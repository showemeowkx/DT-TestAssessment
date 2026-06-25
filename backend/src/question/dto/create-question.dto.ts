/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { QuestionTypeEnum } from '../questionType.enum';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsEnum(QuestionTypeEnum)
  type: QuestionTypeEnum;

  @IsOptional()
  @IsString()
  answer?: string | null;
}
