import React from 'react';
import { Modal } from '../common/UI';
import { LoadingSpinner, ErrorMessage } from '../common/States';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEnrollment: any;
  studentStats: any;
  studentStatsLoading: boolean;
  studentStatsError: string | null;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  selectedEnrollment,
  studentStats,
  studentStatsLoading,
  studentStatsError,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết học viên"
      size="xl"
    >
      {selectedEnrollment && (
        <div className="space-y-6">
          {/* Student Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên học viên</label>
                <p className="text-gray-900">{selectedEnrollment.studentName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedEnrollment.studentEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tiến độ</label>
                <p className="text-gray-900">{selectedEnrollment.progressPercentage || 0}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <p className="text-gray-900">
                  {selectedEnrollment.status === 'completed' ? 'Hoàn thành' :
                   selectedEnrollment.status === 'active' ? 'Đang học' : 'Chưa bắt đầu'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Details */}
          {studentStatsLoading ? (
            <LoadingSpinner size="md" className="py-8" />
          ) : studentStatsError ? (
            <ErrorMessage message={studentStatsError} />
          ) : studentStats ? (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Tiến độ chi tiết</h4>
              
              {/* Lecture Progress */}
              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-medium mb-3">Tiến độ bài học</h5>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{studentStats.lectureStats.completedLectures}</p>
                    <p className="text-sm text-gray-600">Hoàn thành</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">{studentStats.lectureStats.totalLectures}</p>
                    <p className="text-sm text-gray-600">Tổng bài học</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{Math.round(studentStats.lectureStats.totalWatchTime / 60)}h</p>
                    <p className="text-sm text-gray-600">Thời gian học</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Modal>
  );
};