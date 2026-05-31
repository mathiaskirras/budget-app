<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
            class="h-3 w-3 shrink-0 rounded-full"
            :style="{ backgroundColor: transaction.category.colorHex }"
        />

        <div>
          <p class="font-semibold text-slate-900">
            {{ transaction.category.name }}
          </p>

          <p
            v-if="transaction.description"
            class="text-sm text-slate-500"
          >
            {{ transaction.description }}
          </p>

          <p class="mt-1 text-xs text-slate-400">
            {{ formattedDate }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="text-right">
          <p
            :class="[
              'text-lg font-bold',
              amountColorClass,
            ]"
          >
            {{ formatCurrency(transaction.amount) }}
          </p>
        </div>

        <button
          type="button"
          class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          @click="$emit('edit', transaction)"
        >
          <Icon
            name="heroicons:pencil-square"
            class="h-5 w-5"
          />
        </button>

        <button
          type="button"
          class="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
          @click="$emit('delete', transaction.id)"
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
import type { Transaction } from '~~/types/transaction';

const props = defineProps<{
  transaction: Transaction;
}>();

defineEmits<{
  edit: [transaction: Transaction];
  delete: [id: string];
}>();

const { formatCurrency } = useCurrency();

const formattedDate = computed(() => {
  return new Date(props.transaction.date).toLocaleDateString('da-DK');
});

const amountColorClass = computed(() => {
  if (props.transaction.amount < 0) {
    return 'text-emerald-600';
  }

  return 'text-slate-700';
});
</script>