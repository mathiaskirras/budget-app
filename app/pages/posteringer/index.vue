<template>
  <MonthPicker
    :month="month"
    :year="year"
    :can-go-next="canGoNext"
    :mode="mode"
    @toggle-mode="toggleMode"
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
      @delete="openDeleteDialog"
    />
  </div>

  <div
    v-if="selectedTransaction"
    ref="editFormContainer"
    class="mt-4"
  >
    <TransactionForm
      :categories="categories"
      :transaction="selectedTransaction"
      @submit="saveTransaction"
    />

    <button
      type="button"
      class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700"
      @click="selectedTransaction = null"
    >
      Annuller redigering
    </button>
  </div>

  <ConfirmDialog
    v-model="isDeleteDialogOpen"
    title="Slet postering"
    description="Er du sikker på, at du vil slette posteringen? Denne handling kan ikke fortrydes."
    @confirm="confirmDeleteTransaction"
  />
</template>

<script setup lang="ts">
import type { Transaction, TransactionFormData } from '~~/types/transaction';

const {
  month,
  canGoNext,
  year,
  mode,
  toggleMode,
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
const selectedTransactionId = ref<string | null>(null);
const isDeleteDialogOpen = ref(false);
const editFormContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchTransactions(month.value, year.value, mode.value),
  ]);
});

watch([month, year, mode], async () => {
  selectedTransaction.value = null;

  await fetchTransactions(
    month.value,
    year.value,
    mode.value,
  );
});

const openEditForm = async (transaction: Transaction) => {
  selectedTransaction.value = transaction;

  await nextTick();

  editFormContainer.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

const saveTransaction = async (data: TransactionFormData) => {
  await updateTransaction(data);

  selectedTransaction.value = null;
};

const openDeleteDialog = (id: string) => {
  selectedTransactionId.value = id;
  isDeleteDialogOpen.value = true;
};

const confirmDeleteTransaction = async () => {
  if (!selectedTransactionId.value) {
    return;
  }

  await deleteTransaction(selectedTransactionId.value);

  selectedTransactionId.value = null;
};
</script>
