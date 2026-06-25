import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Injectable()
export class QuestionService {
  private logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
    quiz: Quiz,
    manager?: EntityManager,
  ): Promise<Question> {
    const repository = manager
      ? manager.getRepository(Question)
      : this.questionRepository;

    const question = repository.create({
      title: createQuestionDto.title,
      type: createQuestionDto.type,
      answer: createQuestionDto.answer ?? null,
      quiz,
    });

    const saved = await repository.save(question);
    this.logger.log(`Question created: ${saved.id}`);
    return saved;
  }
}
