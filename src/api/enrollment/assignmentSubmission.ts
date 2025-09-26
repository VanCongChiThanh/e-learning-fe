import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";

const apiAssignmentSubmission: AxiosInstance = axios.create({
  baseURL: "http://localhost:8105/api/assignment-submissions",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiAssignmentSubmission.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// POST /api/assignment-submissions -> create
export const createAssignmentSubmission = async (data: {
  assignmentId: UUID;
  userId: UUID;
  content: string;
  submittedAt?: string;
}): Promise<any> => {
  const res: AxiosResponse = await apiAssignmentSubmission.post("", data);
  return res.data;
};

// GET /api/assignment-submissions/{id} -> getById
export const getAssignmentSubmissionById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await apiAssignmentSubmission.get(`/${id}`);
  return res.data;
};

// PUT /api/assignment-submissions/{id}/grade -> gradeSubmission
export const gradeAssignmentSubmission = async (
  id: UUID,
  data: { grade: number; feedback?: string }
): Promise<any> => {
  const res: AxiosResponse = await apiAssignmentSubmission.put(`/${id}/grade`, data);
  return res.data;
};

// GET /api/assignment-submissions/assignment/{assignmentId} -> getByAssignment
export const getAssignmentSubmissionsByAssignment = async (
  assignmentId: UUID
): Promise<any> => {
  const res: AxiosResponse = await apiAssignmentSubmission.get(`/assignment/${assignmentId}`);
  return res.data;
};

// GET /api/assignment-submissions/user/{userId} -> getByUser
export const getAssignmentSubmissionsByUser = async (userId: UUID): Promise<any> => {
  const res: AxiosResponse = await apiAssignmentSubmission.get(`/user/${userId}`);
  return res.data;
};

export default apiAssignmentSubmission;
