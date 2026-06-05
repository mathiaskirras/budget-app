import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/supabase',
    '@vite-pwa/nuxt'
  ],

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },

  routeRules: {},

  app: {
    pageTransition: false,
    head: {
      link: [
        {
          rel: 'icon',
          href: '/favicon.png',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      ],
    },
  },

  pwa: {
    manifest: {
      name: 'Balnce',
      short_name: 'Balnce',
      theme_color: '#059669',
      background_color: '#ffffff',

      icons: [
        {
          src: '/logo-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/logo-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    }
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [],
    },
  },
});