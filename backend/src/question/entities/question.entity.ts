import { Quiz } from 'src/quiz/entities/quiz.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionTypeEnum } from '../questionType.enum';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: QuestionTypeEnum })
  type: QuestionTypeEnum;

  @Column()
  quizId: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;
}
