<script setup lang="ts">
import BaseHeader from "@/core/components/ui/BaseHeader.vue";
import BaseButton from "@/core/components/ui/BaseButton.vue";
import HorseList from "../components/HorseList.vue";
import ResultsAndProgramWrapper from "../components/ResultsAndProgramWrapper.vue";
import RaceTrack from "../components/RaceTrack.vue";

import { useHorseStore } from "../store/horseStore";
import { useRace } from "../composables/useRace";

const {
  round,
  getHorsesPerCurrentRound,
  raceStatus,
  raceLeader,
  distance,
  shouldUpdateCondition,
  generateProgram,
  startRace,
  resetState,
  getNextRound,
} = useRace();

const horseStore = useHorseStore();

const canStart = computed(
  () =>
    getHorsesPerCurrentRound.value.length > 0 &&
    horseStore.resultsPerRound[round.value].length === 0,
);

const canResume = computed(
  () =>
    getHorsesPerCurrentRound.value.length > 0 &&
    (raceStatus.value === "paused" || raceStatus.value === "running"),
);

const canGenerate = computed(
  () => raceStatus.value === "idle" && !canRestart.value,
);
const canRestart = computed(() =>
  Object.values(horseStore.resultsPerRound).every((arr) => arr.length === 10),
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
          @click="resetState"
          :disabled="!canRestart"
          data-testid="generate-program"
        >
          Restart Race
        </BaseButton>
        <BaseButton
          size="sm"
          variant="outline"
          @click="generateProgram"
          :disabled="!canGenerate"
          data-testid="generate-program"
        >
          Generate Program
        </BaseButton>
        <div class="min-w-[140px]">
          <BaseButton
            v-if="raceStatus === 'idle'"
            size="sm"
            @click="startRace"
            :disabled="!canStart"
            data-testid="start-race"
            class="w-full"
          >
            Start Round: #{{ round }}
          </BaseButton>
          <BaseButton
            v-else-if="raceStatus === 'finished'"
            size="sm"
            :disabled="true"
            class="w-full"
          >
            Start Round: #{{ getNextRound() }}
          </BaseButton>
          <BaseButton
            v-else="raceStatus === 'running' || raceStatus === 'paused'"
            size="sm"
            @click="startRace"
            :disabled="!canResume"
            data-testid="pause-resume-race"
            class="w-full"
          >
            {{ raceStatus === "running" ? "Pause" : "Resume" }}
          </BaseButton>
        </div>
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
        <HorseList
          :horses="horseStore.horses"
          :raceHorses="[...getHorsesPerCurrentRound]"
          :update-condition="shouldUpdateCondition"
          @condition-updated="shouldUpdateCondition = false"
        />
      </div>

      <!-- Center — Race Track -->
      <div class="w-full 2xl:w-4xl overflow-auto order-1 2xl:order-2 min-h-125">
        <RaceTrack
          :raceHorses="getHorsesPerCurrentRound"
          :raceStatus
          :distance
          :raceLeader
        />
      </div>

      <!-- Right — Program & Results  -->
      <div
        class="w-full 2xl:w-xl min-h-100 2xl:h-full overflow-auto order-3 2xl:order-3"
      >
        <ResultsAndProgramWrapper />
      </div>
    </div>
    <!-- /MainContent -->
  </div>
</template>
