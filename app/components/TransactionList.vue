<template>
  <div class="space-y-6">
    <section
      v-for="group in groupedTransactions"
      :key="group.date"
    >
      <h2 class="mb-3 text-sm font-semibold text-slate-500">
        {{ group.label }}
      </h2>

      <div class="space-y-3">
        <TransactionListItem
          v-for="transaction in group.transactions"
          :key="transaction.id"
          :transaction="transaction"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </section>

    <div
      v-if="transactions.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"
    >
      <p class="font-medium text-slate-900">
        Ingen posteringer
      </p>

      <p class="mt-1 text-sm text-slate-500">
        Opret din første postering.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~~/types/transaction';

const props = defineProps<{
  transactions: Transaction[];
}>();

defineEmits<{
  edit: [transaction: Transaction];
  delete: [id: string];
}>();

const formatGroupLabel = (dateKey: string) => {
  const date = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isSameDate = (a: Date, b: Date) => {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  };

  if (isSameDate(date, today)) {
    return 'I dag';
  }

  if (isSameDate(date, yesterday)) {
    return 'I går';
  }

  return date.toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const groupedTransactions = computed(() => {
  const groups = props.transactions.reduce<Record<string, Transaction[]>>(
    (result, transaction) => {
      const dateKey = transaction.date.slice(0, 10);

      if (!result[dateKey]) {
        result[dateKey] = [];
      }

      result[dateKey].push(transaction);

      return result;
    },
    {},
  );

  return Object.entries(groups)
    .sort(([dateA], [dateB]) => {
      return dateB.localeCompare(dateA);
    })
    .map(([date, transactions]) => {
      return {
        date,
        label: formatGroupLabel(date),
        transactions,
      };
    });
});
</script>