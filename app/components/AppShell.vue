<template>
  <div class="min-h-screen bg-linear-to-b from-emerald-50 via-slate-50 to-slate-100">
    <AppHeader />

    <AppToast />

    <main
      class="mx-auto max-w-4xl px-4 py-4"
      style="padding-bottom: calc(6rem + env(safe-area-inset-bottom));"
    >
      <slot />
    </main>

    <BottomNav />
  </div>
</template>