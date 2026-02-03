import type { LoginDto, RefreshDto, TokenResponse } from "./types.ts";
import type { AxiosInstance, AxiosResponse } from "axios";

export interface AuthApi {
  login: (payload: LoginDto) => Promise<TokenResponse>;
  refresh: (payload: RefreshDto) => Promise<TokenResponse>;
  quiz: (payload: any) => Promise<any>;
}
export const createAuthApi = (axiosInstance: AxiosInstance): AuthApi => ({
  login: async (payload: LoginDto) => {
    try {
      const { data } = await axiosInstance.post<TokenResponse>(
        "/auth/login",
        payload,
      );
      return data;
    } catch (e) {
      throw e;
    }
  },
  refresh: async (payload: RefreshDto) => {
    try {
      const { data } = await axiosInstance.post<TokenResponse>(
        "/auth/refresh",
        payload,
      );
      return data;
    } catch (e) {
      throw e;
    }
  },
  quiz: async (payload: any) => {
    try {
      const { data } = await axiosInstance.get<any>("/quiz");
      return data;
    } catch (e) {
      throw e;
    }
  },
  // register: (payload: RegisterDto) => axiosInstance.post<RegisterResponse>('/api/auth/register', payload),
});
