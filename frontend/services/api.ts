import type { Quiz, QuizCreatePayload } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = {
  getQuizzes: async (): Promise<Quiz[]> => {
    const res = await fetch(`${API_BASE}/quizzes`);
    if (!res.ok) throw new Error("Failed to fetch quizzes");
    return res.json();
  },

  getQuiz: async (id: string): Promise<Quiz> => {
    const res = await fetch(`${API_BASE}/quizzes/${id}`);
    if (!res.ok) throw new Error("Failed to fetch quiz details");
    return res.json();
  },

  createQuiz: async (payload: QuizCreatePayload): Promise<Quiz> => {
    const res = await fetch(`${API_BASE}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
  },

  deleteQuiz: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/quizzes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete quiz");
  },
};
