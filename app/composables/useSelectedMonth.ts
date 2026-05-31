export const useSelectedMonth = () => {
  const month = useState<number>('selected-month', () => {
    return new Date().getMonth() + 1;
  });

  const year = useState<number>('selected-year', () => {
    return new Date().getFullYear();
  });

  const previousMonth = () => {
    if (month.value === 1) {
      month.value = 12;
      year.value--;

      return;
    }

    month.value--;
  };

  const nextMonth = () => {
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
    year.value++;
  };

  return {
    month,
    year,
    previousMonth,
    nextMonth,
    previousYear,
    nextYear,
  };
};