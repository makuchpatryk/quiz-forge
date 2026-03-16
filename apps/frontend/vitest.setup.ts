// Mock Nuxt global composables
(globalThis as unknown as Record<string, unknown>).defineNuxtPlugin = (
  fn: (...args: unknown[]) => unknown,
) => fn;
(globalThis as unknown as Record<string, unknown>).useRuntimeConfig = () => ({
  public: {
    apiBaseUrl: "http://localhost:3000",
  },
});
