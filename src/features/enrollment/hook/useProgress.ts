import { useEffect, useState } from "react";
import { UUID } from "../utils/UUID";
import { getAllSections, getAllLectures } from "../api/course";
import {
  getProgressByEnrollmentId,
  createProgress,
  updateProgress,
  getProgressById,
  getProgressByLectureId
} from "../api/progress";
import { Session, Lecture, Progress } from "../type";

export function useSessionsByCourse(courseId?: UUID, enrollmentId?: UUID) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchSessions = async () => {
      setLoading(true);
      try {
        const sessionsData = await getAllSections(courseId as any);

        let progressData: Progress[] = [];
        if (enrollmentId) {
          try {
            progressData = await getProgressByEnrollmentId(enrollmentId as any);
          } catch (err) {
            console.warn("Could not fetch progress data:", err);
          }
        }

        const sessionsWithCompletion = await Promise.all(
          sessionsData.map(async (session: any) => {
            try {
              const lectures = await getAllLectures(session.id);

              // Map lectures với progress data
              const lecturesWithProgress = lectures.map((lecture: any) => {
                const progress = progressData.find(p => p.lectureId === lecture.id);
                return {
                  ...lecture,
                  isCompleted: progress?.isCompleted || false,
                  watchTimeMinutes: progress?.watchTimeMinutes || 0
                };
              });

              const completedLectures = lecturesWithProgress.filter((l: any) => l.isCompleted).length;
              const totalLectures = lecturesWithProgress.length;

              return {
                ...session,
                lectureCount: totalLectures,
                completedLectureCount: completedLectures,
                isCompleted: totalLectures > 0 && completedLectures === totalLectures,
              };
            } catch {
              return {
                ...session,
                lectureCount: 0,
                completedLectureCount: 0,
                isCompleted: false,
              };
            }
          })
        );

        const sorted = sessionsWithCompletion.sort((a, b) => a.position - b.position);
        setSessions(sorted);
      } catch (err: any) {
        setError(err.message || "Error fetching sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [courseId, enrollmentId]);

  return { sessions, loading, error };
}

export function useLecturesBySession(sessionId?: UUID, enrollmentId?: UUID) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchLectures = async () => {
      setLoading(true);
      try {
        const lecturesData = await getAllLectures(sessionId as any);

        // Lấy progress data nếu có enrollmentId
        let progressData: Progress[] = [];
        if (enrollmentId) {
          try {
            progressData = await getProgressByEnrollmentId(enrollmentId as any);
          } catch (err) {
            console.warn("Could not fetch progress data:", err);
          }
        }

        // Map lectures với progress data
        const lecturesWithProgress = lecturesData.map((lecture: any) => {
          const progress = progressData.find(p => p.lectureId === lecture.id);
          return {
            ...lecture,
            isCompleted: progress?.isCompleted || false,
            watchTimeMinutes: progress?.watchTimeMinutes || 0
          };
        });

        const sorted = lecturesWithProgress.sort((a: any, b: any) => a.position - b.position);
        setLectures(sorted);
      } catch (err: any) {
        setError(err.message || "Error fetching lectures");
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [sessionId, enrollmentId]);

  return { lectures, loading, error };
}

// Hook để lấy thống kê session (cập nhật để sử dụng enrollmentId)
export function useSessionStats(courseId?: UUID, enrollmentId?: UUID) {
  const { sessions } = useSessionsByCourse(courseId, enrollmentId);

  const stats = {
    totalSessions: sessions.length,
    completedSessions: sessions.filter(s => s.isCompleted).length,
    totalDuration: sessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0),
    totalLectures: sessions.reduce((sum, s) => sum + (s.lectureCount || 0), 0),
    completionRate: sessions.length > 0
      ? Math.round((sessions.filter(s => s.isCompleted).length / sessions.length) * 100)
      : 0,
  };

  return stats;
}

// Hook để lấy thống kê lecture (cập nhật để sử dụng enrollmentId)
export function useLectureStats(sessionId?: UUID, enrollmentId?: UUID) {
  const { lectures } = useLecturesBySession(sessionId, enrollmentId);

  const stats = {
    totalLectures: lectures.length,
    completedLectures: lectures.filter(l => l.isCompleted).length,
    totalDuration: lectures.reduce((sum, l) => sum + (l.duration || 0), 0),
    totalWatchTime: lectures.reduce((sum, l) => sum + (l.watchTimeMinutes || 0), 0),
    completionRate: lectures.length > 0
      ? Math.round((lectures.filter(l => l.isCompleted).length / lectures.length) * 100)
      : 0,
  };

  return stats;
}

// Hook để lấy progress theo enrollmentId - được sử dụng bởi Progress.tsx
export function useProgressByEnrollment(enrollmentId?: UUID) {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enrollmentId) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const data = await getProgressByEnrollmentId(enrollmentId as any);
        const progressArray = Array.isArray(data) ? data : [];

        // Map API response fields to our interface
        const mappedProgress = progressArray.map((item: any) => ({
          ...item,
          watchTimeMinutes: item.watchTimeMinutes || item.watchedDurationMinutes || 0,
          isCompleted: item.isCompleted || (item.watchedPercentage >= 100),
        }));

        setProgress(mappedProgress);
      } catch (err: any) {
        setError(err.message || "Error fetching progress");
        setProgress([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [enrollmentId]);

  // Function để tạo progress mới
  const addProgress = async (progressData: {
    enrollmentId: UUID;
    watchedPercentage: number;
    watchedDurationMinutes?: number;
    lastWatchedAt?: string;
  }) => {
    try {
      const newProgress = await createProgress(progressData);
      setProgress(prev => [...prev, newProgress]);
      return newProgress;
    } catch (err: any) {
      setError(err.message || "Error creating progress");
      throw err;
    }
  };

  // Function để cập nhật progress theo ID
  const updateProgressById = async (
    id: UUID,
    progressData: {
      watchedPercentage?: number;
      watchedDurationMinutes?: number;
      lastWatchedAt?: string;
    }
  ) => {
    try {
      const updatedProgress = await updateProgress(id, progressData);

      // Cập nhật trong state local
      setProgress(prev =>
        prev.map(p => p.id === id ? { ...p, ...updatedProgress } : p)
      );

      return updatedProgress;
    } catch (err: any) {
      setError(err.message || "Error updating progress");
      throw err;
    }
  };

  return {
    progress,
    loading,
    error,
    addProgress,
    updateProgressById,
  };
}

export function useProgressByLecture(lectureId?: UUID) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  useEffect(() => {
    if (!lectureId) return;
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const data = await getProgressByLectureId(lectureId as any);
        if (data) {
          const mappedProgress = {
            ...data,
            watchTimeMinutes: data.watchTimeMinutes || data.watchedDurationMinutes || 0,
            isCompleted: data.isCompleted || (data.watchedPercentage >= 100),
          };
          setProgress(mappedProgress);
        } else {
          setProgress(null);
        }
      } catch (err: any) {
        setError(err.message || "Error fetching progress");
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [lectureId, refreshIndex]);

  const refreshProgress = () => {
    setRefreshIndex(prev => prev + 1);
  };
  return { progress, loading, error, refreshProgress };
}