import { useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  createQuizAttempt,
  getQuizAttemptsByQuiz,
  getQuizAttemptsByUser
} from "../api/quizAttempt";

// Hook for getting quiz attempts by quiz ID
export function useQuizAttemptsByQuiz(quizId?: UUID) {
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getQuizAttemptsByQuiz(quizId);
        setQuizAttempts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quizId]);

  const addQuizAttempt = async (attemptData: {
    quizId: UUID;
    userId: UUID;
    score?: number;
    startedAt?: string;
    completedAt?: string;
  }) => {
    try {
      const newAttempt = await createQuizAttempt(attemptData);
      setQuizAttempts((prev) => [...prev, newAttempt]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    quizAttempts,
    loading,
    error,
    addQuizAttempt,
  };
}

// Hook for getting quiz attempts by user ID
export function useQuizAttemptsByUser(userId?: UUID) {
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getQuizAttemptsByUser(userId);
        setQuizAttempts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const addQuizAttempt = async (attemptData: {
    quizId: UUID;
    userId: UUID;
    score?: number;
    startedAt?: string;
    completedAt?: string;
  }) => {
    try {
      const newAttempt = await createQuizAttempt(attemptData);
      setQuizAttempts((prev) => [...prev, newAttempt]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    quizAttempts,
    loading,
    error,
    addQuizAttempt,
  };
}