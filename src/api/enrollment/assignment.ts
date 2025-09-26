import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";

const apiAssignment: AxiosInstance = axios.create({
  baseURL: "http://localhost:8105/api/assignments",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiAssignment.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// POST /api/assignments -> create
export const createAssignment = async (data: {
  courseId: UUID;
  title: string;
  description?: string;
  dueDate?: string;
}): Promise<any> => {
  const res: AxiosResponse = await apiAssignment.post("", data);
  return res.data;
};

// GET /api/assignments/{id} -> getById
export const getAssignmentById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await apiAssignment.get(`/${id}`);
  return res.data;
};

// PUT /api/assignments/{id} -> update
export const updateAssignment = async (
  id: UUID,
  data: {
    title?: string;
    description?: string;
    dueDate?: string;
  }
): Promise<any> => {
  const res: AxiosResponse = await apiAssignment.put(`/${id}`, data);
  return res.data;
};

// DELETE /api/assignments/{id} -> delete
export const deleteAssignment = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await apiAssignment.delete(`/${id}`);
  return res.data;
};

// GET /api/assignments/course/{courseId} -> getByCourse
export const getAssignmentsByCourseId = async (courseId: UUID): Promise<any> => {
  const res: AxiosResponse = await apiAssignment.get(`/course/${courseId}`);
  return res.data;
};

export default apiAssignment;
