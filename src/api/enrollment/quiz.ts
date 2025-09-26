import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";

const apiQuiz: AxiosInstance = axios.create({
  baseURL: "http://localhost:8105/api/quizzes",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiQuiz.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// POST /api/quizzes -> createQuiz
export const createQuiz = async (data: {
  lectureId: UUID;
  title: string;
  description?: string;
}): Promise<any> => {
  const res: AxiosResponse = await apiQuiz.post("", data);
  return res.data;
};

// GET /api/quizzes/{id} -> getQuizById
export const getQuizById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await apiQuiz.get(`/${id}`);
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
  const res: AxiosResponse = await apiQuiz.put(`/${id}`, data);
  return res.data;
};

// DELETE /api/quizzes/{id} -> deleteQuiz
export const deleteQuiz = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await apiQuiz.delete(`/${id}`);
  return res.data;
};

// GET /api/quizzes/lecture/{lectureId} -> getAllQuizzesByLectureId
export const getAllQuizzesByLectureId = async (lectureId: UUID): Promise<any> => {
  const res: AxiosResponse = await apiQuiz.get(`/lecture/${lectureId}`);
  return res.data;
};

export default apiQuiz;
