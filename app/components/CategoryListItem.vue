<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start gap-3">
        <div
          class="mt-1 h-3 w-3 rounded-full"
          :style="{ backgroundColor: category.colorHex }"
        />

        <div>
          <p class="font-semibold text-slate-900">
            {{ category.name }}
          </p>

          <p
            v-if="category.description"
            class="mt-1 text-sm text-slate-500"
          >
            {{ category.description }}
          </p>

          <div class="mt-2 flex flex-wrap gap-2">
            <span :class="typeBadgeClasses">
              {{ typeLabel }}
            </span>

            <span
              v-if="category.target !== null"
              class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
            >
              {{ formatCurrency(Number(category.target)) }} / måned
            </span>
          </div>
        </div>
      </div>

      <div class="flex gap-1">
        <button
          type="button"
          class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          @click="$emit('edit', category)"
        >
          <Icon
            name="heroicons:pencil-square"
            class="h-5 w-5"
          />
        </button>

        <button
          type="button"
          class="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
          @click="$emit('delete', category.id)"
        >
          <Icon
            name="heroicons:trash"
            class="h-5 w-5"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~~/types/category';

const props = defineProps<{
  category: Category;
}>();

defineEmits<{
  edit: [category: Category];
  delete: [id: string];
}>();

const { formatCurrency } = useCurrency();

const typeLabel = computed(() => {
  const labels = {
    EXPENSE: 'Forbrug',
    SAVING: 'Opsparing',
    INVESTMENT: 'Investering',
  };

  return labels[props.category.type];
});

const typeBadgeClasses = computed(() => {
  const classes = {
    EXPENSE: 'bg-rose-50 text-rose-700',
    SAVING: 'bg-blue-50 text-blue-700',
    INVESTMENT: 'bg-purple-50 text-purple-700',
  };

  return [
    'rounded-full px-2 py-1 text-xs font-medium',
    classes[props.category.type],
  ];
});
</script>