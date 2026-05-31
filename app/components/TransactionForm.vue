<template>
  <form
    class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    @submit.prevent="submit"
  >
    <div>
      <label class="text-sm font-medium text-slate-700">
        Kategori
      </label>

      <select
        v-model="form.categoryId"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
      >
        <option value="">
          Vælg kategori
        </option>

        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="text-sm font-medium text-slate-700">
        Beløb
      </label>

      <input
        v-model.number="form.amount"
        type="number"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
      >
    </div>

    <div>
      <label class="text-sm font-medium text-slate-700">
        Dato
      </label>

      <input
        v-model="form.date"
        type="date"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
      >
    </div>

    <div>
      <label class="text-sm font-medium text-slate-700">
        Beskrivelse
      </label>

      <input
        v-model="form.description"
        type="text"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
        placeholder="Valgfri"
      >
    </div>

    <button
      type="submit"
      class="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white"
    >
      {{ submitLabel }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { Category } from '~~/types/category';
import type {
  Transaction,
  TransactionFormData,
} from '~~/types/transaction';

const props = defineProps<{
  categories: Category[];
  transaction?: Transaction | null;
}>();

const emit = defineEmits<{
  submit: [data: TransactionFormData];
}>();

const form = reactive<TransactionFormData>({
  categoryId: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  description: null,
});

const submitLabel = computed(() => {
  return props.transaction
    ? 'Gem ændringer'
    : 'Opret postering';
});

watch(
  () => props.transaction,
  (transaction) => {
    if (!transaction) {
      return;
    }

    form.id = transaction.id;
    form.categoryId = transaction.categoryId;
    form.amount = transaction.amount;
    form.date = transaction.date.slice(0, 10);
    form.description = transaction.description;
  },
  {
    immediate: true,
  },
);

const submit = () => {
  emit('submit', {
    ...form,
  });
};
</script>