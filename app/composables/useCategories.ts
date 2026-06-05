import type { Category, CategoryFormData } from '~~/types/category';

export const useCategories = () => {
  const categories = useState<Category[]>('categories', () => []);
  const isLoading = useState<boolean>('categories-loading', () => false);

  const fetchCategories = async () => {
    categories.value = [];
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
      body: data,
    });

    categories.value.push(category);
  };

  const updateCategory = async (data: CategoryFormData) => {
    const category = await $fetch<Category>('/api/categories/update', {
      method: 'POST',
      body: data,
    });

    categories.value = categories.value.map((item) => {
      return item.id === category.id ? category : item;
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