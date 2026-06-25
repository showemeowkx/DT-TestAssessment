import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';

@Injectable()
export class QuizService {
  private logger = new Logger(QuizService.name);

  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<void> {
    const quiz = this.quizRepository.create(createQuizDto);
    await this.quizRepository.save(quiz);
    this.logger.log(`Quiz created: ${quiz.id}`);
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizRepository.find();
  }

  async findOne(id: number): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }
    return quiz;
  }

  async remove(id: number): Promise<void> {
    await this.quizRepository.delete(id);
    this.logger.log(`Quiz removed: ${id}`);
  }
}
