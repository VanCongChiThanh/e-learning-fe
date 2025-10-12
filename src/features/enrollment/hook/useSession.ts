import { useEffect, useState } from "react";
import { UUID } from "../utils/UUID";
import { getAllSections, getAllLectures } from "../api/course";
import { getProgressByEnrollmentId } from "../api/progress";
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
                const data = await getAllSections(courseId);
                // Lấy progress data nếu có enrollmentId
                let progressData: Progress[] = [];
                if (enrollmentId) {
                    try {
                        progressData = await getProgressByEnrollmentId(enrollmentId);
                    } catch (err) {
                        console.warn("Could not fetch progress data:", err);
                    }
                }
                console.log("Progress Data:", progressData);
                // Tính toán completion status cho từng session
                const sessionsWithCompletion = await Promise.all(
                    data.data.map(async (session: any) => {
                        try {
                            const lectures = await getAllLectures(session.sectionId);

                            // Map lectures với progress data
                            const lecturesWithProgress = lectures.map((lecture: any) => {
                                const progress = progressData.find(p => p.lectureId === lecture.lectureId);
                                return {
                                    ...lecture,
                                    isCompleted: progress?.isCompleted || false,
                                    watchTimeMinutes: progress?.watchTimeMinutes || 0,
                                };
                            });

                            const completedLectures = lecturesWithProgress.filter((l: any) => l.isCompleted).length;
                            const totalLectures = lecturesWithProgress.length;
                            const totalDuration = lecturesWithProgress.reduce((sum: number, l: any) => sum + (l.duration || 0), 0);

                            return {
                                ...session,
                                lectureCount: totalLectures,
                                completedLectureCount: completedLectures,
                                totalDuration,
                                isCompleted: totalLectures > 0 && completedLectures === totalLectures,
                            };
                        } catch {
                            return {
                                ...session,
                                lectureCount: 0,
                                completedLectureCount: 0,
                                totalDuration: 0,
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
                        progressData = await getProgressByEnrollmentId(enrollmentId);
                    } catch (err) {
                        console.warn("Could not fetch progress data:", err);
                    }
                }
                // Map lectures với progress data
                const lecturesWithProgress = lecturesData.data.map((lecture: any) => {
                    const progress = progressData.find(p => p.lectureId === lecture.lectureId);
                    return {
                        ...lecture,
                        isCompleted: progress?.isCompleted || false,
                        watchTimeMinutes: progress?.watchTimeMinutes || 0,
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

    // Function to update lecture progress
    const updateLectureProgress = async (lectureId: UUID, watchTimeMinutes: number) => {
        try {
            const updatedLectures = lectures.map(lecture => {
                if (lecture.lectureId === lectureId) {
                    const isCompleted = watchTimeMinutes >= (lecture.duration || 0);
                    return {
                        ...lecture,
                        watchTimeMinutes,
                        isCompleted,
                    };
                }
                return lecture;
            });

            setLectures(updatedLectures);
        } catch (err: any) {
            setError(err.message || "Error updating lecture progress");
        }
    };

    return { lectures, loading, error, updateLectureProgress };
}

// Hook để lấy thống kê session
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

// Hook để lấy thống kê lecture
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