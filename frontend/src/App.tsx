import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuizDetailPage from "../pages/QuizDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/quizzes" replace />} />
          <Route path="/quizzes/:id" element={<QuizDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
