import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

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
export const getProgressByEnrollmentId = async (
  enrollmentId: UUID
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/progress/enrollment/${enrollmentId}`
  );
  return res.data;
};

export const getProgressByLectureId = async (lectureId: UUID): Promise<any> => {
  try {
    const res: AxiosResponse = await axiosAuth.get(
      `/progress/lecture/${lectureId}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching progress by lecture ID:", error);
    throw error;
  }
};
