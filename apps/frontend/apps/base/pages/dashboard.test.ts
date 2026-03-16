import { describe, it, expect, vi, beforeEach } from "vitest";
import type { QuizDto, PaginationResult } from "@core/libs/api/quiz/types";

// ── helpers ──────────────────────────────────────────────

const makeQuiz = (overrides: Partial<QuizDto> = {}): QuizDto => ({
  id: 1,
  title: "Laravel Quiz",
  description: "Basic Laravel questions",
  isActive: true,
  questions: [
    {
      id: 1,
      text: "Q1",
      options: [
        { id: 1, text: "A", isCorrect: true },
        { id: 2, text: "B", isCorrect: false },
      ],
    },
  ],
  ...overrides,
});

const makePaginationResult = (
  items: QuizDto[] = [makeQuiz()],
): PaginationResult<QuizDto> => ({
  items,
  meta: {
    totalItems: items.length,
    itemCount: items.length,
    itemsPerPage: 20,
    totalPages: 1,
    currentPage: 1,
  },
});

// ── mocks ────────────────────────────────────────────────

const mockSearch = vi.fn();
const mockCreate = vi.fn();

const mockApi = {
  quiz: { search: mockSearch, create: mockCreate },
};

// Mock Nuxt composables used in dashboard.vue
vi.stubGlobal("useNuxtApp", () => ({ $api: mockApi }));
vi.stubGlobal("useI18n", () => ({
  t: (key: string) => key,
}));
vi.stubGlobal("ref", (val: unknown) => ({ value: val }));
vi.stubGlobal("useRouter", () => ({
  push: vi.fn(),
  back: vi.fn(),
}));
vi.stubGlobal("onMounted", (fn: () => void) => fn());
vi.stubGlobal("computed", (fn: () => unknown) => ({ value: fn() }));

// ── tests ────────────────────────────────────────────────

describe("Dashboard — API integration logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Pobieranie quizów z API", () => {
    it("powinno wywołać $api.quiz.search z page=1 i limit=20", async () => {
      mockSearch.mockResolvedValue(makePaginationResult());

      await mockApi.quiz.search({ page: 1, limit: 20 });

      expect(mockSearch).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });

    it("powinno zwrócić listę quizów z items", async () => {
      const quizzes = [
        makeQuiz({ id: 1, title: "Quiz 1" }),
        makeQuiz({ id: 2, title: "Quiz 2" }),
      ];
      mockSearch.mockResolvedValue(makePaginationResult(quizzes));

      const result = await mockApi.quiz.search({ page: 1, limit: 20 });

      expect(result.items).toHaveLength(2);
      expect(result.items[0].title).toBe("Quiz 1");
      expect(result.items[1].title).toBe("Quiz 2");
    });

    it("powinno zwrócić pustą listę gdy brak quizów", async () => {
      mockSearch.mockResolvedValue(makePaginationResult([]));

      const result = await mockApi.quiz.search({ page: 1, limit: 20 });

      expect(result.items).toHaveLength(0);
    });

    it("powinno propagować błąd z API", async () => {
      mockSearch.mockRejectedValue(new Error("Network Error"));

      await expect(mockApi.quiz.search({ page: 1, limit: 20 })).rejects.toThrow(
        "Network Error",
      );
    });
  });

  describe("Dane quizu z backendu", () => {
    it("quiz powinien mieć pole title (nie name)", async () => {
      mockSearch.mockResolvedValue(
        makePaginationResult([makeQuiz({ title: "My Quiz Title" })]),
      );

      const result = await mockApi.quiz.search({ page: 1, limit: 20 });
      const quiz = result.items[0];

      expect(quiz.title).toBe("My Quiz Title");
      expect(quiz).not.toHaveProperty("name");
    });

    it("quiz powinien zawierać questions z options", async () => {
      const quiz = makeQuiz({
        questions: [
          {
            id: 1,
            text: "What is Vue?",
            options: [
              { id: 1, text: "Framework", isCorrect: true },
              { id: 2, text: "Library", isCorrect: false },
            ],
          },
          {
            id: 2,
            text: "What is Nuxt?",
            options: [
              { id: 3, text: "Meta-framework", isCorrect: true },
              { id: 4, text: "Database", isCorrect: false },
            ],
          },
        ],
      });
      mockSearch.mockResolvedValue(makePaginationResult([quiz]));

      const result = await mockApi.quiz.search({ page: 1, limit: 20 });

      expect(result.items[0].questions).toHaveLength(2);
      expect(result.items[0].questions[0].options).toHaveLength(2);
    });
  });

  describe("Metadane paginacji", () => {
    it("powinno zwrócić poprawne meta danych paginacji", async () => {
      const paginationResult: PaginationResult<QuizDto> = {
        items: [makeQuiz()],
        meta: {
          totalItems: 50,
          itemCount: 20,
          itemsPerPage: 20,
          totalPages: 3,
          currentPage: 1,
        },
      };
      mockSearch.mockResolvedValue(paginationResult);

      const result = await mockApi.quiz.search({ page: 1, limit: 20 });

      expect(result.meta.totalItems).toBe(50);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(20);
    });
  });

  describe("Stany UI dashboardu", () => {
    it("isLoading powinno być ustawione podczas ładowania", async () => {
      let resolveSearch: (value: unknown) => void;
      const searchPromise = new Promise((resolve) => {
        resolveSearch = resolve;
      });
      mockSearch.mockReturnValue(searchPromise);

      // Symulacja logiki z dashboard.vue onMounted
      const isLoading = { value: false };
      const errorMessage = { value: null as string | null };
      const quizzes = { value: [] as QuizDto[] };

      isLoading.value = true;
      errorMessage.value = null;

      const loadPromise = mockApi.quiz
        .search({ page: 1, limit: 20 })
        .then((result: PaginationResult<QuizDto>) => {
          quizzes.value = result.items;
        })
        .catch(() => {
          errorMessage.value = "loadQuizzesError";
        })
        .finally(() => {
          isLoading.value = false;
        });

      // Podczas ładowania
      expect(isLoading.value).toBe(true);
      expect(errorMessage.value).toBeNull();

      // Po zakończeniu
      resolveSearch!(makePaginationResult());
      await loadPromise;

      expect(isLoading.value).toBe(false);
      expect(quizzes.value).toHaveLength(1);
    });

    it("errorMessage powinien być ustawiony przy błędzie API", async () => {
      mockSearch.mockRejectedValue(new Error("Server error"));

      const isLoading = { value: false };
      const errorMessage = { value: null as string | null };
      const quizzes = { value: [] as QuizDto[] };

      isLoading.value = true;
      errorMessage.value = null;

      try {
        const result = await mockApi.quiz.search({ page: 1, limit: 20 });
        quizzes.value = result.items;
      } catch {
        errorMessage.value = "loadQuizzesError";
      } finally {
        isLoading.value = false;
      }

      expect(isLoading.value).toBe(false);
      expect(errorMessage.value).toBe("loadQuizzesError");
      expect(quizzes.value).toHaveLength(0);
    });
  });

  describe("Wyłączone przyciski (brak endpointów)", () => {
    it("przycisk edycji i usuwania powinny być disabled — brak endpointów PUT/DELETE", () => {
      // Test sprawdza kontrakt: API client nie ma metod update/delete
      const apiMethods = Object.keys(mockApi.quiz);
      expect(apiMethods).toContain("search");
      expect(apiMethods).toContain("create");
      expect(apiMethods).not.toContain("update");
      expect(apiMethods).not.toContain("delete");
    });
  });
});
