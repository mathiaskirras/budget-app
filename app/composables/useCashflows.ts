import type {
  CashflowFormData,
  CashflowItem,
} from '~~/types/cashflow';

export const useCashflows = () => {
  const cashflows = useState<CashflowItem[]>('cashflows', () => []);
  const isLoading = useState<boolean>('cashflows-loading', () => false);

  const fetchCashflows = async () => {
    cashflows.value = [];
    isLoading.value = true;

    try {
      cashflows.value = await $fetch<CashflowItem[]>('/api/cashflows/list');
    } finally {
      isLoading.value = false;
    }
  };

  const createCashflow = async (data: CashflowFormData) => {
    const item = await $fetch<CashflowItem>('/api/cashflows/create', {
      method: 'POST',
      body: data,
    });

    cashflows.value.push(item);
  };

  const updateCashflow = async (data: CashflowFormData) => {
    const item = await $fetch<CashflowItem>('/api/cashflows/update', {
      method: 'POST',
      body: data,
    });

    cashflows.value = cashflows.value.map((cashflow) => {
      return cashflow.id === item.id ? item : cashflow;
    });
  };

  const deleteCashflow = async (id: string) => {
    await $fetch('/api/cashflows/delete', {
      method: 'POST',
      body: {
        id,
      },
    });

    cashflows.value = cashflows.value.filter((cashflow) => {
      return cashflow.id !== id;
    });
  };

  return {
    cashflows,
    isLoading,
    fetchCashflows,
    createCashflow,
    updateCashflow,
    deleteCashflow,
  };
};