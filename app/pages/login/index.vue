<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 px-4">
    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-bold text-slate-900">
        Log ind
      </h1>

      <p class="mt-1 text-sm text-slate-500">
        Log ind for at se dit budget.
      </p>

      <form
        class="mt-6 space-y-4"
        @submit.prevent="login"
      >
        <div>
          <label class="text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            v-model="email"
            type="email"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          >
        </div>

        <div>
          <label class="text-sm font-medium text-slate-700">
            Adgangskode
          </label>

          <input
            v-model="password"
            type="password"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          >
        </div>

        <p
          v-if="errorMessage"
          class="rounded-xl bg-red-50 p-3 text-sm text-red-600"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500"
        >
          Log ind
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const supabase = useSupabaseClient();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
  errorMessage.value = '';

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
    return;
  }

  await router.push('/');
};
</script>