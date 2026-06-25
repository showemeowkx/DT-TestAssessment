import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import type { Question, QuestionType, Variant } from "../services/types";

export default function QuizCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { type: "input", title: "", answer: "" },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { type: "input", title: "", answer: "" }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-setup required fields when type changes to match your backend DTOs exactly
    if (field === "type") {
      if (value === "checkbox") {
        updated[index].variants = [
          { text: "Option 1", isCorrect: false },
          { text: "Option 2", isCorrect: false },
        ];
        delete updated[index].answer;
      } else if (value === "boolean") {
        // BACKEND FIX: Boolean requires exactly two variants, one true, one false
        updated[index].variants = [
          { text: "True", isCorrect: true }, // Default to True being correct
          { text: "False", isCorrect: false },
        ];
        delete updated[index].answer;
      } else if (value === "input") {
        delete updated[index].variants;
        updated[index].answer = "";
      }
    }

    setQuestions(updated);
  };

  // Dedicated handler for Boolean radio buttons
  const setBooleanAnswer = (qIndex: number, isTrueCorrect: boolean) => {
    const updated = [...questions];
    updated[qIndex].variants = [
      { text: "True", isCorrect: isTrueCorrect },
      { text: "False", isCorrect: !isTrueCorrect },
    ];
    setQuestions(updated);
  };

  // --- Variant Handlers for Checkboxes ---
  const addVariant = (qIndex: number) => {
    const updated = [...questions];
    const vars = updated[qIndex].variants || [];
    updated[qIndex].variants = [
      ...vars,
      { text: `Option ${vars.length + 1}`, isCorrect: false },
    ];
    setQuestions(updated);
  };

  const updateVariant = (
    qIndex: number,
    vIndex: number,
    field: keyof Variant,
    value: any,
  ) => {
    const updated = [...questions];
    if (updated[qIndex].variants) {
      updated[qIndex].variants![vIndex] = {
        ...updated[qIndex].variants![vIndex],
        [field]: value,
      };
    }
    setQuestions(updated);
  };

  const removeVariant = (qIndex: number, vIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].variants) {
      updated[qIndex].variants = updated[qIndex].variants!.filter(
        (_, i) => i !== vIndex,
      );
    }
    setQuestions(updated);
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Quiz title is required");
    if (questions.length === 0) return setError("Add at least one question");

    const hasShortTitles = questions.some(
      (q) => !q.title || q.title.length < 3,
    );
    if (hasShortTitles)
      return setError("All questions must be at least 3 characters long");

    try {
      setLoading(true);
      await api.createQuiz({ title, questions });
      navigate("/quizzes");
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to create quiz. Check the console for backend validation errors.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link
        to="/quizzes"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; Cancel and go back
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Create a New Quiz
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Javascript Basics"
            className="w-full border-gray-300 border p-3 rounded-md"
          />
        </div>

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative"
            >
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={q.title}
                    onChange={(e) =>
                      updateQuestion(qIndex, "title", e.target.value)
                    }
                    placeholder="Enter your question here..."
                    className="w-full border-gray-300 border p-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(
                        qIndex,
                        "type",
                        e.target.value as QuestionType,
                      )
                    }
                    className="w-full border-gray-300 border p-2 rounded-md bg-white"
                  >
                    <option value="input">Short Answer (Text)</option>
                    <option value="boolean">True / False</option>
                    <option value="checkbox">Multiple Choice</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pl-4 border-l-2 border-gray-100 bg-gray-50 p-4 rounded-r-md">
                {q.type === "input" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={q.answer || ""}
                      onChange={(e) =>
                        updateQuestion(qIndex, "answer", e.target.value)
                      }
                      placeholder="Exact text answer..."
                      className="w-full border-gray-300 border p-2 rounded-md"
                    />
                  </div>
                )}

                {q.type === "boolean" && q.variants && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`bool-${qIndex}`} // Groups the radio buttons per question
                          checked={q.variants[0]?.isCorrect === true}
                          onChange={() => setBooleanAnswer(qIndex, true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>True</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`bool-${qIndex}`}
                          checked={q.variants[1]?.isCorrect === true}
                          onChange={() => setBooleanAnswer(qIndex, false)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>False</span>
                      </label>
                    </div>
                  </div>
                )}

                {q.type === "checkbox" && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 flex justify-between">
                      <span>Answer Options</span>
                      <span className="text-xs text-gray-500 font-normal">
                        Check the correct ones
                      </span>
                    </p>
                    {q.variants?.map((variant, vIndex) => (
                      <div key={vIndex} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={variant.isCorrect}
                          onChange={(e) =>
                            updateVariant(
                              qIndex,
                              vIndex,
                              "isCorrect",
                              e.target.checked,
                            )
                          }
                          className="w-5 h-5 text-green-600 rounded cursor-pointer"
                          title="Mark as correct answer"
                        />
                        <input
                          type="text"
                          value={variant.text}
                          onChange={(e) =>
                            updateVariant(
                              qIndex,
                              vIndex,
                              "text",
                              e.target.value,
                            )
                          }
                          placeholder="Option text"
                          className="flex-1 border-gray-300 border p-2 rounded-md text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariant(qIndex, vIndex)}
                          className="text-gray-400 hover:text-red-500 px-2 text-lg font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addVariant(qIndex)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
                    >
                      + Add Option
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 font-medium transition"
          >
            + Add Another Question
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
