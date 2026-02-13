<script setup lang="ts">
import { ref, watch } from "vue";
import type { RaceHorse } from "../domain/types";
import HorseSilhouette from "@/core/components/ui/HorseSilhouette.vue";

interface RaceTrackProps {
  raceHorses: RaceHorse[];
  raceStatus: "idle" | "running" | "paused" | "finished";
  distance: number;
}

const props = defineProps<RaceTrackProps>();

const distance = ref(0);
const lanes = 10;

const horseByLane = ref<Record<number, RaceHorse>>({});

watch(
  () => props.raceHorses,
  () => {
    props.raceHorses.forEach((h) => (horseByLane.value[h.lane] = h));
  },
  { deep: true },
);
</script>
<template>
  <div
    class="flex flex-col h-full border rounded-lg bg-card shadow-sm overflow-hidden"
  >
    <div class="px-3 py-2 text-sm font-semibold border-b bg-muted/30">
      Race Track
    </div>
    <div class="flex-1 relative p-2 overflow-hidden">
      <!--  Finish line  -->
      <div
        class="absolute top-2 bottom-10 w-1 z-10"
        :style="{ right: '16px', background: 'hsl(0 72% 51%)' }"
      />
      <div
        class="absolute top-2 bottom-10 w-3 z-10 opacity-20"
        :style="{
          right: '12px',
          background:
            'repeating-linear-gradient(0deg, hsl(0 72% 51%) 0px, hsl(0 72% 51%) 4px, transparent 4px, transparent 8px)',
        }"
      />

      <!-- Lanes  -->
      <div class="flex flex-col h-[calc(100%-2rem)] justify-between">
        <div
          v-for="lane in lanes"
          :key="lane"
          class="flex items-center relative"
          :style="{
            height: `${100 / lanes}%`,
            borderBottom:
              lane < lanes - 1 ? '1px dashed hsl(var(--border))' : 'none',
          }"
        >
          <!--  Lane number  -->
          <span
            class="text-[10px] text-muted-foreground w-4 shrink-0 text-center font-mono"
          >
            {{ lane + 1 }}
          </span>

          <!--  Track area  -->
          <div class="flex-1 relative h-full">
            <div
              v-if="horseByLane[lane]"
              class="absolute top-1/2 -translate-y-1/2 transition-all"
              :style="{
                left: `${Math.min(horseByLane[lane].progress || 0, 95)}%`,
                transitionDuration: raceStatus === 'running' ? '300ms' : '0ms',
                transitionTimingFunction: 'linear',
              }"
            >
              <HorseSilhouette
                :color="horseByLane[lane]!.color"
                :animate="
                  horseByLane[lane].progress >= 1 &&
                  horseByLane[lane].progress < 100
                "
                :size="50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom info  -->
    <div
      class="px-3 py-1.5 text-xs text-muted-foreground border-t bg-muted/20 text-center"
    >
      {{ raceStatus === "idle" && "Generate a program to start" }}
      {{ raceStatus === "running" && `Racing — ${distance}m` }}
      {{ raceStatus === "paused" && `Paused — ${distance}m` }}
      {{ raceStatus === "finished" && `RaceComplete — ${distance}m` }}
    </div>
  </div>
</template>

<style scoped></style>
