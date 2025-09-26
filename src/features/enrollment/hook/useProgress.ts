import { useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  createProgress,
  getProgressById,
  updateProgress,
  getProgressByEnrollmentId
} from "../api/progress";

// Hook for getting progress by ID
export function useProgress(id?: UUID) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProgressById(id);
        setProgress(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { progress, loading, error };
}

// Hook for getting progress by enrollment ID
export function useProgressByEnrollment(enrollmentId?: UUID) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enrollmentId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProgressByEnrollmentId(enrollmentId);
        setProgress(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [enrollmentId]);

  const addProgress = async (progressData: {
    enrollmentId: UUID;
    watchedPercentage: number;
    watchedDurationMinutes?: number;
    lastWatchedAt?: string;
  }) => {
    try {
      const newProgress = await createProgress(progressData);
      setProgress(newProgress);
    } catch (err: any) {
      setError(err.message);
    }
  };

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
      setProgress(updatedProgress);
    } catch (err: any) {
      setError(err.message);
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