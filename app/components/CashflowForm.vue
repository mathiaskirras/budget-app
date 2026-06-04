<template>
  <form
    class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    @submit.prevent="submit"
  >
    <div>
      <label class="text-sm font-medium text-slate-700">
        Type
      </label>

      <select
        v-model="form.type"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
      >
        <option value="INCOME">
          Indkomst
        </option>
        <option value="FIXED_EXPENSE">
          Fast udgift
        </option>
      </select>
    </div>

    <div>
      <label class="text-sm font-medium text-slate-700">
        Navn
      </label>

      <input
        v-model="form.name"
        type="text"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        placeholder="Fx Løn eller Husleje"
      >
    </div>

    <div>
      <label class="text-sm font-medium text-slate-700">
        Beløb
      </label>

      <input
        v-model.number="form.amount"
        type="number"
        min="0"
        step="0.01"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        placeholder="Fx 32000"
      >
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-sm font-medium text-slate-700">
          Startdato
        </label>

        <input
          v-model="form.startDate"
          type="date"
          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        >
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700">
          Slutdato
        </label>

        <input
          v-model="form.endDate"
          type="date"
          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
        >
      </div>
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
        'w-full rounded-xl px-4 py-3 font-semibold text-white transition',
        isValid
          ? 'bg-emerald-600 hover:bg-emerald-500'
          : 'cursor-not-allowed bg-slate-300',
      ]"
    >
      {{ submitLabel }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type {
  CashflowFormData,
  CashflowItem,
} from '~~/types/cashflow';

const props = withDefaults(defineProps<{
  cashflow?: CashflowItem | null;
}>(), {
  cashflow: null,
});

const emit = defineEmits<{
  submit: [data: CashflowFormData];
}>();

const form = reactive<CashflowFormData>({
  type: 'INCOME',
  name: '',
  description: null,
  amount: null,
  startDate: new Date().toISOString().split('T')[0] || '',
  endDate: null,
});

const submitLabel = computed(() => {
  return props.cashflow
    ? 'Gem ændringer'
    : 'Opret';
});

const isValid = computed(() => {
  return Boolean(form.type)
    && Boolean(form.name.trim())
    && Boolean(form.startDate)
    && typeof form.amount === 'number'
    && Number.isFinite(form.amount)
    && form.amount > 0;
});

watch(
  () => props.cashflow,
  (cashflow) => {
    if (!cashflow) {
      form.id = undefined;
      form.type = 'INCOME';
      form.name = '';
      form.description = null;
      form.amount = null;
      form.startDate = new Date().toISOString().split('T')[0] || '';
      form.endDate = null;

      return;
    }

    form.id = cashflow.id;
    form.type = cashflow.type;
    form.name = cashflow.name;
    form.description = cashflow.description;
    form.amount = Number(cashflow.amount);
    form.startDate = cashflow.startDate.slice(0, 10);
    form.endDate = cashflow.endDate?.slice(0, 10) ?? null;
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
    type: form.type,
    name: form.name.trim(),
    description: form.description || null,
    amount: Number(form.amount),
    startDate: form.startDate,
    endDate: form.endDate || null,
  });
};
</script>