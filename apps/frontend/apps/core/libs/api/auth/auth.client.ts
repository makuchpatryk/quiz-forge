import type {
  LoginDto,
  RegisterDto,
  RefreshDto,
  TokenResponse,
} from "./types.ts";
import type { AxiosInstance } from "axios";

export interface AuthApi {
  login: (payload: LoginDto) => Promise<TokenResponse>;
  register: (payload: RegisterDto) => Promise<void>;
  refresh: (payload: RefreshDto) => Promise<TokenResponse>;
}

export const createAuthApi = (axiosInstance: AxiosInstance): AuthApi => ({
  login: async (payload: LoginDto) => {
    const { data } = await axiosInstance.post<TokenResponse>(
      "/auth/login",
      payload,
    );
    return data;
  },
  register: async (payload: RegisterDto) => {
    await axiosInstance.post("/auth/register", payload);
  },
  refresh: async (payload: RefreshDto) => {
    const { data } = await axiosInstance.post<TokenResponse>(
      "/auth/refresh",
      payload,
    );
    return data;
  },
});
