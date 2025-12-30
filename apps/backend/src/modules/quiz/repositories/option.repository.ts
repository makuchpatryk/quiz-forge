import { EntityRepository, Repository } from "typeorm";
import { Option } from "../entities/option.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "../entities/question.entity";

@Injectable()
export class OptionRepository extends Repository<Option> {}
