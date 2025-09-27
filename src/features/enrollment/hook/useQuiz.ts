import { useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getAllQuizzesByLectureId
} from "../api/quiz";

// Hook for getting quiz by ID
export function useQuiz(id?: UUID) {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getQuizById(id);
        setQuiz(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { quiz, loading, error };
}

// Hook for getting quizzes by lecture ID
export function useQuizzesByLecture(lectureId?: UUID) {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lectureId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllQuizzesByLectureId(lectureId);
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lectureId]);

  const addQuiz = async (quizData: {
    lectureId: UUID;
    title: string;
    description?: string;
  }) => {
    try {
      const newQuiz = await createQuiz(quizData);
      setQuizzes((prev) => [...prev, newQuiz]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateQuizById = async (
    id: UUID,
    quizData: {
      title?: string;
      description?: string;
    }
  ) => {
    try {
      const updatedQuiz = await updateQuiz(id, quizData);
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === id ? updatedQuiz : quiz
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeQuiz = async (id: UUID) => {
    try {
      await deleteQuiz(id);
      setQuizzes((prev) =>
        prev.filter((quiz) => quiz.id !== id)
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    quizzes,
    loading,
    error,
    addQuiz,
    updateQuizById,
    removeQuiz,
  };
}