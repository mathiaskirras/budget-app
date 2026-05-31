<template>
  <PageHeader
    title="Posteringer"
    description="Registrer dine køb og udgifter"
  />

  <MonthPicker
    :month="month"
    :year="year"
    @previous-month="previousMonth"
    @next-month="nextMonth"
    @previous-year="previousYear"
    @next-year="nextYear"
  />

  <button
    type="button"
    :class="[
      'mt-4 mb-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-white transition',
      showForm
        ? 'bg-slate-600 hover:bg-slate-500'
        : 'bg-indigo-600 hover:bg-indigo-500',
    ]"
    @click="toggleForm"
  >
    <Icon
      :name="
        showForm
          ? 'heroicons:x-mark'
          : 'heroicons:plus'
      "
      class="h-5 w-5"
    />

    {{ showForm ? 'Annuller' : 'Ny postering' }}
  </button>

  <div
    v-if="showForm"
    class="mb-4"
  >
    <TransactionForm
      :categories="categories"
      :transaction="selectedTransaction"
      @submit="saveTransaction"
    />
  </div>

  <TransactionList
    :transactions="transactions"
    @edit="openEditForm"
    @delete="removeTransaction"
  />
</template>

<script setup lang="ts">
import type { Transaction, TransactionFormData } from '~~/types/transaction';

const {
  month,
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
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = useTransactions();

const showForm = ref(false);
const selectedTransaction = ref<Transaction | null>(null);

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchTransactions(month.value, year.value),
  ]);
});

watch([month, year], async () => {
  await fetchTransactions(month.value, year.value);
});

const openCreateForm = () => {
  selectedTransaction.value = null;
  showForm.value = true;
};

const toggleForm = () => {
  if (showForm.value) {
    selectedTransaction.value = null;
  }

  showForm.value = !showForm.value;
};

const openEditForm = (transaction: Transaction) => {
  selectedTransaction.value = transaction;
  showForm.value = true;
};

const saveTransaction = async (data: TransactionFormData) => {
  if (data.id) {
    await updateTransaction(data);
  } else {
    await createTransaction(data);
  }

  selectedTransaction.value = null;
  showForm.value = false;
};

const removeTransaction = async (id: string) => {
  const confirmed = confirm('Er du sikker på, at du vil slette posteringen?');

  if (!confirmed) {
    return;
  }

  await deleteTransaction(id);
};
</script>