import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { getQuizAttempts } from "../api/quizAttempt";
import { getAssignmentSubmissionsByAssignment } from "../api/assignmentSubmission";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

// Interface for quiz stats
interface QuizStats {
    totalAttempts: number;
    averageScore: number;
}

// Interface for assignment stats
interface AssignmentStats {
    totalSubmissions: number;
    gradedSubmissions: number;
    averageGrade: number;
}

// Hook for getting quiz stats
export function useQuizStats(quizzes: any[]) {
    const [quizStats, setQuizStats] = useState<Record<string, QuizStats>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useSelector((state: RootState) => state.auth as { user: { id: UUID } | null });
    const userId = user?.id;
    useEffect(() => {
        if (!quizzes.length) {
            setQuizStats({});
            return;
        }

        const fetchQuizStats = async () => {
            setLoading(true);
            try {
                const stats: Record<string, QuizStats> = {};

                await Promise.all(
                    quizzes.map(async (quiz) => {
                        try {
                            const attempts = await getQuizAttempts(quiz.id, userId as UUID);
                            stats[quiz.id] = {
                                totalAttempts: attempts.length,
                                averageScore: attempts.length > 0
                                    ? attempts.reduce((sum: number, attempt: any) => sum + (attempt.score || 0), 0) / attempts.length
                                    : 0,
                            };
                        } catch (err) {
                            console.error(`Error fetching stats for quiz ${quiz.id}:`, err);
                            stats[quiz.id] = {
                                totalAttempts: 0,
                                averageScore: 0,
                            };
                        }
                    })
                );

                setQuizStats(stats);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizStats();
    }, [quizzes]);

    return { quizStats, loading, error };
}

// Hook for getting assignment stats
export function useAssignmentStats(assignments: any[]) {
    const [assignmentStats, setAssignmentStats] = useState<Record<string, AssignmentStats>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!assignments.length) {
            setAssignmentStats({});
            return;
        }

        const fetchAssignmentStats = async () => {
            setLoading(true);
            try {
                const stats: Record<string, AssignmentStats> = {};

                await Promise.all(
                    assignments.map(async (assignment) => {
                        try {
                            const submissions = await getAssignmentSubmissionsByAssignment(assignment.id);
                            const gradedSubmissions = submissions.filter((s: any) => s.grade !== undefined && s.grade !== null);

                            stats[assignment.id] = {
                                totalSubmissions: submissions.length,
                                gradedSubmissions: gradedSubmissions.length,
                                averageGrade: gradedSubmissions.length > 0
                                    ? gradedSubmissions.reduce((sum: number, sub: any) => sum + (sub.grade || 0), 0) / gradedSubmissions.length
                                    : 0,
                            };
                        } catch (err) {
                            console.error(`Error fetching stats for assignment ${assignment.id}:`, err);
                            stats[assignment.id] = {
                                totalSubmissions: 0,
                                gradedSubmissions: 0,
                                averageGrade: 0,
                            };
                        }
                    })
                );

                setAssignmentStats(stats);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentStats();
    }, [assignments]);

    return { assignmentStats, loading, error };
}