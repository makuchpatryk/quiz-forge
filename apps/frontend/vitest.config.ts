import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    {
      name: "nuxt-import-meta-stub",
      transform(code) {
        return code
          .replace(/import\.meta\.client/g, "true")
          .replace(/import\.meta\.server/g, "false");
      },
    },
  ],
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["**/*.{test,spec}.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@core": resolve(__dirname, "./apps/core"),
      "@auth": resolve(__dirname, "./apps/auth"),
      "@base": resolve(__dirname, "./apps/base"),
    },
  },
});
