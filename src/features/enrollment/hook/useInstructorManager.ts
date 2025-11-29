import { useState, useEffect, useCallback } from "react";
import { UUID } from "../utils/UUID";
import { getCoursesByInstructor } from "../api/course";
import { getEnrollmentByCourseId } from "../api/enrollment";
import { useProgressByEnrollment } from "./useProgress";
import { Course, EnrollmentWithStats, CourseStats } from "../type";
const generateMockQuizData = (enrollmentId: UUID) => ({
  totalQuizzes: Math.floor(Math.random() * 10) + 5,
  completedQuizzes: Math.floor(Math.random() * 8) + 2,
  averageScore: Math.floor(Math.random() * 40) + 60, // 60-100
  highestScore: Math.floor(Math.random() * 20) + 80, // 80-100
  lowestScore: Math.floor(Math.random() * 30) + 40, // 40-70
  lastAttemptDate: new Date(
    Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  ),
  quizDetails: Array.from(
    { length: Math.floor(Math.random() * 5) + 3 },
    (_, index) => ({
      id: `quiz-${index}`,
      title: `Quiz ${index + 1}: Kiểm tra kiến thức`,
      score: Math.floor(Math.random() * 40) + 60,
      maxScore: 100,
      attempts: Math.floor(Math.random() * 3) + 1,
      completedAt: new Date(
        Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000
      ),
      timeSpent: Math.floor(Math.random() * 30) + 10, // minutes
    })
  ),
});

export const useInstructorCourses = (instructorId: UUID | undefined) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!instructorId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getCoursesByInstructor(instructorId);
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  }, [instructorId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
};

export const useCourseStudents = (courseId: UUID | undefined) => {
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchCourseStudents = useCallback(async () => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    // try {
    //   const enrollmentResponse = await getEnrollmentByCourseId(courseId);
    //   const enrollments = enrollmentResponse || [];

    //   const enhancedEnrollments: EnrollmentWithStats[] = enrollments.map(
    //     (enrollment: any) => ({
    //       ...enrollment,
    //       studentName: `Học viên ${enrollment.userId.slice(-4)}`, // Mock name
    //       studentEmail: `student${enrollment.userId.slice(-4)}@example.com`, // Mock email
    //       quizStats: generateMockQuizData(enrollment.id),
    //     })
    //   );
    //   console.log("Enhanced enrollments:", enhancedEnrollments);
    //   // Calculate course statistics
    //   const totalStudents = enhancedEnrollments.length;
    //   const completedStudents = enhancedEnrollments.filter(
    //     (e) => e.status === "COMPLETED"
    //   ).length;
    //   const activeStudents = enhancedEnrollments.filter(
    //     (e) => e.status === "ACTIVE"
    //   ).length;

    //   const totalProgress = enhancedEnrollments.reduce(
    //     (sum, e) => sum + (e.progressPercentage || 0),
    //     0
    //   );
    //   const averageProgress =
    //     totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0;

    //   const totalWatchTime = enhancedEnrollments.reduce(
    //     (sum, e) => sum + (e.totalWatchTimeMinutes || 0),
    //     0
    //   );
    //   const completionRate =
    //     totalStudents > 0
    //       ? Math.round((completedStudents / totalStudents) * 100)
    //       : 0;

    //   setCourseStats({
    //     courseId,
    //     courseName: `Khóa học ${courseId.slice(-6)}`, // Mock course name
    //     totalStudents,
    //     activeStudents,
    //     completedStudents,
    //     averageProgress,
    //     totalWatchTime,
    //     completionRate,
    //     enrollments: enhancedEnrollments,
    //   });
    // } catch (err: any) {
    //   setError(err.message || "Lỗi khi tải danh sách học viên");
    // } finally {
    //   setLoading(false);
    // }
  }, [courseId]);

  useEffect(() => {
    fetchCourseStudents();
  }, [fetchCourseStudents]);

  return {
    courseStats,
    loading,
    error,
    refetch: fetchCourseStudents,
  };
};

export const useStudentDetailStats = (enrollmentId: UUID | undefined) => {
  const [studentStats, setStudentStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use existing progress hook
  const {
    progress: progressList,
    loading: progressLoading,
    error: progressError,
  } = useProgressByEnrollment(enrollmentId);

  const fetchStudentStats = useCallback(async () => {
    if (!enrollmentId) return;

    setLoading(true);
    setError(null);

    try {
      // Generate comprehensive student statistics
      const quizStats = generateMockQuizData(enrollmentId);
      const lectureStats = {
        totalLectures: progressList?.length || 0,
        completedLectures:
          progressList?.filter((p: any) => p.isCompleted).length || 0,
        totalWatchTime:
          progressList?.reduce(
            (sum: number, p: any) => sum + (p.watchTimeMinutes || 0),
            0
          ) || 0,
        averageWatchPercentage:
          progressList?.length > 0
            ? Math.round(
                progressList.reduce(
                  (sum: number, p: any) => sum + (p.watchedPercentage || 0),
                  0
                ) / progressList.length
              )
            : 0,
      };

      setStudentStats({
        enrollmentId,
        quizStats,
        lectureStats,
        progressList: progressList || [],
        lastActivity: new Date(
          Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
        ),
        studyStreak: Math.floor(Math.random() * 30) + 1, // Mock study streak
        totalStudyTime:
          lectureStats.totalWatchTime +
          (quizStats.quizDetails?.reduce(
            (sum: number, q: any) => sum + q.timeSpent,
            0
          ) || 0),
      });
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải thống kê học viên");
    } finally {
      setLoading(false);
    }
  }, [enrollmentId, progressList]);

  useEffect(() => {
    if (progressList) {
      fetchStudentStats();
    }
  }, [fetchStudentStats, progressList]);

  return {
    studentStats,
    loading: loading || progressLoading,
    error: error || progressError,
    refetch: fetchStudentStats,
  };
};
