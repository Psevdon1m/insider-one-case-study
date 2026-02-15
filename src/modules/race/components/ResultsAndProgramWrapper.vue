<template>
  <div class="program-results-grid">
    <ProgramList :rounds="roundCount" />
    <ResultsList />
  </div>
</template>

<script setup lang="ts">
import type { RoundType } from "../domain/types";
import { ROUND_TO_DISTANCE } from "../domain/constatns";

const roundCount = Object.keys(ROUND_TO_DISTANCE).length as RoundType;

import ProgramList from "./ProgramList.vue";
import ResultsList from "./ResultsList.vue";
</script>

<style scoped>
.program-results-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: repeat(6, auto);
  grid-auto-flow: column;
  gap: 0.75rem;
  align-items: start;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}
.program-results-grid > * {
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
