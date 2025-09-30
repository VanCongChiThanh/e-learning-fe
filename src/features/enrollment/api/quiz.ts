import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// POST /api/quizzes -> createQuiz
export const createQuiz = async (data: {
  lectureId: UUID;
  title: string;
  description?: string;
}): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.post("/quizzes", data);
  return res.data;
};

// GET /api/quizzes/{id} -> getQuizById
export const getQuizById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/quizzes/${id}`);
  return res.data;
};

// PUT /api/quizzes/{id} -> updateQuiz
export const updateQuiz = async (
  id: UUID,
  data: {
    title?: string;
    description?: string;
  }
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.put(`/quizzes/${id}`, data);
  return res.data;
};

// DELETE /api/quizzes/{id} -> deleteQuiz
export const deleteQuiz = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.delete(`/quizzes/${id}`);
  return res.data;
};

// GET /api/quizzes/lecture/{lectureId} -> getAllQuizzesByLectureId
export const getAllQuizzesByLectureId = async (lectureId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/quizzes/lecture/${lectureId}`);
  return res.data;
};
