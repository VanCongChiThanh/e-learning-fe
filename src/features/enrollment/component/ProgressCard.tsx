import React from "react";
import { StatusBadge } from "../common/Progress";
import { Button } from "../common/UI";
import { formatDate } from "../utils/formatDate";

interface ProgressCardProps {
  progress: any;
  lectureTitle?: string;
  onViewDetail?: (progress: any) => void;
  onEdit?: (progress: any) => void;
  viewMode?: "student" | "teacher" | "admin";
  showActions?: boolean;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  progress,
  lectureTitle,
  onViewDetail,
  onEdit,
  viewMode = "student",
  showActions = true,
  className = "",
}) => {
  const isCompleted = progress.isCompleted;
  const watchTime = progress.watchTimeMinutes || 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Completion Icon */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
          }`}>
            {isCompleted ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">
              {lectureTitle || `Bài học ${progress.lectureId}`}
            </h4>
            <p className="text-sm text-gray-500">
              ID: {progress.id}
            </p>
          </div>
        </div>

        <StatusBadge status={isCompleted ? "completed" : "in_progress"} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-500">Thời gian xem:</span>
          <p className="font-medium text-gray-900">{watchTime} phút</p>
        </div>
        <div>
          <span className="text-gray-500">Cập nhật cuối:</span>
          <p className="font-medium text-gray-900">{formatDate(progress.updatedAt)}</p>
        </div>
        {isCompleted && (
          <div className="col-span-2">
            <span className="text-gray-500">Hoàn thành lúc:</span>
            <p className="font-medium text-gray-900">{formatDate(progress.completionDate)}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-3 border-t">
          {onViewDetail && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetail(progress)}
              className="flex-1"
            >
              Chi tiết
            </Button>
          )}
          {onEdit && viewMode !== "student" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(progress)}
              className="flex-1"
            >
              Cập nhật
            </Button>
          )}
        </div>
      )}
    </div>
  );
};