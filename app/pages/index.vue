<template>
  <PageHeader
    title="Overblik"
    description="Dit budget for den valgte måned"
  />

  <MonthPicker
    :month="month"
    :year="year"
    @previous-month="previousMonth"
    @next-month="nextMonth"
    @previous-year="previousYear"
    @next-year="nextYear"
  />

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

    <div class="space-y-3">
      <CategorySpendingCard
        v-for="category in categorySpendings"
        :key="category.name"
        :name="category.name"
        :spent="category.spent"
        :target="category.target"
        :color="category.color"
      />
    </div>
  </section>

  <section class="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 class="text-base font-semibold text-slate-900">
      Månedens faste tal
    </h2>

    <div class="mt-3">
      <BudgetSummaryRow
        v-for="item in summaryItems"
        :key="item.label"
        :label="item.label"
        :description="item.description"
        :value="item.value"
        :icon="item.icon"
        :variant="item.variant"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const {
  month,
  year,
  previousMonth,
  nextMonth,
  previousYear,
  nextYear,
} = useSelectedMonth();

const { formatCurrency } = useCurrency();

const remaining = computed(() => {
  return 8450;
});

const remainingVariant = computed(() => {
  return remaining.value >= 0 ? 'success' : 'danger';
});

const categorySpendings = computed(() => {
  return [
    {
      name: 'Dagligvarer',
      spent: 1250,
      target: 2500,
      color: '#22c55e',
    },
    {
      name: 'Underholdning',
      spent: 1200,
      target: 1000,
      color: '#a855f7',
    },
    {
      name: 'Transport',
      spent: 620,
      target: 800,
      color: '#3b82f6',
    },
  ];
});

const summaryItems = computed(() => {
  return [
    {
      label: 'Indkomst',
      description: 'Efter skat',
      value: formatCurrency(32000),
      icon: 'heroicons:arrow-trending-up',
      variant: 'success' as const,
    },
    {
      label: 'Faste udgifter',
      description: 'Husleje, forsikringer og abonnementer',
      value: formatCurrency(11200),
      icon: 'heroicons:home',
      variant: 'warning' as const,
    },
    {
      label: 'Opsparing',
      description: 'Penge sat til side',
      value: formatCurrency(2000),
      icon: 'heroicons:banknotes',
      variant: 'info' as const,
    },
    {
      label: 'Investering',
      description: 'Investeringer denne måned',
      value: formatCurrency(3000),
      icon: 'heroicons:chart-bar',
      variant: 'purple' as const,
    },
  ];
});
</script>