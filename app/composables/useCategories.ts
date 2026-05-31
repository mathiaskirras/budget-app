import type { Category, CategoryFormData } from '~~/types/category';

const DEV_BUDGET_ID = 'local-dev';

export const useCategories = () => {
  const categories = useState<Category[]>('categories', () => []);
  const isLoading = useState<boolean>('categories-loading', () => false);

  const fetchCategories = async () => {
    isLoading.value = true;

    try {
      categories.value = await $fetch<Category[]>('/api/categories/list');
    } finally {
      isLoading.value = false;
    }
  };

  const createCategory = async (data: CategoryFormData) => {
    const category = await $fetch<Category>('/api/categories/create', {
      method: 'POST',
      body: {
        ...data,
        budgetId: DEV_BUDGET_ID,
      },
    });

    categories.value.push(category);
  };

  const updateCategory = async (data: CategoryFormData) => {
    if (!data.id) {
      return;
    }

    const category = await $fetch<Category>('/api/categories/update', {
      method: 'POST',
      body: data,
    });

    categories.value = categories.value.map((item) => {
      if (item.id === category.id) {
        return category;
      }

      return item;
    });
  };

  const deleteCategory = async (id: string) => {
    await $fetch('/api/categories/delete', {
      method: 'POST',
      body: {
        id,
      },
    });

    categories.value = categories.value.filter((category) => {
      return category.id !== id;
    });
  };

  return {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};