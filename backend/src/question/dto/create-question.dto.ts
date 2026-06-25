/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
  Validate,
} from 'class-validator';
import { QuestionTypeEnum } from '../questionType.enum';
import { CreateVariantDto } from 'src/variant/dto/create-variant.dto';
import { Type } from 'class-transformer';
import { QuestionTypeValidator } from '../validators/question-type.validator';

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];

  @Validate(QuestionTypeValidator)
  private readonly _typeCheck?: never;
}
