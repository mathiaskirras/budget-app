import type { Category } from './category';

export type Transaction = {
  id: string;
  budgetId: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
};

export type TransactionFormData = {
  id?: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string | null;
};