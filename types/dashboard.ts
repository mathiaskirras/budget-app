export type DashboardCategorySpending = {
  categoryId: string;
  categoryName: string;
  colorHex: string;
  type: 'EXPENSE' | 'SAVING' | 'INVESTMENT';
  target: number | null;
  spent: number;
};

export type DashboardData = {
  income: number;
  extraIncome: number;
  fixedExpenses: number;
  spent: number;
  saved: number;
  invested: number;
  remaining: number;
  categorySpending: DashboardCategorySpending[];
};