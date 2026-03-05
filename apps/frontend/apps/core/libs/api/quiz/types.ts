export interface QuizSearchDtoRequest {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export type OptionDto = {
  id: number;
  text: string;
  isCorrect: boolean;
};
export type QuestionDto = {
  id: number;
  text: string;
  options: OptionDto[];
};

export type QuizDto = {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  questions: QuestionDto[];
};

export interface CreateQuizOptionDtoRequest {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuizQuestionDtoRequest {
  question: string;
  options: CreateQuizOptionDtoRequest[];
}

export interface CreateQuizDtoRequest {
  title: string;
  description: string;
  questions: CreateQuizQuestionDtoRequest[];
}
