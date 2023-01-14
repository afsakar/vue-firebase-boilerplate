<script setup>
const props = defineProps({
  meta: {
    type: Object,
    required: false,
  },
})
</script>

<template>
  <title v-text="meta?.title ? meta.title + ' | VueJS Boilerplate' : 'VueJS Boilerplate'"></title>
  <meta v-if="meta?.description" name="description" :content="meta.description">
</template>