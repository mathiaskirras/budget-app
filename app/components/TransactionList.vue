<template>
  <div class="space-y-3">
    <TransactionListItem
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />

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

defineProps<{
  transactions: Transaction[];
}>();

defineEmits<{
  edit: [transaction: Transaction];
  delete: [id: string];
}>();
</script>