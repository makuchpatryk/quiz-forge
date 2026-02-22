import { useAuthService } from "@auth/composables/auth";
import type { RouteLocationNormalized } from "vue-router";

const PUBLIC_ROUTES = ["/auth/login", "/auth/signup", "/auth/register"];

export default defineNuxtRouteMiddleware(
  async (to: RouteLocationNormalized) => {
    const authService = useAuthService();

    // Inicjalizacja z localStorage na kliencie
    if (import.meta.client) {
      authService.initFromStorage();
    }

    // Sprawdź czy strona jest publiczna
    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => to.path === route || to.path.startsWith(route),
    );

    if (isPublicRoute) {
      return;
    }

    // Sprawdź autentykację
    const isAuthenticated = await authService.checkAuth();

    if (!isAuthenticated) {
      return navigateTo("/auth/login");
    }
  },
);
