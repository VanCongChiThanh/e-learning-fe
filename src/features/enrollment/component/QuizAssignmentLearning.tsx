import React, { useState } from 'react';
import { UUID } from 'crypto';

interface QuizTakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: {
    id: UUID;
    title: string;
    description?: string;
  };
  questions: Array<{
    id: UUID;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
  }>;
  onSubmit: (answers: Record<UUID, string>) => void;
}

export const QuizTakeModal: React.FC<QuizTakeModalProps> = ({
  isOpen,
  onClose,
  quiz,
  questions,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<Record<UUID, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (questionId: UUID, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
    setAnswers({});
    setCurrentQuestion(0);
    onClose();
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!isOpen) return null;
  console.log("Rendering QuizTakeModal with questions:", questions);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#106c54] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Câu {currentQuestion + 1} / {questions.length}</span>
            <span>{Math.round(progress)}% hoàn thành</span>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {questions.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {questions[currentQuestion].questionText}
              </h4>
              
              <div className="space-y-3">
                {questions[currentQuestion] && (
                  <div className="space-y-3">
                    {["A", "B", "C", "D"].map((label, index) => {
                      const optionKey = `option${label}` as keyof typeof questions[number];
                      const optionValue = questions[currentQuestion][optionKey];

                      return (
                        optionValue && (
                          <label
                            key={index}
                            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`question-${questions[currentQuestion].id}`}
                              value={label} // giá trị là "A", "B", "C", "D"
                              checked={answers[questions[currentQuestion].id] === label}
                              onChange={() =>
                                handleAnswerChange(questions[currentQuestion].id, label)
                              }
                              className="text-[#106c54] focus:ring-[#106c54] mr-3"
                            />
                            <span className="text-gray-700">{optionValue}</span>
                          </label>
                        )
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Câu trước
            </button>
            
            <div className="flex gap-2">
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5942]"
                >
                  Câu tiếp
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Nộp bài
                </button>
              )}
            </div>
          </div>
          
          {/* Question indicators */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-[#106c54] text-white'
                    : answers[questions[index].id]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AssignmentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: {
    id: UUID;
    title: string;
    description?: string;
    dueDate?: string;
  };
  onSubmit: (data: { content: string }) => void;
  existingSubmission?: {
    content: string;
    submittedAt?: string;
  };
}

export const AssignmentSubmissionModal: React.FC<AssignmentSubmissionModalProps> = ({
  isOpen,
  onClose,
  assignment,
  onSubmit,
  existingSubmission,
}) => {
  const [content, setContent] = useState(existingSubmission?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit({ content: content.trim() });
    setContent('');
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {assignment.description && (
            <p className="text-gray-600 mt-2">{assignment.description}</p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>Hạn nộp: {formatDate(assignment.dueDate)}</span>
            {existingSubmission?.submittedAt && (
              <span>Đã nộp: {formatDate(existingSubmission.submittedAt)}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(90vh-200px)]">
          <div className="flex-1 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài làm *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent resize-none"
              placeholder="Nhập nội dung bài làm của bạn..."
              required
            />
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5942] transition-colors duration-200"
              >
                {existingSubmission ? 'Cập nhật bài nộp' : 'Nộp bài'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};