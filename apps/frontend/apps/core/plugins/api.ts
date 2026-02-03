import { createAuthApi } from "~/apps/core/libs/api/auth";
import type { AxiosInstance } from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = (nuxtApp.$axios ||
    nuxtApp.$api ||
    useNuxtApp().$axios) as AxiosInstance;

  const api = {
    auth: createAuthApi(axiosInstance),
  };

  return {
    provide: { api },
  };
});
