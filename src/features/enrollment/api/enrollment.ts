import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// Example: gọi GET users
export const getEnrollmentById = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments/${id}`);
  return res.data;
};

export const getAllEnrollment = async (): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments`);
  return res.data;
}

export const createEnrollment = async (data: {
  userId: UUID;
  courseId: UUID;
}): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.post("/enrollments", data);
  return res;
};

export const updateEnrollment = async (
  id: UUID,
  data: {
    progressPercentage?: string; status?: string; completionDate?: string;
    totalWatchTimeMinutes?: string; lastAccessedAt?: string
  }
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.put(`/enrollments/${id}`, data);
  return res.data;
};

export const getEnrollmentByUserId = async (id: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments/user/${id}`);
  return res;
}
export const getEnrollmentByCourseId = async (courseId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments/course/${courseId}`);
  return res;
}
export const getReportedEnrollments = async (enrollmentId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments/${enrollmentId}/reported`);
  return res;
}
export const getEnrollmentReportByCourseId = async (courseId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments/reports/course/${courseId}`);
  return res;
}
export const getEnrollmentReportByUserId = async (userId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments/reports/user/${userId}`);
}