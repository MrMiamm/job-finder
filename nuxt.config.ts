// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  runtimeConfig: {
    public: {
      EDITOR_NAME: '',
      EDITOR_EMAIL: '',
      HOST_NAME: '',
      HOST_EMAIL: '',
      HOST_URL: '',
    }
  },
  modules: ['@nuxt/image', '@nuxt/icon', '@nuxtjs/color-mode', '@vercel/analytics'],
  vite: {
    plugins: [
      tailwindcss() as any,
    ],
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'theme',
  }
})