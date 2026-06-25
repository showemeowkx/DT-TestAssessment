import { Injectable, Logger } from '@nestjs/common';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class VariantService {
  private logger = new Logger(VariantService.name);

  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  async create(createVariantDto: CreateVariantDto): Promise<void> {
    const variant = await this.variantRepository.save(createVariantDto);
    this.logger.log(`Variant created: ${variant.id}`);
  }
}
