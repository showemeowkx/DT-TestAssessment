import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { GetQuizzesDto } from './dto/get-quizzes.dto';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto): Promise<void> {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll(@Query() getQuizzesDto: GetQuizzesDto): Promise<{
    data: Quiz[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.quizService.findAll(getQuizzesDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.quizService.remove(+id);
  }
}
