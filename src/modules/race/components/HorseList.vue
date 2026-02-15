<script setup lang="ts">
import { ref, watch } from "vue";
import type { Horse, RaceHorse } from "../domain/types";
interface HorseListProps {
  horses: Horse[];
  raceHorses: RaceHorse[];
  updateCondition: boolean;
}

const props = defineProps<HorseListProps>();

const emit = defineEmits(["condition-updated"]);

//id:difference
const res = ref<Record<number, number>>({});

watch(
  () => props.updateCondition,
  (newVal) => {
    if (newVal) {
      props.raceHorses.forEach((rh) => {
        const freshHorse = props.horses.find((h) => h.id === rh.id);
        if (freshHorse) {
          if (rh.condition !== freshHorse.condition) {
            res.value[rh.id] = freshHorse.condition - rh.condition;
          }
        }
      });
      setTimeout(() => {
        res.value = {};
      }, 3000);
    }
  }
);
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
            <th class="text-center px-2 pr-7 py-1.5 font-medium">Cond</th>
            <th class="text-center px-2 py-1.5 font-medium">Color</th>
          </tr>
        </thead>
        <tbody data-testid="horse-list">
          <tr
            v-for="h in horses"
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
              class="px-2 py-1 w-25 text-center"
              :class="{ 'text-red-600': res[h.id] }"
              data-testid="horse-condition"
            >
              <span class="condition-cell">
                <span class="condition-cell__value">{{ h.condition }}</span>
                <span class="condition-cell__arrow">
                  <span v-if="res[h.id]" class="text-red-800">&#8595;</span>
                </span>
              </span>
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

<style scoped>
.condition-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  min-width: 0;
  margin: 0 auto;
}
.condition-cell__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.condition-cell__arrow {
  flex-shrink: 0;
  width: 1.25rem;
  text-align: right;
}
</style>
