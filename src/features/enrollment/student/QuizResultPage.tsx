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

  const [submission, setSubmission] = useState<QuizSubmissionResponse | null>(
    null
  );
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
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (!submission || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy kết quả bài quiz.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5942]"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 quiz-result-page">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                submission.isPassed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {submission.isPassed ? (
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {submission.isPassed ? "Chúc mừng!" : "Chưa đạt"}
            </h1>

            <p className="text-lg text-gray-600 mb-4">
              {submission.isPassed
                ? "Bạn đã hoàn thành xuất sắc bài quiz này!"
                : "Bạn chưa đạt điểm qua. Hãy thử lại lần nữa!"}
            </p>

            <div className="text-4xl font-bold mb-2">
              <span
                className={
                  submission.isPassed ? "text-green-600" : "text-red-600"
                }
              >
                {submission.scorePercentage.toFixed(1)}%
              </span>
            </div>

            <p className="text-gray-600">
              {submission.totalScore}/{submission.maxPossibleScore} điểm
            </p>
          </div>
        </div>

        {/* Quiz Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Thông tin bài quiz
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tên bài quiz:</span>
                <span className="font-medium">{submission.quizTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số câu hỏi:</span>
                <span className="font-medium">{submission.answers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Điểm qua:</span>
                <span className="font-medium">{quiz.passingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lần thử:</span>
                <span className="font-medium">{submission.attemptNumber}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Kết quả chi tiết
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bắt đầu lúc:</span>
                <span className="font-medium">
                  {formatDateTime(submission.startedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hoàn thành lúc:</span>
                <span className="font-medium">
                  {formatDateTime(submission.submittedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian làm bài:</span>
                <span className="font-medium">
                  {formatTime(submission.timeTakenMinutes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Câu trả lời đúng:</span>
                <span className="font-medium text-green-600">
                  {submission.answers.filter((a) => a.isCorrect).length}/
                  {submission.answers.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Tiến độ hoàn thành
            </span>
            <span className="text-sm text-gray-500">
              {submission.scorePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                submission.isPassed ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${submission.scorePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0%</span>
            <span className="text-amber-600">
              {quiz.passingScore}% (Điểm qua)
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Detailed Results Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-gray-900">
              Xem chi tiết từng câu hỏi
            </h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                showDetailedResults ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDetailedResults && (
            <div className="mt-6 space-y-4">
              {submission.answers.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`border rounded-lg p-4 ${
                    answer.isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      Câu {index + 1}
                    </h4>
                    <div
                      className={`flex items-center space-x-2 ${
                        answer.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {answer.isCorrect ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      <span className="text-sm font-medium">
                        {answer.pointsEarned}/{answer.maxPoints} điểm
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-800 mb-3">{answer.questionText}</p>

                  <div className="space-y-2">
                    {answer.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded ${
                          optionIndex === answer.correctAnswerIndex
                            ? "bg-green-100 border border-green-300"
                            : optionIndex === answer.selectedAnswerIndex &&
                              !answer.isCorrect
                            ? "bg-red-100 border border-red-300"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span className="text-sm">{option}</span>
                          {optionIndex === answer.correctAnswerIndex && (
                            <span className="ml-auto text-green-600 text-xs font-medium">
                              Đáp án đúng
                            </span>
                          )}
                          {optionIndex === answer.selectedAnswerIndex &&
                            optionIndex !== answer.correctAnswerIndex && (
                              <span className="ml-auto text-red-600 text-xs font-medium">
                                Bạn đã chọn
                              </span>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(`/learn/enrollment/${enrollmentId}`)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
          >
            Quay về khóa học
          </button>

          {!submission.isPassed &&
            quiz.maxAttempts &&
            submission.attemptNumber < quiz.maxAttempts && (
              <button
                onClick={() =>
                  navigate(`/learn/quiz/${quizId}/${enrollmentId}`)
                }
                className="px-6 py-3 bg-[#106c54] text-white rounded-lg font-medium hover:bg-[#0d5942] transition-colors duration-200"
              >
                Làm lại bài quiz
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
