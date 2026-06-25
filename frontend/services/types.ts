export type QuestionType = "boolean" | "input" | "checkbox";

export interface Variant {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id?: string;
  title: string;
  type: QuestionType;
  answer?: string | null;
  variants?: Variant[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface QuizCreatePayload {
  title: string;
  questions: Question[];
}
