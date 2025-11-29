import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UUID } from "crypto";
import {
  getQuizSubmissionById,
  QuizSubmissionResponse,
} from "../api/quizAttempt";
import { getQuizById, QuizResponse } from "../api/quiz";

const QuizResultPage: React.FC = () => {
  const { quizId, enrollmentId, submissionId } = useParams<{
    quizId: string;
    enrollmentId: string;
    submissionId: string;
  }>();
  const navigate = useNavigate();

  // State để điều khiển popup
  const [showResultPopup, setShowResultPopup] = useState(true);
  const [submission, setSubmission] = useState<QuizSubmissionResponse | null>(null);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      try {
        if (!submissionId || !quizId) return;

        const [submissionData, quizData] = await Promise.all([
          getQuizSubmissionById(submissionId as UUID),
          getQuizById(quizId as UUID),
        ]);

        setSubmission(submissionData);
        setQuiz(quizData);
      } catch (error) {
        console.error("Error loading quiz results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [submissionId, quizId]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} phút`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const closeResultPopup = () => {
    setShowResultPopup(false);
    navigate(`/learn/enrollment/${enrollmentId}`);
  };

  const retakeQuiz = () => {
    setShowResultPopup(false);
    navigate(`/learn/quiz/${quizId}/${enrollmentId}`);
  };

  // Render toàn bộ nội dung trong popup
  const renderResultContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải kết quả...</p>
          </div>
        </div>
      );
    }

    if (!submission || !quiz) {
      return (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.26-5.374-3.138" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Không tìm thấy kết quả</h3>
          <p className="text-gray-600 mb-6">Không tìm thấy kết quả bài quiz.</p>
          <button
            onClick={closeResultPopup}
            className="px-6 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5942] transition-colors duration-200"
          >
            Quay lại
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className={`${submission.isPassed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {submission.isPassed ? "🎉 Chúc mừng!" : "😔 Chưa đạt"}
            </h1>
            <button
              onClick={closeResultPopup}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {submission.scorePercentage.toFixed(1)}%
            </div>
            <p className="text-lg opacity-90">
              {submission.totalScore}/{submission.maxPossibleScore} điểm - {submission.isPassed ? "Đã qua bài quiz!" : "Chưa đạt điểm qua"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${submission.scorePercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm opacity-90">
              <span>0%</span>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                Điểm qua: {quiz.passingScore}%
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Thông tin bài quiz</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-700">Tên bài quiz:</span>
                  <span className="font-medium text-right text-sm max-w-48 truncate">{submission.quizTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Số câu hỏi:</span>
                  <span className="font-medium">{submission.answers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Điểm qua:</span>
                  <span className="font-medium">{quiz.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Lần thử:</span>
                  <span className="font-medium">{submission.attemptNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-4">Kết quả chi tiết</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-700">Bắt đầu lúc:</span>
                  <span className="font-medium text-right text-sm">{formatDateTime(submission.startedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Hoàn thành lúc:</span>
                  <span className="font-medium text-right text-sm">{formatDateTime(submission.submittedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Thời gian:</span>
                  <span className="font-medium">{formatTime(submission.timeTakenMinutes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Câu đúng:</span>
                  <span className="font-medium text-green-600">
                    {submission.answers.filter((a) => a.isCorrect).length}/{submission.answers.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results Toggle */}
          <div className="bg-white border rounded-lg shadow-sm mb-6">
            <button
              onClick={() => setShowDetailedResults(!showDetailedResults)}
              className="flex items-center justify-between w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <h3 className="font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15" />
                </svg>
                Xem chi tiết từng câu hỏi
              </h3>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${showDetailedResults ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDetailedResults && (
              <div className="p-6 pt-0 max-h-64 overflow-auto">
                <div className="space-y-4">
                  {submission.answers.map((answer, index) => (
                    <div
                      key={answer.questionId}
                      className={`border rounded-lg p-4 ${
                        answer.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Câu {index + 1}</h4>
                        <div className={`flex items-center space-x-2 ${answer.isCorrect ? "text-green-600" : "text-red-600"}`}>
                          {answer.isCorrect ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className="text-xs font-medium">{answer.pointsEarned}/{answer.maxPoints}</span>
                        </div>
                      </div>

                      <p className="text-gray-800 mb-3 text-sm">{answer.questionText}</p>

                      <div className="space-y-1">
                        {answer.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${
                              optionIndex === answer.correctAnswerIndex
                                ? "bg-green-100 border border-green-300"
                                : optionIndex === answer.selectedAnswerIndex && !answer.isCorrect
                                ? "bg-red-100 border border-red-300"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="text-xs font-medium mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className="text-xs flex-1">{option}</span>
                              {optionIndex === answer.correctAnswerIndex && (
                                <span className="text-green-600 text-xs font-medium">✓</span>
                              )}
                              {optionIndex === answer.selectedAnswerIndex && optionIndex !== answer.correctAnswerIndex && (
                                <span className="text-red-600 text-xs font-medium">✗</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={closeResultPopup}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
            >
              Quay về khóa học
            </button>

            {!submission.isPassed && quiz.maxAttempts && submission.attemptNumber < quiz.maxAttempts && (
              <button
                onClick={retakeQuiz}
                className="flex-1 px-4 py-3 bg-[#106c54] text-white rounded-lg font-medium hover:bg-[#0d5942] transition-colors duration-200"
              >
                Làm lại bài quiz
              </button>
            )}

            {submission.isPassed && (
              <button
                onClick={closeResultPopup}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Tiếp tục học
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main component return
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Main Result Popup */}
      {showResultPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
            {renderResultContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResultPage;