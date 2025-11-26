import { AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// Interface for quiz submission - New API format
export interface QuizSubmissionRequest {
  quizId: UUID;
  enrollmentId: UUID;
  startedAt: string;
  answers: {
    questionId: UUID;
    selectedAnswerIndex: number;
  }[];
}

export interface QuizSubmissionResponse {
  id: UUID;
  quizId: UUID;
  quizTitle: string;
  userId: UUID;
  userEmail: string;
  attemptNumber: number;
  totalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt: string;
  timeTakenMinutes: number;
  isCompleted: boolean;
  answers: {
    questionId: UUID;
    questionText: string;
    options: string[];
    selectedAnswerIndex: number;
    correctAnswerIndex: number;
    isCorrect: boolean;
    pointsEarned: number;
    maxPoints: number;
  }[];
}

// POST /api/v1/quiz-submissions/submit -> submit quiz
export const submitQuiz = async (
  data: QuizSubmissionRequest
): Promise<QuizSubmissionResponse> => {
  const res: AxiosResponse = await axiosAuth.post(
    "/quiz-submissions/submit",
    data
  );
  return res.data;
};

export const getQuizSubmissionById = async (
  submissionId: UUID
): Promise<QuizSubmissionResponse> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/quiz-submissions/${submissionId}`
  );
  return res.data;
};

export const getQuizSubmissionsByEnrollment = async (
  enrollmentId: UUID
): Promise<QuizSubmissionResponse[]> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/quiz-submissions/enrollment/${enrollmentId}`
  );
  return res.data;
};

// GET /api/v1/quiz-submissions/quiz/{quizId}/user/{userId} -> get user's attempts for a quiz
export const getQuizAttempts = async (
  quizId: UUID,
  userId: UUID
): Promise<QuizSubmissionResponse[]> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/quiz-submissions/quiz/${quizId}/user/${userId}`
  );
  return res.data;
};

// GET /api/v1/quiz-submissions/quiz/{quizId}/user/{userId}/can-attempt -> check if user can attempt quiz
export const canUserAttemptQuiz = async (
  quizId: UUID,
  userId: UUID
): Promise<boolean> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/quiz-submissions/quiz/${quizId}/user/${userId}/can-attempt`
  );
  return res.data;
};

// GET /api/v1/quiz-submissions/quiz/{quizId}/user/{userId}/latest -> get latest attempt
export const getLatestAttempt = async (
  quizId: UUID,
  userId: UUID
): Promise<QuizSubmissionResponse | null> => {
  try {
    const res: AxiosResponse = await axiosAuth.get(
      `/quiz-submissions/quiz/${quizId}/user/${userId}/latest`
    );
    return res.data;
  } catch (error) {
    // Return null if no attempts found
    return null;
  }
};

// GET /api/v1/quiz-submissions/statistics/user/{userId}/course/{courseId} -> get quiz statistics
export const getQuizStatistics = async (
  userId: UUID,
  courseId: UUID
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/quiz-submissions/statistics/user/${userId}/course/${courseId}`
  );
  return res.data;
};

// Legacy function names for backward compatibility
export const getQuizSubmission = getQuizSubmissionById;
export const getUserQuizSubmissions = getQuizAttempts;
