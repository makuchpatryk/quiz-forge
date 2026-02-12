<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-2">
        <span class="text-2xl">👤</span>
        <span class="font-bold text-lg">{{ currentUser }}</span>
      </div>
      <button
        class="bg-red-600 text-white border-none rounded-md px-4 py-2 cursor-pointer hover:bg-red-700"
        @click="logout"
      >
        {{ $t("logout") }}
      </button>
    </div>
    <h1 class="text-center mb-10 text-3xl font-bold">
      {{ $t("quizMaster") }}
    </h1>
    <div class="flex gap-6 mb-8 justify-center">
      <div class="bg-gray-50 rounded-lg p-5 text-center min-w-[120px]">
        <div class="text-3xl mb-2">🏆</div>
        <div class="text-2xl font-bold">{{ userData.bestScore }}</div>
        <div class="text-sm text-gray-600">{{ $t("bestScore") }}</div>
      </div>
      <div class="bg-gray-50 rounded-lg p-5 text-center min-w-[120px]">
        <div class="text-3xl mb-2">🎮</div>
        <div class="text-2xl font-bold">{{ userData.gamesPlayed }}</div>
        <div class="text-sm text-gray-600">{{ $t("gamesPlayed") }}</div>
      </div>
      <div class="bg-gray-50 rounded-lg p-5 text-center min-w-[120px]">
        <div class="text-3xl mb-2">📝</div>
        <div class="text-2xl font-bold">{{ userQuizzes.length }}</div>
        <div class="text-sm text-gray-600">{{ $t("yourQuizzes") }}</div>
      </div>
    </div>
    <div class="flex gap-6 justify-center">
      <NuxtLink
        class="flex items-center gap-2 px-7 py-3 text-lg border-none rounded-lg cursor-pointer no-underline text-white bg-blue-600 transition-colors hover:bg-blue-700"
        to="/quiz-selection"
      >
        <span class="text-2xl">🎯</span>
        <span>{{ $t("playQuiz") }}</span>
      </NuxtLink>
      <NuxtLink
        class="flex items-center gap-2 px-7 py-3 text-lg border-none rounded-lg cursor-pointer no-underline text-white bg-gray-600 transition-colors hover:bg-gray-700"
        to="/dashboard"
      >
        <span class="text-2xl">⚙️</span>
        <span>{{ $t("manageQuizzes") }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@auth/stores/auth.ts";

const { t } = useI18n();

const router = useRouter();
const currentUser = ref<string | null>(null);
const users = ref<Record<string, any>>({});
const quizzes = ref<Record<string, any>>({});

const userData = computed(() => {
  if (!currentUser.value || !users.value[currentUser.value]) {
    return { bestScore: 0, gamesPlayed: 0, quizScores: {} };
  }
  return users.value[currentUser.value];
});

const userQuizzes = computed(() => {
  return Object.values(quizzes.value).filter(
    (quiz: any) => quiz.author === currentUser.value,
  );
});

const logout = () => {
  localStorage.removeItem("currentUser");
  router.push("/auth/login");
};

onMounted(() => {
  users.value = JSON.parse(localStorage.getItem("quizUsers") || "{}");
  quizzes.value = JSON.parse(localStorage.getItem("quizzes") || "{}");
  if (!useAuthStore().state.accessToken) router.push("/auth/login");
});
</script>
