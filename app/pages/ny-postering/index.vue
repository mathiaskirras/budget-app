<template>
  <div
    v-if="successMessage"
    class="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"
  >
    {{ successMessage }}
  </div>

  <TransactionForm
    ref="transactionForm"
    :categories="categories"
    @submit="saveTransaction"
  />
</template>

<script setup lang="ts">
import type { TransactionFormData } from '~~/types/transaction';

const {
  categories,
  fetchCategories,
} = useCategories();

const {
  createTransaction,
} = useTransactions();

const transactionForm = ref<{
  resetForm: () => void;
} | null>(null);

const successMessage = ref('');

onMounted(async () => {
  await fetchCategories();
});

const saveTransaction = async (data: TransactionFormData) => {
  const category = categories.value.find((item) => {
    return item.id === data.categoryId;
  });

  await createTransaction(data);

  transactionForm.value?.resetForm();

  successMessage.value = category
    ? `${category.name} blev oprettet.`
    : 'Posteringen blev oprettet.';

  window.setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};
</script>