import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// POST /api/assignments -> create
export const createAssignment = async (data: {
  courseId: UUID;
  title: string;
  description?: string;
  dueDate?: string;
}): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.post("/assignments", data);
  return res.data;
};

// GET /api/assignments/{id} -> getById
export const getAssignmentById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/assignments/${id}`);
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
  const res: AxiosResponse = await axiosAuth.put(`/assignments/${id}`, data);
  return res.data;
};

// DELETE /api/assignments/{id} -> delete
export const deleteAssignment = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.delete(`/assignments/${id}`);
  return res.data;
};

// GET /api/assignments/course/{courseId} -> getByCourse
export const getAssignmentsByCourseId = async (courseId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/assignments/course/${courseId}`);
  return res.data;
};
