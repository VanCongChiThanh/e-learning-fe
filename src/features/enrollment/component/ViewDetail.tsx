import React from 'react'
import { formatDate } from "../utils/formatDate";
import { UUID } from "../utils/UUID";

interface ViewDetailProps {
  selectedEnrollment: any;
  setSelectedEnrollment: (enrollment: any | null) => void;
  onViewSessions?: (courseId: UUID, enrollmentId: UUID) => void;
}

const ViewDetail: React.FC<ViewDetailProps> = ({ selectedEnrollment, setSelectedEnrollment, onViewSessions }) => {
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
                  <label className="block text-sm font-medium text-gray-700">ID User</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedEnrollment.userId}</p>
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
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setSelectedEnrollment(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
                {onViewSessions && (
                  <button
                    onClick={() => onViewSessions?.(selectedEnrollment.courseId, selectedEnrollment.id)}
                    className="px-4 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5a47] transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Xem Sessions
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
  )
}

export default ViewDetail