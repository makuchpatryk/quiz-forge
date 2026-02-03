import axios from "axios";
import { useAuthStore } from "@auth/stores/auth.ts";
import { createAuthApi } from "@core/libs/api/auth";

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const axiosInstance = axios.create({
    baseURL: runtimeConfig.public.apiBaseUrl,
  });
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore().state.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        const authStore = useAuthStore();
        if (!authStore.state.refreshToken) {
          authStore.logout();
          return Promise.reject(error);
        }
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const authApi = createAuthApi(axiosInstance);
          const data = await authApi.refresh({
            refreshToken: authStore.state.refreshToken,
          });

          authStore.setAccessToken(data.accessToken);
          authStore.setRefreshToken(data.refreshToken);

          processQueue(null, data.accessToken);
          originalRequest.headers["Authorization"] =
            "Bearer " + data.accessToken;
          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          authStore.logout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    },
  );
  return {
    provide: { axios: axiosInstance },
  };
});
