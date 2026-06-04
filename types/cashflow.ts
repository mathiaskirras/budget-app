export type CashflowType = 'INCOME' | 'FIXED_EXPENSE';

export type CashflowItem = {
  id: string;
  budgetId: string;
  type: CashflowType;
  name: string;
  description: string | null;
  amount: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CashflowFormData = {
  id?: string;
  type: CashflowType;
  name: string;
  description: string | null;
  amount: number | null;
  startDate: string;
  endDate: string | null;
};