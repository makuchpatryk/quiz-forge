<template>
  <div class="mx-auto p-8">
    <back-to-daschboard />
    <h1 class="text-center mb-8 text-3xl font-bold">
      {{ $t("createQuiz") }}
    </h1>
    <div class="mb-5">
      <label class="block mb-2">{{ $t("quizName") }}</label>
      <input
        type="text"
        v-model="quizForm.name"
        class="w-full px-3 py-2 text-base border border-gray-300 rounded"
        :placeholder="$t('quizNamePlaceholder')"
      />
    </div>
    <div class="mb-5">
      <label class="block mb-2">{{ $t("quizDescription") }}</label>
      <input
        type="text"
        v-model="quizForm.description"
        class="w-full px-3 py-2 text-base border border-gray-300 rounded"
        :placeholder="$t('quizDescriptionPlaceholder')"
      />
    </div>
    <h3 class="my-8 text-xl font-bold text-gray-800">
      {{ $t("questions") }}
    </h3>
    <div
      v-for="(question, qIndex) in quizForm.questions"
      :key="qIndex"
      class="bg-gray-50 rounded-lg p-5 mb-5"
    >
      <div class="flex justify-between items-center mb-3">
        <span class="font-bold text-lg"
          >{{ $t("question") }} {{ qIndex + 1 }}</span
        >
        <button
          class="bg-red-600 text-white border-none rounded-md px-3 py-1 cursor-pointer hover:bg-red-700"
          @click="removeQuestion(qIndex)"
        >
          {{ $t("remove") }}
        </button>
      </div>
      <div class="mb-5">
        <label class="block mb-2">{{ $t("questionText") }}</label>
        <input
          type="text"
          v-model="question.question"
          class="w-full px-3 py-2 text-base border border-gray-300 rounded"
          :placeholder="$t('enterQuestion')"
        />
      </div>
      <div class="mb-5">
        <label class="block mb-2">{{ $t("answersMarkCorrect") }}</label>
        <div class="flex flex-col gap-2">
          <div
            v-for="(option, oIndex) in question.options"
            :key="oIndex"
            class="flex items-center gap-2"
          >
            <input
              type="radio"
              :name="'correct-' + qIndex"
              :value="oIndex"
              v-model.number="question.correct"
              class="cursor-pointer"
            />
            <input
              type="text"
              v-model="question.options[oIndex]"
              class="flex-1 px-3 py-2 text-base border border-gray-300 rounded"
              :placeholder="
                $t('answer') + ' ' + String.fromCharCode(65 + oIndex)
              "
            />
          </div>
        </div>
      </div>
    </div>
    <button
      class="mt-3 px-4 py-2 text-base border-none rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
      @click="addQuestion"
    >
      + {{ $t("addQuestion") }}
    </button>
    <div class="flex gap-5 mt-6">
      <button
        class="px-5 py-2 text-base border-none rounded-md bg-green-600 text-white cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSubmitting"
        @click="saveQuiz"
      >
        💾 {{ isSubmitting ? $t("saving") : $t("saveQuiz") }}
      </button>
      <NuxtLink
        class="px-5 py-2 text-base border-none rounded-md bg-red-600 text-white cursor-pointer no-underline flex items-center justify-center hover:bg-red-700"
        to="/dashboard"
      >
        ❌ {{ $t("cancel") }}
      </NuxtLink>
    </div>
    <div
      class="mt-5 text-center"
      :class="quizMessage.success ? 'text-green-600' : 'text-red-600'"
    >
      {{ quizMessage.text }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { CreateQuizDtoRequest } from "@core/libs/api/quiz/types";
import type { AxiosError } from "axios";

const router = useRouter();
const { t } = useI18n();
const { $api } = useNuxtApp();

const quizForm = ref({
  name: "",
  description: "",
  questions: [createEmptyQuestion()],
});
const quizMessage = ref({ text: "", success: false });
const isSubmitting = ref(false);

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
    alert(t("minOneQuestion"));
    return;
  }
  quizForm.value.questions.splice(index, 1);
}

function mapFormToCreateQuizDto(
  form: typeof quizForm.value,
): CreateQuizDtoRequest {
  return {
    title: form.name,
    description: form.description,
    questions: form.questions.map((q) => ({
      question: q.question,
      options: q.options.map((text, oIndex) => ({
        text,
        isCorrect: oIndex === q.correct,
      })),
    })),
  };
}

async function saveQuiz() {
  const { name, description, questions } = quizForm.value;
  if (!name) {
    quizMessage.value = { text: t("quizNameRequired"), success: false };
    return;
  }
  if (!description) {
    quizMessage.value = { text: t("quizDescriptionRequired"), success: false };
    return;
  }
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q) {
      return;
    }
    if (!q.question) {
      quizMessage.value = {
        text: `${t("fillQuestionText")} ${i + 1}!`,
        success: false,
      };
      return;
    }
    if (q.options.some((opt: string) => !opt)) {
      quizMessage.value = {
        text: `${t("fillAllAnswers")} ${i + 1}!`,
        success: false,
      };
      return;
    }
    if (q.correct === undefined || q.correct === null) {
      quizMessage.value = {
        text: `${t("markCorrectAnswer")} ${i + 1}!`,
        success: false,
      };
      return;
    }
  }
  if (questions.length < 3) {
    quizMessage.value = {
      text: t("minThreeQuestions"),
      success: false,
    };
    return;
  }

  isSubmitting.value = true;
  quizMessage.value = { text: "", success: false };

  try {
    await $api.quiz.create(mapFormToCreateQuizDto(quizForm.value));
    quizMessage.value = { text: t("quizSavedSuccess"), success: true };
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  } catch (err) {
    const axiosError = err as AxiosError<{ message: string | string[] }>;
    const msg = axiosError.response?.data?.message;
    const errorText = Array.isArray(msg)
      ? msg.join(", ")
      : msg || t("quizSaveError");
    quizMessage.value = { text: errorText, success: false };
  } finally {
    isSubmitting.value = false;
  }
}
</script>
