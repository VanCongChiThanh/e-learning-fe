import { useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  createAssignmentSubmission,
  getAssignmentSubmissionById,
  gradeAssignmentSubmission,
  getAssignmentSubmissionsByAssignment,
  getAssignmentSubmissionsByUser
} from "../../../api/enrollment/assignmentSubmission";

// Hook for getting assignment submission by ID
export function useAssignmentSubmission(id?: UUID) {
  const [assignmentSubmission, setAssignmentSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAssignmentSubmissionById(id);
        setAssignmentSubmission(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { assignmentSubmission, loading, error };
}

// Hook for getting assignment submissions by assignment ID
export function useAssignmentSubmissionsByAssignment(assignmentId?: UUID) {
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAssignmentSubmissionsByAssignment(assignmentId);
        setAssignmentSubmissions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId]);

  const addAssignmentSubmission = async (submissionData: {
    assignmentId: UUID;
    userId: UUID;
    content: string;
    submittedAt?: string;
  }) => {
    try {
      const newSubmission = await createAssignmentSubmission(submissionData);
      setAssignmentSubmissions((prev) => [...prev, newSubmission]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const gradeSubmission = async (
    id: UUID,
    gradeData: { grade: number; feedback?: string }
  ) => {
    try {
      const gradedSubmission = await gradeAssignmentSubmission(id, gradeData);
      setAssignmentSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === id ? gradedSubmission : submission
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    assignmentSubmissions,
    loading,
    error,
    addAssignmentSubmission,
    gradeSubmission,
  };
}

// Hook for getting assignment submissions by user ID
export function useAssignmentSubmissionsByUser(userId?: UUID) {
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAssignmentSubmissionsByUser(userId);
        setAssignmentSubmissions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const addAssignmentSubmission = async (submissionData: {
    assignmentId: UUID;
    userId: UUID;
    content: string;
    submittedAt?: string;
  }) => {
    try {
      const newSubmission = await createAssignmentSubmission(submissionData);
      setAssignmentSubmissions((prev) => [...prev, newSubmission]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    assignmentSubmissions,
    loading,
    error,
    addAssignmentSubmission,
  };
}