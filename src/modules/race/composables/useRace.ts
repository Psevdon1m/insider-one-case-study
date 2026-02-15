import { ref, computed, nextTick } from "vue";
import { useThrottleFn } from "@vueuse/core";
import { ROUND_TO_DISTANCE } from "../domain/constatns";
import type { RaceHorse, RaceResult } from "../domain/types";
import { useHorseStore } from "../store/horseStore";

export function useRace() {
  const TICK_MS = 50;
  const intervalRef = ref<null | number>(null);
  const round = ref<keyof typeof ROUND_TO_DISTANCE>(1);
  const results = ref<RaceResult[]>([]);
  const raceStatus = ref<"idle" | "running" | "paused" | "finished">("idle");
  const distance = ref(0);
  const raceLeader = ref<{ name: string; speed: number } | null>(null);
  const shouldUpdateCondition = ref(false);
  const horseStore = useHorseStore();

  const getHorsesPerCurrentRound = computed(
    (): RaceHorse[] => horseStore.raceHorsesPerRound[round.value],
  );

  const currentDistance = computed<number>(() => {
    return ROUND_TO_DISTANCE[round.value];
  });

  const generateProgram = () => {
    if (intervalRef.value) clearInterval(intervalRef.value);

    const shuffled = [...horseStore.horses]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    const horsesForNextRound: RaceHorse[] = shuffled.map((h, i) => ({
      ...h,
      lane: i + 1,
      progress: 0,
      finished: false,
    }));

    horseStore.setRaceHorsesPerRound(round.value, horsesForNextRound);
    results.value = [];

    raceStatus.value = "idle";

    distance.value = 0;
  };
  const startRace = async () => {
    if (getHorsesPerCurrentRound.value.length === 0) return;

    if (raceStatus.value === "running") {
      // Pause

      stopInterval();
      raceStatus.value = "paused";

      return;
    }

    raceStatus.value = "running";
    intervalRef.value = setInterval(() => {
      const done = tick();

      if (done) {
        stopInterval();
        prepareForNextRound();

        nextTick().then(() => {
          updateAllHorsesCondition();
          results.value = [];
          distance.value = 0;

          setTimeout(() => {
            //delay reset and let user see that all horses are finished
            round.value = getNextRound() as keyof typeof ROUND_TO_DISTANCE; //allows rounds to inc only till 6, then reset to 1
            raceStatus.value = "idle";
          }, 1000);
        });
      }
    }, TICK_MS);
  };

  const tick = () => {
    let allFinished = true;
    const currentResults = [...results.value];
    let minProgress = 100;
    let leaderHorse: RaceHorse | null = null;
    let leaderMaxProgress = -1;
    let leaderPreviousProgress = -1;

    // Speed calculation constants
    const REFERENCE_DISTANCE = 1600; // 1600m is the baseline distance
    const BASE_SPEED_COMPONENT = 0.3;
    const CONDITION_WEIGHT = 0.5;
    const MIN_RANDOM_FACTOR = 0.7;
    const RANDOM_VARIANCE = 0.5;

    // Adjust speed inversely proportional to distance (longer distance = slower progress per tick)
    const distanceModifier = REFERENCE_DISTANCE / currentDistance.value;

    const updated = getHorsesPerCurrentRound.value.map((h) => {
      if (h.finished) return h;

      // Speed based on condition + randomness
      const baseSpeed =
        BASE_SPEED_COMPONENT + (h.condition / 100) * CONDITION_WEIGHT;
      const randomFactor = MIN_RANDOM_FACTOR + Math.random() * RANDOM_VARIANCE;

      // Final speed scaled by distance
      const speed = baseSpeed * randomFactor * distanceModifier;

      const newProgress = Math.min(h.progress + speed, 100);

      const finished = newProgress >= 100;

      minProgress = Math.min(minProgress, newProgress);

      if (newProgress > leaderMaxProgress) {
        leaderMaxProgress = newProgress;
        leaderHorse = h;
        leaderPreviousProgress = h.progress;
      }

      if (finished && !h.finished) {
        currentResults.push({
          position: currentResults.length + 1,
          name: h.name,
          color: h.color,
        });
      }

      if (!finished) allFinished = false;

      return { ...h, progress: newProgress, finished };
    });

    horseStore.setRaceHorsesPerRound(round.value, [...updated]);
    results.value = [...currentResults];
    if (horseStore.resultsPerRound[round.value]) {
      horseStore.setResultsPerRound(round.value, [...results.value]);
    }

    if (raceStatus.value === "running") {
      let newDistance =
        Math.round((minProgress / 100) * currentDistance.value) + 75;
      distance.value =
        newDistance > currentDistance.value
          ? currentDistance.value
          : newDistance;

      if (leaderHorse && leaderMaxProgress < 99) {
        const leaderSpeedPercent = leaderMaxProgress - leaderPreviousProgress;
        // speed in m/s = (percent_increment / 100 * total_distance_m) / (TICK_MS / 1000)
        // speed in km/h = speed_m_s * 3.6
        const speedMS =
          ((leaderSpeedPercent / 100) * currentDistance.value) /
          (TICK_MS / 1000);
        const speedKMH = (speedMS * 3.6) / 100;

        updateLeader(leaderHorse, speedKMH);
      }
    }

    if (allFinished) {
      raceStatus.value = "finished";
      return true;
    }
    return false;
  };

  const prepareForNextRound = () => {
    const currentResults = [...results.value];

    const updated = getHorsesPerCurrentRound.value.map((h) => {
      if (h.finished) {
        currentResults.push({
          position: currentResults.length + 1,
          name: h.name,
          color: h.color,
        });
      }

      const tireness = Math.floor(Math.random() * 10);

      return {
        ...h,
        progress: 0,
        condition: h.condition - tireness >= 0 ? h.condition - tireness : 0,
        finished: false,
      };
    });

    horseStore.setRaceHorsesPerRound(round.value, [...updated]);
    shouldUpdateCondition.value = true;
  };

  const updateAllHorsesCondition = () => {
    horseStore.raceHorsesPerRound[round.value].forEach((rh) => {
      let index = horseStore.horses.findIndex((h) => h.id === rh.id);
      if (
        horseStore.horses[index] &&
        horseStore.horses[index].condition !== rh.condition
      ) {
        horseStore.horses[index].condition = rh.condition;
      }
    });
  };

  const updateLeader = useThrottleFn(
    (leaderHorse: RaceHorse, speedKMH: number) => {
      raceLeader.value = {
        name: leaderHorse.name,
        speed: Math.round(speedKMH),
      };
    },
    500,
  );

  const getNextRound = () => (round.value % 6) + 1;
  const stopInterval = () => {
    if (intervalRef.value) {
      clearInterval(intervalRef.value);
      intervalRef.value = null;
    }
  };

  const resetState = () => {
    results.value = [];

    distance.value = 0;
    raceLeader.value = null;
    horseStore.resetRaceHorsesPerRound();
    horseStore.resetResultsPerRound();
  };
  return {
    round,
    getHorsesPerCurrentRound,
    currentDistance,
    raceLeader,
    raceStatus,
    results,
    distance,
    shouldUpdateCondition,
    generateProgram,
    startRace,
    tick,
    prepareForNextRound,
    updateAllHorsesCondition,
    stopInterval,
    resetState,
    getNextRound,
  };
}
