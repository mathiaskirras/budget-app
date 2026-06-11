<template>
  <button
    v-if="!isFormOpen"
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
    ref="formContainer"
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
    @delete="openDeleteDialog"
  />

  <ConfirmDialog
    v-model="isDeleteDialogOpen"
    title="Slet kategori"
    description="Er du sikker på, at du vil slette kategorien? Denne handling kan ikke fortrydes."
    @confirm="confirmDeleteCategory"
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
const selectedCategoryId = ref<string | null>(null);
const isDeleteDialogOpen = ref(false);
const formContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  await fetchCategories();
});

const openCreateForm = async () => {
  selectedCategory.value = null;
  isFormOpen.value = true;

  await nextTick();

  formContainer.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
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

const openDeleteDialog = (id: string) => {
  selectedCategoryId.value = id;
  isDeleteDialogOpen.value = true;
};

const confirmDeleteCategory = async () => {
  if (!selectedCategoryId.value) {
    return;
  }

  await deleteCategory(selectedCategoryId.value);

  selectedCategoryId.value = null;
};
</script>
