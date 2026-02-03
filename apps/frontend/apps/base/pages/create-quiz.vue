<template>
  <div class="create-quiz-container">
    <back-to-daschboard />
    <h1 style="text-align: center; margin-bottom: 30px">
      {{ editingQuizId ? $t("editQuiz") : $t("createQuiz") }}
    </h1>
    <div class="form-group">
      <label>{{ $t("quizName") }}</label>
      <input
        type="text"
        v-model="quizForm.name"
        class="form-input"
        :placeholder="$t('quizNamePlaceholder')"
      />
    </div>
    <div class="form-group">
      <label>{{ $t("quizDescription") }}</label>
      <input
        type="text"
        v-model="quizForm.description"
        class="form-input"
        :placeholder="$t('quizDescriptionPlaceholder')"
      />
    </div>
    <h3 style="margin: 30px 0 20px 0; color: var(--dark)">
      {{ $t("questions") }}
    </h3>
    <div
      v-for="(question, qIndex) in quizForm.questions"
      :key="qIndex"
      class="question-editor"
    >
      <div class="question-header">
        <span class="question-number"
          >{{ $t("question") }} {{ qIndex + 1 }}</span
        >
        <button class="remove-question-btn" @click="removeQuestion(qIndex)">
          {{ $t("remove") }}
        </button>
      </div>
      <div class="form-group">
        <label>{{ $t("questionText") }}</label>
        <input
          type="text"
          v-model="question.question"
          class="form-input"
          :placeholder="$t('enterQuestion')"
        />
      </div>
      <div class="form-group">
        <label>{{ $t("answersMarkCorrect") }}</label>
        <div class="options-editor">
          <div
            v-for="(option, oIndex) in question.options"
            :key="oIndex"
            class="option-editor"
          >
            <input
              type="radio"
              :name="'correct-' + qIndex"
              :value="oIndex"
              v-model.number="question.correct"
            />
            <input
              type="text"
              v-model="question.options[oIndex]"
              class="form-input"
              :placeholder="
                $t('answer') + ' ' + String.fromCharCode(65 + oIndex)
              "
            />
          </div>
        </div>
      </div>
    </div>
    <button class="add-question-btn" @click="addQuestion">
      + {{ $t("addQuestion") }}
    </button>
    <div class="button-group">
      <button class="save-quiz-btn" @click="saveQuiz">
        💾 {{ $t("saveQuiz") }}
      </button>
      <NuxtLink class="cancel-btn" to="/dashboard">
        ❌ {{ $t("cancel") }}
      </NuxtLink>
    </div>
    <div class="error-message" :class="{ success: quizMessage.success }">
      {{ quizMessage.text }}
    </div>
  </div>
</template>
<script lang="ts" setup>
const router = useRouter();
const { t } = useI18n();
const currentUser = ref<string | null>(null);
const quizzes = ref<Record<string, any>>({});
const editingQuizId = ref<string | null>(null);
const quizForm = ref({
  name: "",
  description: "",
  questions: [createEmptyQuestion()],
});
const quizMessage = ref({ text: "", success: false });

function createEmptyQuestion() {
  return {
    question: "",
    options: ["", "", "", ""],
    correct: 0,
  };
}

function addQuestion() {
  quizForm.value.questions.push(createEmptyQuestion());
}

function removeQuestion(index: number) {
  if (quizForm.value.questions.length <= 1) {
    alert("Quiz musi mieć przynajmniej jedno pytanie!");
    return;
  }
  quizForm.value.questions.splice(index, 1);
}

function saveQuiz() {
  const { name, description, questions } = quizForm.value;
  if (!name) {
    quizMessage.value = { text: "⚠️ Podaj nazwę quizu!", success: false };
    return;
  }
  if (!description) {
    quizMessage.value = { text: "⚠️ Dodaj opis quizu!", success: false };
    return;
  }
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q) {
      return;
    }
    if (!q.question) {
      quizMessage.value = {
        text: `⚠️ Wypełnij treść pytania ${i + 1}!`,
        success: false,
      };
      return;
    }
    if (q.options.some((opt: string) => !opt)) {
      quizMessage.value = {
        text: `⚠️ Wypełnij wszystkie odpowiedzi w pytaniu ${i + 1}!`,
        success: false,
      };
      return;
    }
    if (q.correct === undefined || q.correct === null) {
      quizMessage.value = {
        text: `⚠️ Zaznacz poprawną odpowiedź w pytaniu ${i + 1}!`,
        success: false,
      };
      return;
    }
  }
  if (questions.length < 3) {
    quizMessage.value = {
      text: "⚠️ Quiz musi mieć minimum 3 pytania!",
      success: false,
    };
    return;
  }
  const quizId = editingQuizId.value || `quiz-${Date.now()}`;
  quizzes.value[quizId] = {
    id: quizId,
    name,
    description,
    questions: questions.map((q: any) => ({
      question: q.question,
      options: q.options,
      correct: q.correct,
    })),
    author: currentUser.value,
    isPublic: true,
    createdAt: editingQuizId.value
      ? quizzes.value[quizId].createdAt
      : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem("quizzes", JSON.stringify(quizzes.value));
  quizMessage.value = { text: "✓ Quiz zapisany pomyślnie!", success: true };
  setTimeout(() => {
    router.push("/dashboard");
  }, 1000);
}

onMounted(() => {
  quizzes.value = JSON.parse(localStorage.getItem("quizzes") || "{}");
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) currentUser.value = savedUser;
  // Obsługa edycji quizu przez query (?edit=quizId)
  const editId = router.currentRoute.value.query.edit as string;
  if (editId && quizzes.value[editId]) {
    editingQuizId.value = editId;
    const quiz = quizzes.value[editId];
    quizForm.value = {
      name: quiz.name,
      description: quiz.description,
      questions: JSON.parse(JSON.stringify(quiz.questions)),
    };
  }
});
</script>
<style scoped>
.create-quiz-container {
  margin: 0 auto;
  padding: 32px;
}
.form-group {
  margin-bottom: 18px;
}
.form-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.question-editor {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 18px;
}
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.remove-question-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}
.remove-question-btn:hover {
  background: #b52a37;
}
.options-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.option-editor {
  display: flex;
  align-items: center;
  gap: 8px;
}
.add-question-btn {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: #fff;
  cursor: pointer;
}
.add-question-btn:hover {
  background: #0056b3;
}
.button-group {
  display: flex;
  gap: 18px;
  margin-top: 24px;
}
.save-quiz-btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background: #28a745;
  color: #fff;
  cursor: pointer;
}
.save-quiz-btn:hover {
  background: #218838;
}
.cancel-btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background: #dc3545;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cancel-btn:hover {
  background: #b52a37;
}
.error-message {
  margin-top: 18px;
  text-align: center;
  color: red;
}
.success {
  color: green;
}
</style>
