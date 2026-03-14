<template>
  <div class="mx-auto p-8">
    <BackToDaschboard>← {{ $t("backToDashboard") }}</BackToDaschboard>
    <h1 class="text-center mb-8 text-3xl font-bold">
      {{ $t("dashboardTitle") }}
    </h1>
    <NuxtLink
      class="inline-block mb-6 px-5 py-2 text-base bg-blue-600 text-white border-none rounded-md no-underline cursor-pointer hover:bg-blue-700"
      to="/create-quiz"
    >
      + {{ $t("createQuiz") }}
    </NuxtLink>

    <!-- Stan ładowania -->
    <div v-if="isLoading" class="text-center text-gray-500 mt-8">
      <div class="text-4xl mb-2 animate-spin">⏳</div>
      <p>{{ $t("loadingQuizzes") }}</p>
    </div>

    <!-- Błąd z API -->
    <div v-else-if="errorMessage" class="text-center text-red-500 mt-8">
      <div class="text-4xl mb-2">⚠️</div>
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="quizzes.length > 0">
      <div
        v-for="quiz in quizzes"
        :key="quiz.id"
        class="bg-gray-50 rounded-lg p-5 mb-5"
      >
        <h3 class="text-xl font-bold mb-2">{{ quiz.title }}</h3>
        <p class="text-gray-700 mb-2">{{ quiz.description }}</p>
        <div class="mt-2 text-sm text-gray-600 flex gap-4">
          <span>📝 {{ quiz.questions.length }} {{ $t("questions") }}</span>
        </div>
        <div class="flex gap-3 mt-3">
          <NuxtLink
            class="px-4 py-2 text-base border-none rounded-md cursor-pointer no-underline text-white bg-green-600 transition-all flex items-center gap-1 hover:brightness-90"
            :to="{ path: '/playing', query: { quizId: quiz.id } }"
          >
            ▶️ {{ $t("play") }}
          </NuxtLink>
          <!-- TODO: Włączyć po dodaniu endpointu PUT/PATCH /quiz/:id na backendzie -->
          <button
            class="px-4 py-2 text-base border-none rounded-md cursor-not-allowed no-underline text-gray-800 bg-yellow-400 opacity-50 transition-all flex items-center gap-1"
            disabled
            :title="$t('editNotAvailable')"
          >
            ✏️ {{ $t("edit") }}
          </button>
          <!-- TODO: Włączyć po dodaniu endpointu DELETE /quiz/:id na backendzie -->
          <button
            class="px-4 py-2 text-base border-none rounded-md cursor-not-allowed text-white bg-red-600 opacity-50 transition-all flex items-center gap-1"
            disabled
            :title="$t('deleteNotAvailable')"
          >
            🗑️ {{ $t("delete") }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-8">
      <div class="text-4xl mb-2">🎯</div>
      <p>{{ $t("noQuizzesYet") }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { QuizDto } from "~/apps/core/libs/api/quiz/types";

const { $api } = useNuxtApp();
const { t } = useI18n();

const quizzes = ref<QuizDto[]>([]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

onMounted(async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    const result = await $api.quiz.search({ page: 1, limit: 20 });
    quizzes.value = result.items;
  } catch (error) {
    errorMessage.value = t("loadQuizzesError");
    console.error("Failed to load quizzes:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
