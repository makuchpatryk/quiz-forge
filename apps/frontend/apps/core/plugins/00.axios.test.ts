import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { AxiosInstance } from "axios";

// Mock $fetch (Nuxt global used by the plugin for token refresh)
const mock$fetch = vi.fn();
(globalThis as unknown as Record<string, unknown>).$fetch = mock$fetch;

// Import after globals are set
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
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    mock$fetch.mockReset();

    // Replace window.location with a plain object to track href changes
    // @ts-expect-error -- happy-dom requires delete before reassign
    delete window.location;
    window.location = { href: "" } as unknown as Location;

    // Execute plugin and get axios instance
    const result = createPluginInstance();
    axiosInstance = result.provide.axios;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe("Plugin initialization", () => {
    it("should create axios instance with correct baseURL", () => {
      expect(axiosInstance.defaults.baseURL).toBe("http://localhost:3000");
    });

    it("should provide axios instance", () => {
      const result = createPluginInstance();
      expect(result.provide.axios).toBeDefined();
    });

    it("should set withCredentials to true", () => {
      expect(axiosInstance.defaults.withCredentials).toBe(true);
    });
  });

  describe("Request handling", () => {
    it("should use cookies (withCredentials) instead of Authorization header", async () => {
      const mockAdapter = vi.fn().mockResolvedValue({ data: {}, status: 200 });
      axiosInstance.defaults.adapter = mockAdapter;

      await axiosInstance.get("/test");

      expect(mockAdapter).toHaveBeenCalled();
      const requestConfig = mockAdapter.mock.calls[0]![0];
      expect(requestConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe("Response interceptor", () => {
    it("should pass through successful responses", async () => {
      axiosInstance.defaults.adapter = vi
        .fn()
        .mockResolvedValue({ data: { success: true }, status: 200 });

      const response = await axiosInstance.get("/test");

      expect(response.data).toEqual({ success: true });
    });

    it("should not retry on non-401 errors", async () => {
      axiosInstance.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 500 },
        config: { headers: {} },
        isAxiosError: true,
      });

      await expect(axiosInstance.get("/test")).rejects.toBeDefined();
      expect(mock$fetch).not.toHaveBeenCalled();
    });

    it("should reject errors without config", async () => {
      axiosInstance.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 401 },
        isAxiosError: true,
      });

      await expect(axiosInstance.get("/test")).rejects.toBeDefined();
      expect(mock$fetch).not.toHaveBeenCalled();
    });
  });

  describe("Token refresh flow", () => {
    it("should attempt token refresh via $fetch on 401 error", async () => {
      mock$fetch.mockResolvedValueOnce({});

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

      const response = await axiosInstance.get("/test");

      expect(callCount).toBe(2);
      expect(mock$fetch).toHaveBeenCalledWith("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      expect(response.data).toEqual({ retried: true });
    });

    it("should redirect to login when refresh fails", async () => {
      mock$fetch.mockRejectedValueOnce(new Error("Refresh failed"));

      axiosInstance.defaults.adapter = vi.fn().mockRejectedValue({
        response: { status: 401 },
        config: { headers: {} },
        isAxiosError: true,
      });

      await expect(axiosInstance.get("/test")).rejects.toBeDefined();
      expect(mock$fetch).toHaveBeenCalledWith("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      expect(window.location.href).toBe("/auth/login");
    });

    it("should not retry a request that was already retried", async () => {
      mock$fetch.mockResolvedValueOnce({});

      let callCount = 0;
      axiosInstance.defaults.adapter = vi.fn().mockImplementation((config) => {
        callCount++;
        return Promise.reject({
          response: { status: 401 },
          config: { ...config, headers: { ...config.headers } },
          isAxiosError: true,
        });
      });

      await expect(axiosInstance.get("/test")).rejects.toBeDefined();
      // First call triggers refresh, second call after retry also fails with 401
      // but should NOT trigger another refresh (already retried)
      expect(callCount).toBe(2);
      expect(mock$fetch).toHaveBeenCalledTimes(1);
    });
  });
});
