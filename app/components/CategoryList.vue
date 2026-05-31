<template>
  <div class="space-y-3">
    <CategoryListItem
      v-for="category in categories"
      :key="category.id"
      :category="category"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />

    <div
      v-if="categories.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center"
    >
      <p class="font-medium text-slate-900">
        Ingen kategorier endnu
      </p>

      <p class="mt-1 text-sm text-slate-500">
        Opret din første kategori for at komme i gang.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~~/types/category';

defineProps<{
  categories: Category[];
}>();

defineEmits<{
  edit: [category: Category];
  delete: [id: string];
}>();
</script>