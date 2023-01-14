<script setup>
import {inject, ref} from "vue";

const {theme} = inject("theme");
const showNotification = ref(false);
</script>

<template>
  <div :data-theme="theme" class="h-screen">
    <div class="max-w-4xl mx-auto p-3 md:p-0 ">
      <router-view />
      <transition name="slide-fade">
        <div v-if="showNotification" class="toast toast-top toast-end mt-14">
          <div class="alert alert-success">
            <div>
              <span>Message sent successfully.</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>