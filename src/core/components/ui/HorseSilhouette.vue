<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * Running horse (gif)
   */
  gifSrc: {
    type: String,
    default: `${import.meta.env.BASE_URL}horse-no-bg-1.gif`,
  },

  /**
   * Standing horse image
   */
  standingSrc: {
    type: String,
    default: `${import.meta.env.BASE_URL}horse-no-bg.png`,
  },

  /**
   * Toggle animation
   */
  animate: {
    type: Boolean,
    default: true,
  },

  /**
   * Size in px
   */
  size: {
    type: Number,
    default: 150,
  },

  /**
   * Accepts:
   * "hsl(200, 80%, 50%)"
   * "210 60% 40%"
   */
  color: {
    type: String,
    default: "0 0% 0%",
  },
  name: {
    type: String,
    default: "Unnamed",
  },
});

/* normalize to hsl() */
const hslColor = computed(() => {
  if (props.color.startsWith("hsl")) return props.color;
  return `hsl(${props.color})`;
});
</script>

<template>
  <div class="horse-wrapper" :style="{ width: size + 10 + 'px' }">
    <p style="font-size: 8px; font-weight: bold">{{ name }}</p>
    <!-- Both images in DOM so they load once (and use preload cache); only one sets layout -->
    <img
      :src="standingSrc"
      class="horse-ghost horse-ghost--layout"
      draggable="false"
      aria-hidden="true"
      fetchpriority="high"
    />
    <img
      :src="gifSrc"
      class="horse-ghost horse-ghost--preload"
      draggable="false"
      aria-hidden="true"
      fetchpriority="high"
    />

    <!-- Mask overlays: one per image so we never change url() and re-fetch -->
    <div
      v-show="animate"
      class="horse-mask"
      :style="{
        backgroundColor: hslColor,
        maskImage: `url(${gifSrc})`,
        WebkitMaskImage: `url(${gifSrc})`,
      }"
    />
    <div
      v-show="!animate"
      class="horse-mask"
      :style="{
        backgroundColor: hslColor,
        maskImage: `url(${standingSrc})`,
        WebkitMaskImage: `url(${standingSrc})`,
      }"
    />
  </div>
</template>

<style scoped>
.horse-wrapper {
  position: relative;
  display: inline-block;
  line-height: 0;
}

.horse-ghost {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  pointer-events: none;
}

.horse-ghost--layout {
  /* In flow so wrapper gets height from this image */
}

.horse-ghost--preload {
  position: absolute;
  inset: 0;
  /* Keeps gif in cache without affecting layout */
}

.horse-mask {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  transition: background-color 0.3s ease;
}
</style>
