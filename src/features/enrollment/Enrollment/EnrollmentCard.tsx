import React from "react";
import { ProgressBar, StatusBadge } from "../common/Progress";
import { Button } from "../common/UI";
import { formatDate } from "../utils/formatDate";

interface EnrollmentCardProps {
  enrollment: any;
  onViewDetail?: (enrollment: any) => void;
  onEdit?: (enrollment: any) => void;
  onDelete?: (enrollment: any) => void;
  viewMode?: "student" | "teacher" | "admin";
  showActions?: boolean;
  className?: string;
}

export const EnrollmentCard: React.FC<EnrollmentCardProps> = ({
  enrollment,
  onViewDetail,
  onEdit,
  onDelete,
  viewMode = "student",
  showActions = true,
  className = "",
}) => {
  const progress = enrollment.progressPercentage || 0;
  const status = enrollment.status || "not_started";

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {viewMode === "student" ? `Khóa học: ${enrollment.courseId}` :
               viewMode === "teacher" ? `Học viên: ${enrollment.userId}` :
               `${enrollment.courseId} - ${enrollment.userId}`}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              ID: {enrollment.id}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          progress={progress} 
          className="mb-4"
          showLabel={true}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="text-gray-500">Thời gian xem:</span>
            <p className="font-medium text-gray-900">{enrollment.totalWatchTimeMinutes || 0} phút</p>
          </div>
          <div>
            <span className="text-gray-500">Ngày đăng ký:</span>
            <p className="font-medium text-gray-900">{formatDate(enrollment.enrolledAt)}</p>
          </div>
          <div>
            <span className="text-gray-500">Truy cập cuối:</span>
            <p className="font-medium text-gray-900">{formatDate(enrollment.lastAccessedAt)}</p>
          </div>
          <div>
            <span className="text-gray-500">Hoàn thành:</span>
            <p className="font-medium text-gray-900">{formatDate(enrollment.completionDate)}</p>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t">
            {onViewDetail && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onViewDetail(enrollment)}
                className="flex-1"
              >
                Xem chi tiết
              </Button>
            )}
            {onEdit && viewMode !== "student" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(enrollment)}
                className="flex-1"
              >
                {viewMode === "admin" ? "Chỉnh sửa" : "Cập nhật"}
              </Button>
            )}
            {onDelete && viewMode === "admin" && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(enrollment)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};