<template>
  <div
    ref="root"
    class="relative"
  >
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm transition hover:border-slate-300"
      @click.stop="toggle"
    >
      <div
        v-if="selectedCategory"
        class="flex items-center gap-3"
      >
        <div
          class="h-3 w-3 rounded-full"
          :style="{
            backgroundColor: selectedCategory.colorHex,
          }"
        />

        <span class="font-medium text-slate-900">
          {{ selectedCategory.name }}
        </span>
      </div>

      <span
        v-else
        class="text-slate-500"
      >
        Vælg kategori
      </span>

      <Icon
        name="heroicons:chevron-down"
        :class="[
          'h-4 w-4 text-slate-500 transition-transform',
          isOpen ? 'rotate-180' : '',
        ]"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
    >
      <button
        v-for="category in activeCategories"
        :key="category.id"
        type="button"
        class="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-slate-50"
        @click="selectCategory(category.id)"
      >
        <div
          class="h-3 w-3 rounded-full"
          :style="{
            backgroundColor: category.colorHex,
          }"
        />

        <div class="flex-1">
          <p class="font-medium text-slate-900">
            {{ category.name }}
          </p>

          <p
            v-if="category.target"
            class="text-xs text-slate-500"
          >
            Budget: {{ formatCurrency(Number(category.target)) }}
          </p>
        </div>

        <Icon
          v-if="category.id === modelValue"
          name="heroicons:check"
          class="h-4 w-4 text-emerald-600"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~~/types/category';

const props = defineProps<{
  modelValue: string;
  categories: Category[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const { formatCurrency } = useCurrency();

const root = ref<HTMLElement>();
const isOpen = ref(false);

const selectedCategory = computed(() => {
  return props.categories.find((category) => {
    return category.id === props.modelValue;
  });
});

const activeCategories = computed(() => {
  return props.categories.filter((category) => {
    return category.isActive;
  });
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const selectCategory = (id: string) => {
  emit('update:modelValue', id);

  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!root.value) {
    return;
  }

  if (!root.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>