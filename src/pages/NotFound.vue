<script setup>
import {inject} from "vue";

const {theme} = inject("theme");
</script>

<template>
  <div :data-theme="theme">
    <div class="grid h-screen content-center max-w-lg mx-auto px-5 md:px-0">
      <div class="card p-4 bg-neutral space-y-3 text-neutral-content flex-1 items-center justify-center">
        <h2 class="text-9xl font-bold">404</h2>
        <p class="text-3xl">Page not found</p>
        <button class="btn btn-info btn-sm" @click="$router.go(-1)">Go back</button>
      </div>
    </div>
  </div>
</template>