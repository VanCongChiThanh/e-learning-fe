import { AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";
import { Enrollment, EnrollmentWithStats, ProgressEnrollment } from "../type";

export const getEnrollmentById = async (id: UUID): Promise<Enrollment> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments/${id}`);
  return res.data;
};
export const getProgressEnrollmentById = async (
  id: UUID
): Promise<ProgressEnrollment> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/progress/enrollment/${id}/recent-learning`
  );
  return res.data;
};
export const getAllEnrollment = async (): Promise<Enrollment> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments`);
  return res.data;
};

export const getEnrollmentByUserId = async (id: UUID): Promise<Enrollment> => {
  const res: AxiosResponse = await axiosAuth.get(`/enrollments/user/${id}`);
  return res.data;
};
export const getEnrollmentByCourseId = async (
  courseId: UUID
): Promise<Enrollment> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/enrollments/course/${courseId}`
  );
  return res.data;
};

export const getEnrollmentReportByCourseId = async (
  courseId: UUID
): Promise<EnrollmentWithStats> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/enrollments/reports/course/${courseId}`
  );
  return res.data;
};
export const getEnrollmentReportByUserId = async (
  userId: UUID
): Promise<EnrollmentWithStats> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/enrollments/reports/user/${userId}`
  );
  return res.data;
};
export const getEnrollmentCourseCompletionTrends = async (
  courseId: UUID
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/enrollment-statistics/course/${courseId}/completion-trends`
  );
  return res.data;
};
export const getEnrollmentCourseOverview = async (
  courseId: UUID
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/enrollment-statistics/course/${courseId}/overview`
  );
  return res.data;
};
export const getEnrollmentCourseQuizPerformance = async (
  courseId: UUID
): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/enrollment-statistics/course/${courseId}/quiz-performance`
  );
  return res.data;
};
export const getEnrollmentUserOverview = async (userId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(
    `/enrollment-statistics/user/${userId}/overview`
  );
  return res.data;
};
