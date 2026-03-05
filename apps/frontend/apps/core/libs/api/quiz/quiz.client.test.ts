import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AxiosInstance } from "axios";
import { createQuizApi } from "./quiz.client";
import type {
  CreateQuizDtoRequest,
  PaginationResult,
  QuizDto,
  QuizSearchDtoRequest,
} from "./types";

describe("Quiz API Client", () => {
  let mockAxios: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
  };
  let quizApi: ReturnType<typeof createQuizApi>;

  const sampleQuiz: QuizDto = {
    id: 1,
    title: "Test Quiz",
    description: "A test quiz",
    isActive: true,
    questions: [
      {
        id: 1,
        text: "What is 2+2?",
        options: [
          { id: 1, text: "3", isCorrect: false },
          { id: 2, text: "4", isCorrect: true },
          { id: 3, text: "5", isCorrect: false },
          { id: 4, text: "6", isCorrect: false },
        ],
      },
    ],
  };

  const samplePaginationResult: PaginationResult<QuizDto> = {
    items: [sampleQuiz],
    meta: {
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 20,
      totalPages: 1,
      currentPage: 1,
    },
  };

  beforeEach(() => {
    mockAxios = {
      get: vi.fn(),
      post: vi.fn(),
    };
    quizApi = createQuizApi(mockAxios as unknown as AxiosInstance);
  });

  describe("search", () => {
    it("should call GET /quiz with query params", async () => {
      mockAxios.get.mockResolvedValue({ data: samplePaginationResult });

      const payload: QuizSearchDtoRequest = { page: 1, limit: 20 };
      await quizApi.search(payload);

      expect(mockAxios.get).toHaveBeenCalledWith("/quiz", {
        params: payload,
      });
    });

    it("should return paginated quiz data", async () => {
      mockAxios.get.mockResolvedValue({ data: samplePaginationResult });

      const result = await quizApi.search({ page: 1, limit: 20 });

      expect(result).toEqual(samplePaginationResult);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]!.title).toBe("Test Quiz");
      expect(result.meta.currentPage).toBe(1);
    });

    it("should pass empty params when no pagination specified", async () => {
      mockAxios.get.mockResolvedValue({ data: samplePaginationResult });

      await quizApi.search({});

      expect(mockAxios.get).toHaveBeenCalledWith("/quiz", { params: {} });
    });

    it("should propagate errors from axios", async () => {
      const error = new Error("Network Error");
      mockAxios.get.mockRejectedValue(error);

      await expect(quizApi.search({ page: 1 })).rejects.toThrow(
        "Network Error",
      );
    });
  });

  describe("create", () => {
    const createPayload: CreateQuizDtoRequest = {
      title: "New Quiz",
      description: "A new quiz",
      questions: [
        {
          question: "What is 2+2?",
          options: [
            { text: "3", isCorrect: false },
            { text: "4", isCorrect: true },
            { text: "5", isCorrect: false },
            { text: "6", isCorrect: false },
          ],
        },
        {
          question: "What is 3+3?",
          options: [
            { text: "5", isCorrect: false },
            { text: "6", isCorrect: true },
            { text: "7", isCorrect: false },
            { text: "8", isCorrect: false },
          ],
        },
        {
          question: "What is 1+1?",
          options: [
            { text: "1", isCorrect: false },
            { text: "2", isCorrect: true },
            { text: "3", isCorrect: false },
            { text: "4", isCorrect: false },
          ],
        },
      ],
    };

    it("should call POST /quiz with payload body", async () => {
      mockAxios.post.mockResolvedValue({ data: sampleQuiz });

      await quizApi.create(createPayload);

      expect(mockAxios.post).toHaveBeenCalledWith("/quiz", createPayload);
    });

    it("should return created quiz data", async () => {
      const createdQuiz: QuizDto = {
        ...sampleQuiz,
        title: "New Quiz",
        description: "A new quiz",
      };
      mockAxios.post.mockResolvedValue({ data: createdQuiz });

      const result = await quizApi.create(createPayload);

      expect(result.title).toBe("New Quiz");
      expect(result.description).toBe("A new quiz");
      expect(result.id).toBeDefined();
    });

    it("should propagate validation errors from backend", async () => {
      const error = {
        response: {
          status: 400,
          data: { message: ["title should not be empty"] },
        },
      };
      mockAxios.post.mockRejectedValue(error);

      await expect(quizApi.create(createPayload)).rejects.toEqual(error);
    });

    it("should propagate auth errors (401)", async () => {
      const error = {
        response: { status: 401, data: { message: "Unauthorized" } },
      };
      mockAxios.post.mockRejectedValue(error);

      await expect(quizApi.create(createPayload)).rejects.toEqual(error);
    });
  });
});
