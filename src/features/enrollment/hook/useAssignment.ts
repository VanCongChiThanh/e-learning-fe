import { useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByCourseId
} from "../api/index";

export function useAssignment(id?: UUID) {
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAssignmentById(id);
        setAssignment(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { assignment, loading, error };
}

// Hook for getting assignments by course ID
export function useAssignmentsByCourse(courseId?: UUID) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAssignmentsByCourseId(courseId);
        setAssignments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const addAssignment = async (assignmentData: {
    courseId: UUID;
    title: string;
    description?: string;
    dueDate?: string;
  }) => {
    try {
      const newAssignment = await createAssignment(assignmentData);
      setAssignments((prev) => [...prev, newAssignment]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateAssignmentById = async (
    id: UUID,
    assignmentData: {
      title?: string;
      description?: string;
      dueDate?: string;
    }
  ) => {
    try {
      const updatedAssignment = await updateAssignment(id, assignmentData);
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === id ? updatedAssignment : assignment
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeAssignment = async (id: UUID) => {
    try {
      await deleteAssignment(id);
      setAssignments((prev) =>
        prev.filter((assignment) => assignment.id !== id)
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    assignments,
    loading,
    error,
    addAssignment,
    updateAssignmentById,
    removeAssignment,
  };
}