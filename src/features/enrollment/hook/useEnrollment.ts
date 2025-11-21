import { useState, useCallback, useEffect, useRef } from "react";
import { UUID } from "../utils/UUID";
import {
  getAllEnrollment,
  getEnrollmentByUserId,
  getEnrollmentByCourseId,
  getEnrollmentById,
  getEnrollmentReportByCourseId,
  getEnrollmentReportByUserId,
  getEnrollmentCourseCompletionTrends,
  getEnrollmentCourseOverview,
  getEnrollmentCourseQuizPerformance,
  getEnrollmentUserOverview,
} from "../api/enrollment";
import { getCourseById } from "../api/course";
import {
  Course,
  CourseReport,
  Enrollment,
  EnrollmentWithStats,
  UserReport,
} from "../type";

export function useEnrollments(userId?: UUID, courseId?: UUID) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentReport, setEnrollmentReport] = useState<
    EnrollmentWithStats[]
  >([]);
  const [userReport, setUserReport] = useState<UserReport[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(
    null
  );
  const [courseReport, setCourseReport] = useState<CourseReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (userId) {
        const res = await getEnrollmentByUserId(userId);
        data = res;
      } else if (courseId) {
        const res = await getEnrollmentByCourseId(courseId);
        data = res;
      } else {
        data = await getAllEnrollment();
      }
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Error fetching enrollments");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [userId, courseId]);

  const fetchEnrollmentById = useCallback(async (id: UUID) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEnrollmentById(id);
      setSelectedEnrollment(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Error fetching enrollment by id");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrollmentsByCourseId = useCallback(async (courseId: UUID) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEnrollmentByCourseId(courseId);
      const data = res;
      setEnrollments(Array.isArray(data) ? data : []);
      return data;
    } catch (err: any) {
      setError(err.message || "Error fetching enrollments by course");
      setEnrollments([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrollmentReportByCourseId = useCallback(
    async (courseId: UUID) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEnrollmentReportByCourseId(courseId);
        setEnrollmentReport(Array.isArray(res) ? res : []);
        return res;
      } catch (err: any) {
        setError(err.message || "Error fetching enrollment report by course");
        setEnrollmentReport([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const fetchCourseById = useCallback(async (id: UUID) => {
    try {
      const data = await getCourseById(id);
      setCourse(data.data);
      return data;
    } catch (err: any) {
      console.error(`Error fetching course ${id}:`, err.message);
      setCourse(null);
      return null;
    }
  }, []);
  const fetchUserReportByCourseId = useCallback(async (courseId: UUID) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEnrollmentUserOverview(courseId);
      setUserReport(Array.isArray(res) ? res : []);
      return res;
    } catch (err: any) {
      setError(err.message || "Error fetching user report by course");
      setUserReport([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchCourseReportOverview = useCallback(async (courseId: UUID) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEnrollmentCourseOverview(courseId);
      setCourseReport(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Error fetching course report overview");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    enrollments,
    selectedEnrollment,
    course,
    loading,
    error,
    enrollmentReport,
    courseReport,
    userReport,
    fetchCourseReportOverview,
    setEnrollmentReport,
    setSelectedEnrollment,
    fetchEnrollments,
    fetchEnrollmentById,
    fetchEnrollmentsByCourseId,
    fetchEnrollmentReportByCourseId,
    fetchCourseById,
    fetchUserReportByCourseId,
  };
}
