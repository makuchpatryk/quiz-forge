<template>
  <div class="mx-auto p-8">
    <div v-if="!showScore">
      <div class="text-lg mb-4">
        {{ $t("question") }} {{ currentQuestionIndex + 1 }} {{ $t("of") }}
        {{ questions.length }}
      </div>
      <h1 class="text-2xl mb-6 font-bold">{{ currentQuestion.question }}</h1>
      <div class="flex flex-col gap-3 mb-6">
        <div
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="p-3 border border-gray-300 rounded-md cursor-pointer bg-gray-50 transition-all"
          :class="getOptionClass(index)"
          @click="selectOption(index)"
        >
          {{ option }}
        </div>
      </div>
      <button
        v-if="answered && !isLastQuestion"
        class="mt-4 px-5 py-2 text-base border-none rounded-md bg-blue-600 text-white cursor-pointer block hover:bg-blue-700"
        @click="nextQuestion"
      >
        {{ $t("nextQuestion") }}
      </button>
    </div>
    <div v-else class="text-center">
      <h1 class="text-3xl font-bold mb-4">🎉 {{ $t("congrats") }}</h1>
      <div class="text-4xl my-4">{{ quizScore }}/{{ questions.length }}</div>
      <p class="text-xl mb-6">{{ scoreMessage }}</p>
      <button class="mt-4 px-5 py-2 text-base border-none rounded-md bg-blue-600 text-white cursor-pointer block mx-auto hover:bg-blue-700" @click="restartQuiz">
        {{ $t("playAgain") }}
      </button>
      <NuxtLink class="mt-4 px-5 py-2 text-base border-none rounded-md bg-blue-600 text-white cursor-pointer block mx-auto no-underline hover:bg-blue-700" to="/menu">
        {{ $t("backToMenu") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  if (percentage === 100) return t("scorePerfect");
  if (percentage >= 75) return t("scoreGreat");
  if (percentage >= 50) return t("scoreGood");
  return t("scoreTryAgain");
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
    return index === currentQuestion.value.correct ? "!bg-green-200 !border-green-600" : "!bg-red-200 !border-red-600";
  }
  if (index === currentQuestion.value.correct) {
    return "!bg-green-200 !border-green-600";
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
