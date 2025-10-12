import { useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByCourseId
} from "../api/index";

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
      console.error('Hook: Error creating assignment:', err);
      setError(err.message);
      throw err; // Re-throw để component có thể catch
    }
  };

  const updateAssignmentById = async (
    id: UUID,
    assignmentData: {
      title?: string;
      description?: string;
      dueDate?: string | null;
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