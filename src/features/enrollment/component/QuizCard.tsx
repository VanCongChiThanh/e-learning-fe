import React from "react";
import { UUID } from "crypto";
interface QuizCardProps {
  quiz: {
    id: UUID;
    title: string;
    description?: string;
    lectureId: UUID;
    maxAttempts?: number;
    passingScore?: number;
    timeLimitMinutes?: number;
    createdAt?: string;
    numberQuestions?: number;
    averageScore?: number;
  };
  userRole: "ADMIN" | "INSTRUCTOR" | "LEARNER";
  onEdit?: (quizId: UUID) => void;
  onDelete?: (quizId: UUID) => void;
  onTakeQuiz?: (quizId: UUID) => void;
  onViewStats?: (quizId: UUID) => void;
  onManageQuestions?: (quizId: UUID) => void;
  className?: string;
}
export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  userRole,
  onEdit,
  onDelete,
  onTakeQuiz,
  onViewStats,
  onManageQuestions,
  className = "",
}) => {
  // Determine quiz status for display
  const getQuizStatus = () => {
    if (quiz.numberQuestions === 0)
      return { text: "DRAFT", color: "bg-yellow-100 text-yellow-800" };
    return { text: "ACTIVE", color: "bg-green-100 text-green-800" };
  };

  const status = getQuizStatus();

  return (
    <div
      className={`bg-white border border-gray-200 hover:bg-gray-50 transition-colors ${className}`}
    >
      <div className="p-6">
        {/* Header with Icon */}
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-[#106c54] flex items-center justify-center text-white text-sm font-medium mr-4">
            Q{quiz.id.toString().slice(-2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {quiz.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium ${status.color}`}>
                {status.text}
              </span>
            </div>
            {quiz.description && (
              <p className="text-sm text-gray-500 truncate">
                {quiz.description.length > 50
                  ? quiz.description.substring(0, 50) + "..."
                  : quiz.description}
              </p>
            )}
          </div>
        </div>

        {/* Quiz Information Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Số câu hỏi:</span>
            <span className="ml-1 font-medium text-gray-900">
              {quiz.numberQuestions || 0}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Thời gian:</span>
            <span className="ml-1 font-medium text-gray-900">
              {quiz.timeLimitMinutes || 0} phút
            </span>
          </div>
          <div>
            <span className="text-gray-500">Điểm qua:</span>
            <span className="ml-1 font-medium text-gray-900">
              {quiz.passingScore || 0}%
            </span>
          </div>
          <div>
            <span className="text-gray-500">Lần làm:</span>
            <span className="ml-1 font-medium text-gray-900">
              {quiz.maxAttempts === -1
                ? "Không giới hạn"
                : quiz.maxAttempts || 1}
            </span>
          </div>
        </div>

        {/* Instructor Stats */}

        {/* Actions */}
        <div className="flex space-x-2 text-sm font-medium">
          {onTakeQuiz && (
            <button
              onClick={() => onTakeQuiz(quiz.id)}
              className="flex-1 bg-[#106c54] text-white px-4 py-2 hover:bg-[#0d5942] transition-colors"
            >
              Làm bài
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
