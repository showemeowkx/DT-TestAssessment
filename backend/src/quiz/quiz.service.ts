import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QuestionService } from 'src/question/question.service';
import { VariantService } from 'src/variant/variant.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { GetQuizzesDto } from './dto/get-quizzes.dto';

@Injectable()
export class QuizService {
  private logger = new Logger(QuizService.name);

  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private dataSource: DataSource,
    private questionService: QuestionService,
    private variantService: VariantService,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const quiz = await manager.save(
        manager.create(Quiz, { title: createQuizDto.title }),
      );
      this.logger.log(`Quiz created: ${quiz.id}`);

      for (const questionDto of createQuizDto.questions) {
        const question = await this.questionService.create(
          questionDto,
          quiz,
          manager,
        );

        if (questionDto.variants?.length) {
          for (const variantDto of questionDto.variants) {
            await this.variantService.create(variantDto, question, manager);
          }
        }
      }
    });
  }

  async findAll(getQuizzesDto: GetQuizzesDto): Promise<{
    data: Quiz[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = getQuizzesDto.page || 1;
    const limit = getQuizzesDto.limit || 10;

    const [quizzes, total] = await this.quizRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: quizzes,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }
    const questions = await this.questionService.findByQuizId(quiz.id);
    quiz.questions = questions;

    return quiz;
  }

  async remove(id: number): Promise<void> {
    await this.quizRepository.delete(id);
    this.logger.log(`Quiz removed: ${id}`);
  }
}
