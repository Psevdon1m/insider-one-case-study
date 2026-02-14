<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref<number | 'GO!'> (4);
const emit = defineEmits(['completed']);
const interval = ref<number>();

function countDown() {
  if (typeof count.value === 'number') {
      if (count.value > 1) {
        count.value--;
      } else {
        count.value = 'GO!';
      }
    } else {
      clearInterval(interval.value);
      setTimeout(() => {
        emit('completed');
      }, 1000);
    }
}

onMounted(() => {
  countDown();
  interval.value = setInterval(() => {
    countDown();
  }, 800);
});

</script>

<template>
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <Transition name="fade" mode="out-in" appear>
      <div 
        :key="count" 
        class="text-6xl font-black text-black drop-shadow-lg"
      >
        {{ count }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.5);
}
</style>
