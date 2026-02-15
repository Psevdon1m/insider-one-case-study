<script setup lang="ts">
import { ROUND_TO_DISTANCE } from "../domain/constatns";
interface Props {
  results: Record<
    keyof typeof ROUND_TO_DISTANCE,
    { position: number; name: string; color: string }[]
  >;
}

defineProps<Props>();
</script>

<template>
  <div v-for="(race, i) in results" className="flex h-100% gap-2 mb-2 w-full">
    <!-- Results  -->
    <div
      className="w-full border rounded-lg bg-card shadow-sm overflow-scroll flex flex-col"
      :data-testid="`round-${i}-results`"
    >
      <div
        className="px-3 py-2 text-sm font-semibold text-white"
        :style="{ background: 'hsl(142 60% 40%)' }"
      >
        Round: #{{ i }} Results
      </div>
      <div className="flex-1">
        <p
          v-if="race.length === 0"
          className="text-xs text-muted-foreground p-3"
        >
          Waiting for race…
        </p>

        <div v-else className="text-xs" :data-testid="`results-${i}-list`">
          <div
            v-for="r in race"
            :key="r.position"
            className="flex items-center gap-2 px-3 py-1.5 border-b last:border-0"
            :data-testid="`results-${i}-horse-item`"
          >
            <span className="font-mono font-bold w-5">
              {{
                r.position === 1
                  ? "🥇"
                  : r.position === 2
                    ? "🥈"
                    : r.position === 3
                      ? "🥉"
                      : `${r.position}.`
              }}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              :style="{ background: `hsl(${r.color})` }"
            />
            <span className="truncate font-medium">{{ r.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
