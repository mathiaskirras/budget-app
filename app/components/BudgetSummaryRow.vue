<template>
  <div class="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
    <div class="flex items-center gap-3">
      <div :class="iconClasses">
        <Icon
          :name="icon"
          class="h-5 w-5"
        />
      </div>

      <div>
        <p class="font-medium text-slate-900">
          {{ label }}
        </p>

        <p
          v-if="description"
          class="text-sm text-slate-500"
        >
          {{ description }}
        </p>
      </div>
    </div>

    <p :class="valueClasses">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string;
  value: string;
  icon: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'default';
  description?: string;
}>(), {
  variant: 'default',
});

const iconClasses = computed(() => {
  const variants = {
    default: 'bg-slate-100 text-slate-500',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return [
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
    variants[props.variant],
  ];
});

const valueClasses = computed(() => {
  const variants = {
    default: 'text-slate-900',
    success: 'text-green-700',
    danger: 'text-red-700',
    warning: 'text-amber-700',
    info: 'text-blue-700',
    purple: 'text-purple-700',
  };

  return [
    'font-semibold',
    variants[props.variant],
  ];
});
</script>