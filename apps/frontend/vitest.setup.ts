import { vi } from "vitest";

// Mock Nuxt global composables
(globalThis as any).defineNuxtPlugin = (fn: Function) => fn;
(globalThis as any).useRuntimeConfig = () => ({
  public: {
    apiBaseUrl: "http://localhost:3000",
  },
});
