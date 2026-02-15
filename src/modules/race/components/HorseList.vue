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
const horsesConditions = ref<Record<number, number>>({});

watch(
  () => props.raceHorses,
  (newVal) => {
    if (newVal.length === 0) {
      //on raceHorse reset, removes arrow down condition and red class
      horsesConditions.value = {};
      emit("condition-updated");
    }
  }
);

watch(
  () => props.updateCondition,
  (newVal) => {
    if (newVal) {
      //when receive updateCondition, calcs the difference and store id:difference in object for further render.
      props.raceHorses.forEach((rh) => {
        const freshHorse = props.horses.find((h) => h.id === rh.id);
        if (freshHorse) {
          if (rh.condition !== freshHorse.condition) {
            horsesConditions.value[rh.id] = freshHorse.condition - rh.condition;
          }
        }
      });
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
      <table class="w-full text-xs border-separate [border-spacing:0_6px]">
        <thead>
          <tr class="text-muted-foreground">
            <th class="text-left px-2 py-1.5 font-medium border-b border-gray-300">#</th>
            <th class="text-left px-2 py-1.5 font-medium border-b border-gray-300">Name</th>
            <th class="text-center px-2 pr-7 py-1.5 font-medium border-b border-gray-300">Cond</th>
            <th class="text-center px-2 py-1.5 font-medium border-b border-gray-300">Color</th>
          </tr>
        </thead>
        <tbody data-testid="horse-list">
          <tr
            v-for="h in horses"
            :key="h.id"
            class="border-2 border-transparent rounded-2xl"
            :class="{
              'ring-2 ring-inset ring-emerald-600':
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
              :class="{ 'text-red-600': horsesConditions[h.id] }"
              data-testid="horse-condition"
            >
              <span
                class="flex items-center justify-center gap-1 w-full min-w-0 mx-auto"
              >
                <span class="min-w-0 truncate">{{ h.condition }}</span>
                <span class="shrink-0 w-5 text-right">
                  <span v-if="horsesConditions[h.id]" class="text-red-800"
                    >&#8595;</span
                  >
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
