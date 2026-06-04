<template>
  <header class="sticky top-0 z-50 border-b border-emerald-700 bg-emerald-600">
    <div class="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
      <h1 class="text-xl font-bold text-white">
        Dit budget
      </h1>

      <div class="relative">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-400"
          @click="isMenuOpen = !isMenuOpen"
        >
          <Icon
            name="heroicons:user-circle"
            class="h-6 w-6"
          />
        </button>

        <div
          v-if="isMenuOpen"
          class="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
        >
          <NuxtLink
            to="/indkomst-og-faste-udgifter"
            class="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            @click="isMenuOpen = false"
          >
            <Icon
              name="heroicons:credit-card"
              class="h-5 w-5 text-slate-400"
            />
            <span>Indkomst og faste udgifter</span>
          </NuxtLink>

          <NuxtLink
            to="/kategorier"
            class="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            @click="isMenuOpen = false"
          >
            <Icon
              name="heroicons:tag"
              class="h-5 w-5 text-slate-400"
            />
            <span>Kategorier</span>
          </NuxtLink>

          <NuxtLink
            to="/indstillinger"
            class="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            @click="isMenuOpen = false"
          >
            <Icon
              name="heroicons:cog-6-tooth"
              class="h-5 w-5 text-slate-400"
            />
            <span>Indstillinger</span>
          </NuxtLink>

          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <Icon
              name="heroicons:arrow-right-on-rectangle"
              class="h-5 w-5"
            />
            <span>Log ud</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false);
</script>