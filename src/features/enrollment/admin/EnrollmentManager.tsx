import React, { useState, useMemo } from 'react';
import { useEnrollments } from '../hook/useEnrollment';
import { formatDate } from '../utils/formatDate';
import { EnrollmentCard } from '../Enrollment/EnrollmentCard';
import { StatsCard } from '../common/Progress';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common/States';
import { Modal, Button, Input, Select } from '../common/UI';

const EnrollmentManager = () => {
  // State management
  const [filterUserId, setFilterUserId] = useState('');
  const [filterCourseId, setFilterCourseId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [editData, setEditData] = useState({
    progressPercentage: '',
    status: '',
    totalWatchTimeMinutes: '',
  });
  
  // Get all enrollments (Admin can see all)
  const {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    editEnrollment,
  } = useEnrollments();

  // Advanced filtering and search functionality
  const filteredEnrollments = useMemo(() => {
    if (!enrollments) return [];
    
    return enrollments.filter((enrollment: any) => {
      const matchesSearch = searchTerm === '' || 
        enrollment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.userId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUserId = activeFilter !== 'user' || 
        (filterUserId === '' || enrollment.userId.toLowerCase().includes(filterUserId.toLowerCase()));

      const matchesCourseId = activeFilter !== 'course' || 
        (filterCourseId === '' || enrollment.courseId.toLowerCase().includes(filterCourseId.toLowerCase()));

      return matchesSearch && matchesUserId && matchesCourseId;
    });
  }, [enrollments, searchTerm, activeFilter, filterUserId, filterCourseId]);

  // System-wide statistics calculation
  const calculateSystemStats = () => {
    if (!enrollments || enrollments.length === 0) {
      return {
        totalEnrollments: 0,
        completedEnrollments: 0,
        inProgressEnrollments: 0,
        completionRate: 0,
        activeUsers: 0,
        activeCourses: 0,
      };
    }

    const completed = enrollments.filter((e: any) => e.status === "completed").length;
    const uniqueUsers = new Set(enrollments.map((e: any) => e.userId)).size;
    const uniqueCourses = new Set(enrollments.map((e: any) => e.courseId)).size;

    return {
      totalEnrollments: enrollments.length,
      completedEnrollments: completed,
      inProgressEnrollments: enrollments.length - completed,
      completionRate: enrollments.length > 0 ? Math.round((completed / enrollments.length) * 100) : 0,
      activeUsers: uniqueUsers,
      activeCourses: uniqueCourses,
    };
  };

  const stats = calculateSystemStats();

  // Event handlers
  const handleViewDetail = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setShowDetailModal(true);
  };

  const handleEditEnrollment = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setEditData({
      progressPercentage: enrollment.progressPercentage?.toString() || '',
      status: enrollment.status || '',
      totalWatchTimeMinutes: enrollment.totalWatchTimeMinutes?.toString() || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollment) return;

    try {
      const updateData: any = {};
      if (editData.progressPercentage) updateData.progressPercentage = editData.progressPercentage;
      if (editData.status) updateData.status = editData.status;
      if (editData.totalWatchTimeMinutes) updateData.totalWatchTimeMinutes = editData.totalWatchTimeMinutes;

      await editEnrollment(selectedEnrollment.id, updateData);
      setShowEditModal(false);
      setSelectedEnrollment(null);
      setEditData({ progressPercentage: '', status: '', totalWatchTimeMinutes: '' });
    } catch (error) {
      console.error("Error updating enrollment:", error);
    }
  };

  const handleDeleteEnrollment = async (enrollment: any) => {
    if (window.confirm(`Xác nhận xóa enrollment ${enrollment.id}?`)) {
      console.log("Delete enrollment:", enrollment.id);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[500px]" />;
  }

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Enrollment</h1>
        <p className="text-gray-600">Theo dõi và quản lý tất cả enrollment trong hệ thống</p>
      </div>

      {/* Comprehensive System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Tổng Enrollment"
          value={stats.totalEnrollments}
          color="#106c54"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Đã hoàn thành"
          value={stats.completedEnrollments}
          color="#10b981"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Đang học"
          value={stats.inProgressEnrollments}
          color="#f59e0b"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
      </div>

      {/* Additional System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatsCard
          title="Người dùng hoạt động"
          value={stats.activeUsers}
          color="#3b82f6"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        <StatsCard
          title="Khóa học hoạt động"
          value={stats.activeCourses}
          color="#06b6d4"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc và tìm kiếm</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            label="Tìm kiếm"
            type="text"
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="ID enrollment, course, user..."
          />
          
          <Select
            label="Loại bộ lọc"
            value={activeFilter}
            onChange={setActiveFilter}
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'user', label: 'Theo User ID' },
              { value: 'course', label: 'Theo Course ID' },
            ]}
          />

          {activeFilter === 'user' && (
            <Input
              label="User ID"
              type="text"
              value={filterUserId}
              onChange={setFilterUserId}
              placeholder="Nhập User ID"
            />
          )}

          {activeFilter === 'course' && (
            <Input
              label="Course ID"
              type="text"
              value={filterCourseId}
              onChange={setFilterCourseId}
              placeholder="Nhập Course ID"
            />
          )}
        </div>

        <div className="text-sm text-gray-600">
          Hiển thị {filteredEnrollments.length} / {enrollments?.length || 0} enrollment
        </div>
      </div>

      {filteredEnrollments.length === 0 ? (
        <EmptyState
          title="Không tìm thấy enrollment nào"
          description="Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác."
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Danh sách Enrollment</h3>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => console.log("Export enrollments")}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất báo cáo
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEnrollments.map((enrollment: any) => (
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                viewMode="admin"
                onViewDetail={handleViewDetail}
                onEdit={handleEditEnrollment}
                onDelete={handleDeleteEnrollment}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

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
        <form onSubmit={handleUpdateEnrollment} className="space-y-4">
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
    </div>
  );
};

export default EnrollmentManager;
