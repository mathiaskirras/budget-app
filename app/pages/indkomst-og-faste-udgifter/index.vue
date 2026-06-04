<template>
  <PageHeader title="Indkomst og faste udgifter" />

  <button
    type="button"
    class="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
    @click="openCreateForm"
  >
    <Icon
      name="heroicons:plus"
      class="h-5 w-5"
    />

    Ny post
  </button>

  <div
    v-if="isFormOpen"
    class="mb-4"
  >
    <CashflowForm
      :cashflow="selectedCashflow"
      @submit="saveCashflow"
    />

    <button
      type="button"
      class="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700"
      @click="closeForm"
    >
      Annuller
    </button>
  </div>

  <div
    v-if="isLoading"
    class="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500"
  >
    Henter poster...
  </div>

  <template v-else>
    <section class="mb-6">
      <h2 class="mb-3 text-base font-semibold text-slate-900">
        Indkomst
      </h2>

      <CashflowList
        :cashflows="incomeItems"
        @edit="openEditForm"
        @delete="removeCashflow"
      />
    </section>

    <section>
      <h2 class="mb-3 text-base font-semibold text-slate-900">
        Faste udgifter
      </h2>

      <CashflowList
        :cashflows="fixedExpenseItems"
        @edit="openEditForm"
        @delete="removeCashflow"
      />
    </section>
  </template>
</template>

<script setup lang="ts">
import type {
  CashflowFormData,
  CashflowItem,
} from '~~/types/cashflow';

const {
  cashflows,
  isLoading,
  fetchCashflows,
  createCashflow,
  updateCashflow,
  deleteCashflow,
} = useCashflows();

const isFormOpen = ref(false);
const selectedCashflow = ref<CashflowItem | null>(null);

onMounted(async () => {
  await fetchCashflows();
});

const incomeItems = computed(() => {
  return cashflows.value.filter((cashflow) => {
    return cashflow.type === 'INCOME';
  });
});

const fixedExpenseItems = computed(() => {
  return cashflows.value.filter((cashflow) => {
    return cashflow.type === 'FIXED_EXPENSE';
  });
});

const openCreateForm = () => {
  selectedCashflow.value = null;
  isFormOpen.value = true;
};

const openEditForm = (cashflow: CashflowItem) => {
  selectedCashflow.value = cashflow;
  isFormOpen.value = true;
};

const closeForm = () => {
  selectedCashflow.value = null;
  isFormOpen.value = false;
};

const saveCashflow = async (data: CashflowFormData) => {
  if (data.id) {
    await updateCashflow(data);
  } else {
    await createCashflow(data);
  }

  closeForm();
};

const removeCashflow = async (id: string) => {
  const confirmed = confirm('Er du sikker på, at du vil slette posten?');

  if (!confirmed) {
    return;
  }

  await deleteCashflow(id);
};
</script>