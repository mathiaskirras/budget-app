export const useSelectedMonth = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const month = useState<number>('selected-month', () => {
    return currentMonth;
  });

  const year = useState<number>('selected-year', () => {
    return currentYear;
  });

  const mode = useState<'month' | 'year'>('selected-period-mode', () => {
    return 'month';
  });

  const isCurrentOrFuturePeriod = computed(() => {
    if (mode.value === 'year') {
      return year.value >= currentYear;
    }

    return year.value > currentYear
      || (year.value === currentYear && month.value >= currentMonth);
  });

  const canGoNext = computed(() => {
    return !isCurrentOrFuturePeriod.value;
  });

  const toggleMode = () => {
    mode.value = mode.value === 'month'
      ? 'year'
      : 'month';

    if (year.value > currentYear) {
      year.value = currentYear;
    }

    if (year.value === currentYear && month.value > currentMonth) {
      month.value = currentMonth;
    }
  };

  const previousMonth = () => {
    if (month.value === 1) {
      month.value = 12;
      year.value--;

      return;
    }

    month.value--;
  };

  const nextMonth = () => {
    if (!canGoNext.value) {
      return;
    }

    if (month.value === 12) {
      month.value = 1;
      year.value++;

      return;
    }

    month.value++;
  };

  const previousYear = () => {
    year.value--;
  };

  const nextYear = () => {
    if (!canGoNext.value) {
      return;
    }

    year.value++;
  };

  return {
    month,
    year,
    mode,
    canGoNext,
    toggleMode,
    previousMonth,
    nextMonth,
    previousYear,
    nextYear,
  };
};