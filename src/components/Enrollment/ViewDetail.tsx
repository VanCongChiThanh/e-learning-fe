import React from 'react'
import { formatDate } from "../../features/enrollment/utils/formatDate";
interface ViewDetailProps {
  selectedEnrollment: any;
  setSelectedEnrollment: (enrollment: any | null) => void;
}

const ViewDetail: React.FC<ViewDetailProps> = ({ selectedEnrollment, setSelectedEnrollment }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết khóa học</h2>
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
                  <label className="block text-sm font-medium text-gray-700">Tiến độ</label>
                  <p className="text-gray-900">{selectedEnrollment.progressPercentage || 0}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <p className="text-gray-900">{selectedEnrollment.status || "Chưa xác định"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thời gian xem</label>
                  <p className="text-gray-900">{selectedEnrollment.totalWatchTimeMinutes || 0} phút</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày hoàn thành</label>
                  <p className="text-gray-900">{formatDate(selectedEnrollment.completionDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày đăng ký</label>
                  <p className="text-gray-900">{formatDate(selectedEnrollment.enrolledAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Truy cập cuối</label>
                  <p className="text-gray-900">{formatDate(selectedEnrollment.lastAccessedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ViewDetail