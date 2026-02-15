<script setup lang="ts">
import { ref, computed } from "vue";
import BaseHeader from "@/core/components/ui/BaseHeader.vue";
import BaseButton from "@/core/components/ui/BaseButton.vue";
import HorseList from "../components/HorseList.vue";
import CountDown from "@/core/components/ui/CountDown.vue";

import { freshHorses } from "../domain/horses";

import type { RaceHorse } from "../domain/types";
import RaceTrack from "../components/RaceTrack.vue";
import ResultsList from "../components/ResultsList.vue";

import { ROUND_TO_DISTANCE } from "../domain/constatns";

import { useThrottleFn } from "@vueuse/core";

const round = ref<keyof typeof ROUND_TO_DISTANCE>(1);
const areRacesCompleted = computed(() =>
  Object.values(resultsPerRound.value).every((r) => r.length > 0),
);

const currentDistance = computed<number>(() => {
  return ROUND_TO_DISTANCE[round.value];
});

const TICK_MS = 50;

const intervalRef = ref<null | number>(null);

const raceHorses = ref<RaceHorse[]>([]);
const results = ref<{ position: number; name: string; color: string }[]>([]);
const raceStatus = ref<"idle" | "running" | "paused" | "finished">("idle");
const distance = ref(0);
const raceLeader = ref<{ name: string; speed: number } | null>(null);

const resultsPerRound = ref<Record<typeof round.value, typeof results.value>>({
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
});

const horses = ref(freshHorses);

const updateLeader = useThrottleFn(
  (leaderHorse: RaceHorse, speedKMH: number) => {
    raceLeader.value = {
      name: leaderHorse.name,
      speed: Math.round(speedKMH),
    };
  },
  500,
);

const generateProgram = () => {
  if (intervalRef.value) clearInterval(intervalRef.value);
  const shuffled = [...horses.value]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  const programmed: RaceHorse[] = shuffled.map((h, i) => ({
    ...h,
    lane: i + 1,
    progress: 0,
    finished: false,
  }));

  raceHorses.value = programmed;
  results.value = [];

  raceStatus.value = "idle";

  distance.value = 0;
};
const startRace = async () => {
  if (raceHorses.value.length === 0) return;
  if (round.value === 1 && resultsPerRound.value[1].length === 10) {
    resetState();
  }

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

      round.value = ((round.value % 6) + 1) as keyof typeof ROUND_TO_DISTANCE; //allows rounds to inc only till 6, then reset to 1
      results.value = [];
      setTimeout(() => {
        //delay reset and let user see that all horses are finished
        prepareForNextRound();
        raceStatus.value = "idle";

        distance.value = 0;
      }, 2000);
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

  const updated = raceHorses.value.map((h) => {
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

  raceHorses.value = [...updated];
  results.value = [...currentResults];
  if (resultsPerRound.value) {
    resultsPerRound.value[round.value] = [...results.value];
  }

  if (raceStatus.value === "running") {
    let newDistance =
      Math.round((minProgress / 100) * currentDistance.value) + 75;
    distance.value =
      newDistance > currentDistance.value ? currentDistance.value : newDistance;

    if (leaderHorse && leaderMaxProgress < 99) {
      const leaderSpeedPercent = leaderMaxProgress - leaderPreviousProgress;
      // speed in m/s = (percent_increment / 100 * total_distance_m) / (TICK_MS / 1000)
      // speed in km/h = speed_m_s * 3.6
      const speedMS =
        ((leaderSpeedPercent / 100) * currentDistance.value) / (TICK_MS / 1000);
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
  //todo fix duplicates
  const currentResults = [...results.value];

  const updated = raceHorses.value.map((h) => {
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

  raceHorses.value = [...updated];
};

const stopInterval = () => {
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
    intervalRef.value = null;
  }
};

const handleCountdownFinished = () => {
  startRace();
};

const resetState = () => {
  results.value = [];

  distance.value = 0;
  raceLeader.value = null;
  resultsPerRound.value = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };
};

const canStart = computed(
  () =>
    raceHorses.value.length > 0 &&
    raceStatus.value !== "finished" &&
    round.value === 1,
);

const canResume = computed(
  () =>
    raceHorses.value.length > 0 &&
    (raceStatus.value === "paused" || raceStatus.value === "running"),
);

const canGenerate = computed(
  () => raceHorses.value.length === 0 || areRacesCompleted.value,
);
</script>

<template>
  <CountDown
    v-if="raceStatus === 'idle' && round > 1 && round <= 6"
    @completed="handleCountdownFinished"
  />
  <div class="flex flex-col h-screen bg-background overflow-hidden">
    <!-- Header -->
    <BaseHeader>
      <div class="flex gap-2">
        <BaseButton
          size="sm"
          variant="outline"
          @click="generateProgram"
          :disabled="!canGenerate"
          data-testid="generate-program"
        >
          Generate Program
        </BaseButton>
        <BaseButton
          v-if="raceStatus === 'idle'"
          size="sm"
          @click="startRace"
          :disabled="!canStart"
          data-testid="start-race"
        >
          {{ `Start` }}
        </BaseButton>
        <BaseButton
          v-else="raceStatus === 'running' || raceStatus === 'paused'"
          size="sm"
          @click="startRace"
          :disabled="!canResume"
          data-testid="pause-resume-race"
        >
          {{ raceStatus === "running" ? "Pause" : "Resume" }}
        </BaseButton>
      </div>
    </BaseHeader>
    <!-- /Header -->

    <!-- Main content -->
    <div
      class="flex flex-1 flex-col 2xl:flex-row gap-2 p-2 overflow-y-auto 2xl:overflow-hidden min-h-0"
      data-testid="race-dashboard"
    >
      <!-- Left — Horse List -->
      <div class="w-full 2xl:w-xs shrink-0 order-2 2xl:order-1">
        <HorseList :horses :raceHorses />
      </div>

      <!-- Center — Race Track -->
      <div class="w-full 2xl:w-4xl overflow-auto order-1 2xl:order-2 min-h-125">
        <RaceTrack :raceHorses :raceStatus :distance :raceLeader />
      </div>

      <!-- Right — Program & Results  -->
      <div
        class="w-full 2xl:w-xl min-h-100 2xl:h-full overflow-auto order-3 2xl:order-3"
      >
        <ResultsList :program="raceHorses" :results="resultsPerRound" />
      </div>
    </div>
    <!-- /MainContent -->
  </div>
</template>
