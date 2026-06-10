<template>
  <form
    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    @submit.prevent="submit"
  >
    <div
      :class="[
        'flex min-h-24 flex-col justify-center p-4',
        selectedCategory
          ? ''
          : 'border-b border-slate-200 bg-white text-slate-900',
      ]"
      :style="heroStyle"
    >
      <p
        :class="[
          'text-xs font-medium',
          selectedCategory ? heroMutedTextClass : 'text-slate-500',
        ]"
      >
        Valgt kategori
      </p>

      <p
        :class="[
          'mt-0.5 text-xl font-bold',
          selectedCategory ? heroTextClass : 'text-slate-900',
        ]"
      >
        {{ selectedCategory?.name ?? 'Ingen kategori valgt' }}
      </p>

      <p
        v-if="selectedCategory"
        :class="[
          'mt-0.5 text-xs',
          heroMutedTextClass,
        ]"
      >
        {{ selectedCategory.description || categoryMetaText }}
      </p>
    </div>

    <div class="space-y-3 p-4">
      <div>
        <label class="text-sm font-medium text-slate-700">
          Kategori
        </label>

        <div class="mt-1">
          <CategorySelect
            v-model="form.categoryId"
            :categories="categories"
          />
        </div>
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700">
          Beløb
        </label>

        <input
          v-model.number="form.amount"
          type="number"
          step="0.01"
          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          placeholder="Fx 249 eller -500"
        >
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700">
          Dato
        </label>

        <input
          v-model="form.date"
          type="date"
          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        >
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700">
          Beskrivelse
        </label>

        <input
          v-model="form.description"
          type="text"
          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          placeholder="Valgfri"
        >
      </div>

      <button
        type="submit"
        :disabled="!isValid"
        :class="[
          'w-full rounded-xl px-4 py-2.5 font-semibold text-white transition',
          isValid
            ? 'bg-emerald-600 hover:bg-emerald-500'
            : 'cursor-not-allowed bg-slate-300',
        ]"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Category } from '~~/types/category';
import type {
  Transaction,
  TransactionFormData,
} from '~~/types/transaction';

const props = withDefaults(defineProps<{
  categories?: Category[];
  transaction?: Transaction | null;
}>(), {
  categories: () => [],
  transaction: null,
});

const emit = defineEmits<{
  submit: [data: TransactionFormData];
}>();

const { formatCurrency } = useCurrency();

const getDefaultDate = () => {
  return new Date().toISOString().split('T')[0];
};

const form = reactive<TransactionFormData>({
  categoryId: '',
  amount: null as unknown as number,
  date: getDefaultDate(),
  description: null,
});

const resetForm = () => {
  form.id = undefined;
  form.categoryId = '';
  form.amount = null as unknown as number;
  form.date = getDefaultDate();
  form.description = null;
};

defineExpose({
  resetForm,
});

const selectedCategory = computed(() => {
  return props.categories.find((category) => {
    return category.id === form.categoryId;
  });
});

const submitLabel = computed(() => {
  return props.transaction
    ? 'Gem ændringer'
    : 'Opret postering';
});

const categoryMetaText = computed(() => {
  if (!selectedCategory.value?.target) {
    return 'Budgetkategori';
  }

  return `Månedligt mål: ${formatCurrency(Number(selectedCategory.value.target))}`;
});

const heroStyle = computed(() => {
  if (!selectedCategory.value) {
    return {};
  }

  const color = selectedCategory.value.colorHex;

  return {
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
  };
});

const heroTextColor = computed(() => {
  const color = selectedCategory.value?.colorHex;

  if (!color) {
    return 'dark';
  }

  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? 'dark' : 'light';
});

const heroTextClass = computed(() => {
  return heroTextColor.value === 'dark'
    ? 'text-slate-950'
    : 'text-white';
});

const heroMutedTextClass = computed(() => {
  return heroTextColor.value === 'dark'
    ? 'text-slate-700'
    : 'text-white/80';
});

const isValid = computed(() => {
  return Boolean(form.categoryId)
    && Boolean(form.date)
    && typeof form.amount === 'number'
    && Number.isFinite(form.amount)
    && form.amount !== 0;
});

watch(
  () => props.transaction,
  (transaction) => {
    if (!transaction) {
      resetForm();
      return;
    }

    form.id = transaction.id;
    form.categoryId = transaction.categoryId;
    form.amount = Number(transaction.amount);
    form.date = transaction.date.slice(0, 10);
    form.description = transaction.description;
  },
  {
    immediate: true,
  },
);

const submit = () => {
  if (!isValid.value) {
    return;
  }

  emit('submit', {
    id: form.id,
    categoryId: form.categoryId,
    amount: Number(form.amount),
    date: form.date,
    description: form.description || null,
  });
};
</script>
