<script setup>
import { LogoGithub, Skull } from '@vicons/ionicons5'
import {useAuthStore} from "@/stores/authStore.js";
import {computed} from "vue";

const userStore = useAuthStore();

const login = () => {
  userStore.login();
};

const metaInfo = computed(() => {
  return {
    title: "Login",
  }
});
</script>

<template>
  <teleport to="head">
    <MetaInfo :meta="metaInfo"/>
  </teleport>
  <div class="grid h-screen content-center max-w-2xl mx-auto px-5 md:px-0">
    <div class="card p-4 w-full bg-neutral text-neutral-content h-40 grid content-center">
      <div class="form-control w-full max-w-xs mx-auto text-white">
        <button @click="login" class="bg-gray-900 text-gray-100 hover:bg-gray-800 btn">
          <LogoGithub class="inline-block w-5 h-5 mr-2" />
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </div>
  </div>
</template>