export function useWindowSize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const update = useThrottleFn(() => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  }, 500);

  onMounted(() => {
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });

  const isMobile = computed(() => width.value < 1024);

  return { width, height, isMobile };
}
