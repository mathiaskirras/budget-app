<template>
  <div class="space-y-3">
    <CashflowListItem
      v-for="cashflow in cashflows"
      :key="cashflow.id"
      :cashflow="cashflow"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />

    <div
      v-if="cashflows.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"
    >
      <p class="font-medium text-slate-900">
        Ingen poster endnu
      </p>

      <p class="mt-1 text-sm text-slate-500">
        Opret din første indkomst eller faste udgift.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CashflowItem } from '~~/types/cashflow';

defineProps<{
  cashflows: CashflowItem[];
}>();

defineEmits<{
  edit: [cashflow: CashflowItem];
  delete: [id: string];
}>();
</script>