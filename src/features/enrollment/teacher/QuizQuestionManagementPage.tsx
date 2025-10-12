import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { getQuizQuestionsByQuizId, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion, QuizQuestionAnswerResponse } from '../api/quizQA';
import { getQuizById, QuizResponse } from '../api/quiz';

const QuizQuestionManagementPage: React.FC = () => {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<QuizQuestionAnswerResponse[]>([]);
  const [quizInfo, setQuizInfo] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestionAnswerResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<{
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    points: number;
    sortOrder: number;
    quizId: string;
  }>({
    questionText: '',
    options: ['', '', '', ''], // Array of 4 options
    correctAnswerIndex: 0,
    points: 1,
    sortOrder: 1,
    quizId: quizId || '',
  });

  useEffect(() => {
    if (quizId) {
      fetchQuizInfo();
      fetchQuestions();
      // Update quizId in form data when quizId changes
      setFormData(prev => ({
        ...prev,
        quizId: quizId
      }));
    }
  }, [quizId]);

  const fetchQuizInfo = async () => {
    try {
      const data = await getQuizById(quizId as UUID);
      setQuizInfo(data);
    } catch (error) {
      console.error('Error fetching quiz info:', error);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuizQuestionsByQuizId(quizId as UUID);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      options: ['', '', '', ''], // Reset to 4 empty options
      correctAnswerIndex: 0,
      points: 1,
      sortOrder: questions.length + 1,
      quizId: quizId || '',
    });
    setEditingQuestion(null);
    setIsFormOpen(false);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionText.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi');
      return;
    }
    
    try {
      console.log('Creating question with data:', formData);
      await createQuizQuestion(quizId as UUID, formData);
      resetForm();
      fetchQuestions();
      alert('Tạo câu hỏi thành công!');
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Có lỗi xảy ra khi tạo câu hỏi');
    }
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !formData.questionText.trim()) return;
    
    try {
      const questionData = {
        questionText: formData.questionText,
        options: formData.options,
        correctAnswer: formData.correctAnswerIndex.toString(), // Convert index to string for API
      };
      
      await updateQuizQuestion(editingQuestion.id as UUID, questionData);
      resetForm();
      fetchQuestions();
      alert('Cập nhật câu hỏi thành công!');
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Có lỗi xảy ra khi cập nhật câu hỏi');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (! window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    
    try {
      await deleteQuizQuestion(questionId as UUID);
      fetchQuestions();
      alert('Xóa câu hỏi thành công!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Có lỗi xảy ra khi xóa câu hỏi');
    }
  };

  const handleEditQuestion = (question: QuizQuestionAnswerResponse) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: [...question.options], // Create a copy of the options array
      correctAnswerIndex: question.correctAnswerIndex,
      points: question.points,
      sortOrder: question.sortOrder,
      quizId: quizId || '',
    });
    setIsFormOpen(true);
  };

  const handleBackToQuizManagement = () => {
    navigate(`/teacher/course/${courseId}/quizzes`);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToQuizManagement}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại quản lý quiz
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý câu hỏi Quiz
          </h1>
          {quizInfo && (
            <p className="text-gray-600 mt-2">
              {quizInfo.title} - {questions.length} câu hỏi
            </p>
          )}
        </div>

        {/* Quiz Info */}
        {quizInfo && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin Quiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-500">Thời gian:</span>
                <p className="font-medium">{quizInfo.timeLimitMinutes || 'Không giới hạn'} {quizInfo.timeLimitMinutes ? 'phút' : ''}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Số lần làm:</span>
                <p className="font-medium">{quizInfo.maxAttempts || 'Không giới hạn'} {quizInfo.maxAttempts ? 'lần' : ''}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Điểm qua:</span>
                <p className="font-medium">{quizInfo.passingScore || 0}%</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Số câu hỏi:</span>
                <p className="font-medium">{questions.length} câu</p>
              </div>
            </div>
            {quizInfo.description && (
              <div className="mt-4">
                <span className="text-sm text-gray-500">Mô tả:</span>
                <p className="text-gray-900">{quizInfo.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Add Question Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm câu hỏi mới
          </button>
        </div>

        {/* Question Form */}
        {isFormOpen && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
            </h3>
            <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung câu hỏi *
                  </label>
                  <textarea
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án A</label>
                    <input
                      type="text"
                      value={formData.options[0] || ''}
                      onChange={(e) => updateOption(0, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án B</label>
                    <input
                      type="text"
                      value={formData.options[1] || ''}
                      onChange={(e) => updateOption(1, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án C</label>
                    <input
                      type="text"
                      value={formData.options[2] || ''}
                      onChange={(e) => updateOption(2, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án D</label>
                    <input
                      type="text"
                      value={formData.options[3] || ''}
                      onChange={(e) => updateOption(3, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án đúng *</label>
                    <select
                      value={formData.correctAnswerIndex}
                      onChange={(e) => setFormData({ ...formData, correctAnswerIndex: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value={0}>A</option>
                      <option value={1}>B</option>
                      <option value={2}>C</option>
                      <option value={3}>D</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingQuestion ? 'Cập nhật' : 'Thêm câu hỏi'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Questions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách câu hỏi ({questions.length})
            </h2>
          </div>
          
          {questions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {questions.map((question, index) => (
                <div key={question.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Câu {index + 1}: {question.questionText}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className={`p-2 rounded ${question.correctAnswerIndex === 0 ? 'bg-green-100 border-green-300' : 'bg-gray-50'} border`}>
                      <span className="font-medium">A:</span> {question.options[0] || ''}
                    </div>
                    <div className={`p-2 rounded ${question.correctAnswerIndex === 1 ? 'bg-green-100 border-green-300' : 'bg-gray-50'} border`}>
                      <span className="font-medium">B:</span> {question.options[1] || ''}
                    </div>
                    <div className={`p-2 rounded ${question.correctAnswerIndex === 2 ? 'bg-green-100 border-green-300' : 'bg-gray-50'} border`}>
                      <span className="font-medium">C:</span> {question.options[2] || ''}
                    </div>
                    <div className={`p-2 rounded ${question.correctAnswerIndex === 3 ? 'bg-green-100 border-green-300' : 'bg-gray-50'} border`}>
                      <span className="font-medium">D:</span> {question.options[3] || ''}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Đáp án đúng: <strong>{['A', 'B', 'C', 'D'][question.correctAnswerIndex]}</strong></span>
                    <span>Điểm: <strong>{question.points}</strong></span>
                    <span>Thứ tự: <strong>{question.sortOrder}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có câu hỏi nào</h3>
              <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm câu hỏi đầu tiên cho quiz này.</p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm câu hỏi đầu tiên
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionManagementPage;