import React, { useState, useEffect } from 'react';
import { UUID } from 'crypto';
import { getQuizQuestionsByQuizId, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion } from '../api/quizQA';

interface QuizQuestionManagerProps {
  quizId: UUID;
  isOpen: boolean;
  onClose: () => void;
}

export const QuizQuestionManager: React.FC<QuizQuestionManagerProps> = ({
  quizId,
  isOpen,
  onClose,
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<{
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    points: number | null;
    sortOrder: number | null;
  }>({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '', 
    points: null,
    sortOrder: null,
  });

  useEffect(() => {
    if (isOpen && quizId) {
      fetchQuestions();
    }
  }, [isOpen, quizId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuizQuestionsByQuizId(quizId);
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionText.trim() || !formData.correctAnswer.trim()) return;
    
    try {
      const questionData: any = {
        questionText: formData.questionText,
        optionA: formData.optionA,
        optionB: formData.optionB,
        optionC: formData.optionC,
        optionD: formData.optionD,
        correctAnswer: formData.correctAnswer,
      };
      
      if (formData.points !== null) questionData.points = formData.points;
      if (formData.sortOrder !== null) questionData.sortOrder = formData.sortOrder;
      
      await createQuizQuestion(quizId, questionData);
      
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
      const questionData: any = {
        questionText: formData.questionText,
        optionA: formData.optionA,
        optionB: formData.optionB,
        optionC: formData.optionC,
        optionD: formData.optionD,
        correctAnswer: formData.correctAnswer,
      };
      
      if (formData.points !== null) questionData.points = formData.points;
      if (formData.sortOrder !== null) questionData.sortOrder = formData.sortOrder;
      
      await updateQuizQuestion(editingQuestion.id, questionData);
      
      resetForm();
      setEditingQuestion(null);
      fetchQuestions();
      alert('Cập nhật câu hỏi thành công!');
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Có lỗi xảy ra khi cập nhật câu hỏi');
    }
  };

  const handleDeleteQuestion = async (questionId: UUID) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    
    try {
      await deleteQuizQuestion(questionId);
      fetchQuestions();
      alert('Xóa câu hỏi thành công!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Có lỗi xảy ra khi xóa câu hỏi');
    }
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      optionA: question.optionA || '',
      optionB: question.optionB || '',
      optionC: question.optionC || '',
      optionD: question.optionD || '',
      correctAnswer: question.correctAnswer,
      points: question.points,
      sortOrder: question.sortOrder,
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      points: null,
      sortOrder: null,
    });
    setIsFormOpen(false);
    setEditingQuestion(null);
  };



  if (!isOpen) return null;
  console.log(questions)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Quản lý Câu hỏi Quiz</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Questions List */}
          <div className="w-1/2 p-6 border-r overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Danh sách câu hỏi</h4>
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(true);
                }}
                className="bg-[#106c54] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#0d5942]"
              >
                Thêm câu hỏi
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#106c54] mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">Câu {index + 1}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="text-amber-600 hover:text-amber-700 text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-900 mb-2">{question.questionText}</p>
                    <div className="space-y-1">
                      {[
                        { key: 'A', value: question.optionA },
                        { key: 'B', value: question.optionB },
                        { key: 'C', value: question.optionC },
                        { key: 'D', value: question.optionD },
                      ].map((option) => (
                        option.value && (
                          <div
                            key={option.key}
                            className={`text-sm p-2 rounded ${
                              option.key === question.correctAnswer
                                ? 'bg-green-100 text-green-800 font-medium'
                                : 'bg-white text-gray-600'
                            }`}
                          >
                            {option.key}. {option.value}
                          </div>
                        )
                      ))}
                    </div>
                    {(question.points || question.sortOrder) && (
                      <div className="mt-2 text-xs text-gray-500">
                        {question.points && <span>Điểm: {question.points}</span>}
                        {question.points && question.sortOrder && <span> • </span>}
                        {question.sortOrder && <span>Thứ tự: {question.sortOrder}</span>}
                      </div>
                    )}
                  </div>
                ))}
                {questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có câu hỏi nào
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Question Form */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {isFormOpen ? (
              <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Câu hỏi *
                    </label>
                    <textarea
                      value={formData.questionText}
                      onChange={(e) => setFormData(prev => ({ ...prev, questionText: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Nhập câu hỏi..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Các lựa chọn
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500 w-6">A.</span>
                      <input
                        type="text"
                        value={formData.optionA}
                        onChange={(e) => setFormData(prev => ({ ...prev, optionA: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                        placeholder="Lựa chọn A"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500 w-6">B.</span>
                      <input
                        type="text"
                        value={formData.optionB}
                        onChange={(e) => setFormData(prev => ({ ...prev, optionB: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                        placeholder="Lựa chọn B"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500 w-6">C.</span>
                      <input
                        type="text"
                        value={formData.optionC}
                        onChange={(e) => setFormData(prev => ({ ...prev, optionC: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                        placeholder="Lựa chọn C"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500 w-6">D.</span>
                      <input
                        type="text"
                        value={formData.optionD}
                        onChange={(e) => setFormData(prev => ({ ...prev, optionD: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                        placeholder="Lựa chọn D"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đáp án đúng *
                    </label>
                    <select
                      value={formData.correctAnswer}
                      onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                      required
                    >
                      <option value="">Chọn đáp án đúng</option>
                      {formData.optionA.trim() && (
                        <option value="A">A. {formData.optionA}</option>
                      )}
                      {formData.optionB.trim() && (
                        <option value="B">B. {formData.optionB}</option>
                      )}
                      {formData.optionC.trim() && (
                        <option value="C">C. {formData.optionC}</option>
                      )}
                      {formData.optionD.trim() && (
                        <option value="D">D. {formData.optionD}</option>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm số
                      </label>
                      <input
                        type="number"
                        value={formData.points || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value ? Number(e.target.value) : null }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                        placeholder="Điểm số"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thứ tự
                      </label>
                      <input
                        type="number"
                        value={formData.sortOrder || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: e.target.value ? Number(e.target.value) : null }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                        placeholder="Thứ tự"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5942] transition-colors duration-200"
                  >
                    {editingQuestion ? 'Cập nhật' : 'Thêm câu hỏi'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Chọn "Thêm câu hỏi" để tạo câu hỏi mới
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};