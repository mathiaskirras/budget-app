<template>
  <div class="space-y-4">
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="font-semibold text-slate-900">
            Dark mode
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Skift mellem lyst og mørkt tema.
          </p>
        </div>

        <button
          type="button"
          :class="[
            'relative h-8 w-14 rounded-full transition',
            theme === 'dark'
              ? 'bg-emerald-600'
              : 'bg-slate-300',
          ]"
          @click="toggleTheme"
        >
          <span
            :class="[
              'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition',
              theme === 'dark'
                ? 'left-7'
                : 'left-1',
            ]"
          />
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const {
  theme,
  toggleTheme,
} = useTheme();
</script>