import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuestionModule } from 'src/question/question.module';
import { VariantModule } from 'src/variant/variant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz]), QuestionModule, VariantModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
