<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4"
    >
      <div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div class="mb-4 flex items-start gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Icon
              :name="icon"
              class="h-5 w-5"
            />
          </div>

          <div>
            <h2 class="text-lg font-bold text-slate-900">
              {{ title }}
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              {{ description }}
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            class="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="$emit('update:modelValue', false)"
          >
            {{ cancelLabel }}
          </button>

          <button
            type="button"
            class="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            @click="confirm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: string;
}>(), {
  confirmLabel: 'Slet',
  cancelLabel: 'Annuller',
  icon: 'heroicons:trash',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
}>();

const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};
</script>