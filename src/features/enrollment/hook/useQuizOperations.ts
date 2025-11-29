import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import {
  QuizResponse,
  QuizCreateRequest,
  QuizQuestionAnswerResponse,
  QuizSubmissionRequest,
} from "../type";
import { UUID } from "../utils/UUID";
import {
  createQuizWithQuestions,
  getQuizById,
  getAllQuizzesByLectureId,
  updateQuiz,
  deleteQuiz,
} from "../api/quiz";
import {
  getQuizQuestionsByQuizId as getQuizQuestions,
  getQuizQuestionById,
  updateQuizQuestion,
  deleteQuizQuestion,
} from "../api/quizQA";
import { submitQuiz } from "../api/quizAttempt";

// Helper function để xử lý Toast và lỗi trong Mutation
const handleMutationError = (error: any, action: string) => {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
  toast.error(`Failed to ${action}: ${errorMessage}`);
  return error; // Trả về lỗi để hàm gọi có thể bắt (catch)
};

// ===================================================
//                 MUTATION HOOKS (Sử dụng useState)
// ===================================================

/**
 * Hook thay thế useMutation cho việc tạo Quiz
 */
export const useCreateQuizWithQuestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: QuizCreateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createQuizWithQuestions(data);
      toast.success("Quiz created successfully!");
      return response;
    } catch (err) {
      setError(err as Error);
      throw handleMutationError(err, "create quiz");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
};

/**
 * Hook thay thế useUpdateQuiz
 * Lưu ý: Khi dùng cách này, bạn phải tự gọi hàm fetch data để làm mới dữ liệu sau khi update thành công.
 */
export const useUpdateQuiz = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async ({ id, data }: { id: string; data: Partial<QuizResponse> }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await updateQuiz(id as UUID, data);
        toast.success("Quiz updated successfully!");
        // *** Tự làm mới dữ liệu: Bạn phải gọi lại hàm fetch data trong component sau khi gọi mutate thành công ***
        return response;
      } catch (err) {
        setError(err as Error);
        throw handleMutationError(err, "update quiz");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { mutate, isLoading, error };
};

/**
 * Hook thay thế useDeleteQuiz
 */
export const useDeleteQuiz = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteQuiz(id as UUID);
      toast.success("Quiz deleted successfully!");
      // *** Tự làm mới dữ liệu: Bạn phải gọi lại hàm fetch data trong component sau khi gọi mutate thành công ***
    } catch (err) {
      setError(err as Error);
      throw handleMutationError(err, "delete quiz");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
};

// ... Các hook mutation khác (useUpdateQuizQuestion, useDeleteQuizQuestion, useSubmitQuiz) sẽ làm tương tự ...

export const useSubmitQuiz = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: QuizSubmissionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await submitQuiz(data);
      toast.success(`Quiz submitted! Score: ${response.scorePercentage}%`);
      // *** Tự làm mới dữ liệu: Bạn phải gọi lại hàm fetch data để cập nhật tiến trình người dùng ***
      return response;
    } catch (err) {
      setError(err as Error);
      throw handleMutationError(err, "submit quiz");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
};

// ===================================================
//                 QUERY HOOKS (Sử dụng useEffect)
// ===================================================

const useDataFetcher = <T>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  dependency: string | undefined
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!dependency) {
      setData(undefined);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err as Error);
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Dependency array chứa dependency để re-fetch khi ID thay đổi
  }, [dependency, ...queryKey]); // Thêm queryKey để tạo sự phụ thuộc nếu cần re-fetch thủ công

  // Hàm thủ công để re-fetch (thay thế queryClient.invalidateQueries)
  const refetch = useCallback(() => {
    if (dependency) {
      // Bằng cách thay đổi key này, chúng ta buộc useEffect chạy lại
      setData((prev) => (prev === undefined ? undefined : undefined)); // Ép state thay đổi để trigger useEffect
      // Cách khác: sử dụng một state riêng biệt cho refetch
    }
  }, [dependency]);

  return { data, isLoading, error, refetch };
};

/**
 * Hook thay thế useQuizById
 */
export const useQuizById = (quizId: string | undefined) => {
  return useDataFetcher<QuizResponse>(
    ["quiz"],
    () => getQuizById(quizId! as UUID),
    quizId
  );
};

/**
 * Hook thay thế useQuizzesByLecture
 */
export const useQuizzesByLecture = (lectureId: string | undefined) => {
  return useDataFetcher<QuizResponse[]>(
    ["quizzes", "lecture"],
    () => getAllQuizzesByLectureId(lectureId! as UUID),
    lectureId
  );
};

/**
 * Hook thay thế useQuizQuestions
 */
export const useQuizQuestions = (quizId: string | undefined) => {
  return useDataFetcher<QuizQuestionAnswerResponse[]>(
    ["quizQuestions"],
    () => getQuizQuestions(quizId! as UUID),
    quizId
  );
};

/**
 * Hook thay thế useQuizQuestion
 */
export const useQuizQuestion = (questionId: string | undefined) => {
  return useDataFetcher<QuizQuestionAnswerResponse>(
    ["quizQuestion"],
    () => getQuizQuestionById(questionId! as UUID),
    questionId
  );
};

// ===================================================
//        QUIZ TAKING STATE MANAGEMENT (Giữ nguyên)
// ===================================================

// Giữ nguyên useQuizTaking vì nó quản lý state cục bộ, không phụ thuộc vào TanStack Query.
export const useQuizTaking = (questions: QuizQuestionAnswerResponse[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime] = useState<Date>(new Date());

  const currentQuestion = questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const totalQuestions = questions.length;

  // Answer management
  const selectAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const getSelectedAnswer = (questionId: string): number | undefined => {
    return answers[questionId];
  };

  // Navigation
  const nextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Submission preparation
  const prepareSubmission = (
    quizId: string,
    enrollmentId: string
  ): QuizSubmissionRequest => {
    return {
      quizId: quizId as UUID,
      enrollmentId: enrollmentId as UUID,
      startedAt: startTime.toISOString(),
      answers: questions.map((question) => ({
        questionId: question.id,
        selectedAnswerIndex: answers[question.id] ?? -1,
      })),
    };
  };

  // Progress tracking
  const getAnsweredCount = (): number => {
    return Object.keys(answers).length;
  };

  const getUnansweredQuestions = (): QuizQuestionAnswerResponse[] => {
    return questions.filter((q) => !(q.id in answers));
  };

  const isAllAnswered = (): boolean => {
    return getAnsweredCount() === questions.length;
  };

  // Reset state
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
  };
  /**
   * Hook thay thế useDeleteQuizQuestion
   */

  return {
    // Current state
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    isFirstQuestion,

    // Answer management
    answers,
    selectAnswer,
    getSelectedAnswer,

    // Navigation
    nextQuestion,
    previousQuestion,
    goToQuestion,

    // Submission
    prepareSubmission,

    // Progress
    getAnsweredCount,
    getUnansweredQuestions,
    isAllAnswered,

    // Utils
    resetQuiz,
    startTime,
  };
};
export const useDeleteQuizQuestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteQuizQuestion(id as UUID);
      toast.success("Question deleted successfully!");
      // *** LƯU Ý: Phải tự gọi refetch (làm mới dữ liệu) cho danh sách câu hỏi của Quiz ***
    } catch (err) {
      setError(err as Error);
      throw handleMutationError(err, "delete question");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
};
/**
 * Hook thay thế useUpdateQuizQuestion
 */
export const useUpdateQuizQuestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<QuizQuestionAnswerResponse>;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await updateQuizQuestion(id as UUID, data);
        toast.success("Question updated successfully!");
        // *** LƯU Ý: Phải tự gọi refetch (làm mới dữ liệu) cho câu hỏi đó hoặc danh sách câu hỏi ***
        return response;
      } catch (err) {
        setError(err as Error);
        throw handleMutationError(err, "update question");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { mutate, isLoading, error };
};
