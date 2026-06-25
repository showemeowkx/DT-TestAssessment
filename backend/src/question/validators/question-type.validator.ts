/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { QuestionTypeEnum } from '../questionType.enum';
import { CreateVariantDto } from 'src/variant/dto/create-variant.dto';

@ValidatorConstraint({ name: 'QuestionType', async: false })
export class QuestionTypeValidator implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const q = args.object as {
      type: QuestionTypeEnum;
      answer?: string | null;
      variants?: CreateVariantDto[];
    };

    const variants = q.variants ?? [];
    const correctCount = variants.filter((v) => v.isCorrect).length;

    switch (q.type) {
      case QuestionTypeEnum.INPUT:
        return (
          variants.length === 0 &&
          typeof q.answer === 'string' &&
          q.answer.trim().length > 0
        );

      case QuestionTypeEnum.BOOLEAN:
        return !q.answer && variants.length === 2 && correctCount === 1;

      case QuestionTypeEnum.CHECKBOX:
        return !q.answer && variants.length >= 2 && correctCount >= 1;

      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const q = args.object as { type: QuestionTypeEnum };
    switch (q.type) {
      case QuestionTypeEnum.INPUT:
        return 'Input questions require answer and must not have variants';
      case QuestionTypeEnum.BOOLEAN:
        return 'Boolean questions require exactly 2 variants with 1 correct';
      case QuestionTypeEnum.CHECKBOX:
        return 'Checkbox questions require at least 2 variants with 1 correct';
      default:
        return 'Invalid question type';
    }
  }
}
