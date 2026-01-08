import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, Length, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateQuizDto {
  @ApiProperty({
    description: "The title of the quiz",
    example: "How good are your with Laravel?",
  })
  @IsNotEmpty({ message: "The quiz should have a title" })
  @Length(3, 255)
  title: string;

  @ApiProperty({
    description: "A small description for the user",
    example:
      "This quiz will ask your questions on Laravel and test your knowledge.",
  })
  @IsNotEmpty()
  @Length(3)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  questions: CreateQuizQuestionDto[];
}

export class CreateQuizQuestionDto {
  @ApiProperty({
    description: "The actual question",
    example: "A sample question",
  })
  @IsNotEmpty()
  @Length(3, 255)
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizOptionDto)
  options: CreateQuizOptionDto[];
}

export class CreateQuizOptionDto {
  @ApiProperty({
    description: "The option for a question",
    example: "Owl",
  })
  @IsNotEmpty()
  @Length(2, 255)
  text: string;

  @ApiProperty({
    description: "Whether the option is correct or not",
    example: true,
  })
  @IsNotEmpty()
  isCorrect: boolean;
}
