<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <img
          src="/logo.png"
          alt="Balnce"
          class="mx-auto h-24 w-24"
        >

        <h1 class="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Balnce
        </h1>

        <p class="mt-2 text-sm text-slate-500">
          Få overblik over dit budget
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-2xl font-bold text-slate-900">
          {{ isRegistering ? 'Opret bruger' : 'Log ind' }}
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          {{
            isRegistering
              ? 'Opret en bruger for at komme i gang.'
              : 'Log ind for at se dit budget.'
          }}
        </p>

        <form
          class="mt-6 space-y-4"
          @submit.prevent="submit"
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

          <p
            v-if="successMessage"
            class="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
          >
            {{ successMessage }}
          </p>

          <button
            type="submit"
            class="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500"
          >
            {{ isRegistering ? 'Opret bruger' : 'Log ind' }}
          </button>
        </form>

        <button
          type="button"
          class="mt-4 w-full text-sm font-medium text-emerald-700"
          @click="toggleMode"
        >
          {{
            isRegistering
              ? 'Har du allerede en bruger? Log ind'
              : 'Ingen bruger? Opret en her'
          }}
        </button>
      </div>
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
const successMessage = ref('');
const isRegistering = ref(false);

const toggleMode = () => {
  isRegistering.value = !isRegistering.value;
  errorMessage.value = '';
  successMessage.value = '';
};

const submit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (isRegistering.value) {
    await register();
    return;
  }

  await login();
};

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
    return;
  }

  await $fetch('/api/auth/ensure-budget', {
    method: 'POST',
  });

  await router.push('/');
};

const register = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
    return;
  }

  if (!data.session) {
    successMessage.value = 'Brugeren er oprettet. Tjek din email for at bekræfte kontoen.';
    return;
  }

  await $fetch('/api/auth/ensure-budget', {
    method: 'POST',
  });

  await router.push('/');
};
</script>