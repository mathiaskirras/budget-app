<template>
  <form
    class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    @submit.prevent="submit"
  >
    <div>
      <label class="text-sm font-medium text-slate-700">
        Navn
      </label>

      <input
        v-model="form.name"
        type="text"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        placeholder="Fx Dagligvarer"
      >
    </div>

    <div>
      <label class="text-sm font-medium text-slate-700">
        Beskrivelse
      </label>

      <input
        v-model="form.description"
        type="text"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        placeholder="Valgfri"
      >
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-sm font-medium text-slate-700">
          Farve
        </label>

        <input
          v-model="form.colorHex"
          type="color"
          class="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white p-1"
        >
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700">
          Månedligt mål
        </label>

        <input
          v-model.number="form.target"
          type="number"
          min="0"
          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          placeholder="2500"
        >
      </div>
    </div>

    <div>
      <label class="text-sm font-medium text-slate-700">
        Type
      </label>

      <select
        v-model="form.type"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
      >
        <option value="EXPENSE">
          Forbrug
        </option>
        <option value="SAVING">
          Opsparing
        </option>
        <option value="INVESTMENT">
          Investering
        </option>
      </select>
    </div>

    <div class="flex gap-3">
      <button
        type="submit"
        class="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        {{ submitLabel }}
      </button>

      <button
        v-if="isEditing"
        type="button"
        class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        @click="$emit('cancel')"
      >
        Annuller
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Category, CategoryFormData, CategoryType } from '~~/types/category';

const props = defineProps<{
  category?: Category | null;
}>();

const emit = defineEmits<{
  submit: [data: CategoryFormData];
  cancel: [];
}>();

const isEditing = computed(() => {
  return !!props.category;
});

const submitLabel = computed(() => {
  return isEditing.value ? 'Gem ændringer' : 'Opret kategori';
});

const form = reactive<{
  id?: string;
  name: string;
  description: string | null;
  colorHex: string;
  type: CategoryType;
  target: number | null;
}>({
  id: undefined,
  name: '',
  description: null,
  colorHex: '#6366f1',
  type: 'EXPENSE',
  target: null,
});

watch(
  () => props.category,
  (category) => {
    form.id = category?.id;
    form.name = category?.name ?? '';
    form.description = category?.description ?? null;
    form.colorHex = category?.colorHex ?? '#6366f1';
    form.type = category?.type ?? 'EXPENSE';
    form.target = category?.target === null ? null : Number(category?.target);
  },
  {
    immediate: true,
  },
);

const submit = () => {
  if (!form.name.trim()) {
    return;
  }

  emit('submit', {
    id: form.id,
    name: form.name.trim(),
    description: form.description || null,
    colorHex: form.colorHex,
    type: form.type,
    target: form.target,
  });

  if (!isEditing.value) {
    form.name = '';
    form.description = null;
    form.colorHex = '#6366f1';
    form.type = 'EXPENSE';
    form.target = null;
  }
};
</script>