<script setup lang="ts">
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
      class="flex flex-1 flex-col xl:flex-row gap-2 p-2 overflow-y-auto xl:overflow-hidden min-h-0"
      data-testid="race-dashboard"
    >
      <!-- Left — Horse List (wide enough for #, Name, Cond, Color; RaceTrack scrolls horizontally) -->
      <div class="w-full xl:max-w-[15rem] xl:w-60 xl:shrink-0 order-2 xl:order-1 overflow-auto">
        <HorseList
          :horses="horseStore.horses"
          :raceHorses="[...getHorsesPerCurrentRound]"
          :update-condition="shouldUpdateCondition"
          @condition-updated="shouldUpdateCondition = false"
        />
      </div>

      <!-- Center — Race Track (flex-1 + min-w-0 so it can shrink and scroll horizontally) -->
      <div class="w-full xl:flex-1 xl:min-w-0 overflow-auto order-1 xl:order-2 min-h-125">
        <RaceTrack
          :raceHorses="getHorsesPerCurrentRound"
          :raceStatus
          :distance
          :raceLeader
        />
      </div>

      <!-- Right — Program & Results  -->
      <div
        class="w-full xl:max-w-[26rem] xl:w-96 min-h-100 xl:h-full overflow-auto order-3 xl:order-3 xl:shrink-0"
      >
        <ResultsAndProgramWrapper />
      </div>
    </div>
    <!-- /MainContent -->
  </div>
</template>
