import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8105/api/enrollments", 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Example: gọi GET users
export const getEnrollmentById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await api.get(`/${id}`);
  return res.data;
};

export const getAllEnrollment = async (): Promise<any> => {
    const res: AxiosResponse = await api.get(``);
    return res.data;
}

export const createEnrollment = async (data: {
  userId: UUID;
  courseId: UUID;
}): Promise<any> => {
  const res: AxiosResponse = await api.post("", data);
  return res;
};

export const updateEnrollment = async (
  id: UUID,
    data: {
        progressPercentage?: string; status?: string; completionDate?: string;
        totalWatchTimeMinutes?: string; lastAccessedAt?: string
    }
): Promise<any> => {
  const res: AxiosResponse = await api.put(`/${id}`, data);
  return res.data;
};

export const getEnrollmentByUserId = async (id: UUID): Promise<any> => {
    const res: AxiosResponse = await api.get(`/user/${id}`);
    return res;
}

export default api;
