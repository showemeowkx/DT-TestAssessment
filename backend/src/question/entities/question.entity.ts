import { Quiz } from 'src/quiz/entities/quiz.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionTypeEnum } from '../questionType.enum';
import { Variant } from 'src/variant/entities/variant.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: QuestionTypeEnum })
  type: QuestionTypeEnum;

  @Column({ type: 'varchar', nullable: true })
  answer: string | null;

  @Column()
  quizId: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @OneToMany(() => Variant, (variant) => variant.question, { cascade: true })
  variants: Variant[];
}
