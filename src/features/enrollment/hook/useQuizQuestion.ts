import { useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  getQuizQuestionById,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  getQuizQuestionsByQuizId
} from "../../../api/enrollment/quizQA";

// Hook for getting quiz question by ID
export function useQuizQuestion(id?: UUID) {
  const [quizQuestion, setQuizQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getQuizQuestionById(id);
        setQuizQuestion(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { quizQuestion, loading, error };
}

// Hook for getting quiz questions by quiz ID
export function useQuizQuestionsByQuiz(quizId?: UUID) {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getQuizQuestionsByQuizId(quizId);
        setQuizQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quizId]);

  const addQuizQuestion = async (
    id: UUID,
    questionData: {
      questionText: string;
      options: string[];
      correctAnswer: string;
    }
  ) => {
    try {
      const newQuestion = await createQuizQuestion(id, questionData);
      setQuizQuestions((prev) => [...prev, newQuestion]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateQuizQuestionById = async (
    id: UUID,
    questionData: {
      questionText?: string;
      options?: string[];
      correctAnswer?: string;
    }
  ) => {
    try {
      const updatedQuestion = await updateQuizQuestion(id, questionData);
      setQuizQuestions((prev) =>
        prev.map((question) =>
          question.id === id ? updatedQuestion : question
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeQuizQuestion = async (id: UUID) => {
    try {
      await deleteQuizQuestion(id);
      setQuizQuestions((prev) =>
        prev.filter((question) => question.id !== id)
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    quizQuestions,
    loading,
    error,
    addQuizQuestion,
    updateQuizQuestionById,
    removeQuizQuestion,
  };
}