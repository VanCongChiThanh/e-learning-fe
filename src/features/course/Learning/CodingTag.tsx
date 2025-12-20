import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCodeExercisesByLecture, ExerciseListItem } from '../api'; // Import hàm và kiểu dữ liệu mới
import axiosAuth from '../../../api/axiosAuth';

interface Submission {
  codeSubmissionId: string;
  status: string;
  pointsAchieved: number;
  submittedAt: number[];
}

interface CodingExerciseTabProps {
  lectureId: string;
  onSelectExercise: (exerciseId: string) => void;
}

const CodingExerciseTab: React.FC<CodingExerciseTabProps> = ({ lectureId, onSelectExercise }) => {
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phần mở rộng lịch sử nộp bài
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

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

  const handleToggleExpand = async (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (expandedExerciseId === exerciseId) {
      setExpandedExerciseId(null);
      return;
    }

    setExpandedExerciseId(exerciseId);
    setLoadingSubmissions(true);
    setSubmissions([]);
    
    try {
      const response = await axiosAuth.get(`/code-exercises/${exerciseId}/my-submissions?attributes=%7B%7D&order=desc&page=1&paging=10&sort=submitted_At`);
      if (response.data.status === 'success') {
        setSubmissions(response.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử nộp bài:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const formatTime = (timeArray: number[]) => {
    if (!Array.isArray(timeArray) || timeArray.length < 6) return "N/A";
    const [year, month, day, hour, minute, second] = timeArray;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString('vi-VN');
  };

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
              <li key={exercise.id} className="group">
                <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => onSelectExercise(exercise.id)}
                    className="flex-grow text-left flex items-center"
                  >
                    <span className="text-lg font-bold text-[#106c54] mr-4">{index + 1}</span>
                    <span className="font-semibold text-gray-800">{exercise.title}</span>
                  </button>
                  
                  <button 
                    onClick={(e) => handleToggleExpand(exercise.id, e)}
                    className="px-3 py-1 text-gray-400 hover:text-[#106c54] transition-colors mr-2"
                    title="Lịch sử nộp bài"
                  >
                    <i className={`fas fa-history ${expandedExerciseId === exercise.id ? 'text-[#106c54]' : ''}`}></i>
                  </button>

                  <button 
                    onClick={() => onSelectExercise(exercise.id)}
                    className="text-gray-400 hover:text-[#106c54]"
                  >
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>

                {expandedExerciseId === exercise.id && (
                  <div className="bg-gray-50 border-t border-gray-100 p-4 pl-12">
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">Lịch sử nộp bài</h4>
                    {loadingSubmissions ? (
                      <div className="text-sm text-gray-500 italic">Đang tải...</div>
                    ) : submissions.length === 0 ? (
                      <div className="text-sm text-gray-500 italic">Chưa có bài nộp nào.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                            <tr>
                              <th className="px-3 py-2">Thời gian</th>
                              <th className="px-3 py-2">Trạng thái</th>
                              <th className="px-3 py-2">Điểm</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.map((sub) => (
                              <tr key={sub.codeSubmissionId} className="border-b bg-white hover:bg-gray-50 last:border-b-0">
                                <td className="px-3 py-2 whitespace-nowrap">{formatTime(sub.submittedAt)}</td>
                                <td className="px-3 py-2">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    sub.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {sub.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 font-medium">{sub.pointsAchieved}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodingExerciseTab;