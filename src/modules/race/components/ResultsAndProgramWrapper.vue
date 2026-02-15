<template>
  <div class="program-results-grid mx-2">
    <ProgramList :program="program" :rounds="roundCount" />
    <ResultsList :results="results" />
  </div>
</template>

<script setup lang="ts">
import type { RaceHorse } from "../domain/types";

import { ROUND_TO_DISTANCE } from "../domain/constatns";

interface ProgramResultsProps {
  program: RaceHorse[];
  results: Record<
    keyof typeof ROUND_TO_DISTANCE,
    { position: number; name: string; color: string }[]
  >;
}

const props = defineProps<ProgramResultsProps>();

const roundCount = Object.keys(ROUND_TO_DISTANCE).length;

import ProgramList from "./ProgramList.vue";
import ResultsList from "./ResultsList.vue";
</script>

<style scoped>
.program-results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(6, auto);
  grid-auto-flow: column;
  gap: 0.75rem;
  align-items: start;
  width: 100%;
  min-width: 0;
}
.program-results-grid > * {
  min-width: 0;
}
</style>
