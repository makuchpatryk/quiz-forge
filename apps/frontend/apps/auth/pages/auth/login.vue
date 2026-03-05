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

const router = useRouter();
const loginForm = ref({ username: "", password: "" });
const showPassword = ref(false);
const authMessage = ref({ text: "", success: false });
const authService = useAuthService();

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
