import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const state = reactive<{
    accessToken: string | null;
    refreshToken: string | null;
  }>({
    accessToken: null,
    refreshToken: null,
  });
  function setAccessToken(token: string) {
    state.accessToken = token;
  }
  function setRefreshToken(token: string) {
    state.refreshToken = token;
  }
  function logout() {
    state.accessToken = null;
    state.refreshToken = null;
  }

  return { state, setAccessToken, setRefreshToken, logout };
});
