<template>
  <PageHeader
    title="Overblik"
  />

  <MonthPicker
    :month="month"
    :year="year"
    :mode="mode"
    :can-go-next="canGoNext"
    @toggle-mode="toggleMode"
    @previous-month="previousMonth"
    @next-month="nextMonth"
    @previous-year="previousYear"
    @next-year="nextYear"
  />

  <div
    v-if="isLoading"
    class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500"
  >
    Henter overblik...
  </div>

  <template v-else>
    <div class="mt-6">
      <StatCard
        title="Resterende"
        :value="formatCurrency(remaining)"
        :variant="remainingVariant"
        icon="heroicons:wallet"
      />
    </div>

    <section class="mt-6">
      <h2 class="mb-3 text-base font-semibold text-slate-900">
        Forbrug pr. kategori
      </h2>

      <div
        v-if="categorySpendings.length === 0"
        class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"
      >
        <Icon
          name="heroicons:chart-bar"
          class="mx-auto mb-3 h-8 w-8 text-slate-400"
        />

        <p class="font-medium text-slate-900">
          Ingen aktivitet endnu
        </p>

        <p class="mt-1 text-sm text-slate-500">
          Opret din første postering for at se dit forbrug.
        </p>
      </div>

      <div
        v-else
        class="space-y-3"
      >
        <CategorySpendingCard
          v-for="category in categorySpendings"
          :key="category.categoryId"
          :name="category.categoryName"
          :spent="category.spent"
          :target="category.target ?? 0"
          :color="category.colorHex"
        />
      </div>
    </section>

    <section class="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-base font-semibold text-slate-900">
        Periodens faste tal
      </h2>

      <div class="mt-3">
        <BudgetSummaryRow
          label="Indkomst"
          description="Efter skat"
          :value="formatCurrency(dashboard?.income ?? 0)"
          icon="heroicons:arrow-trending-up"
          variant="success"
        />

        <BudgetSummaryRow
          label="Faste udgifter"
          description="Husleje, forsikringer og abonnementer"
          :value="formatCurrency(dashboard?.fixedExpenses ?? 0)"
          icon="heroicons:home"
          variant="warning"
        />

        <BudgetSummaryRow
          label="Opsparing"
          description="Penge sat til side"
          :value="formatCurrency(dashboard?.saved ?? 0)"
          icon="heroicons:banknotes"
          variant="info"
        />

        <BudgetSummaryRow
          label="Investering"
          description="Investeringer i perioden"
          :value="formatCurrency(dashboard?.invested ?? 0)"
          icon="heroicons:chart-bar"
          variant="purple"
        />

        <BudgetSummaryRow
          label="Ekstra indkomst"
          description="Gaver, refunderinger og andre penge ind"
          :value="formatCurrency(dashboard?.extraIncome ?? 0)"
          icon="heroicons:gift"
          variant="success"
        />
      </div>
    </section>
  </template>
</template>

<script setup lang="ts">
const {
  month,
  year,
  mode,
  canGoNext,
  toggleMode,
  previousMonth,
  nextMonth,
  previousYear,
  nextYear,
} = useSelectedMonth();

const { formatCurrency } = useCurrency();

const {
  dashboard,
  isLoading,
  fetchDashboard,
} = useDashboard();

onMounted(async () => {
  await fetchDashboard(month.value, year.value, mode.value);
});

watch([month, year, mode], async () => {
  await fetchDashboard(month.value, year.value, mode.value);
});

const remaining = computed(() => {
  return dashboard.value?.remaining ?? 0;
});

const remainingVariant = computed(() => {
  return remaining.value >= 0
    ? 'success'
    : 'danger';
});

const categorySpendings = computed(() => {
  return (dashboard.value?.categorySpending ?? []).filter((category) => {
    return category.spent > 0 || (category.target ?? 0) > 0;
  });
});
</script>