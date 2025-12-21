import { useEnrollments } from "../hook/useEnrollment";
import { useSelector } from "react-redux";
import HomeLayout from "../../home/layout/HomeLayout";
import { UUID } from "../utils/UUID";
import { RootState } from "../../../app/store";
import { useNavigate } from "react-router-dom";
import "./EnrollmentLearn.scss";

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

// Component hiển thị thống kê tổng quan
const StatsCard = ({ icon, title, value, description, colorClass }: any) => (
  <div className="enrollment-learn__stats-card">
    <div className={`enrollment-learn__stats-card-icon ${colorClass}`}>
      {icon}
    </div>
    <div className="enrollment-learn__stats-card-title">{title}</div>
    <div className="enrollment-learn__stats-card-value">{value}</div>
    <div className="enrollment-learn__stats-card-description">
      {description}
    </div>
  </div>
);

// Component loading skeleton
const LoadingCard = () => (
  <div className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-full"></div>
  </div>
);

// Component card khóa học
const CourseCard = ({ enrollment }: { enrollment: any }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/learning/${enrollment.course?.slug}`);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "bg-green-100 text-green-800",
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
          color: "bg-[#106c54]/10 text-[#106c54]",
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
          color: "bg-gray-100 text-gray-800",
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
    <div className="enrollment-learn__course-card">
      <div className="enrollment-learn__course-card-image">
        <img
          src={enrollment.course?.image || "/api/placeholder/400/300"}
          alt={enrollment.course?.title}
        />
        <div className="enrollment-learn__course-card-image-overlay"></div>

        <div
          className={`enrollment-learn__course-card-image-badge enrollment-learn__course-card-image-badge--${enrollment.status.toLowerCase()}`}
        >
          {statusInfo.icon}
          <span>{statusInfo.text}</span>
        </div>

        <div className="enrollment-learn__course-card-image-title">
          <h3>{enrollment.course?.title || "Khóa học"}</h3>
        </div>
      </div>

      <div className="enrollment-learn__course-card-content">
        <div className="progress">
          <div className="progress-header">
            <span>Tiến độ học tập</span>
            <span>{Number(progressPercentage).toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Thời gian học
            </div>
            <div className="info-value">
              {enrollment.totalWatchTimeMinutes || 0} phút
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Ngày đăng ký
            </div>
            <div className="info-value">
              {formatDateDisplay(enrollment.enrollmentDate)}
            </div>
          </div>
        </div>

        {enrollment.course?.instructor && (
          <div className="instructor-info">
            <img
              src={
                enrollment.course.instructor.avatar || "/api/placeholder/32/32"
              }
              alt={enrollment.course.instructor.name}
            />
            <div className="instructor-details">
              <div className="name">{enrollment.course.instructor.name}</div>
              <div className="role">Giảng viên</div>
            </div>
          </div>
        )}

        {enrollment.course?.category && (
          <div className="category">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            {enrollment.course.category}
          </div>
        )}

        <button onClick={handleContinue} className="action-button">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {enrollment.status === "COMPLETED" ? "Ôn tập lại" : "Tiếp tục học"}
        </button>
      </div>
    </div>
  );
};

export default function EnrollmentLearn() {
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: { id: string } | null }
  );
  const userId = user?.id;
  const { enrollments, loading, error } = useEnrollments(userId as UUID);

  // Tính toán thống kê
  const stats = {
    total: enrollments?.length || 0,
    active: enrollments?.filter((e) => e.status === "ACTIVE").length || 0,
    completed: enrollments?.filter((e) => e.status === "COMPLETED").length || 0,
    avgProgress: enrollments?.length
      ? Math.round(
          enrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0) /
            enrollments.length
        )
      : 0,
  };

  if (loading) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#106c54]/5 via-white to-[#106c54]/10">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Header skeleton */}
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>

            {/* Cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }

  if (error) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#106c54]/5 via-white to-[#106c54]/10 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-2xl border border-red-200 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="enrollment-learn">
        <div className="enrollment-learn__container">
          <div className="enrollment-learn__header">
            <h1>
              Khóa học <span className="highlight">của tôi</span>
            </h1>
            <p>Tiếp tục hành trình học tập và phát triển kỹ năng của bạn</p>
          </div>

          <div className="enrollment-learn__stats">
            <StatsCard
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Tổng khóa học"
              value={stats.total}
              description="Khóa học đã đăng ký"
              colorClass="enrollment-learn__stats-card-icon--primary"
            />
            <StatsCard
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              title="Đang học"
              value={stats.active}
              description="Khóa học đang tiếp tục"
              colorClass="enrollment-learn__stats-card-icon--secondary"
            />
            <StatsCard
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              title="Hoàn thành"
              value={stats.completed}
              description="Khóa học đã hoàn thành"
              colorClass="enrollment-learn__stats-card-icon--success"
            />
            <StatsCard
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              title="Tiến độ TB"
              value={`${stats.avgProgress}%`}
              description="Tiến độ trung bình"
              colorClass="enrollment-learn__stats-card-icon--warning"
            />
          </div>

          {enrollments && enrollments.length > 0 ? (
            <div className="enrollment-learn__courses">
              <div className="enrollment-learn__courses-header">
                <h2>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Danh sách khóa học
                </h2>
                <div className="enrollment-learn__courses-header-badge">
                  {enrollments.length} khóa học
                </div>
              </div>
              <div className="enrollment-learn__courses-grid">
                {enrollments.map((enrollment) => (
                  <CourseCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            </div>
          ) : (
            <div className="enrollment-learn__empty-state">
              <div className="empty-card">
                <div className="empty-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C6.228 6.253 2 10.541 2 15.75S6.228 25.247 12 25.247s10-4.288 10-9.497c0-5.209-4.228-9.497-10-9.497z"
                    />
                  </svg>
                </div>
                <h3>Chưa có khóa học nào</h3>
                <p>
                  Hãy khám phá và bắt đầu hành trình học tập của bạn ngay hôm
                  nay
                </p>
                <button
                  className="action-button"
                  onClick={() => (window.location.href = "/courses")}
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Khám phá khóa học
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
