import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { ApiPaginatedResponse } from "../../../common/decorator/api-pagination.response";
import { Roles } from "../../auth/roles.decorator";
import { RolesGuard } from "../../auth/roles.guard";

import { CreateQuizDto } from "../dto/create-quiz.dto";
import { Quiz } from "../entities/quiz.entity";
import { QuizService } from "../services/quiz.service";
import { AuthGuard } from "../../auth/auth.guard";

@ApiTags("Quiz")
@Controller("quiz")
@ApiSecurity("bearer")
@UseGuards(AuthGuard)
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get()
  @ApiPaginatedResponse({ model: Quiz, description: "List of quizzes" })
  async getAllQuiz(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 1
  ): Promise<Pagination<Quiz>> {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return await this.quizService.paginate(options);
  }
  @ApiCreatedResponse({ description: "The quiz that got created", type: Quiz })
  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(RolesGuard)
  @Roles("admin")
  async createQuiz(@Body() quizData: CreateQuizDto): Promise<Quiz> {
    return await this.quizService.createNewQuiz(quizData);
  }

  @Get("/:id")
  @ApiOkResponse({ description: "Get a quiz by id", type: Quiz })
  async getQuizById(@Param("id", ParseIntPipe) id: number): Promise<Quiz> {
    return await this.quizService.getQuizById(id);
  }
}
