import { ref } from "vue";

export function useQuizStore() {
    const currentQuestion = ref(0);
    const answers = ref<Record<string, string[]>>({});

    function answerQuestion(questionId: string, selected: string[]) {
        answers.value[questionId] = selected;
    }

    return { currentQuestion, answers, answerQuestion };
}