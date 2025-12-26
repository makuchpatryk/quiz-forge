import { Injectable } from "@nestjs/common";
import { CreateQuestionDto } from "../dto/create-question.dto";
import { Question } from "../entities/question.entity";
import { QuestionRepository } from "../repositories/question.repository";
import { Quiz } from "../entities/quiz.entity";

@Injectable()
export class QuestionService {
  constructor(private questionRepository: QuestionRepository) {}

  async findQuestionById(id: number): Promise<Question | null> {
    return await this.questionRepository.findOne({
      where: {
        id,
      },
      relations: ["quiz", "options"],
    });
  }

  async createQuestion(
    question: CreateQuestionDto,
    quiz: Quiz
  ): Promise<Question> {
    const newQuestion = await this.questionRepository.save({
      question: question.question,
    });

    quiz.questions = [...quiz.questions, newQuestion];
    await quiz.save();

    return newQuestion;
  }
}
