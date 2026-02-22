import type { UserResponse } from "@core/libs/api/auth/types";

const CURRENT_USER_KEY = "current_user";

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const authState = ref<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export const useAuthService = () => {
  function setCurrentUser(user: UserResponse | null) {
    authState.value.user = user;
    authState.value.isAuthenticated = !!user;
    if (import.meta.client && user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  }

  function getCurrentUser(): UserResponse | null {
    return authState.value.user;
  }

  function isAuthenticated(): boolean {
    return authState.value.isAuthenticated;
  }

  function isLoading(): boolean {
    return authState.value.isLoading;
  }

  async function checkAuth(): Promise<boolean> {
    authState.value.isLoading = true;
    try {
      // Używamy useFetch dla SSR - automatycznie przekazuje cookies
      const { data, error } = await useFetch<UserResponse>("/api/auth/me", {
        credentials: "include",
      });

      if (error.value || !data.value) {
        setCurrentUser(null);
        return false;
      }

      setCurrentUser(data.value);
      return true;
    } catch {
      setCurrentUser(null);
      return false;
    } finally {
      authState.value.isLoading = false;
    }
  }

  async function logout() {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignoruj błędy podczas wylogowania
    }
    setCurrentUser(null);
    if (import.meta.client) {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  // Inicjalizacja ze stanu z localStorage (dla hydratacji)
  function initFromStorage() {
    if (import.meta.client) {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        try {
          const user = JSON.parse(stored);
          authState.value.user = user;
          authState.value.isAuthenticated = true;
        } catch {
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      }
    }
  }

  return {
    state: authState,
    setCurrentUser,
    getCurrentUser,
    isAuthenticated,
    isLoading,
    checkAuth,
    logout,
    initFromStorage,
  };
};
