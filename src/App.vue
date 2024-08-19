<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
console.log(route);
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
