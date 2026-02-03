<template>
  <div class="dashboard-container">
    <BackToDaschboard>← {{ $t("backToDashboard") }}</BackToDaschboard>
    <h1 style="text-align: center; margin-bottom: 30px">
      {{ $t("dashboardTitle") }}
    </h1>
    <NuxtLink class="create-quiz-btn" to="/create-quiz">
      + {{ $t("createQuiz") }}
    </NuxtLink>
    <div v-if="userQuizzes.length > 0">
      <div
        v-for="quiz in userQuizzes"
        :key="quiz.id"
        class="quiz-management-item"
      >
        <h3>{{ quiz.name }}</h3>
        <p>{{ quiz.description }}</p>
        <div class="quiz-meta">
          <span>📝 {{ quiz.questions.length }} {{ $t("questions") }}</span>
          <span>📅 {{ formatDate(quiz.createdAt) }}</span>
        </div>
        <div class="quiz-actions">
          <NuxtLink
            class="quiz-action-btn play-btn"
            :to="{ path: '/playing', query: { quizId: quiz.id } }"
          >
            ▶️ {{ $t("play") }}
          </NuxtLink>
          <NuxtLink
            class="quiz-action-btn edit-btn"
            :to="{ path: '/create-quiz', query: { edit: quiz.id } }"
          >
            ✏️ {{ $t("edit") }}
          </NuxtLink>
          <button
            class="quiz-action-btn delete-btn"
            @click="deleteQuiz(quiz.id)"
          >
            🗑️ {{ $t("delete") }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <div class="empty-state-icon">🎯</div>
      <p>{{ $t("noQuizzesYet") }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
const router = useRouter();
const currentUser = ref<string | null>(null);
const quizzes = ref<Record<string, any>>({});

const userQuizzes = computed(() => {
  return Object.values(quizzes.value).filter(
    (quiz: any) => quiz.author === currentUser.value,
  );
});

function deleteQuiz(quizId: string) {
  if (
    !confirm(
      "Czy na pewno chcesz usunąć ten quiz? Tej operacji nie można cofnąć.",
    )
  ) {
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
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) currentUser.value = savedUser;
  else router.push("/login");
});
</script>
<style scoped>
.dashboard-container {
  margin: 0 auto;
  padding: 32px;
}
.create-quiz-btn {
  display: inline-block;
  margin-bottom: 24px;
  padding: 10px 20px;
  font-size: 16px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
}
.create-quiz-btn:hover {
  background: #0056b3;
}
.quiz-management-item {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 18px;
}
.quiz-meta {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 16px;
}
.quiz-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.quiz-action-btn {
  padding: 8px 16px;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  color: #fff;
  background: #007bff;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.quiz-action-btn.edit-btn {
  background: #ffc107;
  color: #333;
}
.quiz-action-btn.delete-btn {
  background: #dc3545;
}
.quiz-action-btn.play-btn {
  background: #28a745;
}
.quiz-action-btn:hover {
  filter: brightness(0.9);
}
.empty-state {
  text-align: center;
  color: #888;
  margin-top: 32px;
}
.empty-state-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
</style>
