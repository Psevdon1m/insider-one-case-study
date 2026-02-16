<script setup lang="ts">
import type { RoundType } from "../domain/types";

const horseStore = useHorseStore();

const program = computed(() => {
  return horseStore.raceHorsesPerRound;
});

interface Props {
  rounds: RoundType;
}

defineProps<Props>();
</script>

<template>
  <div v-for="round in rounds" className="flex h-100% gap-2 mb-2 w-full">
    <!--  Program  -->
    <div
      className=" w-full border rounded-lg bg-card shadow-sm overflow-hidden flex flex-col"
    >
      <div
        className="px-3 py-2 text-sm font-semibold text-white"
        :style="{ background: 'hsl(210 70% 50%)' }"
      >
        Round: #{{ round }} Program
      </div>
      <div className="flex-1">
        <p
          v-if="program[round as RoundType].length === 0"
          className="text-xs text-muted-foreground p-3"
        >
          Click "Generate Program"
        </p>

        <div v-else className="text-xs" data-testid="race-horse-list">
          <div
            v-for="h in program[round as RoundType]"
            :key="h.id"
            className="flex items-center gap-2 px-3 py-1.5 border-b last:border-0"
            data-testid="race-horse-item"
          >
            <span className="font-mono text-muted-foreground w-5">{{
              h.lane
            }}</span>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              :style="{ background: `hsl(${h.color})` }"
            />
            <span
              className="truncate font-medium"
              data-testid="race-horse-name"
              >{{ h.name }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
