<script setup lang="ts">
const { isMobile } = useWindowSize();
</script>

<template>
  <div v-if="!isMobile">
    <router-view />
  </div>
  <MobileNotSupported v-else />
</template>
