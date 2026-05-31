<template>
  <div class="grid grid-cols-2 gap-3">
    <StatCard
      v-for="item in items"
      :key="item.title"
      :title="item.title"
      :value="item.value"
      :icon="item.icon"
      :variant="item.variant"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: {
    title: string;
    value: string;
    icon?: string;
    variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'purple';
  }[];
}>();
</script>