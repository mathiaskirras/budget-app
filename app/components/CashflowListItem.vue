<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="font-semibold text-slate-900">
          {{ cashflow.name }}
        </p>

        <p
          v-if="cashflow.description"
          class="text-sm text-slate-500"
        >
          {{ cashflow.description }}
        </p>

        <div class="mt-2 flex flex-wrap gap-2">
          <span :class="typeBadgeClasses">
            {{ typeLabel }}
          </span>

          <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {{ dateRange }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <p :class="amountClasses">
          {{ formatCurrency(Number(cashflow.amount)) }}
        </p>

        <button
          type="button"
          class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          @click="$emit('edit', cashflow)"
        >
          <Icon
            name="heroicons:pencil-square"
            class="h-5 w-5"
          />
        </button>

        <button
          type="button"
          class="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
          @click="$emit('delete', cashflow.id)"
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
import type { CashflowItem } from '~~/types/cashflow';

const props = defineProps<{
  cashflow: CashflowItem;
}>();

defineEmits<{
  edit: [cashflow: CashflowItem];
  delete: [id: string];
}>();

const { formatCurrency } = useCurrency();

const typeLabel = computed(() => {
  return props.cashflow.type === 'INCOME'
    ? 'Indkomst'
    : 'Fast udgift';
});

const typeBadgeClasses = computed(() => {
  return [
    'rounded-full px-2 py-1 text-xs font-medium',
    props.cashflow.type === 'INCOME'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700',
  ];
});

const amountClasses = computed(() => {
  return [
    'font-bold',
    props.cashflow.type === 'INCOME'
      ? 'text-emerald-600'
      : 'text-slate-700',
  ];
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('da-DK');
};

const dateRange = computed(() => {
  const start = formatDate(props.cashflow.startDate);

  if (!props.cashflow.endDate) {
    return `${start} → nu`;
  }

  return `${start} → ${formatDate(props.cashflow.endDate)}`;
});
</script>