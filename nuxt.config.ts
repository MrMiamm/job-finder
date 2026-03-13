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
        { name: 'description', content: 'Moteur de recherche d\'offres d\'emploi dans les métiers du numérique.' },
        { name: 'apple-mobile-web-app-title', content: process.env.NUXT_PUBLIC_APP_TITLE || '' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
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