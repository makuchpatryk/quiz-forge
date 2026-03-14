import type {
  CreateQuizDtoRequest,
  PaginationResult,
  QuizDto,
  QuizSearchDtoRequest,
} from "./types.ts";
import type { AxiosInstance } from "axios";

export interface QuizApi {
  search: (payload: QuizSearchDtoRequest) => Promise<PaginationResult<QuizDto>>;
  create: (payload: CreateQuizDtoRequest) => Promise<QuizDto>;
  getById: (id: number) => Promise<QuizDto>;
}

export const createQuizApi = (axiosInstance: AxiosInstance): QuizApi => ({
  search: async (payload: QuizSearchDtoRequest) => {
    const { data } = await axiosInstance.get<PaginationResult<QuizDto>>(
      "/quiz",
      { params: payload },
    );
    return data;
  },
  create: async (payload: CreateQuizDtoRequest) => {
    const { data } = await axiosInstance.post<QuizDto>("/quiz", payload);
    return data;
  },
  getById: async (id: number) => {
    const { data } = await axiosInstance.get<QuizDto>(`/quiz/${id}`);
    return data;
  },
});
