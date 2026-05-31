<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between">
      <button
        type="button"
        class="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
        @click="goPrevious"
      >
        <Icon
          name="heroicons:chevron-left"
          class="h-5 w-5"
        />
      </button>

      <button
        type="button"
        class="rounded-xl px-4 py-2 text-center transition hover:bg-slate-50"
        @click="toggleMode"
      >
        <p class="font-semibold text-slate-900">
          {{ label }}
        </p>

        <p class="text-xs text-slate-500">
          {{ modeLabel }}
        </p>
      </button>

      <button
        type="button"
        class="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
        @click="goNext"
      >
        <Icon
          name="heroicons:chevron-right"
          class="h-5 w-5"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  month: number;
  year: number;
}>();

const emit = defineEmits<{
  previousMonth: [];
  nextMonth: [];
  previousYear: [];
  nextYear: [];
}>();

const mode = ref<'month' | 'year'>('month');

const monthName = computed(() => {
  const date = new Date(props.year, props.month - 1);

  const name = new Intl.DateTimeFormat('da-DK', {
    month: 'long',
  }).format(date);

  return name.charAt(0).toUpperCase() + name.slice(1);
});

const label = computed(() => {
  if (mode.value === 'year') {
    return props.year.toString();
  }

  return `${monthName.value} ${props.year}`;
});

const modeLabel = computed(() => {
  return mode.value === 'month'
    ? 'Tryk for år'
    : 'Tryk for måned';
});

const toggleMode = () => {
  mode.value = mode.value === 'month'
    ? 'year'
    : 'month';
};

const goPrevious = () => {
  if (mode.value === 'year') {
    emit('previousYear');
    return;
  }

  emit('previousMonth');
};

const goNext = () => {
  if (mode.value === 'year') {
    emit('nextYear');
    return;
  }

  emit('nextMonth');
};
</script>