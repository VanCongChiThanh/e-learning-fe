import React, { useState } from "react";
import { useEnrollments } from "../hook/useEnrollment";
import { UUID } from "../utils/UUID";
import { useSelector } from "react-redux";
import { Card } from "../component/Card";
import View from "../component/View";
import ViewDetail from "../component/ViewDetail";
import SessionLearn from "./SessionLearn";
import { RootState } from "../../../app/store";
import HomeLayout from "../../home/layout/HomeLayout";
const EnrollmentLearn: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;
  
  // State để quản lý việc hiển thị SessionLearn
  const [showSessionLearn, setShowSessionLearn] = useState(false);
  const [currentEnrollmentId, setCurrentEnrollmentId] = useState<UUID | null>(null);
  const [currentCourseId, setCurrentCourseId] = useState<UUID | null>(null);
  const {
    enrollments,
    selectedEnrollment,
    setSelectedEnrollment, 
    loading,
    error,
    fetchEnrollmentById,
    fetchEnrollments,
  } = useEnrollments(userId as UUID);
  
  // Handler để xem sessions
  const handleViewSessions = (courseId: UUID, enrollmentId: UUID) => {
    setCurrentEnrollmentId(enrollmentId);
    setCurrentCourseId(courseId);
    setShowSessionLearn(true);
    setSelectedEnrollment(null); // Đóng modal chi tiết
  };
  
  // Handler để quay lại từ SessionLearn
  const handleBackFromSessions = () => {
    setShowSessionLearn(false);
    setCurrentEnrollmentId(null);
  };
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <HomeLayout>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={() => fetchEnrollments()}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
      </HomeLayout>
    );
    
  }

  return (
    <HomeLayout>
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Khóa học của tôi</h1>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card color="bg-[#106c54]" value={enrollments?.length || 0} label="Tổng khóa học" />
        <Card color="bg-[#3b82f6]" value={enrollments?.filter(e => e.status === "COMPLETED")?.length || 0} label="Đã hoàn thành" />
        <Card color="bg-[#f97316]" value={enrollments?.filter(e => e.status === "ACTIVE")?.length || 0} label="Đang học" />
      </div>

      {/* Danh sách enrollments */}
      {enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <View
              key={enrollment.id}
              enrollment={enrollment}
              fetchEnrollmentById={fetchEnrollmentById}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
        </div>
      )}

      {/* Chi tiết enrollment được chọn */}
      {selectedEnrollment && (
        <ViewDetail 
          selectedEnrollment={selectedEnrollment} 
          setSelectedEnrollment={setSelectedEnrollment}
          onViewSessions={handleViewSessions}
        />
      )}
      {
        showSessionLearn && currentEnrollmentId && currentCourseId && (
          <SessionLearn 
            courseId={currentCourseId as UUID}
            enrollmentId={currentEnrollmentId as UUID}
            onBack={handleBackFromSessions}
          />
        )
      }
    </div>
    </HomeLayout>
  );
};
export default EnrollmentLearn;