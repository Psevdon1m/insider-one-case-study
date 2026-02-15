<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * Running horse (gif)
   */
  gifSrc: {
    type: String,
    default: "/horse-no-bg-1.gif",
  },

  /**
   * Standing horse image
   */
  standingSrc: {
    type: String,
    default: "/horse-no-bg.png",
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

/* choose which image to show */
const imageSrc = computed(() =>
  props.animate ? props.gifSrc : props.standingSrc,
);

/* normalize to hsl() */
const hslColor = computed(() => {
  if (props.color.startsWith("hsl")) return props.color;
  return `hsl(${props.color})`;
});
</script>

<template>
  <div class="horse-wrapper" :style="{ width: size + 10 + 'px' }">
    <p style="font-size: 8px; font-weight: bold">{{ name }}</p>
    <!-- ghost image to maintain aspect ratio/size -->
    <img
      :src="imageSrc"
      class="horse-ghost"
      draggable="false"
      aria-hidden="true"
      fetchpriority="high"
    />

    <!-- mask overlay that applies the color -->
    <div
      class="horse-mask"
      :style="{
        backgroundColor: hslColor,
        maskImage: `url(${imageSrc})`,
        WebkitMaskImage: `url(${imageSrc})`,
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
