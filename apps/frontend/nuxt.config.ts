import { resolve } from "path";

export default defineNuxtConfig({
  alias: {
    "@": resolve(__dirname, "."),
    "@core": resolve(__dirname, "./apps/core"),
    "@auth": resolve(__dirname, "./apps/auth"),
    "@base": resolve(__dirname, "./apps/base"),
  },
  extends: ["./apps/core", "./apps/base", "./apps/auth"],
});
