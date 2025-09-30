import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// POST /api/progress -> createProgress
export const createProgress = async (data: {
  enrollmentId: UUID;
  watchedPercentage: number;
  watchedDurationMinutes?: number;
  lastWatchedAt?: string;
}): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.post("/progress", data);
  return res.data;
};

// GET /api/progress/{id} -> getProgressById
export const getProgressById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/progress/${id}`);
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
  const res: AxiosResponse = await axiosAuth.put(`/progress/${id}`, data);
  return res.data;
};

// GET /api/progress/enrollment/{id} -> getProgressByEnrollmentId
export const getProgressByEnrollmentId = async (enrollmentId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/progress/enrollment/${enrollmentId}`);
  return res.data;
};

