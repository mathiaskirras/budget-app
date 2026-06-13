export type CategoryType = 'EXPENSE' | 'SAVING' | 'INVESTMENT';

export type Category = {
  id: string;
  budgetId: string;
  name: string;
  description: string | null;
  colorHex: string;
  type: CategoryType;
  target: string | number | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type CategoryFormData = {
  id?: string;
  name: string;
  description: string | null;
  colorHex: string;
  type: CategoryType;
  target: number | null;
  isActive?: boolean;
};