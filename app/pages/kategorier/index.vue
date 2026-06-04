<template>
  <PageHeader
    title="Kategorier"
  />

  <button
    type="button"
    class="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
    @click="openCreateForm"
  >
    <Icon
      name="heroicons:plus"
      class="h-5 w-5"
    />
    Ny kategori
  </button>

  <div
    v-if="isFormOpen"
    class="mb-4"
  >
    <CategoryForm
      :category="selectedCategory"
      @submit="saveCategory"
      @cancel="closeForm"
    />
  </div>

  <div
    v-if="isLoading"
    class="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500"
  >
    Henter kategorier...
  </div>

  <CategoryList
    v-else
    :categories="categories"
    @edit="openEditForm"
    @delete="removeCategory"
  />
</template>

<script setup lang="ts">
import type { Category, CategoryFormData } from '~~/types/category';

const {
  categories,
  isLoading,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategories();

const isFormOpen = ref(false);
const selectedCategory = ref<Category | null>(null);

onMounted(async () => {
  await fetchCategories();
});

const openCreateForm = () => {
  selectedCategory.value = null;
  isFormOpen.value = true;
};

const openEditForm = (category: Category) => {
  selectedCategory.value = category;
  isFormOpen.value = true;
};

const closeForm = () => {
  selectedCategory.value = null;
  isFormOpen.value = false;
};

const saveCategory = async (data: CategoryFormData) => {
  if (data.id) {
    await updateCategory(data);
  } else {
    await createCategory(data);
  }

  closeForm();
};

const removeCategory = async (id: string) => {
  const confirmed = confirm('Er du sikker på, at du vil slette kategorien?');

  if (!confirmed) {
    return;
  }

  await deleteCategory(id);
};
</script>