import React from "react";
import { UUID } from "../utils/UUID";
import { QuizCard } from "../component/QuizCard";

interface QuizManagementContentProps {
  courseId: string;
  lectures: any[];
  quizzes: any[];
  quizzesLoading: boolean;
  onEditQuiz: (quizId: UUID) => void;
  onDeleteQuiz: (quizId: UUID) => void;
  onViewStats: (quizId: UUID) => void;
  onManageQuestions: (quizId: UUID) => void;
  onCreateQuiz: () => void;
  selectedLectureTitle?: string;
}

const QuizManagementContent: React.FC<QuizManagementContentProps> = ({
  courseId,
  lectures,
  quizzes,
  quizzesLoading,
  onEditQuiz,
  onDeleteQuiz,
  onViewStats,
  onManageQuestions,
  onCreateQuiz,
  selectedLectureTitle,
}) => {
  return (
    <div className="space-y-8">
      {/* Quiz List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-slate-50 to-gray-100 px-6 py-5 border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <i className="fas fa-list-alt text-green-800"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Danh sách Quiz
                </h2>
                {selectedLectureTitle && (
                  <p className="text-sm text-gray-600 font-medium">
                    <i className="fas fa-play-circle mr-1"></i>
                    {selectedLectureTitle}
                  </p>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
              {quizzes.length} quiz
            </div>
          </div>
        </div>

        <div className="p-6">
          {quizzes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={{
                    ...quiz,
                    averageScore: 0,
                  }}
                  userRole="INSTRUCTOR"
                  onEdit={() => onEditQuiz(quiz.id)}
                  onDelete={() => onDeleteQuiz(quiz.id)}
                  onViewStats={() => onViewStats(quiz.id)}
                  onManageQuestions={() => onManageQuestions(quiz.id)}
                  className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-sm mx-auto">
                <div className="bg-gradient-to-r from-indigo-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-clipboard-question text-3xl text-green-800"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Chưa có Quiz nào
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Tạo quiz đầu tiên để kiểm tra hiểu biết của học viên về bài
                  giảng{" "}
                  <span className="font-semibold text-green-800">
                    {selectedLectureTitle}
                  </span>
                </p>
                <button
                  onClick={onCreateQuiz}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Tạo Quiz Đầu Tiên
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizManagementContent;
