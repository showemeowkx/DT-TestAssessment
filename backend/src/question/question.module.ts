import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantModule } from 'src/variant/variant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), VariantModule],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
