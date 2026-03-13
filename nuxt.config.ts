// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  runtimeConfig: {
    public: {
      APP_TITLE: 'PLACEHOLDER',
    }
  },
  app: {
    head: {
      title: process.env.NUXT_PUBLIC_APP_TITLE || '',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      htmlAttrs: {
        lang: 'fr',
      },
    }
  },
  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@vercel/analytics',
    '@nuxtjs/device'
  ],
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