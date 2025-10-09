import { Course } from "../type";
import {formatDate}  from "../utils/formatDate";
import { UUID } from "../utils/UUID";
import { useNavigate } from "react-router-dom";

interface ViewProps {
  enrollment: any;
  fetchCourseById: (id: UUID) => Promise<void>;
  course: Course
  fetchEnrollmentById: (id: UUID) => Promise<void>;
}

const View: React.FC<ViewProps> = ({ enrollment, course, fetchCourseById, fetchEnrollmentById }) => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    fetchEnrollmentById(enrollment.id);
    // Điều hướng đến trang sessions với enrollmentId và courseId
    navigate(`/learn/sessions/${enrollment.id}/${enrollment.courseId}`);
  };
  return (
    <div key={enrollment.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Course Image Header */}
      <div className="relative h-40 bg-gradient-to-br from-[#106c54] to-[#0d5643] overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-white font-semibold text-lg line-clamp-2">
            Khóa học: {enrollment.id}
          </h3>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
            enrollment.status === "COMPLETED" 
              ? "bg-white text-[#106c54]"
              : enrollment.status === "ACTIVE"
              ? "bg-[#106c54] text-white"
              : "bg-gray-800 text-white"
          }`}>
            {enrollment.status === "COMPLETED" ? "Hoàn thành" :
             enrollment.status === "ACTIVE" ? "Đang học" : "Chưa bắt đầu"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-600">Tiến độ học tập</span>
            <span className="text-sm font-bold text-[#106c54]">{enrollment.progressPercentage || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#106c54] h-2 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${enrollment.progressPercentage || 0}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Thời gian học</div>
            <div className="text-base font-semibold text-gray-800">{enrollment.totalWatchTimeMinutes || 0} phút</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Ngày đăng ký</div>
            <div className="text-base font-semibold text-gray-800">{formatDate(enrollment.enrolledAt)}</div>
          </div>
        </div>

        {/* Last Access */}
        <div className="flex items-center text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Truy cập cuối: <span className="ml-1 font-medium text-gray-700">{formatDate(enrollment.lastAccessedAt)}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleContinue()}
          className="w-full bg-[#106c54] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#0d5643] transition-colors duration-200 flex items-center justify-center group"
        >
          <span>Tiếp tục học</span>
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default View;