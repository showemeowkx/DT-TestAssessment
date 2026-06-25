import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import type { Quiz } from "../services/types";

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await api.getQuiz(id);
        setQuiz(data);
      } catch (err) {
        setError("Failed to load quiz details.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading quiz...</div>;
  if (error || !quiz)
    return (
      <div className="p-8 text-center text-red-500">
        {error || "Quiz not found"}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link
        to="/quizzes"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; Back to Quizzes
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">{quiz.title}</h1>

      <div className="space-y-6">
        {quiz.questions.map((q, index) => (
          <div
            key={q.id || index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                <span className="text-gray-400 mr-2">{index + 1}.</span>{" "}
                {q.text}
              </h3>
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded uppercase tracking-wider">
                {q.type}
              </span>
            </div>

            <div className="mt-4 pl-6 border-l-2 border-gray-100 pointer-events-none opacity-60">
              {q.type === "boolean" && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      readOnly
                      checked={false}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">True</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      readOnly
                      checked={false}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">False</span>
                  </label>
                </div>
              )}

              {q.type === "input" && (
                <input
                  type="text"
                  readOnly
                  placeholder="Short answer text..."
                  className="w-full border-gray-300 border p-2 rounded-md bg-gray-50"
                />
              )}

              {q.type === "checkbox" && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        readOnly
                        checked={false}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
