<script setup>
import {computed, onMounted, provide, ref, watch} from "vue";
import {useIdle, useTimestamp} from "@vueuse/core";
import {useAuthStore} from "@/stores/authStore.js";

const userStore = useAuthStore();

/* Theme */
const theme = ref("light");

onMounted(() => {
  if (localStorage.getItem("theme")) {
    theme.value = localStorage.getItem("theme");
  }
});

provide("theme",{
  theme, changeTheme
});

function changeTheme() {
  if(localStorage.getItem("theme") === "light") {
    localStorage.setItem("theme", "dark");
    theme.value = "dark";
  } else {
    localStorage.setItem("theme", "light");
    theme.value = "light";
  }
  // theme.value = theme.value === "light" ? "dark" : "light";
}
/* Theme */

/* Idle */
const timeoutModal = ref();
const { idle, lastActive } = useIdle(5 * 60 * 1000)
const now = useTimestamp()
const idledFor = computed(() =>
    Math.floor((now.value - lastActive.value) / 1000),
)

watch(idledFor, (isIdle) => {
  if (idledFor.value === 270) {
    timeoutModal.value.click();
  }else if (idledFor.value === 300) {
    timeoutModal.value.click();
    userStore.logout();
  }
})
/* Idle */
</script>

<template>
  <router-view/>
  <teleport to="body">
    <input type="checkbox" id="timeoutModal" ref="timeoutModal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Attention!</h3>
        <p class="py-4">
          You have been idle for 5 minutes. You will be logged out in 30 seconds.
        </p>
        <div class="modal-action">
          <label for="timeoutModal" class="btn btn-sm">
            Stay logged in
          </label>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
</style>
