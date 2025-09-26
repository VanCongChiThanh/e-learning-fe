import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";

const apiQuizAttempt: AxiosInstance = axios.create({
  baseURL: "http://localhost:8105/api/quiz-attempts",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiQuizAttempt.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// POST /api/quiz-attempts -> create
export const createQuizAttempt = async (data: {
  quizId: UUID;
  userId: UUID;
  score?: number;
  startedAt?: string;
  completedAt?: string;
}): Promise<any> => {
  const res: AxiosResponse = await apiQuizAttempt.post("", data);
  return res.data;
};

// GET /api/quiz-attempts/quiz/{quizId} -> getByQuiz
export const getQuizAttemptsByQuiz = async (quizId: UUID): Promise<any> => {
  const res: AxiosResponse = await apiQuizAttempt.get(`/quiz/${quizId}`);
  return res.data;
};

// GET /api/quiz-attempts/user/{userId} -> getByUser
export const getQuizAttemptsByUser = async (userId: UUID): Promise<any> => {
  const res: AxiosResponse = await apiQuizAttempt.get(`/user/${userId}`);
  return res.data;
};

export default apiQuizAttempt;
