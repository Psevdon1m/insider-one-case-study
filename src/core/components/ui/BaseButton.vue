<script setup>
const props = defineProps({
  size: {
    type: String,
    default: "md",
    validator: (v) => ["sm", "md", "lg"].includes(v),
  },
  outline: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "button",
  },
});

/**
 * Size styles
 */
const sizeClasses = computed(() => {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return sizes[props.size];
});

/**
 * Variant styles
 */
const variantClasses = computed(() => {
  // outline → transparent background
  if (props.outline) {
    return `
      bg-transparent
      border border-black
      text-black
      hover:bg-gray-100
    `;
  }

  // default → white background
  return `
    bg-white
    border border-black
    text-black
    hover:bg-gray-100
  `;
});

/**
 * Final classes
 */
const buttonClasses = computed(() => [
  "rounded-lg font-medium transition-colors duration-200",
  "cursor-pointer",
  "focus:outline-none focus:ring-2 focus:ring-gray-300",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  sizeClasses.value,
  variantClasses.value,
]);
</script>

<template>
  <button :type="type" :disabled="disabled" :class="buttonClasses">
    <slot />
  </button>
</template>
