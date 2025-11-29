import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// Interface for Quiz Response
export interface QuizResponse {
  id: UUID;
  lectureId: UUID;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  passingScore?: number;
  maxAttempts?: number;
  numberQuestions?: number;
  isActive?: boolean;
  createdAt?: string;
}

// Interface for Quiz Question in the new API
export interface QuizQuestionCreateRequest {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
  sortOrder: number;
}

// Interface for new Quiz Create Request
export interface QuizCreateRequest {
  lectureId: UUID;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  maxAttempts: number;
  isActive: boolean;
  questions: QuizQuestionCreateRequest[];
}

// Interface for new Quiz Create Response
export interface QuizCreateResponse {
  id: UUID;
  lectureId: UUID;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  maxAttempts: number;
  numberQuestions: number;
  isActive: boolean | null;
  createdAt: number;
  questions: null;
}

// POST /api/v1/quizzes -> createQuizWithQuestions (new single API call)
export const createQuizWithQuestions = async (
  data: QuizCreateRequest
): Promise<QuizCreateResponse> => {
  const res: AxiosResponse = await axiosAuth.post("/quizzes", data);
  return res.data;
};

// GET /api/quizzes/{id} -> getQuizById
export const getQuizById = async (id: UUID): Promise<QuizResponse> => {
  const res: AxiosResponse = await axiosAuth.get(`/quizzes/${id}`);
  return res.data;
};

// PUT /api/quizzes/{id} -> updateQuiz
export const updateQuiz = async (
  id: UUID,
  data: {
    title?: string;
    description?: string;
    maxAttempts?: number;
    passingScore?: number;
    timeLimitMinutes?: number;
    numberQuestions?: number;
  }
): Promise<QuizResponse> => {
  const res: AxiosResponse = await axiosAuth.put(`/quizzes/${id}`, data);
  return res.data;
};

// DELETE /api/quizzes/{id} -> deleteQuiz
export const deleteQuiz = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.delete(`/quizzes/${id}`);
  return res.data;
};

// GET /api/quizzes/lecture/{lectureId} -> getAllQuizzesByLectureId
export const getAllQuizzesByLectureId = async (
  lectureId: UUID
): Promise<QuizResponse[]> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/quizzes/lecture/${lectureId}`
  );
  return res.data;
};
