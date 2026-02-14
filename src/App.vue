<script setup lang="ts">
import { useWindowSize } from "@/core/composables/useWindowSize";
import MobileNotSupported from "@/core/components/shared/MobileNotSupported.vue";

const { isMobile } = useWindowSize();
</script>

<template>
  <div v-if="!isMobile">
    <router-view />
  </div>
  <MobileNotSupported v-else />
</template>

