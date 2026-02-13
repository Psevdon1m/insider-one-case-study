<script setup lang="ts">
import type { Horse } from "../domain/types";
interface HorseListProps {
  horses: Horse[];
}

defineProps<HorseListProps>();
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
    <ScrollArea class="flex-1">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b text-muted-foreground">
            <th class="text-left px-2 py-1.5 font-medium">#</th>
            <th class="text-left px-2 py-1.5 font-medium">Name</th>
            <th class="text-center px-2 py-1.5 font-medium">Cond</th>
            <th class="text-center px-2 py-1.5 font-medium">Color</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(h, i) in horses"
            :key="h.id"
            :class="{ 'bg-muted/30': i % 2 === 0 }"
          >
            <td class="px-2 py-1">{{ h.id }}</td>
            <td class="px-2 py-1 font-medium truncate max-w-25">
              {{ h.name }}
            </td>
            <td class="text-center px-2 py-1">{{ h.condition }}</td>
            <td class="text-center px-2 py-1">
              <span
                class="inline-block w-3 h-3 rounded-full"
                :style="{ background: `hsl(${h.color})` }"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </ScrollArea>
  </div>
</template>

<style scoped></style>
