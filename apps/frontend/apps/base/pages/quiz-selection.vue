<template>
  <div class="mx-auto p-8">
    <h1 class="text-center mb-8 text-3xl font-bold">
      {{ $t("chooseQuiz") }}
    </h1>
    <div class="flex flex-col gap-5 mb-8">
      <div
        v-for="quiz in allQuizzes"
        :key="quiz.id"
        class="p-5 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-600"
        @click="startQuiz(String(quiz.id))"
      >
        <h3 class="text-xl font-bold mb-2">{{ quiz.title }}</h3>
        <p class="text-gray-700 mb-2">{{ quiz.description }}</p>
      </div>
    </div>
    <div v-if="allQuizzes.length === 0" class="text-center text-gray-500 mt-8">
      <div class="text-4xl mb-2">📝</div>
      <p>{{ $t("noQuizzesAvailable") }}</p>
    </div>
    <NuxtLink
      class="inline-block mt-6 text-blue-600 no-underline text-base hover:underline"
      to="/menu"
      >← {{ $t("backToMenu") }}</NuxtLink
    >
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
let allQuizzes = ref<{ id: number; title: string; description: string }[]>([]);
const { $api } = useNuxtApp();

const startQuiz = (quizId: string) => {
  router.push({ path: "/playing", query: { quizId } });
};

onMounted(async () => {
  const quiz = await $api.quiz.search({});
  allQuizzes.value = quiz.items.map((it) => ({
    title: it.title,
    id: it.id,
    description: it.description,
  }));
});
</script>
