<template>
  <div>
    <h1 class="text-center mb-10 text-3xl font-bold">
      {{ $t("quizMaster") }}
    </h1>

    <transition name="slide" mode="out-in">
      <div key="login">
        <h2 class="text-3xl mb-5">{{ $t("loginTitle") }}</h2>
        <div class="mb-4">
          <label class="block mb-2">{{ $t("username") }}</label>
          <input
            type="text"
            v-model="loginForm.username"
            class="w-full px-3 py-2 text-base border border-gray-300 rounded"
            :placeholder="$t('enterUsername')"
            @keyup.enter="login"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2">{{ $t("password") }}</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="loginForm.password"
              class="w-full px-3 py-2 pr-10 text-base border border-gray-300 rounded"
              :placeholder="$t('enterPassword')"
              @keyup.enter="login"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-xl text-gray-500 hover:text-gray-700 p-1"
              :title="showPassword ? $t('hidePassword') : $t('showPassword')"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "🙈" : "👁️" }}
            </button>
          </div>
        </div>
        <button
          class="w-full px-3 py-2 text-lg text-white bg-blue-600 border-none rounded cursor-pointer hover:bg-blue-700"
          @click="login"
        >
          {{ $t("loginBtn") }}
        </button>

        <!-- OAuth separator -->
        <div class="flex items-center my-6">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-4 text-gray-500 text-sm">{{ $t("orLoginWith") }}</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Google OAuth -->
        <a
          :href="`${apiBaseUrl}/auth/google`"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-lg bg-white text-gray-700 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 mb-3 no-underline"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ $t("loginWithGoogle") }}
        </a>

        <!-- Facebook OAuth -->
        <a
          :href="`${apiBaseUrl}/auth/facebook`"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-lg bg-[#1877F2] text-white border-none rounded cursor-pointer hover:bg-[#166FE5] mb-3 no-underline"
        >
          <svg class="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {{ $t("loginWithFacebook") }}
        </a>

        <p class="mt-2 text-center">
          {{ $t("noAccount") }}
          <NuxtLink to="/auth/signup" class="text-blue-600 hover:underline">{{
            $t("registerBtn")
          }}</NuxtLink>
        </p>
        <div
          class="mt-2 text-center"
          :class="authMessage.success ? 'text-green-600' : 'text-red-600'"
        >
          {{ authMessage.text }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from "axios";
import { useAuthService } from "@auth/composables/auth";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;

const router = useRouter();
const route = useRoute();
const loginForm = ref({ username: "", password: "" });
const showPassword = ref(false);
const authMessage = ref({ text: "", success: false });
const authService = useAuthService();

onMounted(() => {
  if (route.query.error === "oauth_failed") {
    authMessage.value = {
      text: t("oauthLoginFailed"),
      success: false,
    };
  }
});

async function login() {
  const { username, password } = loginForm.value;

  if (!username || !password) {
    authMessage.value = {
      text: t("pleaseEnterCredentials"),
      success: false,
    };
    return;
  }

  try {
    await $api.auth.login({
      username: username,
      password: password,
    });

    // Po zalogowaniu pobierz dane użytkownika
    await authService.checkAuth();

    authMessage.value = {
      text: t("loginSuccess"),
      success: true,
    };

    setTimeout(function () {
      router.push("/");
    }, 1000);
  } catch (error: AxiosError<any> | any) {
    console.error("Error during login:", error);
    authMessage.value = {
      text: error.response?.data?.message || t("loginError"),
      success: false,
    };
  }
}
</script>
