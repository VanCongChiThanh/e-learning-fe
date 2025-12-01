import React, { useState, useEffect } from 'react';
import { getQuizDetail, getQuestionsForQuiz, submitQuizAnswers, QuizDetail, QuizQuestion } from '../api';

interface QuizTabProps {
  quizId: string;
}

const QuizTab: React.FC<QuizTabProps> = ({ quizId }) => {
  // State quản lý toàn bộ component
  const [quizState, setQuizState] = useState<'loading' | 'taking' | 'submitting' | 'results'>('loading');
  
  // State lưu dữ liệu từ API
  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  // State cho quá trình làm bài
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // { questionId: selectedOptionId }
  
  // State cho kết quả
  const [score, setScore] = useState<number | null>(null);

  // Fetch dữ liệu quiz và câu hỏi khi component được mount
  useEffect(() => {
    const fetchQuizData = async () => {
      setQuizState('loading');
      try {
        const [detail, questionsData] = await Promise.all([
          getQuizDetail(quizId),
          getQuestionsForQuiz(quizId)
        ]);
        setQuizDetail(detail);
        setQuestions(questionsData.sort((a, b) => a.sortOrder - b.sortOrder));
        setQuizState('taking');
      } catch (error) {
        console.error("Không thể tải bài kiểm tra", error);
        // Có thể thêm state để hiển thị lỗi
      }
    };
    fetchQuizData();
  }, [quizId]);

  // Hàm xử lý khi người dùng chọn một đáp án
  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Hàm xử lý khi nhấn nút Nộp bài
  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length !== questions.length) {
      if (!window.confirm("Bạn chưa trả lời hết các câu hỏi. Bạn có chắc muốn nộp bài?")) {
        return;
      }
    }
    setQuizState('submitting');
    const formattedAnswers = Object.entries(userAnswers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId,
    }));
    try {
      const result = await submitQuizAnswers(quizId, formattedAnswers);
      setScore(result.score);
      setQuizState('results');
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      setQuizState('taking'); // Quay lại trạng thái làm bài nếu có lỗi
    }
  };

  if (quizState === 'loading') {
    return <div className="text-center p-12">Đang tải bài kiểm tra...</div>;
  }
  
  if (!quizDetail || questions.length === 0) {
    return <div className="text-center p-12">Không tìm thấy bài kiểm tra.</div>;
  }

  // Giao diện hiển thị kết quả
  if (quizState === 'results') {
    const isPassed = score !== null && score >= quizDetail.passingScore;
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Kết quả bài kiểm tra</h2>
        <p className={`text-5xl font-bold mb-6 ${isPassed ? 'text-green-500' : 'text-red-500'}`}>{score} / 100</p>
        <p className="text-xl mb-8">{isPassed ? '🎉 Chúc mừng! Bạn đã vượt qua.' : ' Rất tiếc, bạn chưa đạt.'}</p>
        <button onClick={() => setQuizState('loading')} className="px-6 py-2 bg-[#106c54] text-white rounded font-semibold hover:bg-[#0d5a45]">Làm lại</button>
      </div>
    );
  }

  // Giao diện làm bài
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6 pb-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">{quizDetail.title}</h1>
          <p className="text-gray-500">{quizDetail.description}</p>
          <div className="text-sm text-gray-600 mt-2">
            <span>Thời gian: {quizDetail.timeLimitMinutes} phút</span>
            <span className="mx-2">•</span>
            <span>Số câu hỏi: {questions.length}</span>
          </div>
        </div>

        {/* Nội dung câu hỏi */}
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">Câu {currentQuestionIndex + 1} / {questions.length}</p>
          <h3 className="text-lg font-semibold mb-6">{currentQuestion.questionText}</h3>
          
          {/* Các lựa chọn */}
          <div className="space-y-4">
            {currentQuestion.options.map(option => (
              <label 
                key={option.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all 
                           ${userAnswers[currentQuestion.id] === option.id ? 'bg-green-100 border-green-400 ring-2 ring-green-300' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={userAnswers[currentQuestion.id] === option.id}
                  onChange={() => handleSelectOption(currentQuestion.id, option.id)}
                  className="w-5 h-5"
                />
                <span className="ml-4 text-gray-700">{option.optionText}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Thanh điều hướng và nút Nộp bài */}
        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-semibold disabled:opacity-50"
          >
            Trước
          </button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <button 
              onClick={handleSubmit} 
              disabled={quizState === 'submitting'}
              className="px-8 py-3 bg-green-500 text-white rounded font-bold hover:bg-green-600 disabled:bg-green-300"
            >
              {quizState === 'submitting' ? 'Đang nộp...' : 'Nộp bài'}
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-6 py-2 bg-[#106c54] text-white rounded font-semibold disabled:opacity-50 hover:bg-[#0d5a45]"
            >
              Tiếp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;