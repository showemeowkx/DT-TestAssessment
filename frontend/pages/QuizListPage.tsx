import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Quiz } from "../services/types";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError("Could not load quizzes. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await api.deleteQuiz(id);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    } catch (err) {
      alert("Failed to delete the quiz.");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading quizzes...</div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Quizzes</h1>
        <Link
          to="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Create New
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No quizzes found. Create one!
        </p>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              to={`/quizzes/${quiz.id}`}
              className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition group flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {quiz.title}
                </h2>
              </div>

              <button
                onClick={(e) => handleDelete(e, quiz.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition"
                title="Delete Quiz"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
