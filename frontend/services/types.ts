export type QuestionType = "boolean" | "input" | "checkbox";

export interface Question {
  id?: string;
  type: QuestionType;
  text: string;
  options?: string[];
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
