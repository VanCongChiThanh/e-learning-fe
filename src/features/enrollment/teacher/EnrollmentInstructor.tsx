import React, { useState } from 'react';
import { UUID } from '../utils/UUID';
import { useInstructorCourses, useCourseStudents, useStudentDetailStats } from '../hook/useInstructorManager';
import { CourseCard } from '../component/CourseCard';
import { StudentCard } from '../component/StudentCard';
import { InstructorDashboard } from '../component/InstructorDashboard';
import { CourseStatsDashboard } from '../component/CourseStatsDashboard';
import { StudentDetailModal } from '../component/StudentDetailModal';
import { QuizStatisticsModal } from '../component/QuizStatisticsModal';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common/States';
import { Button } from '../common/UI';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';


const EnrollmentInstructor: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const instructorId = user?.id as UUID;
  
  // State management
  const [selectedCourseId, setSelectedCourseId] = useState<UUID | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [viewMode, setViewMode] = useState<'courses' | 'students'>('courses');

  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useInstructorCourses(instructorId);

  const {
    courseStats,
    loading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useCourseStudents(selectedCourseId || undefined);

  const {
    studentStats,
    loading: studentStatsLoading,
    error: studentStatsError,
  } = useStudentDetailStats(selectedEnrollment?.id);

  const handleSelectCourse = (courseId: UUID) => {
    setSelectedCourseId(courseId);
    setViewMode('students');
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setViewMode('courses');
  };

  const handleViewStudentDetail = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setShowStudentModal(true);
  };

  const handleViewQuizStats = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setShowQuizModal(true);
  };

  if (coursesLoading && viewMode === 'courses') {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (coursesError && viewMode === 'courses') {
    return (
      <ErrorMessage
        message={coursesError}
        onRetry={refetchCourses}
        className="m-6"
      />
    );
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {viewMode === 'courses' ? 'Quản lý khóa học' : 'Quản lý học viên'}
            </h1>
            <p className="text-gray-600">
              {viewMode === 'courses' 
                ? 'Danh sách khóa học bạn đang hướng dẫn'
                : `Học viên trong khóa học: ${courseStats?.courseName || 'Đang tải...'}`
              }
            </p>
          </div>
          {viewMode === 'students' && (
            <Button
              variant="secondary"
              onClick={handleBackToCourses}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại khóa học
            </Button>
          )}
        </div>
      </div>

      {/* Courses View */}
      {viewMode === 'courses' && (
        <>
          {/* Courses Statistics */}
          <InstructorDashboard courses={courses} />

          {/* Courses List */}
          {!courses || courses.length === 0 ? (
            <EmptyState
              title="Chưa có khóa học nào"
              description="Bạn chưa tạo hoặc được phân công hướng dẫn khóa học nào."
              icon={
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelectCourse={handleSelectCourse}
                  onEditCourse={(courseId) => console.log('Edit course:', courseId)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Students View */}
      {viewMode === 'students' && (
        <>
          {studentsLoading ? (
            <LoadingSpinner size="lg" className="min-h-[400px]" />
          ) : studentsError ? (
            <ErrorMessage
              message={studentsError}
              onRetry={refetchStudents}
              className="m-6"
            />
          ) : courseStats ? (
            <>
              <CourseStatsDashboard 
                stats={{
                  totalStudents: courseStats.totalStudents,
                  activeStudents: courseStats.activeStudents,
                  completedStudents: courseStats.completedStudents,
                  averageProgress: courseStats.averageProgress,
                  completionRate: courseStats.completionRate,
                }}
              />

              {/* Students List */}
              {courseStats.enrollments.length === 0 ? (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courseStats.enrollments.map((enrollment: any) => (
                    <StudentCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      onViewDetail={handleViewStudentDetail}
                      onViewQuizStats={handleViewQuizStats}
                    />
                  ))}
                </div>
              )}
            </>
          ) : null}
        </>
      )}

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        selectedEnrollment={selectedEnrollment}
        studentStats={studentStats}
        studentStatsLoading={studentStatsLoading}
        studentStatsError={studentStatsError}
      />

      {/* Quiz Statistics Modal */}
      <QuizStatisticsModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        selectedEnrollment={selectedEnrollment}
      />
    </div>
  );
};

export default EnrollmentInstructor;