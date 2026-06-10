<template>
  <button
    v-if="!isFormOpen"
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
    <section class="mb-8">
      <h2 class="mb-4 text-base font-semibold text-slate-900">
        Aktive poster
      </h2>

      <div class="space-y-6">
        <div>
          <h3 class="mb-3 text-sm font-semibold text-slate-500">
            Indkomst
          </h3>

          <CashflowList
            :cashflows="activeIncomeItems"
            @edit="openEditForm"
            @delete="openDeleteDialog"
          />
        </div>

        <div>
          <h3 class="mb-3 text-sm font-semibold text-slate-500">
            Faste udgifter
          </h3>

          <CashflowList
            :cashflows="activeFixedExpenseItems"
            @edit="openEditForm"
            @delete="openDeleteDialog"
          />
        </div>
      </div>
    </section>

    <section v-if="inactiveItems.length > 0">
      <h2 class="mb-4 text-base font-semibold text-slate-900">
        Inaktive poster
      </h2>

      <div class="space-y-6">
        <div v-if="inactiveIncomeItems.length > 0">
          <h3 class="mb-3 text-sm font-semibold text-slate-500">
            Indkomst
          </h3>

          <CashflowList
            :cashflows="inactiveIncomeItems"
            @edit="openEditForm"
            @delete="openDeleteDialog"
          />
        </div>

        <div v-if="inactiveFixedExpenseItems.length > 0">
          <h3 class="mb-3 text-sm font-semibold text-slate-500">
            Faste udgifter
          </h3>

          <CashflowList
            :cashflows="inactiveFixedExpenseItems"
            @edit="openEditForm"
            @delete="openDeleteDialog"
          />
        </div>
      </div>
    </section>
  </template>

  <ConfirmDialog
    v-model="isDeleteDialogOpen"
    title="Slet post"
    description="Er du sikker på, at du vil slette posten? Denne handling kan ikke fortrydes."
    @confirm="confirmDeleteCashflow"
  />
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
const selectedCashflowId = ref<string | null>(null);
const isDeleteDialogOpen = ref(false);

onMounted(async () => {
  await fetchCashflows();
});

const activeIncomeItems = computed(() => {
  return cashflows.value.filter((cashflow) => {
    return cashflow.type === 'INCOME' && !cashflow.endDate;
  });
});

const activeFixedExpenseItems = computed(() => {
  return cashflows.value.filter((cashflow) => {
    return cashflow.type === 'FIXED_EXPENSE' && !cashflow.endDate;
  });
});

const inactiveIncomeItems = computed(() => {
  return cashflows.value
    .filter((cashflow) => {
      return cashflow.type === 'INCOME' && Boolean(cashflow.endDate);
    })
    .sort((a, b) => {
      return (
        new Date(b.endDate!).getTime() -
        new Date(a.endDate!).getTime()
      );
    });
});

const inactiveFixedExpenseItems = computed(() => {
  return cashflows.value
    .filter((cashflow) => {
      return cashflow.type === 'FIXED_EXPENSE' && Boolean(cashflow.endDate);
    })
    .sort((a, b) => {
      return (
        new Date(b.endDate!).getTime() -
        new Date(a.endDate!).getTime()
      );
    });
});

const inactiveItems = computed(() => {
  return [
    ...inactiveIncomeItems.value,
    ...inactiveFixedExpenseItems.value,
  ];
});

const openCreateForm = () => {
  selectedCashflow.value = null;
  isFormOpen.value = true;
};

const openEditForm = (cashflow: CashflowItem) => {
  selectedCashflow.value = cashflow;
  isFormOpen.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
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

const openDeleteDialog = (id: string) => {
  selectedCashflowId.value = id;
  isDeleteDialogOpen.value = true;
};

const confirmDeleteCashflow = async () => {
  if (!selectedCashflowId.value) {
    return;
  }

  await deleteCashflow(selectedCashflowId.value);

  selectedCashflowId.value = null;
};
</script>
