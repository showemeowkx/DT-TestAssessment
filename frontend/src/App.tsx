import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuizListPage from "../pages/QuizListPage";
import QuizDetailPage from "../pages/QuizDetailsPage";
import QuizCreatePage from "../pages/QuizCreatePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/quizzes" replace />} />

          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/create" element={<QuizCreatePage />} />
          <Route path="/quizzes/:id" element={<QuizDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
