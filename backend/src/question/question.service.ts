import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { VariantService } from 'src/variant/variant.service';

@Injectable()
export class QuestionService {
  private logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private variantService: VariantService,
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

  async findByQuizId(quizId: number): Promise<Question[]> {
    const questions = await this.questionRepository.find({ where: { quizId } });

    for (const question of questions) {
      const variants = await this.variantService.findByQuestionId(question.id);
      question.variants = variants;
    }

    return questions;
  }
}
