import type {
  PaginationResult,
  QuizDto,
  QuizSearchDtoRequest,
} from "./types.ts";
import type { AxiosInstance } from "axios";

export interface QuizApi {
  search: (payload: QuizSearchDtoRequest) => Promise<PaginationResult<QuizDto>>;
}

export const createQuizApi = (axiosInstance: AxiosInstance): QuizApi => ({
  search: async (payload: QuizSearchDtoRequest) => {
    const { data } = await axiosInstance.get<PaginationResult<QuizDto>>(
      "/quiz",
      payload,
    );
    return data;
  },
});
