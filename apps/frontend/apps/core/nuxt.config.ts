export default defineNuxtConfig({
  compatibilityDate: "2026-01-18",
  ssr: true,
  css: ["@core/assets/main.scss"],
  modules: ["@nuxtjs/i18n", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
  i18n: {
    locales: [
      {
        code: "pl",
        name: "Polski",
      },
    ],
    vueI18n: "@core/i18n/index.ts",
    defaultLocale: "pl",
  },
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
    },
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});
