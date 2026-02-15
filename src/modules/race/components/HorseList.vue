<script setup lang="ts">
import {  computed } from "vue";
import type { Horse, RaceHorse } from "../domain/types";
interface HorseListProps {
  horses: Horse[];
  raceHorses: RaceHorse[];
}

const props = defineProps<HorseListProps>();

const horsesConditions = computed(() => {
  let res: Record<number, number> = {};
  props.raceHorses.forEach((h) => {
    const id = h.id;
    res[id] = h.condition;
  });
  return res;
});

const getLatestCondition = (h: Horse) => {
  return Math.min(h.condition, horsesConditions.value[h.id] || h.condition);
};

//todo think on how to make it optimal check, currently 2 times function getLatestCondition is called
const horseConditionColorClass = (gap: number) => {
  if (gap === 0) {
    return `text-black`;
  } else if (gap < 10) {
    return `text-red-400`;
  } else if (gap < 20) {
    return `text-red-500`;
  } else if (gap < 30) {
    return `text-red-600`;
  } else if (gap < 40) {
    return `text-red-700`;
  } else {
    return `text-red-800`;
  }
};
</script>

<template>
  <div
    class="flex flex-col h-full border rounded-lg bg-card shadow-sm overflow-hidden"
  >
    <div
      class="px-3 py-2 text-sm font-semibold"
      :style="{ background: 'hsl(45 80% 90%)' }"
    >
      Horse List (1–20)
    </div>
    <div class="flex-1">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b text-muted-foreground">
            <th class="text-left px-2 py-1.5 font-medium">#</th>
            <th class="text-left px-2 py-1.5 font-medium">Name</th>
            <th class="text-center px-2 py-1.5 font-medium">Cond</th>
            <th class="text-center px-2 py-1.5 font-medium">Color</th>
          </tr>
        </thead>
        <tbody data-testid="horse-list">
          <tr
            v-for="(h) in horses"
            :key="h.id"
            :class="{
              'border-2 border-emerald-600 rounded-2xl':
                raceHorses.findIndex((r) => r.id === h.id) >= 0,
            }"
            data-testid="horse-item"
          >
            <td class="px-2 py-1">{{ h.id }}</td>
            <td
              class="px-2 py-1 font-medium truncate max-w-25"
              data-testid="horse-name"
            >
              {{ h.name }}
            </td>
            <td
              class="text-center px-2 py-1"
              :class="
                horseConditionColorClass(h.condition - getLatestCondition(h))
              "
              data-testid="horse-condition"
            >
              {{ getLatestCondition(h) }}
            </td>
            <td class="text-center px-2 py-1">
              <span
                class="inline-block w-3 h-3 rounded-full"
                :style="{ background: `hsl(${h.color})` }"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
