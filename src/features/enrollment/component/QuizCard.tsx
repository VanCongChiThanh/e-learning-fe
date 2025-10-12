import React from 'react';
import { UUID } from 'crypto';
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
  userRole: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
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
  console.log("Rendering QuizCard for quiz:", quiz);
  return (
    <div className={`bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
            {quiz.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{quiz.description}</p>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="w-10 h-10 rounded-lg bg-[#106c54] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quiz Settings Info for Students */}
        {userRole === 'LEARNER' && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">Thời gian</p>
                <p className="text-sm font-medium text-gray-900">{quiz.timeLimitMinutes || 0} phút</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Điểm qua</p>
                <p className="text-sm font-medium text-gray-900">{quiz.passingScore || 0}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Lần làm</p>
                <p className="text-sm font-medium text-gray-900">{quiz.maxAttempts || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {(userRole === 'ADMIN' || userRole === 'INSTRUCTOR') && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[#106c54]">{quiz.numberQuestions || 0}</p>
              <p className="text-xs text-gray-500">Câu hỏi</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-600">{quiz.averageScore || 0}%</p>
              <p className="text-xs text-gray-500">Điểm TB</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{quiz.passingScore || 0}%</p>
              <p className="text-xs text-gray-500">Điểm qua</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {userRole === 'LEARNER' && onTakeQuiz && (
            <button
              onClick={() => onTakeQuiz(quiz.id)}
              className="flex-1 bg-[#106c54] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0d5942] transition-colors duration-200"
            >
              Làm bài
            </button>
          )}
          
          {(userRole === 'ADMIN' || userRole === 'INSTRUCTOR') && (
            <>
              {onManageQuestions && (
                <button
                  onClick={() => onManageQuestions(quiz.id)}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Câu hỏi
                </button>
              )}
              {onViewStats && (
                <button
                  onClick={() => onViewStats(quiz.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Thống kê
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(quiz.id)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors duration-200"
                >
                  Sửa
                </button>
              )}
              {onDelete && userRole === 'ADMIN' && (
                <button
                  onClick={() => onDelete(quiz.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Xóa
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};