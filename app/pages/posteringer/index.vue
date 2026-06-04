<template>
  <PageHeader
    title="Posteringer"
  />

  <MonthPicker
    :month="month"
    :year="year"
    :can-go-next="canGoNext"
    @previous-month="previousMonth"
    @next-month="nextMonth"
    @previous-year="previousYear"
    @next-year="nextYear"
  />

  <div
    v-if="isLoading"
    class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500"
  >
    Henter posteringer...
  </div>

  <div
    v-else
    class="mt-4"
  >
    <TransactionList
      :transactions="transactions"
      @edit="openEditForm"
      @delete="removeTransaction"
    />
  </div>

  <div
    v-if="selectedTransaction"
    class="mt-4"
  >
    <TransactionForm
      :categories="categories"
      :transaction="selectedTransaction"
      @submit="saveTransaction"
    />

    <button
      type="button"
      class="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700"
      @click="selectedTransaction = null"
    >
      Annuller redigering
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Transaction, TransactionFormData } from '~~/types/transaction';

const {
  month,
  canGoNext,
  year,
  previousMonth,
  nextMonth,
  previousYear,
  nextYear,
} = useSelectedMonth();

const {
  categories,
  fetchCategories,
} = useCategories();

const {
  transactions,
  isLoading,
  fetchTransactions,
  updateTransaction,
  deleteTransaction,
} = useTransactions();

const selectedTransaction = ref<Transaction | null>(null);

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchTransactions(month.value, year.value),
  ]);
});

watch([month, year], async () => {
  selectedTransaction.value = null;

  await fetchTransactions(month.value, year.value);
});

const openEditForm = (transaction: Transaction) => {
  selectedTransaction.value = transaction;
};

const saveTransaction = async (data: TransactionFormData) => {
  await updateTransaction(data);

  selectedTransaction.value = null;
};

const removeTransaction = async (id: string) => {
  const confirmed = confirm('Er du sikker på, at du vil slette posteringen?');

  if (!confirmed) {
    return;
  }

  await deleteTransaction(id);
};
</script>