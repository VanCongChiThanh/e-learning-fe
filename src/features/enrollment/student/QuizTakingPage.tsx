import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { getQuizById, QuizResponse } from '../api/quiz';
import { getQuizQuestionsByQuizId, QuizQuestionAnswerResponse } from '../api/quizQA';
import { submitQuiz, QuizSubmissionRequest, canUserAttemptQuiz, getLatestAttempt } from '../api/quizAttempt';
import SubmitConfirmationModal from '../component/SubmitConfirmationModal';
import './QuizTaking.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { toast } from 'react-toastify';

const QuizTakingPage: React.FC = () => {
  const { quizId, enrollmentId } = useParams<{ quizId: string; enrollmentId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionAnswerResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [canAttempt, setCanAttempt] = useState<boolean>(true);
  const [attemptError, setAttemptError] = useState<string>('');

  const { user } = useSelector((state: RootState) => state.auth as { user: { id: UUID } | null });
  const userId = user?.id;
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        if (!quizId || !userId) return;
        
        const [quizData, questionsData, canAttemptResult] = await Promise.all([
          getQuizById(quizId as UUID),
          getQuizQuestionsByQuizId(quizId as UUID),
          canUserAttemptQuiz(quizId as UUID, userId as UUID)
        ]);
        
        setQuiz(quizData);
        setQuestions(questionsData);
        setTimeRemaining((quizData.timeLimitMinutes || 60) * 60); // Convert to seconds
        setCanAttempt(canAttemptResult);
        
        if (!canAttemptResult) {
          // Get latest attempt to show attempt count
          const latestAttempt = await getLatestAttempt(quizId as UUID, userId as UUID);
          if (latestAttempt) {
            setAttemptError(`Bạn đã hết lượt làm bài. Số lần thử: ${latestAttempt.attemptNumber}/${quizData.maxAttempts}`);
          } else {
            setAttemptError('Bạn không thể làm bài quiz này.');
          }
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        setAttemptError('Có lỗi xảy ra khi tải bài quiz.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [quizId, userId]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setShowSubmitModal(false);
    try {
      if (!userId || !quiz || !enrollmentId) return;

      // Prepare submission data
      const answers = questions.map((question, index) => ({
        questionId: question.id,
        selectedAnswerIndex: selectedAnswers[index] ?? -1 // -1 means no answer selected
      }));

      const submissionData: QuizSubmissionRequest = {
        quizId: quiz.id,
        userId: userId as UUID,
        enrollmentId: enrollmentId as UUID,
        answers: answers
      };

      // Submit quiz
      const result = await submitQuiz(submissionData);

      // Navigate to results page with submission ID
      navigate(`/learn/quiz/${quiz.id}/${enrollmentId}/result/${result.id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(new Date());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy bài quiz hoặc câu hỏi.</p>
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

  // Check if user can attempt quiz
  if (!canAttempt || attemptError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Không thể làm bài quiz</h2>
            <p className="text-gray-600 mb-6">{attemptError}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Quay lại
              </button>
              {quiz.maxAttempts && (
                <p className="text-sm text-gray-500">
                  Số lần thử tối đa: {quiz.maxAttempts}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz introduction screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-gray-600 text-lg mb-6">{quiz.description}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Thông tin bài quiz</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Số câu hỏi:</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Thời gian:</span>
                    <span className="font-medium">{quiz.timeLimitMinutes} phút</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Điểm qua:</span>
                    <span className="font-medium">{quiz.passingScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Số lần làm tối đa:</span>
                    <span className="font-medium">{quiz.maxAttempts}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-6">
                <h3 className="font-semibold text-amber-900 mb-4">Lưu ý quan trọng</h3>
                <ul className="space-y-2 text-amber-800">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Đọc kỹ từng câu hỏi trước khi trả lời
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Thời gian sẽ tự động kết thúc khi hết giờ
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Bạn có thể xem lại và thay đổi câu trả lời
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Nhấn "Nộp bài" khi hoàn thành
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startQuiz}
                className="px-8 py-3 bg-[#106c54] text-white text-lg font-semibold rounded-lg hover:bg-[#0d5942] transition-colors duration-200 shadow-lg"
              >
                Bắt đầu làm bài
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 quiz-taking-page">
      {/* Header with timer and progress */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
              <div className="hidden md:block">
                <div className="bg-gray-200 rounded-full h-2 w-64">
                  <div 
                    className="bg-[#106c54] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Câu {currentQuestionIndex + 1} / {questions.length}
              </div>
              <div className={`px-3 py-1 rounded-lg font-medium ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700 timer-warning' : 'bg-blue-100 text-blue-700'
              }`}>
                ⏰ {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question navigation sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Danh sách câu hỏi</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 question-nav-item ${
                      index === currentQuestionIndex
                        ? 'bg-[#106c54] text-white current'
                        : selectedAnswers[index]
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#106c54] rounded mr-2"></div>
                    Đang làm
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                    Đã trả lời
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                    Chưa trả lời
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main question area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 question-card">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Câu {currentQuestionIndex + 1}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {currentQuestion.options.length} lựa chọn
                  </span>
                </div>
                <p className="text-gray-800 text-lg leading-relaxed">
                  {currentQuestion.questionText}
                </p>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 option-card ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-[#106c54] bg-green-50 selected'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={index}
                        checked={selectedAnswers[currentQuestionIndex] === index}
                        onChange={() => handleSelectAnswer(index)}
                        className="w-4 h-4 text-[#106c54] focus:ring-[#106c54] focus:ring-2"
                      />
                      <span className="ml-3 text-gray-800">{String.fromCharCode(65 + index)}. {option}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ← Câu trước
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitClick}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    currentQuestionIndex === questions.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#106c54] text-white hover:bg-[#0d5942]'
                  }`}
                >
                  Câu tiếp →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmitQuiz}
        answeredCount={Object.keys(selectedAnswers).length}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
      />
    </div>
  );
};

export default QuizTakingPage;