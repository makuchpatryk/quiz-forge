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
    <div v-if="userQuizzes.length > 0">
      <div
        v-for="quiz in userQuizzes"
        :key="quiz.id"
        class="bg-gray-50 rounded-lg p-5 mb-5"
      >
        <h3 class="text-xl font-bold mb-2">{{ quiz.name }}</h3>
        <p class="text-gray-700 mb-2">{{ quiz.description }}</p>
        <div class="mt-2 text-sm text-gray-600 flex gap-4">
          <span>📝 {{ quiz.questions.length }} {{ $t("questions") }}</span>
          <span>📅 {{ formatDate(quiz.createdAt) }}</span>
        </div>
        <div class="flex gap-3 mt-3">
          <NuxtLink
            class="px-4 py-2 text-base border-none rounded-md cursor-pointer no-underline text-white bg-green-600 transition-all flex items-center gap-1 hover:brightness-90"
            :to="{ path: '/playing', query: { quizId: quiz.id } }"
          >
            ▶️ {{ $t("play") }}
          </NuxtLink>
          <NuxtLink
            class="px-4 py-2 text-base border-none rounded-md cursor-pointer no-underline text-gray-800 bg-yellow-400 transition-all flex items-center gap-1 hover:brightness-90"
            :to="{ path: '/create-quiz', query: { edit: quiz.id } }"
          >
            ✏️ {{ $t("edit") }}
          </NuxtLink>
          <button
            class="px-4 py-2 text-base border-none rounded-md cursor-pointer text-white bg-red-600 transition-all flex items-center gap-1 hover:brightness-90"
            @click="deleteQuiz(quiz.id)"
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
import { useAuthStore } from "@auth/stores/auth.ts";

const router = useRouter();
const currentUser = ref<string | null>(null);
const quizzes = ref<Record<string, any>>({});

const userQuizzes = computed(() => {
  return Object.values(quizzes.value).filter(
    (quiz: any) => quiz.author === currentUser.value,
  );
});

const { t } = useI18n();

function deleteQuiz(quizId: string) {
  if (!confirm(t("deleteConfirm"))) {
    return;
  }
  delete quizzes.value[quizId];
  localStorage.setItem("quizzes", JSON.stringify(quizzes.value));
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pl-PL");
}

onMounted(() => {
  quizzes.value = JSON.parse(localStorage.getItem("quizzes") || "{}");
  if (!useAuthStore().state.accessToken) router.push("/auth/login");
});
</script>
