import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzesByLecture, QuizListItem } from '../api';

interface QuizTabProps {
  lectureId: string;
  enrollmentId: string | null | undefined;
}

const QuizTab: React.FC<QuizTabProps> = ({ lectureId, enrollmentId }) => {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!lectureId) return;

    const fetchQuizzes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getQuizzesByLecture(lectureId);
        setQuizzes(data);
      } catch (err) {
        setError("Không thể tải danh sách bài kiểm tra. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [lectureId]);

  const handleTakeQuiz = (quizId: string) => {
    if (enrollmentId) {
      navigate(`/learn/quiz/${quizId}/${enrollmentId}`);
    } else {
      alert("Không tìm thấy thông tin đăng ký khóa học để bắt đầu bài quiz.");
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Đang tải danh sách bài kiểm tra...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Danh sách bài kiểm tra trắc nghiệm</h2>
      {quizzes.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          Chưa có bài kiểm tra nào cho bài giảng này.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <li key={quiz.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl w-8 text-center"><i className="fas fa-question-circle text-blue-600"></i></span>
                    <div>
                      <p className="font-semibold text-gray-800">{quiz.title}</p>
                      <p className="text-sm text-gray-500">{quiz.numberQuestions} câu hỏi</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTakeQuiz(quiz.id)}
                    className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Làm bài
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizTab;