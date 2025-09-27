import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { UUID } from "../utils/UUID";
import { useProgressByEnrollment } from "../hook/useProgress";
import { useEnrollments } from "../hook/useEnrollment";
import { ProgressCard } from "../component/ProgressCard";
import { ProgressBar, StatsCard } from "../common/Progress";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../common/States";
import { Modal, Button, Select } from "../common/UI";

const Progress: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id as UUID;

  // State for selected enrollment
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<UUID | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<any>(null);

  // Get user's enrollments
  const {
    enrollments,
    loading: enrollmentsLoading,
    error: enrollmentsError,
  } = useEnrollments(userId);

  // Get progress for selected enrollment
  const {
    progress: progressList,
    loading: progressLoading,
    error: progressError,
    updateProgressById,
  } = useProgressByEnrollment(selectedEnrollmentId || undefined);

  // Set default enrollment when data loads
  useEffect(() => {
    if (enrollments && enrollments.length > 0 && !selectedEnrollmentId) {
      setSelectedEnrollmentId(enrollments[0].id);
    }
  }, [enrollments, selectedEnrollmentId]);

  // **SÁNG TẠO**: Tính toán thống kê tiến độ tổng quan
  const calculateOverallStats = () => {
    if (!progressList || progressList.length === 0) {
      return {
        totalLectures: 0,
        completedLectures: 0,
        totalWatchTime: 0,
        completionRate: 0,
      };
    }

    const completed = progressList.filter((p: any) => p.isCompleted).length;
    const totalWatchTime = progressList.reduce((sum: number, p: any) => sum + (p.watchTimeMinutes || p.watchedDurationMinutes || 0), 0);

    return {
      totalLectures: progressList.length,
      completedLectures: completed,
      totalWatchTime,
      completionRate: progressList.length > 0 ? Math.round((completed / progressList.length) * 100) : 0,
    };
  };

  const stats = calculateOverallStats();

  // Handle view detail
  const handleViewDetail = (progress: any) => {
    setSelectedProgress(progress);
    setShowDetailModal(true);
  };

  // **SÁNG TẠO**: Simulate progress update (trong thực tế sẽ được gọi khi user xem video)
  const handleSimulateProgress = async (progressId: UUID, watchMinutes: number) => {
    try {
      await updateProgressById(progressId, {
        watchedDurationMinutes: watchMinutes,
        watchedPercentage: watchMinutes >= 30 ? 100 : Math.min((watchMinutes / 30) * 100, 99), // Giả sử 30 phút = hoàn thành
        lastWatchedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (enrollmentsLoading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (enrollmentsError) {
    return (
      <ErrorMessage
        message={enrollmentsError}
        className="m-6"
      />
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <EmptyState
        title="Chưa có khóa học nào"
        description="Bạn chưa đăng ký khóa học nào để xem tiến độ học tập."
        icon={
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
        className="m-6"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tiến độ học tập</h1>
        <p className="text-gray-600">Theo dõi tiến độ học tập của bạn trong từng khóa học</p>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <Select
          label="Chọn khóa học"
          value={selectedEnrollmentId || ""}
          onChange={(value) => setSelectedEnrollmentId(value as UUID)}
          options={enrollments.map((enrollment: any) => ({
            value: enrollment.id,
            label: `Khóa học: ${enrollment.courseId}`,
          }))}
          className="max-w-md"
        />
      </div>

      {selectedEnrollmentId && (
        <>
          {/* **SÁNG TẠO**: Overview Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Tổng bài học"
              value={stats.totalLectures}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
            <StatsCard
              title="Đã hoàn thành"
              value={stats.completedLectures}
              color="#10b981"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Thời gian học"
              value={`${stats.totalWatchTime} phút`}
              color="#f59e0b"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Tỷ lệ hoàn thành"
              value={`${stats.completionRate}%`}
              color="#8b5cf6"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          {/* Overall Progress Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tiến độ tổng quan</h3>
            <ProgressBar
              progress={stats.completionRate}
              size="lg"
              showLabel={true}
            />
            <p className="text-sm text-gray-600 mt-2">
              {stats.completedLectures} / {stats.totalLectures} bài học đã hoàn thành
            </p>
          </div>

          {/* Progress List */}
          {progressLoading ? (
            <LoadingSpinner size="lg" className="min-h-[200px]" />
          ) : progressError ? (
            <ErrorMessage message={progressError} />
          ) : !progressList || progressList.length === 0 ? (
            <EmptyState
              title="Chưa có tiến độ nào"
              description="Khóa học này chưa có bài học nào để theo dõi tiến độ."
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Chi tiết tiến độ từng bài học</h3>
                <span className="text-sm text-gray-500">
                  {progressList.filter((p: any) => p.isCompleted).length} / {progressList.length} hoàn thành
                </span>
              </div>
              
              <div className="space-y-3">
                {progressList.map((progress: any, index: number) => (
                  <ProgressCard
                    key={progress.id}
                    progress={progress}
                    lectureTitle={`Bài học ${index + 1}`}
                    onViewDetail={handleViewDetail}
                    viewMode="student"
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết tiến độ bài học"
        size="md"
      >
        {selectedProgress && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Progress</label>
                <p className="text-gray-900 font-mono text-sm">{selectedProgress.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Bài học</label>
                <p className="text-gray-900 font-mono text-sm">{selectedProgress.lectureId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <p className="text-gray-900">
                  {selectedProgress.isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian xem</label>
                <p className="text-gray-900">{selectedProgress.watchTimeMinutes || selectedProgress.watchedDurationMinutes || 0} phút</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                <p className="text-gray-900">{new Date(selectedProgress.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cập nhật cuối</label>
                <p className="text-gray-900">{new Date(selectedProgress.updatedAt).toLocaleString("vi-VN")}</p>
              </div>
              {selectedProgress.completionDate && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Hoàn thành lúc</label>
                  <p className="text-gray-900">{new Date(selectedProgress.completionDate).toLocaleString("vi-VN")}</p>
                </div>
              )}
            </div>

            {/* **SÁNG TẠO**: Demo buttons để test cập nhật progress */}
            {!selectedProgress.isCompleted && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Demo: Cập nhật tiến độ</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSimulateProgress(selectedProgress.id, 15)}
                  >
                    +15 phút
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSimulateProgress(selectedProgress.id, 30)}
                  >
                    Hoàn thành (30p)
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  *Trong thực tế, progress sẽ được cập nhật tự động khi xem video
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Progress;