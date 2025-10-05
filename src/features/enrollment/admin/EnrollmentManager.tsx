import React from 'react';
import { LoadingSpinner, ErrorMessage } from '../common/States';
import { useEnrollmentManager } from '../hook/useEnrollmentManager';
import SystemStatistics from '../component/SystemStatistics';
import FilterSection from '../component/FilterSection';
import EnrollmentList from '../component/EnrollmentList';
import EnrollmentModals from '../component/EnrollmentModals';

const EnrollmentManager = () => {
  const {
    filterUserId,
    setFilterUserId,
    filterCourseId,
    setFilterCourseId,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    showDetailModal,
    setShowDetailModal,
    showEditModal,
    setShowEditModal,
    selectedEnrollment,
    editData,
    setEditData,
    
    enrollments,
    filteredEnrollments,
    stats,
    loading,
    error,
    
    handleViewDetail,
    handleEditEnrollment,
    handleUpdateEnrollment,
    handleDeleteEnrollment,
    fetchEnrollments,
  } = useEnrollmentManager();

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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Enrollment</h1>
        <p className="text-gray-600">Theo dõi và quản lý tất cả enrollment trong hệ thống</p>
      </div>

      {/* System Statistics */}
      <SystemStatistics stats={stats} />

      {/* Filter Section */}
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filterUserId={filterUserId}
        setFilterUserId={setFilterUserId}
        filterCourseId={filterCourseId}
        setFilterCourseId={setFilterCourseId}
        filteredCount={filteredEnrollments.length}
        totalCount={enrollments?.length || 0}
      />

      {/* Enrollment List */}
      <EnrollmentList
        filteredEnrollments={filteredEnrollments}
        onViewDetail={handleViewDetail}
        onEdit={handleEditEnrollment}
        onDelete={handleDeleteEnrollment}
      />

      {/* Modals */}
      <EnrollmentModals
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        selectedEnrollment={selectedEnrollment}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editData={editData}
        setEditData={setEditData}
        onUpdateEnrollment={handleUpdateEnrollment}
      />
    </div>
  );
};

export default EnrollmentManager;
