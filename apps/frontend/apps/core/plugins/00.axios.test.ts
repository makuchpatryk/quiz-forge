import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AxiosInstance } from "axios";

// Mocks
const mockAuthStore = {
  state: {
    accessToken: "initial-access-token" as string | null,
    refreshToken: "initial-refresh-token" as string | null,
  },
  setAccessToken: vi.fn(),
  setRefreshToken: vi.fn(),
  logout: vi.fn(),
};

vi.mock("@auth/stores/auth.ts", () => ({
  useAuthStore: () => mockAuthStore,
}));

let mockRefreshShouldFail = false;

vi.mock("@core/libs/api/auth", () => ({
  createAuthApi: () => ({
    refresh: vi.fn().mockImplementation(() => {
      if (mockRefreshShouldFail) {
        return Promise.reject(new Error("Refresh failed"));
      }
      return Promise.resolve({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });
    }),
  }),
}));

// Import after mocks
import pluginFactory from "./00.axios";

// Helper type for the plugin result
type PluginResult = { provide: { axios: AxiosInstance } };

// Helper function to create a plugin instance (mock passes undefined as NuxtApp)
const createPluginInstance = (): PluginResult => {
  return pluginFactory(
    undefined as unknown as Parameters<typeof pluginFactory>[0],
  ) as PluginResult;
};

describe("Axios Plugin", () => {
  let axiosInstance: AxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthStore.state.accessToken = "initial-access-token";
    mockAuthStore.state.refreshToken = "initial-refresh-token";
    mockRefreshShouldFail = false;

    // Execute plugin and get axios instance
    const result = createPluginInstance();
    axiosInstance = result.provide.axios;
  });

  describe("Plugin initialization", () => {
    it("should create axios instance with correct baseURL", () => {
      expect(axiosInstance.defaults.baseURL).toBe("http://localhost:3000");
    });

    it("should provide axios instance", () => {
      const result = createPluginInstance();
      expect(result.provide.axios).toBeDefined();
    });
  });

  describe("Request interceptor", () => {
    it("should add Authorization header when token exists", async () => {
      const mockAdapter = vi.fn().mockResolvedValue({ data: {}, status: 200 });
      axiosInstance.defaults.adapter = mockAdapter;

      await axiosInstance.get("/test");

      expect(mockAdapter).toHaveBeenCalled();
      const requestConfig = mockAdapter.mock.calls[0]![0];
      expect(requestConfig.headers.Authorization).toBe(
        "Bearer initial-access-token",
      );
    });

    it("should not add Authorization header when token is null", async () => {
      mockAuthStore.state.accessToken = null;

      const mockAdapter = vi.fn().mockResolvedValue({ data: {}, status: 200 });
      axiosInstance.defaults.adapter = mockAdapter;

      await axiosInstance.get("/test");

      const requestConfig = mockAdapter.mock.calls[0]![0];
      expect(requestConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe("Response interceptor - Token refresh", () => {
    it("should pass through successful responses", async () => {
      axiosInstance.defaults.adapter = vi
        .fn()
        .mockResolvedValue({ data: { success: true }, status: 200 });

      const response = await axiosInstance.get("/test");

      expect(response.data).toEqual({ success: true });
    });

    it("should logout when 401 and no refresh token", async () => {
      mockAuthStore.state.refreshToken = null;

      axiosInstance.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 401 },
        config: { headers: {} },
        isAxiosError: true,
      });

      await expect(axiosInstance.get("/test")).rejects.toBeDefined();
      expect(mockAuthStore.logout).toHaveBeenCalled();
    });

    it("should not retry on non-401 errors", async () => {
      axiosInstance.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 500 },
        config: { headers: {} },
        isAxiosError: true,
      });

      await expect(axiosInstance.get("/test")).rejects.toBeDefined();
      expect(mockAuthStore.logout).not.toHaveBeenCalled();
    });
  });

  describe("Token refresh flow", () => {
    it("should attempt token refresh on 401 error", async () => {
      let callCount = 0;
      axiosInstance.defaults.adapter = vi.fn().mockImplementation((config) => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject({
            response: { status: 401 },
            config: { ...config, headers: { ...config.headers } },
            isAxiosError: true,
          });
        }
        return Promise.resolve({ data: { retried: true }, status: 200 });
      });

      await axiosInstance.get("/test");

      expect(callCount).toBe(2);
      expect(mockAuthStore.setAccessToken).toHaveBeenCalledWith(
        "new-access-token",
      );
      expect(mockAuthStore.setRefreshToken).toHaveBeenCalledWith(
        "new-refresh-token",
      );
    });

    it("should logout when refresh token fails", async () => {
      mockRefreshShouldFail = true;

      axiosInstance.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 401 },
        config: { headers: {} },
        isAxiosError: true,
      });

      await expect(axiosInstance.get("/test")).rejects.toBeDefined();
      expect(mockAuthStore.logout).toHaveBeenCalled();
    });
  });
});
