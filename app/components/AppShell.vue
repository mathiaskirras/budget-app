<template>
  <div class="min-h-screen bg-linear-to-b from-emerald-50 via-slate-50 to-slate-100">
    <AppHeader />

    <main class="mx-auto max-w-4xl px-4 py-4 pb-24">
      <slot />
    </main>

    <BottomNav />
  </div>
</template>