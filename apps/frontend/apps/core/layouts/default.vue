<template>
  <div
    class="w-[1000px] relative z-[1] mx-auto p-8 bg-white rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
  >
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useAuthService } from "@auth/composables/auth.ts";

const authService = useAuthService();
const router = useRouter();
const { $api } = useNuxtApp();

async function checkAndSetMe() {
  if (authService.getCurrentUser()) {
    return;
  }

  try {
    const response = await $api.auth.getMe();
    authService.setCurrentUser(response);
  } catch (error: any) {
    if (error?.response?.status === 401) {
      authService.setCurrentUser(null);
      await router.push("/auth/login");
    } else {
      console.error("Error fetching user data:", error);
    }
  }
}

onMounted(async () => {
  await checkAndSetMe();
});
</script>
