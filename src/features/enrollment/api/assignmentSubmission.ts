import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// POST /api/assignment-submissions -> create
export const createAssignmentSubmission = async (data: {
  assignmentId: UUID;
  userId: UUID;
  content: string;
  submittedAt?: string;
}): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.post("/assignment-submissions", data);
  return res.data;
};

// GET /api/assignment-submissions/{id} -> getById
export const getAssignmentSubmissionById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/${id}`);
  return res.data;
};

// PUT /api/assignment-submissions/{id}/grade -> gradeSubmission
export const gradeAssignmentSubmission = async (
  id: UUID,
  data: { grade: number; feedback?: string }
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.put(`/assignment-submissions/${id}/grade`, data);
  return res.data;
};

// GET /api/assignment-submissions/assignment/{assignmentId} -> getByAssignment
export const getAssignmentSubmissionsByAssignment = async (
  assignmentId: UUID
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/assignment-submissions/assignment/${assignmentId}`);
  return res.data;
};

// GET /api/assignment-submissions/user/{userId} -> getByUser
export const getAssignmentSubmissionsByUser = async (userId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/assignment-submissions/user/${userId}`);
  return res.data;
};

