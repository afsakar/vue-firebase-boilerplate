<script setup>
import { CheckmarkCircleOutline } from '@vicons/ionicons5'
import Navbar from "@/components/layout/Navbar.vue";
import {inject, provide, ref, watch} from "vue";

const {theme} = inject("theme");

const notification = ref({
  message: "",
  type: "",
  show: false,
});

watch(notification, (val) => {
  if (val.show) {
    setTimeout(() => {
      notification.value.show = false;
    }, 5000);
  }
});

provide("notification", notification);
</script>

<template>
  <div :data-theme="theme" class="min-h-screen">
    <Navbar />
    <div class="max-w-4xl mx-auto p-3 md:p-0 mt-5">
      <router-view />
      <transition name="slide-fade">
        <div v-if="notification.show" class="toast toast-top toast-end mt-14">
          <div class="alert" :class="{'alert-success': notification.type === 'success', 'alert-error': notification.type === 'error'}">
            <div class="flex items-center justify-center gap-2">
              <CheckmarkCircleOutline class="h-6" />
              <span>{{ notification.message }}</span>
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