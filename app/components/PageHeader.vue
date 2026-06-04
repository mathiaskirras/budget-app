<template>
  <div class="mb-3">
    <h1 class="text-lg font-semibold text-slate-900">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>