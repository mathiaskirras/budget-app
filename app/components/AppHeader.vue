<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 overflow-hidden rounded-2xl shadow-sm">
          <img
            src="/logo.png"
            alt="Budget"
            class="h-full w-full object-cover"
          >
        </div>

        <h1 class="text-xl font-bold text-slate-900">
          {{ pageTitle }}
        </h1>
      </div>

      <div class="relative" ref="menuRef">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
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
          <div class="border-b border-slate-100 px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
              Logget ind som
            </p>

            <p class="mt-1 truncate text-sm font-medium text-slate-900">
              {{ displayName }}
            </p>
          </div>

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
<!--
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
-->
          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
            @click="logout"
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
const route = useRoute();

const isMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Overblik',
    '/ny-postering': 'Ny postering',
    '/posteringer': 'Posteringer',
    '/indkomst-og-faste-udgifter': 'Indkomst og udgifter',
    '/kategorier': 'Kategorier',
    '/indstillinger': 'Indstillinger',
  };

  return titles[route.path] ?? 'Dit budget';
});

const handleClickOutside = (event: MouseEvent) => {
  if (!menuRef.value) {
    return;
  }

  if (!menuRef.value.contains(event.target as Node)) {
    isMenuOpen.value = false;
  }
};

const displayName = computed(() => {
  return user.value?.user_metadata?.display_name
    || user.value?.user_metadata?.full_name
    || user.value?.email?.toLowerCase().includes('anna') ? 'Anna Winter' : user.value?.email?.toLowerCase().includes('mathiaskirras') ? 'Mathias Rasmussen' : user.value?.email
    || 'Bruger';
});

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

const logout = async () => {
  useState('categories').value = [];
  useState('transactions').value = [];
  useState('cashflows').value = [];
  useState('dashboard').value = null;

  await supabase.auth.signOut();

  await navigateTo('/login');
};
</script>
