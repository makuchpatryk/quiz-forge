<template>
  <div class="quiz-playing-container">
    <div v-if="!showScore">
      <div class="question-counter">
        {{ $t("question") }} {{ currentQuestionIndex + 1 }} {{ $t("of") }}
        {{ questions.length }}
      </div>
      <h1 class="question">{{ currentQuestion.question }}</h1>
      <div class="options">
        <div
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="option"
          :class="getOptionClass(index)"
          @click="selectOption(index)"
        >
          {{ option }}
        </div>
      </div>
      <button
        v-if="answered && !isLastQuestion"
        class="next-btn"
        @click="nextQuestion"
      >
        {{ $t("nextQuestion") }}
      </button>
    </div>
    <div v-else class="score-container">
      <h1>🎉 {{ $t("congrats") }}</h1>
      <div class="score-value">{{ quizScore }}/{{ questions.length }}</div>
      <p class="score-message">{{ scoreMessage }}</p>
      <button class="restart-btn" @click="restartQuiz">
        {{ $t("playAgain") }}
      </button>
      <NuxtLink class="menu-return-btn" to="/menu">
        {{ $t("backToMenu") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();
const questions = ref<any[]>([]);
const currentQuestionIndex = ref(0);
const quizScore = ref(0);
const answered = ref(false);
const selectedOption = ref<number | null>(null);
const showScore = ref(false);

const currentQuestion = computed(() => {
  return (
    questions.value[currentQuestionIndex.value] || { question: "", options: [] }
  );
});

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === questions.value.length - 1;
});

const scoreMessage = computed(() => {
  const percentage = Math.round(
    (quizScore.value / questions.value.length) * 100,
  );
  if (percentage === 100) return "Perfekcyjnie! Jesteś mistrzem!";
  if (percentage >= 75) return "Świetna robota! Prawie perfekcyjnie!";
  if (percentage >= 50) return "Dobry wynik! Jeszcze trochę nauki!";
  return "Nie poddawaj się! Spróbuj jeszcze raz!";
});

const selectOption = (index: number) => {
  if (answered.value) return;
  answered.value = true;
  selectedOption.value = index;
  setTimeout(() => {
    if (index === currentQuestion.value.correct) {
      quizScore.value++;
    }
    if (isLastQuestion.value) {
      setTimeout(() => {
        showScore.value = true;
      }, 1000);
    }
  }, 500);
};

const getOptionClass = (index: number) => {
  if (!answered.value) return "";
  if (index === selectedOption.value) {
    return index === currentQuestion.value.correct ? "correct" : "wrong";
  }
  if (index === currentQuestion.value.correct) {
    return "correct";
  }
  return "";
};

const nextQuestion = () => {
  currentQuestionIndex.value++;
  answered.value = false;
  selectedOption.value = null;
};

const restartQuiz = () => {
  currentQuestionIndex.value = 0;
  quizScore.value = 0;
  answered.value = false;
  selectedOption.value = null;
  showScore.value = false;
};

onMounted(() => {
  // Pobierz quiz z localStorage lub store (przykład: quizId w query)
  const quizId = router.currentRoute.value.query.quizId as string;
  const quizzes = JSON.parse(localStorage.getItem("quizzes") || "{}");
  if (quizId && quizzes[quizId]) {
    questions.value = quizzes[quizId].questions;
  } else {
    // fallback: domyślny quiz
    questions.value = [
      {
        question: "Jaka jest stolica Francji?",
        options: ["Londyn", "Berlin", "Paryż", "Madryt"],
        correct: 2,
      },
      {
        question: "Który ocean jest największy?",
        options: ["Atlantycki", "Spokojny", "Indyjski", "Arktyczny"],
        correct: 1,
      },
    ];
  }
});
</script>

<style scoped>
.quiz-playing-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.question-counter {
  font-size: 18px;
  margin-bottom: 16px;
}
.question {
  font-size: 24px;
  margin-bottom: 24px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.option {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  background: #f9f9f9;
  transition:
    background 0.2s,
    border 0.2s;
}
.option.correct {
  background: #d4edda;
  border-color: #28a745;
}
.option.wrong {
  background: #f8d7da;
  border-color: #dc3545;
}
.next-btn,
.restart-btn,
.menu-return-btn {
  margin-top: 16px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: #fff;
  cursor: pointer;
}
.next-btn:hover,
.restart-btn:hover,
.menu-return-btn:hover {
  background: #0056b3;
}
.score-container {
  text-align: center;
}
.score-value {
  font-size: 32px;
  margin: 16px 0;
}
.score-message {
  font-size: 20px;
  margin-bottom: 24px;
}
</style>
