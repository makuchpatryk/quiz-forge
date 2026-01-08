<template>
  <div class="quiz-selection-container">
    <h1 style="text-align: center; margin-bottom: 30px">
      {{ $t("chooseQuiz") }}
    </h1>
    <div class="quiz-list">
      <div
        v-for="quiz in allQuizzes"
        :key="quiz.id"
        class="quiz-card-item"
        @click="startQuiz(quiz.id)"
      >
        <h3>{{ quiz.name }}</h3>
        <p>{{ quiz.description }}</p>
        <div class="quiz-meta">
          <span>📝 {{ quiz.questions.length }} {{ $t("questions") }}</span>
          <span>👤 {{ quiz.author }}</span>
        </div>
      </div>
    </div>
    <div v-if="allQuizzes.length === 0" class="empty-state">
      <div class="empty-state-icon">📝</div>
      <p>{{ $t("noQuizzesAvailable") }}</p>
    </div>
    <NuxtLink class="back-btn" to="/menu">← {{ $t("backToMenu") }}</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const quizzes = ref<Record<string, any>>({});

const allQuizzes = computed(() => {
  return Object.values(quizzes.value);
});

const startQuiz = (quizId: string) => {
  router.push({ path: "/playing", query: { quizId } });
};

onMounted(() => {
  quizzes.value = JSON.parse(localStorage.getItem("quizzes") || "{}");
});
</script>

<style scoped>
.quiz-selection-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.quiz-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
}
.quiz-card-item {
  padding: 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
  transition:
    background 0.2s,
    border 0.2s;
}
.quiz-card-item:hover {
  background: #e6f0ff;
  border-color: #007bff;
}
.quiz-meta {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 16px;
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
.back-btn {
  display: inline-block;
  margin-top: 24px;
  color: #007bff;
  text-decoration: none;
  font-size: 16px;
}
.back-btn:hover {
  text-decoration: underline;
}
</style>
