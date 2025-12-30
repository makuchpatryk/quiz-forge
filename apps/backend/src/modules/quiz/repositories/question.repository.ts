import { Repository } from "typeorm";
import { Question } from "../entities/question.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class QuestionRepository extends Repository<Question> {}
