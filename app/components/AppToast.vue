<template>
  <Transition name="fade">
    <div
      v-if="toast.visible"
      :class="[
        'fixed left-4 right-4 top-20 z-50 rounded-2xl px-4 py-3 shadow-lg',
        toast.type === 'success'
          ? 'bg-emerald-600 text-white'
          : 'bg-red-600 text-white',
      ]"
    >
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { toast } = useToast();
</script>