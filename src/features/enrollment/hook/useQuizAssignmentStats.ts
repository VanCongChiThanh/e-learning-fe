import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { getQuizAttempts } from "../api/quizAttempt";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

// Interface for quiz stats
interface QuizStats {
  totalAttempts: number;
  averageScore: number;
}

// Hook for getting quiz stats
export function useQuizStats(quizzes: any[]) {
  const [quizStats, setQuizStats] = useState<Record<string, QuizStats>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: { id: UUID } | null }
  );
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
                averageScore:
                  attempts.length > 0
                    ? attempts.reduce(
                        (sum: number, attempt: any) =>
                          sum + (attempt.score || 0),
                        0
                      ) / attempts.length
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
