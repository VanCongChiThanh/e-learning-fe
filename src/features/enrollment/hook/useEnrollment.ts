import { useEffect, useState, useCallback } from "react";
import {
  getAllEnrollment,
  getEnrollmentById,
  getEnrollmentByUserId,
  createEnrollment,
  updateEnrollment,
  getEnrollmentByCourseId
} from "../../../api/enrollment/index";
import { UUID } from "crypto";

export function useEnrollments(userId?: UUID, courseId?: UUID) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load danh sách enrollments
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (userId) {
        const res = await getEnrollmentByUserId(userId);
        console.log("Response from getEnrollmentByUserId:", res);
        data = res.data ?? res;
      } else if (courseId) {
        const res = await getEnrollmentByCourseId(courseId);
        data = res.data ?? res;
      } else {
        data = await getAllEnrollment();
      }
      setEnrollments(data);
    } catch (err: any) {
      setError(err.message || "Error fetching enrollments");
    } finally {
      setLoading(false);
    }
  }, [userId, courseId]);

  // Lấy enrollment theo id
  const fetchEnrollmentById = useCallback(async (id: UUID) => {
    setLoading(true);
    try {
      const data = await getEnrollmentById(id);
      setSelectedEnrollment(data);
    } catch (err: any) {
      setError(err.message || "Error fetching enrollment by id");
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo enrollment
  const addEnrollment = useCallback(
    async (courseId: UUID) => {
      if (!userId) {
        setError("userId is required to create enrollment");
        return;
      }
      try {
        const newEnroll = await createEnrollment({ userId, courseId });
        setEnrollments((prev) => [...prev, newEnroll.data ?? newEnroll]);
      } catch (err: any) {
        setError(err.message || "Error creating enrollment");
      }
    },
    [userId]
  );

  // Cập nhật enrollment
  const editEnrollment = useCallback(
    async (id: UUID, data: any) => {
      try {
        const updated = await updateEnrollment(id, data);
        setEnrollments((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
        );
      } catch (err: any) {
        setError(err.message || "Error updating enrollment");
      }
    },
    []
  );

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    enrollments,
    selectedEnrollment,
    setSelectedEnrollment, 
    loading,
    error,
    fetchEnrollments,
    fetchEnrollmentById,
    addEnrollment,
    editEnrollment,
  };
}
