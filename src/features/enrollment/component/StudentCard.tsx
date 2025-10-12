import React from 'react';
import { Button } from '../common/UI';

interface StudentCardProps {
  enrollment: {
    id: string;
    userId: string;
    progressPercentage: number;
    status: string;
    totalWatchTimeMinutes: number;
    studentName?: string;
    studentEmail?: string;
    quizStats?: {
      averageScore: number;
    };
  };
  onViewDetail: (enrollment: any) => void;
  onViewQuizStats: (enrollment: any) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  enrollment,
  onViewDetail,
  onViewQuizStats,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-800">
            {enrollment.studentName || `Học viên ${enrollment.userId.slice(-4)}`}
          </h4>
          <p className="text-sm text-gray-500">
            {enrollment.studentEmail || `student@example.com`}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ 
          enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
          enrollment.status === 'active' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {enrollment.status === 'completed' ? 'Hoàn thành' :
           enrollment.status === 'active' ? 'Đang học' : 'Chưa bắt đầu'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Tiến độ</span>
          <span className="font-medium">{enrollment.progressPercentage || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${enrollment.progressPercentage || 0}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Thời gian học:</span>
          <p className="font-medium">{Math.round((enrollment.totalWatchTimeMinutes || 0) / 60)}h</p>
        </div>
        <div>
          <span className="text-gray-500">Quiz TB:</span>
          <p className="font-medium">{enrollment.quizStats?.averageScore || 0}%</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onViewDetail(enrollment)}
          className="flex-1"
        >
          Chi tiết
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewQuizStats(enrollment)}
        >
          Quiz
        </Button>
      </div>
    </div>
  );
};