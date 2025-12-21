import { useNavigate } from "react-router-dom";

interface ViewProps {
  enrollment: any;
}

// Utility function to format date
const formatDateDisplay = (dateInput: string | number) => {
  if (!dateInput) return "N/A";

  const date = new Date(
    typeof dateInput === "string" ? parseInt(dateInput) : dateInput
  );
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const View: React.FC<ViewProps> = ({ enrollment }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/learning/${enrollment.course?.slug}`);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "bg-emerald-500 text-white",
          text: "Hoàn thành",
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case "ACTIVE":
        return {
          color: "bg-teal-600 text-white",
          text: "Đang học",
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      default:
        return {
          color: "bg-slate-500 text-white",
          text: "Chưa bắt đầu",
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
    }
  };

  const statusInfo = getStatusInfo(enrollment.status);
  const progressPercentage = enrollment.progressPercentage || 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-teal-100 group transform hover:-translate-y-1">
      {/* Course Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={enrollment.course?.image || "/api/placeholder/400/300"}
          alt={enrollment.course?.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${statusInfo.color}`}
          >
            {statusInfo.icon}
            <span className="ml-1.5">{statusInfo.text}</span>
          </span>
        </div>

        {/* Course Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
            {enrollment.course?.title || "Khóa học"}
          </h3>
          {enrollment.course?.instructor && (
            <p className="text-teal-200 text-sm mt-2 font-medium">
              Giảng viên: {enrollment.course.instructor.name}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-gradient-to-b from-white to-teal-50/30">
        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 flex items-center">
              <svg
                className="w-4 h-4 text-teal-600 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Tiến độ học tập
            </span>
            <span className="text-lg font-bold text-teal-600">
              {Number(progressPercentage).toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-3 bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500 rounded-full transition-all duration-700 relative shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
            <div className="flex items-center space-x-2 mb-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-semibold text-teal-700">
                Thời gian học
              </span>
            </div>
            <div className="text-lg font-bold text-teal-800">
              {enrollment.totalWatchTimeMinutes || 0} phút
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-semibold text-blue-700">
                Ngày đăng ký
              </span>
            </div>
            <div className="text-sm font-bold text-blue-800">
              {formatDateDisplay(enrollment.enrollmentDate)}
            </div>
          </div>
        </div>

        {/* Course Category */}
        {enrollment.course?.category && (
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              {enrollment.course.category}
            </span>
          </div>
        )}

        {/* Last Access Info */}
        {enrollment.lastAccessedAt && (
          <div className="flex items-center text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg border">
            <svg
              className="w-4 h-4 mr-2 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Truy cập cuối: </span>
            <span className="ml-1 text-gray-800 font-semibold">
              {formatDateDisplay(enrollment.lastAccessedAt)}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 text-white font-bold py-4 px-6 rounded-xl hover:from-teal-700 hover:via-teal-800 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Tiếp tục học</span>
          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default View;
