import { useState, useCallback, useEffect } from "react";
import { UUID } from "../utils/UUID";
import {
  getAllEnrollment,
  getEnrollmentByUserId,
  getEnrollmentByCourseId,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
} from "../api/enrollment"; // Adjust import path
import { getCourseById } from "../api/course"; // Adjust import path

export function useEnrollments(userId?: UUID, courseId?: UUID) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Thay đổi: Lưu nhiều courses thay vì 1 course
  const [coursesMap, setCoursesMap] = useState<Record<string, any>>({});

  // Load danh sách enrollments
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (userId) {
        const res = await getEnrollmentByUserId(userId);
        data = res.data ?? res;
      } else if (courseId) {
        const res = await getEnrollmentByCourseId(courseId);
        data = res.data ?? res;
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

  // Lấy enrollment theo id
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

  // Lấy course theo id và lưu vào map
  const fetchCourseById = useCallback(async (id: UUID) => {
    // Kiểm tra xem đã có trong map chưa
    if (coursesMap[id]) {
      return coursesMap[id];
    }

    try {
      const data = await getCourseById(id);
      // Cập nhật vào map
      setCoursesMap(prev => ({
        ...prev,
        [id]: data
      }));
      return data;
    } catch (err: any) {
      console.error(`Error fetching course ${id}:`, err.message);
      return null;
    }
  }, [coursesMap]);

  // Fetch nhiều courses cùng lúc
  const fetchCoursesByIds = useCallback(async (courseIds: UUID[]) => {
    const promises = courseIds.map(id => fetchCourseById(id));
    const results = await Promise.allSettled(promises);

    const newCoursesMap: Record<string, any> = { ...coursesMap };
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        newCoursesMap[courseIds[index]] = result.value;
      }
    });

    setCoursesMap(newCoursesMap);
    return newCoursesMap;
  }, [coursesMap]);

  // Lấy course từ map
  const getCourseFromMap = useCallback((courseId: UUID) => {
    return coursesMap[courseId] || null;
  }, [coursesMap]);

  // Tạo enrollment
  const addEnrollment = useCallback(
    async (courseId: UUID) => {
      if (!userId) {
        setError("userId is required to create enrollment");
        return null;
      }

      setError(null);
      try {
        const newEnroll = await createEnrollment({ userId, courseId });
        const enrollmentData = newEnroll.data ?? newEnroll;
        setEnrollments((prev) => [...prev, enrollmentData]);

        // Fetch course info cho enrollment mới
        await fetchCourseById(courseId);

        return enrollmentData;
      } catch (err: any) {
        setError(err.message || "Error creating enrollment");
        return null;
      }
    },
    [userId, fetchCourseById]
  );

  // Cập nhật enrollment
  const editEnrollment = useCallback(
    async (id: UUID, data: any) => {
      setError(null);
      try {
        const updated = await updateEnrollment(id, data);
        const updatedData = updated.data ?? updated;

        setEnrollments((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
        );

        // Cập nhật selectedEnrollment nếu đang chọn enrollment này
        if (selectedEnrollment?.id === id) {
          setSelectedEnrollment({ ...selectedEnrollment, ...updatedData });
        }

        return updatedData;
      } catch (err: any) {
        setError(err.message || "Error updating enrollment");
        return null;
      }
    },
    [selectedEnrollment]
  );

  // Xóa enrollment (nếu cần)
  const removeEnrollment = useCallback((id: UUID) => {
    setEnrollments((prev) => prev.filter((e) => e.id !== id));
    if (selectedEnrollment?.id === id) {
      setSelectedEnrollment(null);
    }
  }, [selectedEnrollment]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load enrollments khi mount hoặc khi userId/courseId thay đổi
  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    // Data
    enrollments,
    selectedEnrollment,
    coursesMap,
    loading,
    error,

    // Setters
    setSelectedEnrollment,

    // Enrollment methods
    fetchEnrollments,
    fetchEnrollmentById,
    addEnrollment,
    editEnrollment,
    removeEnrollment,

    // Course methods
    fetchCourseById,
    fetchCoursesByIds,
    getCourseFromMap,

    // Utils
    clearError,
  };
}