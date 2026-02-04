import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@auth/stores/auth.ts";
import { createAuthApi } from "@core/libs/api/auth";

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const HTTP_UNAUTHORIZED = 401;

function createTokenRefreshHandler(axiosInstance: AxiosInstance) {
  let isRefreshing = false;
  let failedQueue: QueueItem[] = [];

  const processQueue = (error: unknown, token: string | null = null): void => {
    failedQueue.forEach((item) => {
      if (error) {
        item.reject(error);
      } else if (token) {
        item.resolve(token);
      }
    });
    failedQueue = [];
  };

  const setAuthHeader = (
    config: InternalAxiosRequestConfig,
    token: string,
  ): void => {
    config.headers.Authorization = `Bearer ${token}`;
  };

  const queueFailedRequest = async (
    originalRequest: RetryableRequestConfig,
  ): Promise<unknown> => {
    const token = await new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
    setAuthHeader(originalRequest, token);
    return await axiosInstance(originalRequest);
  };

  const attemptTokenRefresh = async (
    originalRequest: RetryableRequestConfig,
    authStore: ReturnType<typeof useAuthStore>,
  ): Promise<unknown> => {
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const authApi = createAuthApi(axiosInstance);
      const data = await authApi.refresh({
        refreshToken: authStore.state.refreshToken!,
      });

      authStore.setAccessToken(data.accessToken);
      authStore.setRefreshToken(data.refreshToken);

      processQueue(null, data.accessToken);
      setAuthHeader(originalRequest, data.accessToken);

      return axiosInstance(originalRequest);
    } catch (err) {
      processQueue(err, null);
      authStore.logout();
      throw err;
    } finally {
      isRefreshing = false;
    }
  };

  return async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === HTTP_UNAUTHORIZED;
    const hasNotRetried = !originalRequest._retry;

    if (!isUnauthorized || !hasNotRetried) {
      return Promise.reject(error);
    }

    const authStore = useAuthStore();

    if (!authStore.state.refreshToken) {
      authStore.logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return queueFailedRequest(originalRequest);
    }

    return attemptTokenRefresh(originalRequest, authStore);
  };
}

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: runtimeConfig.public.apiBaseUrl,
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore().state.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    createTokenRefreshHandler(axiosInstance),
  );

  return {
    provide: { axios: axiosInstance },
  };
});
