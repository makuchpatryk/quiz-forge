export interface QuizSearchDtoRequest {}

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
