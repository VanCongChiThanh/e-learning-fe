import React, { useState } from 'react';
import { UUID } from '../utils/UUID';
import { useEnrollments } from '../hook/useEnrollment';
import { useProgressByEnrollment } from '../hook/useProgress';
import { EnrollmentCard } from '../Enrollment/EnrollmentCard';
import { ProgressCard } from '../Enrollment/ProgressCard';
import { StatsCard } from '../common/Progress';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common/States';
import { Modal, Button, Select } from '../common/UI';

interface EnrollmentTeacherProps {
  courseId: UUID;
}

const EnrollmentTeacher: React.FC<EnrollmentTeacherProps> = ({ courseId }) => {
  // State for modals and selected data
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [selectedEnrollmentForProgress, setSelectedEnrollmentForProgress] = useState<UUID | null>(null);

  // Get enrollments for this course (assuming we modify the hook to accept courseId)
  const {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    editEnrollment,
  } = useEnrollments(undefined);  // Will need to modify hook to filter by courseId

  // Get progress for selected enrollment
  const {
    progress: progressList,
    loading: progressLoading,
    error: progressError,
    updateProgressById,
  } = useProgressByEnrollment(selectedEnrollmentForProgress || undefined);

  // **SÁNG TẠO**: Calculate course statistics
  const calculateCourseStats = () => {
    if (!enrollments || enrollments.length === 0) {
      return {
        totalStudents: 0,
        completedStudents: 0,
        averageProgress: 0,
        totalWatchTime: 0,
        completionRate: 0,
      };
    }

    const completed = enrollments.filter((e: any) => e.status === "completed").length;
    const totalProgress = enrollments.reduce((sum: number, e: any) => sum + (e.progressPercentage || 0), 0);
    const totalWatchTime = enrollments.reduce((sum: number, e: any) => sum + (e.totalWatchTimeMinutes || 0), 0);

    return {
      totalStudents: enrollments.length,
      completedStudents: completed,
      averageProgress: enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0,
      totalWatchTime,
      completionRate: enrollments.length > 0 ? Math.round((completed / enrollments.length) * 100) : 0,
    };
  };

  const stats = calculateCourseStats();

  // Handle view enrollment detail
  const handleViewDetail = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setShowDetailModal(true);
  };

  // Handle view student progress
  const handleViewProgress = (enrollment: any) => {
    setSelectedEnrollmentForProgress(enrollment.id);
    setSelectedEnrollment(enrollment);
    setShowProgressModal(true);
  };

  // Handle update enrollment
  const handleUpdateEnrollment = async (enrollment: any) => {
    // In real scenario, show update form
    try {
      await editEnrollment(enrollment.id, {
        progressPercentage: Math.min((enrollment.progressPercentage || 0) + 10, 100),
      });
    } catch (error) {
      console.error("Error updating enrollment:", error);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchEnrollments}
        className="m-6"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý học viên</h1>
        <p className="text-gray-600">Xem danh sách và tiến độ học viên trong khóa học</p>
        <p className="text-sm text-gray-500">Course ID: {courseId}</p>
      </div>

      {/* **SÁNG TẠO**: Course Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatsCard
          title="Tổng học viên"
          value={stats.totalStudents}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Đã hoàn thành"
          value={stats.completedStudents}
          color="#10b981"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Tiến độ TB"
          value={`${stats.averageProgress}%`}
          color="#3b82f6"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatsCard
          title="Tỷ lệ hoàn thành"
          value={`${stats.completionRate}%`}
          color="#8b5cf6"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatsCard
          title="Tổng thời gian"
          value={`${Math.round(stats.totalWatchTime / 60)}h`}
          color="#f59e0b"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Students List */}
      {!enrollments || enrollments.length === 0 ? (
        <EmptyState
          title="Chưa có học viên nào"
          description="Chưa có học viên nào đăng ký khóa học này."
          icon={
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Danh sách học viên</h3>
            <span className="text-sm text-gray-500">
              {enrollments.length} học viên
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment: any) => (
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                viewMode="teacher"
                onViewDetail={handleViewDetail}
                onEdit={handleUpdateEnrollment}
                showActions={true}
              />
            ))}
          </div>

          {/* **SÁNG TẠO**: Quick Actions */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  // Export student list functionality
                  console.log("Export student list");
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất danh sách
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // Send notification to all students
                  console.log("Send notification");
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h7a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Gửi thông báo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết học viên"
        size="lg"
      >
        {selectedEnrollment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Enrollment</label>
                <p className="text-gray-900 font-mono text-sm">{selectedEnrollment.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Học viên</label>
                <p className="text-gray-900 font-mono text-sm">{selectedEnrollment.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tiến độ</label>
                <p className="text-gray-900">{selectedEnrollment.progressPercentage || 0}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <p className="text-gray-900">{selectedEnrollment.status || "Không xác định"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian học</label>
                <p className="text-gray-900">{selectedEnrollment.totalWatchTimeMinutes || 0} phút</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày đăng ký</label>
                <p className="text-gray-900">{new Date(selectedEnrollment.enrolledAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => handleViewProgress(selectedEnrollment)}
                className="flex-1"
              >
                Xem tiến độ chi tiết
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleUpdateEnrollment(selectedEnrollment)}
                className="flex-1"
              >
                Cập nhật tiến độ
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Student Progress Modal */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setSelectedEnrollmentForProgress(null);
        }}
        title="Tiến độ chi tiết từng bài học"
        size="xl"
      >
        {selectedEnrollment && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">
                Học viên: {selectedEnrollment.userId}
              </h4>
              <p className="text-sm text-gray-600">
                Tiến độ tổng: {selectedEnrollment.progressPercentage || 0}%
              </p>
            </div>

            {progressLoading ? (
              <LoadingSpinner size="md" className="py-8" />
            ) : progressError ? (
              <ErrorMessage message={progressError} />
            ) : !progressList || progressList.length === 0 ? (
              <EmptyState
                title="Chưa có tiến độ"
                description="Học viên chưa có tiến độ học tập nào."
              />
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {progressList.map((progress: any, index: number) => (
                  <ProgressCard
                    key={progress.id}
                    progress={progress}
                    lectureTitle={`Bài học ${index + 1}`}
                    viewMode="teacher"
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EnrollmentTeacher;