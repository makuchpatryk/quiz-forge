import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionController } from "./controllers/question.controller";
import { QuestionRepository } from "./repositories/question.repository";
import { QuestionService } from "./services/question.service";
import { QuizController } from "./controllers/quiz.controller";
import { QuizRepository } from "./repositories/quiz.repository";
import { QuizService } from "./services/quiz.service";
import { OptionRepository } from "./repositories/option.repository";
import { OptionController } from "./controllers/option.controller";
import { OptionService } from "./services/option.service";
import { UserModule } from "../user/user.module";
import { ResponseController } from "./controllers/response.controller";
import { ResponseService } from "./services/response.service";
import { AuthModule } from "../auth/auth.module";
import { Quiz } from "./entities/quiz.entity";
import { Question } from "./entities/question.entity";
import { Option } from "./entities/option.entity";

@Module({
  controllers: [
    QuizController,
    QuestionController,
    OptionController,
    ResponseController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      Question,
      Option,
      QuestionRepository,
      OptionRepository,
      QuizRepository,
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [
    QuizService,
    QuestionService,
    OptionService,
    ResponseService,
    QuizRepository,
    QuestionRepository,
    OptionRepository,
  ],
})
export class QuizModule {}
