<template>
  <div key="auth">
    <h1 class="text-center mb-10 text-3xl font-bold">
      {{ $t("quizMaster") }}
    </h1>
    <transition name="slide" mode="out-in">
      <div key="register">
        <h2 class="text-3xl mb-5">{{ $t("registerTitle") }}</h2>
        <div class="mb-4">
          <label class="block mb-2">{{ $t("username") }}</label>
          <input
            type="text"
            v-model="registerForm.username"
            class="w-full px-3 py-2 text-base border border-gray-300 rounded"
            :placeholder="$t('chooseUsername')"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2">{{ $t("email") }}</label>
          <input
            type="email"
            v-model="registerForm.email"
            class="w-full px-3 py-2 text-base border border-gray-300 rounded"
            :placeholder="$t('enterEmail')"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2">{{ $t("password") }}</label>
          <input
            type="password"
            v-model="registerForm.password"
            class="w-full px-3 py-2 text-base border border-gray-300 rounded"
            :placeholder="$t('choosePassword')"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-2">{{ $t("repeatPassword") }}</label>
          <input
            type="password"
            v-model="registerForm.passwordConfirm"
            class="w-full px-3 py-2 text-base border border-gray-300 rounded"
            :placeholder="$t('repeatPasswordPlaceholder')"
            @keyup.enter="register"
          />
        </div>
        <button class="w-full px-3 py-2 text-lg text-white bg-blue-600 border-none rounded cursor-pointer hover:bg-blue-700" @click="register">
          {{ $t("registerBtn") }}
        </button>
        <p class="mt-2 text-center">
          {{ $t("alreadyHaveAccount") }}
          <NuxtLink to="/auth/login" class="text-blue-600 hover:underline">{{ $t("loginBtn") }}</NuxtLink>
        </p>
        <div class="mt-2 text-center" :class="authMessage.success ? 'text-green-600' : 'text-red-600'">
          {{ authMessage.text }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from "axios";

const { t } = useI18n();
const { $api } = useNuxtApp();

const router = useRouter();
const registerForm = ref({
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
});
const authMessage = ref({ text: "", success: false });

async function register() {
  const { username, email, password, passwordConfirm } = registerForm.value;

  if (!username || !email || !password || !passwordConfirm) {
    authMessage.value = { text: t("fillAllFields"), success: false };
    return;
  }

  if (username.length < 3) {
    authMessage.value = { text: t("usernameTooShort"), success: false };
    return;
  }

  if (!email.includes("@")) {
    authMessage.value = { text: t("invalidEmail"), success: false };
    return;
  }

  if (password.length < 6) {
    authMessage.value = { text: t("passwordTooShort"), success: false };
    return;
  }

  if (password !== passwordConfirm) {
    authMessage.value = { text: t("passwordsNotMatch"), success: false };
    return;
  }

  try {
    await $api.auth.register({
      username: username,
      email: email,
      password: password,
    });

    authMessage.value = { text: t("registerSuccess"), success: true };

    setTimeout(function () {
      router.push("/auth/login");
    }, 1500);
  } catch (error: AxiosError<any> | any) {
    console.error("Error during registration:", error);
    authMessage.value = {
      text: error.response?.data?.message || t("registerError"),
      success: false,
    };
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
