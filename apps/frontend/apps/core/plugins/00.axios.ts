import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

interface QueueItem {
  resolve: () => void;
  reject: (error: unknown) => void;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const HTTP_UNAUTHORIZED = 401;

function createTokenRefreshHandler(axiosInstance: AxiosInstance) {
  let isRefreshing = false;
  let failedQueue: QueueItem[] = [];

  const processQueue = (error: unknown): void => {
    failedQueue.forEach((item) => {
      if (error) {
        item.reject(error);
      } else {
        item.resolve();
      }
    });
    failedQueue = [];
  };

  const queueFailedRequest = async (
    originalRequest: RetryableRequestConfig,
  ): Promise<unknown> => {
    await new Promise<void>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
    return await axiosInstance(originalRequest);
  };

  const attemptTokenRefresh = async (
    originalRequest: RetryableRequestConfig,
  ): Promise<unknown> => {
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh przez wewnętrzne API Nuxt dla SSR compatibility
      await $fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      processQueue(null);
      return axiosInstance(originalRequest);
    } catch (err) {
      processQueue(err);
      // Przekieruj do logowania przy błędzie refresh
      if (import.meta.client) {
        window.location.href = "/auth/login";
      }
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

    if (isRefreshing) {
      return queueFailedRequest(originalRequest);
    }

    return attemptTokenRefresh(originalRequest);
  };
}

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: runtimeConfig.public.apiBaseUrl,
    withCredentials: true, // Wysyłaj cookies z każdym requestem
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    createTokenRefreshHandler(axiosInstance),
  );

  return {
    provide: { axios: axiosInstance },
  };
});
