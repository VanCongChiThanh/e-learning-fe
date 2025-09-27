import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// GET /api/quiz-questions/{id} -> getById
export const getQuizQuestionById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/quiz-questions/${id}`);
  return res.data;
};

// POST /api/quiz-questions/{id} -> create
export const createQuizQuestion = async (
  id: UUID,
  data: {
    questionText: string;
    options: string[];
    correctAnswer: string;
  }
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.post(`/quiz-questions/${id}`, data);
  return res.data;
};

// PUT /api/quiz-questions/{id} -> update
export const updateQuizQuestion = async (
  id: UUID,
  data: {
    questionText?: string;
    options?: string[];
    correctAnswer?: string;
  }
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.put(`/quiz-questions/${id}`, data);
  return res.data;
};

// DELETE /api/quiz-questions/{id} -> delete
export const deleteQuizQuestion = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.delete(`/quiz-questions/${id}`);
  return res.data;
};

// GET /api/quiz-questions/quiz/{quizId} -> getByQuizId
export const getQuizQuestionsByQuizId = async (quizId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/quiz-questions/quiz/${quizId}`);
  return res.data;
};

