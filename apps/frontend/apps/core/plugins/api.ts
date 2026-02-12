import { createAuthApi } from "~/apps/core/libs/api/auth";
import type { AxiosInstance } from "axios";
import { createQuizApi } from "@core/libs/api/quiz/quiz.client.ts";

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = (nuxtApp.$axios ||
    nuxtApp.$api ||
    useNuxtApp().$axios) as AxiosInstance;

  const api = {
    auth: createAuthApi(axiosInstance),
    quiz: createQuizApi(axiosInstance),
  };

  return {
    provide: { api },
  };
});
