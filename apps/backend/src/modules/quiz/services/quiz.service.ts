import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { events } from "../../../common/constants/event.constants";

import { CreateQuizDto } from "../dto/create-quiz.dto";
import { Quiz } from "../entities/quiz.entity";
import { ResponseAddEvent } from "../events/response-add.event";
import { QuizRepository } from "../repositories/quiz.repository";
import { In } from "typeorm";

@Injectable()
export class QuizService {
  constructor(private quizRepository: QuizRepository) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Quiz>> {
    const qb = this.quizRepository
      .createQueryBuilder("q")
      .orderBy("q.id", "DESC");

    const result = await paginate<Quiz>(qb, options);

    const quizzes = await this.quizRepository.find({
      where: { id: In(result.items.map((q) => q.id)) },
      relations: {
        questions: {
          options: true,
        },
      },
    });

    return {
      ...result,
      items: quizzes,
    };
  }

  async getQuizById(id: number): Promise<Quiz> {
    return await this.quizRepository.findOne({
      where: {
        id,
      },
      relations: ["questions", "questions.options"],
    });
  }

  async createNewQuiz(dto: CreateQuizDto) {
    const quiz = this.quizRepository.create(dto);
    return await this.quizRepository.save(quiz);
  }

  @OnEvent(events.RESPONSE_SUBMITTED)
  checkQuizCompleted(payload: ResponseAddEvent) {}
}
