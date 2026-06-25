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
} from 'class-validator';
import { QuestionTypeEnum } from '../questionType.enum';
import { CreateVariantDto } from 'src/variant/dto/create-variant.dto';
import { Type } from 'class-transformer';

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

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}
