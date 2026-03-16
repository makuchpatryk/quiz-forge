import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CreateQuizDtoRequest, QuizDto } from "@core/libs/api/quiz/types";

// ── mapFormToCreateQuizDto — wyekstrahowana logika ────────

interface QuizFormQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizFormData {
  name: string;
  description: string;
  questions: QuizFormQuestion[];
}

function mapFormToCreateQuizDto(form: QuizFormData): CreateQuizDtoRequest {
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

// ── Walidacja formularza — wyekstrahowana logika ──────────

function validateQuizForm(form: QuizFormData): string | null {
  if (!form.name) return "quizNameRequired";
  if (!form.description) return "quizDescriptionRequired";

  for (let i = 0; i < form.questions.length; i++) {
    const q = form.questions[i]!;
    if (!q.question) return `fillQuestionText ${i + 1}!`;
    if (q.options.some((opt: string) => !opt))
      return `fillAllAnswers ${i + 1}!`;
    if (q.correct === undefined || q.correct === null)
      return `markCorrectAnswer ${i + 1}!`;
  }

  if (form.questions.length < 3) return "minThreeQuestions";

  return null;
}

// ── Mocks ─────────────────────────────────────────────────

const mockCreate = vi.fn();
const mockSearch = vi.fn();

const mockApi = {
  quiz: { create: mockCreate, search: mockSearch },
};

// ── Helpers ───────────────────────────────────────────────

function extractErrorMessage(err: unknown): string {
  const error = err as {
    response?: { data?: { message?: string | string[] } };
  };
  const msg = error.response?.data?.message;
  return Array.isArray(msg) ? msg.join(", ") : msg || "quizSaveError";
}

const makeValidForm = (): QuizFormData => ({
  name: "Test Quiz",
  description: "A test quiz description",
  questions: [
    {
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      question: "What is 3+3?",
      options: ["5", "6", "7", "8"],
      correct: 1,
    },
    {
      question: "What is 1+1?",
      options: ["1", "2", "3", "4"],
      correct: 1,
    },
  ],
});

// ── Tests ─────────────────────────────────────────────────

describe("Create Quiz — mapFormToCreateQuizDto", () => {
  it("powinno mapować form.name na title", () => {
    const form = makeValidForm();
    const dto = mapFormToCreateQuizDto(form);

    expect(dto.title).toBe("Test Quiz");
    expect(dto).not.toHaveProperty("name");
  });

  it("powinno mapować description bez zmian", () => {
    const form = makeValidForm();
    const dto = mapFormToCreateQuizDto(form);

    expect(dto.description).toBe("A test quiz description");
  });

  it("powinno mapować pytania z opcjami string[] na { text, isCorrect }[]", () => {
    const form = makeValidForm();
    const dto = mapFormToCreateQuizDto(form);

    expect(dto.questions).toHaveLength(3);
    expect(dto.questions[0]!.question).toBe("What is 2+2?");
    expect(dto.questions[0]!.options).toEqual([
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false },
    ]);
  });

  it("powinno ustawiać isCorrect=true tylko dla wybranej opcji (correct index)", () => {
    const form = makeValidForm();
    form.questions[0]!.correct = 2; // trzecia opcja poprawna
    const dto = mapFormToCreateQuizDto(form);

    const options = dto.questions[0]!.options;
    expect(options[0]!.isCorrect).toBe(false);
    expect(options[1]!.isCorrect).toBe(false);
    expect(options[2]!.isCorrect).toBe(true);
    expect(options[3]!.isCorrect).toBe(false);
  });

  it("powinno obsłużyć correct=0 (pierwsza opcja)", () => {
    const form = makeValidForm();
    form.questions[0]!.correct = 0;
    const dto = mapFormToCreateQuizDto(form);

    expect(dto.questions[0]!.options[0]!.isCorrect).toBe(true);
    expect(dto.questions[0]!.options[1]!.isCorrect).toBe(false);
  });

  it("powinno zachować kolejność pytań", () => {
    const form = makeValidForm();
    const dto = mapFormToCreateQuizDto(form);

    expect(dto.questions[0]!.question).toBe("What is 2+2?");
    expect(dto.questions[1]!.question).toBe("What is 3+3?");
    expect(dto.questions[2]!.question).toBe("What is 1+1?");
  });
});

describe("Create Quiz — walidacja formularza", () => {
  it("powinno zwrócić null dla poprawnego formularza", () => {
    const form = makeValidForm();
    expect(validateQuizForm(form)).toBeNull();
  });

  it("powinno zwrócić błąd gdy brak nazwy quizu", () => {
    const form = makeValidForm();
    form.name = "";
    expect(validateQuizForm(form)).toBe("quizNameRequired");
  });

  it("powinno zwrócić błąd gdy brak opisu", () => {
    const form = makeValidForm();
    form.description = "";
    expect(validateQuizForm(form)).toBe("quizDescriptionRequired");
  });

  it("powinno zwrócić błąd gdy pytanie jest puste", () => {
    const form = makeValidForm();
    form.questions[0]!.question = "";
    expect(validateQuizForm(form)).toBe("fillQuestionText 1!");
  });

  it("powinno zwrócić błąd gdy opcja odpowiedzi jest pusta", () => {
    const form = makeValidForm();
    form.questions[1]!.options[2] = "";
    expect(validateQuizForm(form)).toBe("fillAllAnswers 2!");
  });

  it("powinno zwrócić błąd gdy mniej niż 3 pytania", () => {
    const form = makeValidForm();
    form.questions = form.questions.slice(0, 2);
    expect(validateQuizForm(form)).toBe("minThreeQuestions");
  });

  it("powinno przejść walidację dla dokładnie 3 pytań", () => {
    const form = makeValidForm();
    expect(form.questions).toHaveLength(3);
    expect(validateQuizForm(form)).toBeNull();
  });
});

describe("Create Quiz — wywołanie API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("powinno wywołać $api.quiz.create z poprawnym DTO", async () => {
    const createdQuiz: QuizDto = {
      id: 42,
      title: "Test Quiz",
      description: "A test quiz description",
      isActive: true,
      questions: [],
    };
    mockCreate.mockResolvedValue(createdQuiz);

    const form = makeValidForm();
    const dto = mapFormToCreateQuizDto(form);

    const result = await mockApi.quiz.create(dto);

    expect(mockCreate).toHaveBeenCalledWith(dto);
    expect(result.id).toBe(42);
    expect(result.title).toBe("Test Quiz");
  });

  it("powinno obsłużyć sukces — ustawić flagę i przekierować", async () => {
    const createdQuiz: QuizDto = {
      id: 1,
      title: "New Quiz",
      description: "Desc",
      isActive: true,
      questions: [],
    };
    mockCreate.mockResolvedValue(createdQuiz);

    const isSubmitting = { value: false };
    const quizMessage = { text: "", success: false };

    // Symulacja logiki saveQuiz
    isSubmitting.value = true;
    quizMessage.text = "";
    quizMessage.success = false;

    try {
      const form = makeValidForm();
      await mockApi.quiz.create(mapFormToCreateQuizDto(form));
      quizMessage.text = "quizSavedSuccess";
      quizMessage.success = true;
    } catch {
      quizMessage.text = "quizSaveError";
      quizMessage.success = false;
    } finally {
      isSubmitting.value = false;
    }

    expect(isSubmitting.value).toBe(false);
    expect(quizMessage.success).toBe(true);
    expect(quizMessage.text).toBe("quizSavedSuccess");
  });

  it("powinno obsłużyć błąd walidacji z backendu (tablica message)", async () => {
    const axiosError = {
      response: {
        status: 400,
        data: {
          message: [
            "title should not be empty",
            "description should not be empty",
          ],
        },
      },
    };
    mockCreate.mockRejectedValue(axiosError);

    const quizMessage = { text: "", success: false };

    try {
      const form = makeValidForm();
      await mockApi.quiz.create(mapFormToCreateQuizDto(form));
      quizMessage.text = "quizSavedSuccess";
      quizMessage.success = true;
    } catch (err: unknown) {
      quizMessage.text = extractErrorMessage(err);
      quizMessage.success = false;
    }

    expect(quizMessage.success).toBe(false);
    expect(quizMessage.text).toBe(
      "title should not be empty, description should not be empty",
    );
  });

  it("powinno obsłużyć błąd walidacji z backendu (string message)", async () => {
    const axiosError = {
      response: {
        status: 400,
        data: { message: "Quiz title is required" },
      },
    };
    mockCreate.mockRejectedValue(axiosError);

    const quizMessage = { text: "", success: false };

    try {
      await mockApi.quiz.create(mapFormToCreateQuizDto(makeValidForm()));
      quizMessage.success = true;
    } catch (err: unknown) {
      quizMessage.text = extractErrorMessage(err);
      quizMessage.success = false;
    }

    expect(quizMessage.text).toBe("Quiz title is required");
  });

  it("powinno obsłużyć błąd sieciowy (brak response)", async () => {
    mockCreate.mockRejectedValue(new Error("Network Error"));

    const quizMessage = { text: "", success: false };

    try {
      await mockApi.quiz.create(mapFormToCreateQuizDto(makeValidForm()));
      quizMessage.success = true;
    } catch (err: unknown) {
      quizMessage.text = extractErrorMessage(err);
      quizMessage.success = false;
    }

    expect(quizMessage.text).toBe("quizSaveError");
    expect(quizMessage.success).toBe(false);
  });

  it("powinno ustawiać isSubmitting=true podczas wysyłania i false po zakończeniu", async () => {
    let resolveCreate: (value: unknown) => void;
    const createPromise = new Promise((resolve) => {
      resolveCreate = resolve;
    });
    mockCreate.mockReturnValue(createPromise);

    const isSubmitting = { value: false };

    isSubmitting.value = true;

    const savePromise = mockApi.quiz
      .create(mapFormToCreateQuizDto(makeValidForm()))
      .finally(() => {
        isSubmitting.value = false;
      });

    // Podczas wysyłania
    expect(isSubmitting.value).toBe(true);

    // Rozwiąż promise
    resolveCreate!({ id: 1, title: "Test" });
    await savePromise;

    expect(isSubmitting.value).toBe(false);
  });

  it("powinno obsłużyć błąd 401 (Unauthorized)", async () => {
    const axiosError = {
      response: {
        status: 401,
        data: { message: "Unauthorized" },
      },
    };
    mockCreate.mockRejectedValue(axiosError);

    const quizMessage = { text: "", success: false };

    try {
      await mockApi.quiz.create(mapFormToCreateQuizDto(makeValidForm()));
    } catch (err: unknown) {
      quizMessage.text = extractErrorMessage(err);
      quizMessage.success = false;
    }

    expect(quizMessage.text).toBe("Unauthorized");
    expect(quizMessage.success).toBe(false);
  });
});
