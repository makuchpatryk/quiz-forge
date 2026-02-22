import type {
  LoginDto,
  RegisterDto,
  UserResponse,
  AuthMessageResponse,
} from "./types.ts";
import type { AxiosInstance } from "axios";

export interface AuthApi {
  login: (payload: LoginDto) => Promise<AuthMessageResponse>;
  register: (payload: RegisterDto) => Promise<void>;
  refresh: () => Promise<AuthMessageResponse>;
  logout: () => Promise<AuthMessageResponse>;
  getMe: () => Promise<UserResponse>;
}

export const createAuthApi = (axiosInstance: AxiosInstance): AuthApi => ({
  login: async (payload: LoginDto) => {
    // Używamy $fetch z wewnętrznym Nuxt API dla SSR
    return await $fetch<AuthMessageResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
      credentials: "include",
    });
  },
  register: async (payload: RegisterDto) => {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: payload,
      credentials: "include",
    });
  },
  refresh: async () => {
    return await $fetch<AuthMessageResponse>("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
  },
  logout: async () => {
    return await $fetch<AuthMessageResponse>("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  },
  getMe: async () => {
    return await $fetch<UserResponse>("/api/auth/me", {
      credentials: "include",
    });
  },
});
