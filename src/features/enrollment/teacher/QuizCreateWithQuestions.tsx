import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UUID } from "crypto";
import { QuizCreateRequest } from "../api/quiz";
import { useCreateQuizWithQuestions } from "../hook/useQuizOperations";
import { toast } from "react-toastify";

interface QuizFormData {
  title: string;
  description: string;
  lectureId: string;
  maxAttempts: number;
  passingScore: number;
  timeLimitMinutes: number;
  isActive: boolean;
}

interface QuestionFormData {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
  sortOrder: number;
}

const QuizCreateWithQuestions: React.FC = () => {
  const { courseId, lectureId } = useParams<{
    courseId: string;
    lectureId?: string;
  }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<QuizFormData>({
    title: "",
    description: "",
    lectureId: lectureId || "",
    maxAttempts: 3,
    passingScore: 70,
    timeLimitMinutes: 30,
    isActive: true,
  });

  const [questions, setQuestions] = useState<QuestionFormData[]>([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
      points: 10,
      sortOrder: 1,
    },
  ]);
  const createQuizMutation = useCreateQuizWithQuestions();
  useEffect(() => {
    if (lectureId) {
      setFormData((prev) => ({
        ...prev,
        lectureId: lectureId,
      }));
    }
  }, [lectureId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "title" || name === "description" || name === "lectureId"
          ? value
          : Number(value),
    }));
  };

  const handleQuestionChange = (
    index: number,
    field: keyof QuestionFormData,
    value: any
  ) => {
    const newQuestions = [...questions];
    if (field === "options") {
      newQuestions[index][field] = value;
    } else {
      (newQuestions[index] as any)[field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    const newQuestion: QuestionFormData = {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
      points: 10,
      sortOrder: questions.length + 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      // Update sort orders
      newQuestions.forEach((q, i) => {
        q.sortOrder = i + 1;
      });
      setQuestions(newQuestions);
    }
  };

  const validateForm = (): boolean => {
    // Chỉ kiểm tra lectureId vì cần thiết cho request
    if (!formData.lectureId) {
      toast.error("Vui lòng chọn bài giảng");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const requestData: QuizCreateRequest = {
        lectureId: formData.lectureId as UUID,
        title: formData.title,
        description: formData.description,
        timeLimitMinutes: formData.timeLimitMinutes,
        passingScore: formData.passingScore,
        maxAttempts: formData.maxAttempts,
        isActive: formData.isActive,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          points: q.points,
          sortOrder: q.sortOrder,
        })),
      };

      createQuizMutation.mutate(requestData);
      toast.success("Tạo quiz thành công!");
      navigate(`/teacher/course/${courseId}/quizzes`);
    } catch (error: any) {
      console.error("Error creating quiz with questions:", error);
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData?.message) {
          toast.error(errorData.message);
        } else if (typeof errorData === "string") {
          toast.error(errorData);
        } else {
          toast.error("Có lỗi xảy ra khi tạo quiz");
        }
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra khi tạo quiz");
      }
    }
  };

  const handleCancel = () => {
    navigate(`/teacher/course/${courseId}/quiz-management`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() =>
              navigate(`/teacher/course/${courseId}/quiz-management`)
            }
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại danh sách quiz
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Tạo Quiz Mới</h1>
          <p className="text-gray-600 mt-2">
            Tạo quiz với đầy đủ câu hỏi trong một bước
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Thông tin Quiz
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tiêu đề Quiz *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tiêu đề quiz"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mô tả *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả chi tiết cho quiz"
                  required
                />
              </div>

              {/* Selected Lecture Display */}
              {lectureId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bài giảng được chọn
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                    ID: {lectureId}
                    <span className="text-xs text-gray-500 ml-2">
                      (Được chọn từ danh sách)
                    </span>
                  </div>
                </div>
              )}

              {/* Quiz Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="maxAttempts"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="passingScore"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timeLimitMinutes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Kích hoạt quiz
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Câu hỏi ({questions.length})
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Thêm câu hỏi
              </button>
            </div>

            <div className="space-y-8">
              {questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Câu hỏi {questionIndex + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung câu hỏi *
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "questionText",
                          e.target.value
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập nội dung câu hỏi"
                    />
                  </div>

                  {/* Options */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            name={`correct-${questionIndex}`}
                            checked={
                              question.correctAnswerIndex === optionIndex
                            }
                            onChange={() =>
                              handleQuestionChange(
                                questionIndex,
                                "correctAnswerIndex",
                                optionIndex
                              )
                            }
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Lựa chọn ${optionIndex + 1}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Chọn radio button để đánh dấu đáp án đúng
                    </p>
                  </div>

                  {/* Points */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm số *
                      </label>
                      {/* <input
                        type="number"
                        value={question.points}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "points",
                            Number(e.target.value)
                          )
                        }
                        // min="1"
                        // max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      /> */}
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "points",
                            // Nếu input rỗng, gửi "", nếu không, gửi giá trị số
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thứ tự
                      </label>
                      {/* <input
                        type="number"
                        value={question.sortOrder}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "sortOrder",
                            Number(e.target.value)
                          )
                        }
                        // min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        // readOnly
                      /> */}
                      <input
                        type="number"
                        value={question.sortOrder}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "sortOrder",
                            // Nếu input rỗng, gửi "", nếu không, gửi giá trị số
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createQuizMutation.isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {createQuizMutation.isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Tạo Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreateWithQuestions;
