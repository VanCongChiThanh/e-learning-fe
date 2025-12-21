import React, { useState } from "react";
import { UUID } from "../../enrollment/utils/UUID";
import { useCreateQuizWithQuestions } from "../../enrollment/hook/useQuizOperations";
import {
  QuizCreateRequest,
  QuizQuestionCreateRequest,
} from "../../enrollment/type";
import { toast } from "react-toastify";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizCreated: () => void; // Callback sau khi tạo quiz thành công
  lectureTitle: string;
  courseId: string;
  lectureId: UUID;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  onQuizCreated,
  lectureTitle,
  courseId,
  lectureId,
}) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("30");
  const [passingScore, setPassingScore] = useState("70");
  const [attempts, setAttempts] = useState("1");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      points: 1,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createQuizMutation = useCreateQuizWithQuestions();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      points: 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate
    if (!quizTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề quiz");
      return;
    }

    const validQuestions = questions.filter(
      (q) =>
        q.question.trim() !== "" && q.options.some((opt) => opt.trim() !== "")
    );

    if (validQuestions.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 câu hỏi hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare API request
      const quizData: QuizCreateRequest = {
        lectureId,
        title: quizTitle,
        description: description || "",
        timeLimitMinutes: parseInt(timeLimit) || 30,
        passingScore: parseInt(passingScore),
        maxAttempts: parseInt(attempts),
        isActive: true,
        questions: validQuestions.map(
          (q, index): QuizQuestionCreateRequest => ({
            questionText: q.question,
            options: q.options.filter((opt) => opt.trim() !== ""),
            correctAnswerIndex: q.correctAnswer,
            points: q.points,
            sortOrder: index + 1,
          })
        ),
      };

      await createQuizMutation.mutate(quizData);

      // Reset form
      setQuizTitle("");
      setDescription("");
      setTimeLimit("30");
      setPassingScore("70");
      setAttempts("1");
      setQuestions([
        {
          id: "1",
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          points: 1,
        },
      ]);
      setCurrentStep(1);

      onQuizCreated(); // Callback to refresh quiz list
      onClose();
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-[#106c54] text-white px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <i className="fas fa-graduation-cap text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Tạo Quiz Mới</h3>
                  <p className="text-green-100 text-sm">
                    Bài giảng: {lectureTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all duration-200"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === 1
                      ? "bg-white text-green-800"
                      : "bg-white bg-opacity-20 text-white"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Thông tin cơ bản</span>
              </div>
              <div className="w-8 h-0.5 bg-white bg-opacity-30"></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === 2
                      ? "bg-white text-green-800"
                      : "bg-white bg-opacity-20 text-white"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Câu hỏi</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 px-6 py-6 max-h-96 overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <i className="fas fa-info-circle text-green-800 mr-2"></i>
                      Thông tin Quiz
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiêu đề Quiz *
                        </label>
                        <input
                          type="text"
                          value={quizTitle}
                          onChange={(e) => setQuizTitle(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all duration-200"
                          placeholder="Nhập tiêu đề quiz..."
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả (tùy chọn)
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all duration-200"
                          placeholder="Mô tả ngắn về quiz này..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thời gian làm bài (phút)
                        </label>
                        <input
                          type="number"
                          value={timeLimit}
                          onChange={(e) => setTimeLimit(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all duration-200"
                          placeholder="30"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Điểm tối thiểu để qua (%)
                        </label>
                        <input
                          type="number"
                          value={passingScore}
                          onChange={(e) => setPassingScore(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all duration-200"
                          placeholder="70"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lần làm tối đa
                        </label>
                        <select
                          value={attempts}
                          onChange={(e) => setAttempts(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all duration-200"
                        >
                          <option value="1">1 lần</option>
                          <option value="2">2 lần</option>
                          <option value="3">3 lần</option>
                          <option value="-1">Không giới hạn</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <i className="fas fa-question-circle text-green-600 mr-2"></i>
                      Câu hỏi ({questions.length})
                    </h4>
                    <div className="text-sm text-gray-600">
                      Tổng điểm:{" "}
                      <span className="font-semibold text-green-600">
                        {totalPoints}
                      </span>
                    </div>
                  </div>

                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-gray-900 flex items-center">
                          <span className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                            {index + 1}
                          </span>
                          Câu hỏi {index + 1}
                        </h5>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">
                              Điểm:
                            </label>
                            <input
                              type="number"
                              value={question.points}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "points",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-800"
                              min="1"
                            />
                          </div>
                          {questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <i className="fas fa-trash text-sm"></i>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung câu hỏi *
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "question",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
                            placeholder="Nhập câu hỏi..."
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Các lựa chọn *
                          </label>
                          <div className="space-y-3">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center space-x-3"
                              >
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={
                                    question.correctAnswer === optionIndex
                                  }
                                  onChange={() =>
                                    updateQuestion(
                                      question.id,
                                      "correctAnswer",
                                      optionIndex
                                    )
                                  }
                                  className="w-4 h-4 text-green-600 focus:ring-green-800"
                                />
                                <div className="flex-1 relative">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                      updateOption(
                                        question.id,
                                        optionIndex,
                                        e.target.value
                                      )
                                    }
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
                                    placeholder={`Lựa chọn ${String.fromCharCode(
                                      65 + optionIndex
                                    )}`}
                                    required
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giải thích (tùy chọn)
                          </label>
                          <textarea
                            value={question.explanation}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "explanation",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
                            placeholder="Giải thích cho đáp án đúng..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:border-green-400 hover:bg-green-80 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-plus"></i>
                    <span>Thêm câu hỏi</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Quay lại</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>

            <div>
              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!quizTitle.trim()}
                  className="px-8 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Tiếp tục</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !quizTitle.trim() ||
                    questions.some((q) => !q.question.trim())
                  }
                  className="px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i>
                      <span>Tạo Quiz</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizModal;
