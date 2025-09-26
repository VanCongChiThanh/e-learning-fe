import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";

const apiProgress: AxiosInstance = axios.create({
  baseURL: "http://localhost:8105/api/progress",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiProgress.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// POST /api/progress -> createProgress
export const createProgress = async (data: {
  enrollmentId: UUID;
  watchedPercentage: number;
  watchedDurationMinutes?: number;
  lastWatchedAt?: string;
}): Promise<any> => {
  const res: AxiosResponse = await apiProgress.post("", data);
  return res.data;
};

// GET /api/progress/{id} -> getProgressById
export const getProgressById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await apiProgress.get(`/${id}`);
  return res.data;
};

// PUT /api/progress/{id} -> updateProgress
export const updateProgress = async (
  id: UUID,
  data: {
    watchedPercentage?: number;
    watchedDurationMinutes?: number;
    lastWatchedAt?: string;
  }
): Promise<any> => {
  const res: AxiosResponse = await apiProgress.put(`/${id}`, data);
  return res.data;
};

// GET /api/progress/enrollment/{id} -> getProgressByEnrollmentId
export const getProgressByEnrollmentId = async (enrollmentId: UUID): Promise<any> => {
  const res: AxiosResponse = await apiProgress.get(`/enrollment/${enrollmentId}`);
  return res.data;
};

export default apiProgress;
