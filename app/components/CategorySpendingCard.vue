<template>
  <div
    :class="[
      'rounded-2xl border bg-white p-4 shadow-sm',
      isOverBudget ? 'border-red-200' : 'border-slate-200',
    ]"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: color }"
        />

        <div>
          <p class="font-medium text-slate-900">
            {{ name }}
          </p>

          <p
            v-if="isOverBudget"
            class="text-xs text-red-500"
          >
            Over budget
          </p>
        </div>
      </div>

      <p
        :class="[
          'text-sm font-semibold',
          isOverBudget ? 'text-red-600' : 'text-slate-900',
        ]"
      >
        {{ formatCurrency(spent) }}
      </p>
    </div>

    <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        :class="[
          'h-full rounded-full',
          isOverBudget ? 'bg-red-400' : '',
        ]"
        :style="progressStyle"
      />
    </div>

    <div class="mt-2 flex justify-between text-xs text-slate-500">
      <span>{{ formatCurrency(spent) }} brugt</span>
      <span>{{ formatCurrency(target) }} budget</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  spent: number;
  target: number;
  color: string;
}>();

const { formatCurrency } = useCurrency();

const isOverBudget = computed(() => {
  return props.spent > props.target;
});

const progress = computed(() => {
  if (props.target <= 0) {
    return 0;
  }

  return Math.min((props.spent / props.target) * 100, 100);
});

const progressStyle = computed(() => {
  return {
    width: `${progress.value}%`,
    backgroundColor: isOverBudget.value ? undefined : props.color,
  };
});
</script>