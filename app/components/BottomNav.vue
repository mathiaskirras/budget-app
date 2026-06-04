<template>
  <nav class="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto grid h-16 max-w-4xl grid-cols-3 px-2">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center justify-center text-xs"
      >
        <div
          :class="[
            'flex min-w-20 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition',
            isActive(item.to)
              ? 'bg-emerald-50 text-emerald-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
          ]"
        >
          <Icon
            :name="item.icon"
            class="h-5 w-5"
          />

          <span class="font-medium">
            {{ item.label }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();

const navigationItems = [
  {
    label: 'Overblik',
    icon: 'heroicons:home',
    to: '/',
  },
  {
    label: 'Ny postering',
    icon: 'heroicons:plus-circle',
    to: '/ny-postering',
  },
  {
    label: 'Posteringer',
    icon: 'heroicons:banknotes',
    to: '/posteringer',
  },
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>