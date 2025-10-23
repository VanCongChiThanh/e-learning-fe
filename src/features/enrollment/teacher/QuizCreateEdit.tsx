import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { createQuiz, updateQuiz, getQuizById } from '../api/quiz';
import { toast } from 'react-toastify';

interface QuizFormData {
  title: string;
  description: string;
  lectureId: string;
  maxAttempts: number;
  passingScore: number;
  timeLimitMinutes: number;
  numberQuestions: number;
}

const QuizCreateEdit: React.FC = () => {
  const { courseId, quizId, lectureId } = useParams<{ courseId: string; quizId?: string; lectureId?: string }>();
  const navigate = useNavigate();
  const isEdit = !!quizId;
  
  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    lectureId: lectureId || '', // Use lectureId from URL params
    maxAttempts: 3,
    passingScore: 70,
    timeLimitMinutes: 30,
    numberQuestions: 10
  });
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Initialize form data with lectureId from URL for new quiz
  useEffect(() => {
    if (!isEdit && lectureId) {
      setFormData(prev => ({
        ...prev,
        lectureId: lectureId
      }));
    }
  }, [isEdit, lectureId]);

  useEffect(() => {
    // Load quiz data if editing
    if (isEdit && quizId) {
      const loadQuiz = async () => {
        setLoading(true);
        try {
          const quiz = await getQuizById(quizId as UUID);
          setFormData({
            title: quiz.title,
            description: quiz.description || '',
            lectureId: quiz.lectureId,
            maxAttempts: quiz.maxAttempts || 3,
            passingScore: quiz.passingScore || 70,
            timeLimitMinutes: quiz.timeLimitMinutes || 30,
            numberQuestions: quiz.numberQuestions || 10
          });
        } catch (error) {
          console.error('Error loading quiz:', error);
          toast.error('Không thể tải thông tin quiz');
        } finally {
          setLoading(false);
        }
      };

      loadQuiz();
    }
  }, [isEdit, quizId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Don't allow lectureId to be changed for new quizzes
    if (name === 'lectureId' && !isEdit) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'title' || name === 'description' || name === 'lectureId' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      if (isEdit && quizId) {
        await updateQuiz(quizId as UUID, formData);
        toast.success('Cập nhật quiz thành công!');
      } else {
        await createQuiz({
          ...formData,
          lectureId: formData.lectureId as UUID
        });
        toast.success('Tạo quiz thành công!');
      }
      navigate(`/teacher/course/${courseId}/quizzes`)
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Có lỗi xảy ra khi lưu quiz');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/teacher/course/${courseId}/quiz-management`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/teacher/course/${courseId}/quiz-management`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách quiz
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Chỉnh sửa Quiz' : 'Tạo Quiz Mới'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Cập nhật thông tin quiz' : 'Tạo một bài quiz mới cho khóa học'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề Quiz *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tiêu đề quiz"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mô tả quiz (tùy chọn)"
              />
            </div>

            {/* Selected Lecture Display (for new quiz) */}
            {!isEdit && lectureId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bài giảng được chọn
                </label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  ID: {lectureId}
                  <span className="text-xs text-gray-500 ml-2">(Được chọn từ danh sách)</span>
                </div>
              </div>
            )}

            {/* Quiz Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700 mb-2">
                  Số lần thử tối đa *
                </label>
                <input
                  type="number"
                  id="maxAttempts"
                  name="maxAttempts"
                  value={formData.maxAttempts}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm qua (%) *
                </label>
                <input
                  type="number"
                  id="passingScore"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="timeLimitMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian (phút) *
                </label>
                <input
                  type="number"
                  id="timeLimitMinutes"
                  name="timeLimitMinutes"
                  value={formData.timeLimitMinutes}
                  onChange={handleInputChange}
                  min="1"
                  max="180"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="numberQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                  Số câu hỏi *
                </label>
                <input
                  type="number"
                  id="numberQuestions"
                  name="numberQuestions"
                  value={formData.numberQuestions}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saveLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveLoading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo Quiz')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreateEdit;