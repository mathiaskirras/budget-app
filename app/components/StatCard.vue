<template>
  <div :class="cardClasses">
    <div class="flex items-center justify-between">
      <p :class="titleClasses">
        {{ title }}
      </p>

      <div
        v-if="icon"
        :class="iconClasses"
      >
        <Icon
          :name="icon"
          class="h-5 w-5"
        />
      </div>
    </div>

    <p :class="valueClasses">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string;
  value: string;
  icon?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'purple';
}>(), {
  variant: 'default',
});

const cardClasses = computed(() => {
  const variants = {
    default: 'border-slate-200 bg-white',
    success: 'border-green-200 bg-green-50 shadow-md',
    danger: 'border-red-200 bg-red-50 shadow-md',
    warning: 'border-amber-200 bg-amber-50',
    info: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
  };

  return [
    'rounded-2xl border p-5 shadow-sm',
    variants[props.variant],
  ];
});

const titleClasses = computed(() => {
  const variants = {
    default: 'text-slate-500',
    success: 'text-green-700',
    danger: 'text-red-700',
    warning: 'text-amber-700',
    info: 'text-blue-700',
    purple: 'text-purple-700',
  };

  return [
    'text-sm font-medium',
    variants[props.variant],
  ];
});

const valueClasses = computed(() => {
  const variants = {
    default: 'text-slate-900',
    success: 'text-green-800',
    danger: 'text-red-800',
    warning: 'text-amber-800',
    info: 'text-blue-800',
    purple: 'text-purple-800',
  };

  return [
    'mt-2 text-3xl font-bold',
    variants[props.variant],
  ];
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
    'flex h-9 w-9 items-center justify-center rounded-xl',
    variants[props.variant],
  ];
});
</script>