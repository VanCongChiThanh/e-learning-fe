import { formatDate } from "../../features/enrollment/utils/formatDate";
import { UUID } from "../../features/enrollment/utils/UUID";

interface ViewProps {
  enrollment: any;
  fetchEnrollmentById: (id: UUID) => Promise<void>;
}
const View: React.FC<ViewProps> = ({ enrollment, fetchEnrollmentById }) => {
  return (
    <div key={enrollment.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        Khóa học: {enrollment.courseId}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === "COMPLETED" 
                          ? "bg-green-100 text-green-800"
                          : enrollment.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {enrollment.status === "COMPLETED" ? "Hoàn thành" :
                         enrollment.status === "ACTIVE" ? "Đang học" : "Chưa bắt đầu"}
                      </span>
                    </div>
    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Tiến độ:</span>
                        <span className="font-medium">{enrollment.progressPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#106c54] h-2 rounded-full" 
                          style={{ width: `${enrollment.progressPercentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <span>Thời gian xem:</span>
                        <span className="font-medium">{enrollment.totalWatchTimeMinutes || 0} phút</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ngày đăng ký:</span>
                        <span className="font-medium">{formatDate(enrollment.enrolledAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Truy cập cuối:</span>
                        <span className="font-medium">{formatDate(enrollment.lastAccessedAt)}</span>
                      </div>
                    </div>
    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => fetchEnrollmentById(enrollment.id)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
  )
}

export default View