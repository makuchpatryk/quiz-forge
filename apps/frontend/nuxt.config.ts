export default defineNuxtConfig({
  ssr: true,
  css: ["~/assets/main.scss"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@nuxtjs/i18n"],
  i18n: {
    locales: [
      {
        code: "pl",
        name: "Polski",
        file: "pl.json",
      },
    ],
    defaultLocale: "pl",
  },
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "http://localhost:3000/api",
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
    },
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});
