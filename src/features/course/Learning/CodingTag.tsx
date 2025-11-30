import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCodeExercisesByLecture, ExerciseListItem } from '../api'; // Import hàm và kiểu dữ liệu mới

interface CodingExerciseTabProps {
  lectureId: string;
  onSelectExercise: (exerciseId: string) => void;
}

const CodingExerciseTab: React.FC<CodingExerciseTabProps> = ({ lectureId, onSelectExercise }) => {
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lectureId) return;

    const fetchExercises = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCodeExercisesByLecture(lectureId);
        setExercises(data);
      } catch (err) {
        setError("Không thể tải danh sách bài tập. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [lectureId]);

  if (isLoading) {
    return <div className="text-center p-8">Đang tải danh sách bài tập...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Danh sách bài tập lập trình</h2>
      {exercises.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          Chưa có bài tập nào cho bài giảng này.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {exercises.map((exercise, index) => (
              <li key={exercise.id}>
                <button
                  onClick={() => onSelectExercise(exercise.id)}
                  className="block w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-purple-600 mr-4">{index + 1}</span>
                    <span className="font-semibold text-gray-800">{exercise.title}</span>
                    <i className="fas fa-arrow-right ml-auto text-gray-400"></i>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodingExerciseTab;