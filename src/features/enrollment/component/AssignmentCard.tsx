import React from 'react';
import { UUID } from 'crypto';
import { StatusBadge } from '../common/Progress';
import {formatDate}  from "../utils/formatDate";
interface AssignmentCardProps {
  assignment: {
    id: UUID;
    title: string;
    description?: string;
    courseId: UUID;
    dueDate?: string;
    createdAt?: string;
    totalSubmissions?: number;
    gradedSubmissions?: number;
    averageGrade?: number;
  };
  userRole: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  onEdit?: (assignmentId: UUID) => void;
  onDelete?: (assignmentId: UUID) => void;
  onSubmit?: (assignmentId: UUID) => void;
  onViewSubmissions?: (assignmentId: UUID) => void;
  className?: string;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  userRole,
  onEdit,
  onDelete,
  onSubmit,
  onViewSubmissions,
  className = "",
}) => {

const getHoursUntilDue = (dueDate?: string) => {
  if (!dueDate) return null;

  const timestamp = Number(dueDate);
  if (isNaN(timestamp)) return null;

  const due = new Date(timestamp * 1000);
  const now = new Date();

  const diffTime = due.getTime() - now.getTime();
  const diffHours = diffTime / (1000 * 60 * 60); 
  return diffHours;
};


  const hoursUntilDue = getHoursUntilDue(assignment.dueDate);

  return (
    <div className={`bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
            {assignment.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{assignment.description}</p>
            )}
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="w-10 h-10 rounded-lg bg-[#106c54] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Due Date Info */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Hạn nộp: {formatDate(assignment.dueDate)}</span>
          </div>
          {hoursUntilDue !== null && (
            <div className={`text-sm font-medium ${
              hoursUntilDue <= 0
                ? 'text-red-600'
                : hoursUntilDue <= 72 // 3 ngày
                  ? 'text-amber-600'
                  : 'text-green-600'
            }`}>
              {hoursUntilDue <= 0
                ? 'Hết hạn'
                : hoursUntilDue < 24
                  ? `Còn ${Math.floor(hoursUntilDue)} giờ`
                  : `Còn ${Math.floor(hoursUntilDue / 24)} ngày ${Math.floor(hoursUntilDue % 24)} giờ`
              }
            </div>
          )}
        </div>

        {/* Stats for teachers/admin */}
        {(userRole === 'ADMIN' || userRole === 'INSTRUCTOR') && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[#106c54]">{assignment.totalSubmissions || 0}</p>
              <p className="text-xs text-gray-500">Bài nộp</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{assignment.gradedSubmissions || 0}</p>
              <p className="text-xs text-gray-500">Đã chấm</p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <p className="text-lg font-bold text-amber-600">{assignment.averageGrade || 0}</p>
              <p className="text-xs text-gray-500">Điểm TB</p>
            </div>
          </div>
        )}        
        {/* Actions */}
        <div className="flex gap-2">
          {userRole === 'LEARNER' && onSubmit  && (
            <button
              onClick={() => onSubmit(assignment.id)}
              className="flex-1 bg-[#106c54] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0d5942] transition-colors duration-200"
            >
              Nộp bài
            </button>
          )}
          
          {(userRole === 'ADMIN' || userRole === 'INSTRUCTOR') && (
            <>
              {onViewSubmissions && (
                <button
                  onClick={() => onViewSubmissions(assignment.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Xem bài nộp
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(assignment.id)}
                  className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors duration-200"
                >
                  Chỉnh sửa
                </button>
              )}
              {onDelete && userRole === 'ADMIN' && (
                <button
                  onClick={() => onDelete(assignment.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Xóa
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};