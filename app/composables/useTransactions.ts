import type {
  Transaction,
  TransactionFormData,
} from '~~/types/transaction';

export const useTransactions = () => {
  const transactions = useState<Transaction[]>(
    'transactions',
    () => [],
  );

  const isLoading = useState<boolean>(
    'transactions-loading',
    () => false,
  );

  const fetchTransactions = async (
    month: number,
    year: number,
    mode: 'month' | 'year',
  ) => {
    transactions.value = [];
    isLoading.value = true;

    try {
      transactions.value = await $fetch<Transaction[]>(
        '/api/transactions/list',
        {
          query: {
            month,
            year,
            mode
          },
        },
      );
    } finally {
      isLoading.value = false;
    }
  };

  const createTransaction = async (
    data: TransactionFormData,
  ) => {
    const transaction = await $fetch<Transaction>(
      '/api/transactions/create',
      {
        method: 'POST',
        body: data,
      },
    );

    transactions.value.unshift(transaction);
  };

  const updateTransaction = async (
    data: TransactionFormData,
  ) => {
    const transaction = await $fetch<Transaction>(
      '/api/transactions/update',
      {
        method: 'POST',
        body: data,
      },
    );

    transactions.value = transactions.value.map((item) => {
      return item.id === transaction.id
        ? transaction
        : item;
    });
  };

  const deleteTransaction = async (
    id: string,
  ) => {
    await $fetch('/api/transactions/delete', {
      method: 'POST',
      body: {
        id,
      },
    });

    transactions.value = transactions.value.filter(
      (item) => item.id !== id,
    );
  };

  return {
    transactions,
    isLoading,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};