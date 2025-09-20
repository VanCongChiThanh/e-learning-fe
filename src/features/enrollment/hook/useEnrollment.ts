import { useEffect, useState } from "react";
import { getAllEnrollment, createEnrollment } from "../../../api/enrollment/index";
import { UUID } from "crypto";

export function useEnrollments(userId?: UUID) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllEnrollment();
        setEnrollments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const addEnrollment = async (courseId: UUID) => {
    try {
      const newEnroll = await createEnrollment({ userId: userId!, courseId });
      setEnrollments((prev) => [...prev, newEnroll]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { enrollments, loading, error, addEnrollment };
}
