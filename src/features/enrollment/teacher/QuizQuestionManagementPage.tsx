import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { getQuizQuestionsByQuizId, createBulkQuizQuestions, updateQuizQuestion, deleteQuizQuestion, QuizQuestionAnswerResponse } from '../api/quizQA';
import { getQuizById, QuizResponse } from '../api/quiz';
import { toast } from 'react-toastify';

const QuizQuestionManagementPage: React.FC = () => {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<QuizQuestionAnswerResponse[]>([]);
  const [quizInfo, setQuizInfo] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestionAnswerResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [bulkFormData, setBulkFormData] = useState<{
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    points: number;
    sortOrder: number;
  }[]>([]);

  // Initialize bulk form data when number of questions changes
  useEffect(() => {
    if (isBulkMode) {
      const newBulkData = Array.from({ length: numberOfQuestions }, (_, index) => ({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        points: 1,
        sortOrder: questions.length + index + 1,
      }));
      setBulkFormData(newBulkData);
    }
  }, [numberOfQuestions, isBulkMode, questions.length]);
  const [singleFormData, setSingleFormData] = useState<{
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
      // Update quizId in single form data when quizId changes
      setSingleFormData(prev => ({
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
    setSingleFormData({
      questionText: '',
      options: ['', '', '', ''], // Reset to 4 empty options
      correctAnswerIndex: 0,
      points: 1,
      sortOrder: questions.length + 1,
      quizId: quizId || '',
    });
    setBulkFormData([]);
    setEditingQuestion(null);
    setIsFormOpen(false);
    setIsBulkMode(false);
    setNumberOfQuestions(1);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...singleFormData.options];
    newOptions[index] = value;
    setSingleFormData({ ...singleFormData, options: newOptions });
  };

  const updateBulkQuestion = (questionIndex: number, field: string, value: any) => {
    const newBulkData = [...bulkFormData];
    newBulkData[questionIndex] = {
      ...newBulkData[questionIndex],
      [field]: value
    };
    setBulkFormData(newBulkData);
  };

  const updateBulkOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newBulkData = [...bulkFormData];
    const newOptions = [...newBulkData[questionIndex].options];
    newOptions[optionIndex] = value;
    newBulkData[questionIndex] = {
      ...newBulkData[questionIndex],
      options: newOptions
    };
    setBulkFormData(newBulkData);
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleFormData.questionText.trim()) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return;
    }
    
    try {
      // Create bulk data structure for single question
      const bulkData = [{
        questionText: singleFormData.questionText,
        options: singleFormData.options,
        correctAnswerIndex: singleFormData.correctAnswerIndex,
        points: singleFormData.points,
        sortOrder: singleFormData.sortOrder,
        quizId: quizId as UUID
      }
      ];
      
      console.log('Creating question with data:', bulkData);
      await createBulkQuizQuestions(quizId as UUID, bulkData);
      resetForm();
      fetchQuestions();
      toast.success('Tạo câu hỏi thành công!');
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Có lỗi xảy ra khi tạo câu hỏi');
    }
  };

  const handleCreateBulkQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all questions
    for (let i = 0; i < bulkFormData.length; i++) {
      if (!bulkFormData[i].questionText.trim()) {
        toast.error(`Vui lòng nhập nội dung cho câu hỏi ${i + 1}`);
        return;
      }
      // Check if at least one option is filled
      const hasOptions = bulkFormData[i].options.some(option => option.trim() !== '');
      if (!hasOptions) {
        toast.error(`Vui lòng nhập ít nhất một đáp án cho câu hỏi ${i + 1}`);
        return;
      }
    }
    
    try {
      const bulkData = bulkFormData.map(question => ({
        questionText: question.questionText,
        options: question.options,
        correctAnswerIndex: question.correctAnswerIndex,
        points: question.points,
        sortOrder: question.sortOrder,
        quizId: quizId as UUID
      }));
      
      console.log('Creating bulk questions with data:', bulkData);
      await createBulkQuizQuestions(quizId as UUID, bulkData);
      resetForm();
      fetchQuestions();
      toast.success(`Tạo thành công ${bulkFormData.length} câu hỏi!`);
    } catch (error) {
      console.error('Error creating bulk questions:', error);
       toast.error('Có lỗi xảy ra khi tạo câu hỏi');
    }
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !singleFormData.questionText.trim()) return;
    
    try {
      const questionData = {
        questionText: singleFormData.questionText,
        options: singleFormData.options,
        correctAnswer: singleFormData.correctAnswerIndex.toString(), // Convert index to string for API
      };
      
      await updateQuizQuestion(editingQuestion.id as UUID, questionData);
      resetForm();
      fetchQuestions();
      toast.success('Cập nhật câu hỏi thành công!');
    } catch (error) {
      console.error('Error updating question:', error);
       toast.error('Có lỗi xảy ra khi cập nhật câu hỏi');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (! window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    
    try {
      await deleteQuizQuestion(questionId as UUID);
      fetchQuestions();
      toast.success('Xóa câu hỏi thành công!');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Có lỗi xảy ra khi xóa câu hỏi');
    }
  };

  const handleEditQuestion = (question: QuizQuestionAnswerResponse) => {
    setEditingQuestion(question);
    setSingleFormData({
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
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                resetForm();
                setIsBulkMode(false);
                setIsFormOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm 1 câu hỏi
            </button>
            
            <button
              onClick={() => {
                resetForm();
                setIsBulkMode(true);
                setNumberOfQuestions(3);
                setIsFormOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Tạo nhiều câu hỏi
            </button>
          </div>
        </div>

        {/* Question Form */}
        {isFormOpen && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
            {!isBulkMode ? (
              /* Single Question Form */
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nội dung câu hỏi *
                      </label>
                      <textarea
                        value={singleFormData.questionText}
                        onChange={(e) => setSingleFormData({ ...singleFormData, questionText: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        rows={3}
                        placeholder="Nhập nội dung câu hỏi..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Các đáp án
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['A', 'B', 'C', 'D'].map((letter, index) => (
                          <div key={letter} className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Đáp án {letter}
                            </label>
                            <input
                              type="text"
                              value={singleFormData.options[index] || ''}
                              onChange={(e) => updateOption(index, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder={`Nhập đáp án ${letter}...`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Đáp án đúng *
                        </label>
                        <select
                          value={singleFormData.correctAnswerIndex}
                          onChange={(e) => setSingleFormData({ ...singleFormData, correctAnswerIndex: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value={0}>A</option>
                          <option value={1}>B</option>
                          <option value={2}>C</option>
                          <option value={3}>D</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Điểm số
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={singleFormData.points}
                          onChange={(e) => setSingleFormData({ ...singleFormData, points: parseInt(e.target.value) || 1 })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg hover:shadow-xl"
                      >
                        {editingQuestion ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              /* Bulk Questions Form */
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </div>
                    Tạo nhiều câu hỏi cùng lúc
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Number of Questions Selector */}
                <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Số lượng câu hỏi muốn tạo
                  </label>
                  <div className="flex items-center space-x-4">
                    <select
                      value={numberOfQuestions}
                      onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} câu hỏi</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">
                      Bạn đang tạo <strong className="text-green-600">{numberOfQuestions}</strong> câu hỏi
                    </span>
                  </div>
                </div>

                <form onSubmit={handleCreateBulkQuestions}>
                  <div className="space-y-8">
                    {bulkFormData.map((question, questionIndex) => (
                      <div key={questionIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            {questionIndex + 1}
                          </span>
                          Câu hỏi {questionIndex + 1}
                        </h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nội dung câu hỏi *
                            </label>
                            <textarea
                              value={question.questionText}
                              onChange={(e) => updateBulkQuestion(questionIndex, 'questionText', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                              rows={2}
                              placeholder={`Nhập nội dung câu hỏi ${questionIndex + 1}...`}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['A', 'B', 'C', 'D'].map((letter, optionIndex) => (
                              <div key={letter}>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                  Đáp án {letter}
                                </label>
                                <input
                                  type="text"
                                  value={question.options[optionIndex] || ''}
                                  onChange={(e) => updateBulkOption(questionIndex, optionIndex, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                                  placeholder={`Đáp án ${letter}...`}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đáp án đúng *
                              </label>
                              <select
                                value={question.correctAnswerIndex}
                                onChange={(e) => updateBulkQuestion(questionIndex, 'correctAnswerIndex', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                                required
                              >
                                <option value={0}>A</option>
                                <option value={1}>B</option>
                                <option value={2}>C</option>
                                <option value={3}>D</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Điểm số
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={question.points}
                                onChange={(e) => updateBulkQuestion(questionIndex, 'points', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-lg hover:shadow-xl flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Tạo {numberOfQuestions} câu hỏi
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
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