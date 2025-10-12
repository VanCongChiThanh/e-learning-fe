import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { useEnrollments } from '../hook/useEnrollment';

interface CourseStats {
  enrollmentCount: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
}

const CourseDetailInstructor: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { 
    coursesMap, 
    enrollments,
    fetchCourseById, 
    fetchEnrollmentsByCourseId,
    loading 
  } = useEnrollments();

  const [courseStats, setCourseStats] = useState<CourseStats>({
    enrollmentCount: 0,
    activeStudents: 0,
    completedStudents: 0,
    averageProgress: 0
  });

  // Fetch course detail và enrollments khi component mount
  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId as UUID);
      fetchEnrollmentsByCourseId(courseId as UUID);
    }
  }, [courseId, fetchCourseById, fetchEnrollmentsByCourseId]);

  // Calculate course statistics when enrollments change
  useEffect(() => {
    if (enrollments.length > 0) {
      const activeStudents = enrollments.filter(e => e.status === 'active').length;
      const completedStudents = enrollments.filter(e => e.status === 'completed').length;
      const totalProgress = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
      const averageProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

      setCourseStats({
        enrollmentCount: enrollments.length,
        activeStudents,
        completedStudents,
        averageProgress
      });
    }
  }, [enrollments]);

  // Lấy course từ coursesMap
  const course = courseId ? coursesMap[courseId]?.data : null;
  // const handleManageQuizzes = () => {
  //   navigate(`/teacher/course/${courseId}/quiz-management`);
  // };

  const handleCreateQuiz = () => {
    navigate(`/teacher/course/${courseId}/quiz/create`);
  };

  const handleViewQuizzes = () => {
    navigate(`/teacher/course/${courseId}/quizzes`);
  };

  const handleViewStudents = () => {
    navigate(`/teacher/course/${courseId}/students`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy khóa học</p>
          <button
            onClick={() => navigate('/teacher/enrollments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/teacher/enrollments')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại danh sách khóa học
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {course.name || course.title || 'Khóa học'}
              </h1>
              <p className="text-gray-600 mt-2">
                {course.description || 'Quản lý khóa học và quiz'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Học viên</h3>
                <p className="text-sm text-gray-500">{courseStats.enrollmentCount} học viên</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleViewStudents}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Xem danh sách
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quiz</h3>
                <p className="text-sm text-gray-500">Quản lý bài quiz</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleViewQuizzes}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Xem danh sách
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Tạo Quiz</h3>
                <p className="text-sm text-gray-500">Tạo bài quiz mới</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleCreateQuiz}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Tạo mới
              </button>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khóa học</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tên khóa học</h3>
              <p className="mt-1 text-sm text-gray-900">
                {course?.title || 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Số học viên</h3>
              <p className="mt-1 text-sm text-gray-900">
                {courseStats.enrollmentCount}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                course?.status === 'PUBLISHED' 
                  ? 'bg-green-100 text-green-800'
                  : course?.status === 'DRAFT'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {course?.status === 'PUBLISHED' 
                  ? 'Đang hoạt động'
                  : course?.status === 'DRAFT'
                  ? 'Nháp'
                  : course?.status === 'ARCHIVED'
                  ? 'Đã lưu trữ'
                  : 'N/A'
                }
              </span>
            </div>
          </div>

          {course?.description && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">Mô tả</h3>
              <p className="mt-1 text-sm text-gray-900">
                {course.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailInstructor;