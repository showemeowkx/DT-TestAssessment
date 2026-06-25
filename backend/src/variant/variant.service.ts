import { Injectable, Logger } from '@nestjs/common';
import { Variant } from './entities/variant.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVariantDto } from './dto/create-variant.dto';
import { Question } from 'src/question/entities/question.entity';

@Injectable()
export class VariantService {
  private logger = new Logger(VariantService.name);

  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  async create(
    createVariantDto: CreateVariantDto,
    question: Question,
    manager?: EntityManager,
  ): Promise<Variant> {
    const repository = manager
      ? manager.getRepository(Variant)
      : this.variantRepository;

    const variant = repository.create({
      text: createVariantDto.text,
      isCorrect: createVariantDto.isCorrect,
      question,
    });

    const saved = await repository.save(variant);
    this.logger.log(`Variant created: ${saved.id}`);
    return saved;
  }
}
