<script setup lang="ts">
import { ref, computed } from "vue";
import BaseHeader from "@/core/components/ui/BaseHeader.vue";
import BaseButton from "@/core/components/ui/BaseButton.vue";

import { horses } from "../domain/horses";
import type { RaceHorse } from "../domain/types";
import RaceTrack from "../components/RaceTrack.vue";

const RACE_DISTANCE = 1200;
const TICK_MS = 50;

const intervalRef = ref<null | number>(null);

const raceHorses = ref<RaceHorse[]>([]);
const results = ref<{ position: number; name: string; color: string }[]>([]);
const raceStatus = ref<"idle" | "running" | "paused" | "finished">("idle");
const distance = ref(0);

const generateProgram = () => {
  if (intervalRef.value) clearInterval(intervalRef.value);
  const shuffled = [...horses].sort(() => Math.random() - 0.5).slice(0, 10);
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
const startRace = () => {
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
    if (done) stopInterval();
  }, TICK_MS);

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
    if (done) stopInterval();
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

  raceHorses.value = updated;
  results.value = currentResults;
  raceHorses.value = [...updated];
  results.value = [...currentResults];

  distance.value = Math.min(
    distance.value + Math.round(RACE_DISTANCE / 200),
    RACE_DISTANCE,
  );

  if (allFinished) {
    raceStatus.value = "finished";
    return true;
  }
  return false;
};

const stopInterval = () => {
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
    intervalRef.value = null;
  }
};

const canStart = computed(
  () => raceHorses.value.length > 0 && raceStatus.value !== "finished",
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
          :disabled="raceStatus !== 'idle'"
        >
          Generate Program
        </BaseButton>
        <BaseButton size="sm" @click="startRace" :disabled="!canStart">
          {{
            raceStatus === "running"
              ? "Pause"
              : raceStatus === "paused"
                ? "Resume"
                : "Start"
          }}
        </BaseButton>
      </div>
    </BaseHeader>
    <!-- /Header -->

    <!-- Main content -->
    <div class="flex flex-1 gap-2 p-2 overflow-hidden min-h-0">
      <!-- Left — Horse List -->
      <div class="w-56 shrink-0">
        <pre>{{ horses }}</pre>
      </div>

      <!-- Center — Race Track -->
      <div class="flex-1 min-w-0">
        <RaceTrack :raceHorses :raceStatus :distance />
      </div>

      <!-- Right — Program & Results  -->
      <div class="w-48 shrink-0">
        <pre>{{ results }}</pre>
      </div>
    </div>
    <!-- /MainContent -->
  </div>
</template>
