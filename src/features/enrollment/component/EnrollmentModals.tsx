import React from 'react';
import { Modal, Button, Input, Select } from '../common/UI';
import { formatDate } from '../utils/formatDate';

interface EnrollmentModalsProps {
  // Detail Modal Props
  showDetailModal: boolean;
  setShowDetailModal: (show: boolean) => void;
  selectedEnrollment: any;
  
  // Edit Modal Props
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editData: {
    progressPercentage: string;
    status: string;
    totalWatchTimeMinutes: string;
  };
  setEditData: (data: any) => void;
  onUpdateEnrollment: (e: React.FormEvent) => void;
}

const EnrollmentModals: React.FC<EnrollmentModalsProps> = ({
  showDetailModal,
  setShowDetailModal,
  selectedEnrollment,
  showEditModal,
  setShowEditModal,
  editData,
  setEditData,
  onUpdateEnrollment,
}) => {
  return (
    <>
      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết Enrollment"
        size="lg"
      >
        {selectedEnrollment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Enrollment</label>
                <p className="text-gray-900 font-mono text-sm">{selectedEnrollment.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Khóa học</label>
                <p className="text-gray-900 font-mono text-sm">{selectedEnrollment.courseId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Người dùng</label>
                <p className="text-gray-900 font-mono text-sm">{selectedEnrollment.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <p className="text-gray-900">{selectedEnrollment.status || "Không xác định"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tiến độ</label>
                <p className="text-gray-900">{selectedEnrollment.progressPercentage || 0}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian học</label>
                <p className="text-gray-900">{selectedEnrollment.totalWatchTimeMinutes || 0} phút</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày đăng ký</label>
                <p className="text-gray-900">{formatDate(selectedEnrollment.enrolledAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Truy cập cuối</label>
                <p className="text-gray-900">{formatDate(selectedEnrollment.lastAccessedAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hoàn thành</label>
                <p className="text-gray-900">{formatDate(selectedEnrollment.completionDate)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Chỉnh sửa Enrollment"
        size="md"
      >
        <form onSubmit={onUpdateEnrollment} className="space-y-4">
          <Input
            label="Tiến độ (%)"
            type="number"
            value={editData.progressPercentage}
            onChange={(value) => setEditData({ ...editData, progressPercentage: value })}
            placeholder="0-100"
          />
          
          <Select
            label="Trạng thái"
            value={editData.status}
            onChange={(value) => setEditData({ ...editData, status: value })}
            options={[
              { value: '', label: 'Chọn trạng thái' },
              { value: 'not_started', label: 'Chưa bắt đầu' },
              { value: 'in_progress', label: 'Đang học' },
              { value: 'completed', label: 'Hoàn thành' },
              { value: 'expired', label: 'Hết hạn' },
            ]}
          />
          
          <Input
            label="Thời gian học (phút)"
            type="number"
            value={editData.totalWatchTimeMinutes}
            onChange={(value) => setEditData({ ...editData, totalWatchTimeMinutes: value })}
            placeholder="Số phút đã học"
          />

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Cập nhật
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EnrollmentModals;