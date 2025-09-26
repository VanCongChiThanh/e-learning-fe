import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";

const apiQuizQuestion: AxiosInstance = axios.create({
  baseURL: "http://localhost:8105/api/quiz-questions",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiQuizQuestion.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// GET /api/quiz-questions/{id} -> getById
export const getQuizQuestionById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await apiQuizQuestion.get(`/${id}`);
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
  const res: AxiosResponse = await apiQuizQuestion.post(`/${id}`, data);
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
  const res: AxiosResponse = await apiQuizQuestion.put(`/${id}`, data);
  return res.data;
};

// DELETE /api/quiz-questions/{id} -> delete
export const deleteQuizQuestion = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await apiQuizQuestion.delete(`/${id}`);
  return res.data;
};

// GET /api/quiz-questions/quiz/{quizId} -> getByQuizId
export const getQuizQuestionsByQuizId = async (quizId: UUID): Promise<any> => {
  const res: AxiosResponse = await apiQuizQuestion.get(`/quiz/${quizId}`);
  return res.data;
};

export default apiQuizQuestion;
