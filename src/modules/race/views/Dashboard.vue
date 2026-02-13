<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseHeader from "@/core/components/ui/BaseHeader.vue";
import BaseButton from "@/core/components/ui/BaseButton.vue";
import HorseList from "../components/HorseList.vue";

import { freshHorses } from "../domain/horses";

import type { RaceHorse } from "../domain/types";
import RaceTrack from "../components/RaceTrack.vue";
import ResultsList from "../components/ResultsList.vue";

import { ROUND_TO_DISTANCE } from "../domain/constatns";

const round = ref<keyof typeof ROUND_TO_DISTANCE>(1);

const currentDistance = computed<number>(() => {
  return ROUND_TO_DISTANCE[round.value];
});

const TICK_MS = 50;

const intervalRef = ref<null | number>(null);

const raceHorses = ref<RaceHorse[]>([]);
const results = ref<{ position: number; name: string; color: string }[]>([]);
const raceStatus = ref<"idle" | "running" | "paused" | "finished">("idle");
const distance = ref(0);

const resultsPerRound = ref<Record<typeof round.value, typeof results.value>>({
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
});

const horses = ref(freshHorses);

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
        prepareForNextRound();
        raceStatus.value = "idle";
      }, 3000);
    }
  }, TICK_MS);
};

const tick = () => {
  let allFinished = true;
  const currentResults = [...results.value];

  const updated = raceHorses.value.map((h) => {
    if (h.finished) return h;

    // Speed based on condition + randomness
    const baseSpeed = 0.3 + (h.condition / 100) * 0.5;
    const randomFactor = 0.7 + Math.random() * 0.6;
    const speed = baseSpeed * randomFactor;

    const newProgress = Math.min(h.progress + speed, 100);
    const finished = newProgress >= 100;

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
    distance.value = Math.min(
      distance.value + Math.round(currentDistance.value / 200),
      currentDistance.value,
    );
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
      condition: h.condition - tireness,
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

const canStart = computed(() => raceHorses.value.length > 0);
const canGenerate = computed(() => raceHorses.value.length === 0);

watch(
  raceHorses,
  (newVal) => {
    if (Array.isArray(newVal)) {
      console.log("progress of 1 horse: ", newVal[0]?.progress);
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="flex flex-col h-screen bg-background overflow-hidden">
    <!-- Header -->
    <BaseHeader>
      <div class="flex gap-2">
        <BaseButton
          size="sm"
          variant="outline"
          @click="generateProgram"
          :disabled="!canGenerate"
        >
          Generate Program
        </BaseButton>
        <BaseButton size="sm" @click="startRace" :disabled="!canStart">
          {{
            raceStatus === "running"
              ? "Pause"
              : raceStatus === "paused"
                ? "Resume"
                : `Start Round: #${round}`
          }}
        </BaseButton>
      </div>
    </BaseHeader>
    <!-- /Header -->

    <!-- Main content -->
    <div class="flex flex-1 gap-2 p-2 overflow-hidden min-h-0">
      <!-- Left — Horse List -->
      <div class="w-md shrink-0">
        <HorseList :horses :raceHorses />
      </div>

      <!-- Center — Race Track -->
      <div class="w-4xl">
        <RaceTrack :raceHorses :raceStatus :distance />
      </div>

      <!-- Right — Program & Results  -->
      <div class="w-xl h-full overflow-scroll">
        <ResultsList :program="raceHorses" :results="resultsPerRound" />
      </div>
    </div>
    <!-- /MainContent -->
  </div>
</template>
