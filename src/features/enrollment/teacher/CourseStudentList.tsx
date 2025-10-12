import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { useEnrollments } from '../hook/useEnrollment';

interface EnrollmentReport {
  enrollmentId: string;
  userId: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  enrollmentStatus: 'ACTIVE' | 'COMPLETED' | 'INACTIVE';
  progressPercentage: number;
  totalWatchTimeMinutes: number | null;
  enrollmentDate: number;
  completionDate: number | null;
  lastAccessedAt: number | null;
  totalQuizzes: number;
  completedQuizzes: number;
  passedQuizzes: number;
  averageQuizScore: number;
  totalAssignments: number;
  submittedAssignments: number;
  gradedAssignments: number;
  averageAssignmentScore: number;
  hasCertificate: boolean;
  certificateNumber: string | null;
  certificateIssuedDate: number | null;
}

interface Student {
  id: UUID;
  email: string;
  fullName: string;
  enrollmentDate: string;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'INACTIVE';
  enrollmentData: EnrollmentReport;
}

const CourseStudentList: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { 
    enrollments, 
    coursesMap, 
    fetchCourseById, 
    fetchEnrollmentReportByCourseId,
    loading 
  } = useEnrollments();

  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<EnrollmentReport[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId as UUID);
      fetchEnrollmentReportByCourseId(courseId as UUID);
    }
  }, [courseId, fetchCourseById, fetchEnrollmentReportByCourseId]);

  useEffect(() => {
    const reportData = enrollments as EnrollmentReport[];
    setReports(reportData);
    const studentList = reportData.map(report => ({
      id: report.userId,
      email: report.userEmail,
      fullName: report.userEmail?.split('@')[0], // Extract name from email for now
      enrollmentDate: new Date(report.enrollmentDate * 1000).toISOString(),
      progress: report.progressPercentage || 0,
      status: report.enrollmentStatus,
      enrollmentData: report
    }));
    setStudents(studentList as Student[]);
  }, [enrollments]);

  const course = courseId ? coursesMap[courseId]?.data : null;

  const handleBackToCourse = () => {
    navigate(`/teacher/course/${courseId}`);
  };

  const handleViewStudentProgress = (studentId: string) => {
    navigate(`/teacher/course/${courseId}/student/${studentId}/progress`);
  };

  // Calculate statistics based on enrollment reports
  const activeStudents = students.filter(s => s.status === 'ACTIVE').length;
  const completedStudents = students.filter(s => s.status === 'COMPLETED').length;
  const inactiveStudents = students.filter(s => s.status === 'INACTIVE').length;
  const averageProgress = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length) 
    : 0;
  
  // Quiz statistics
  const totalQuizzes = reports.length > 0 ? Math.max(...reports.map(r => r.totalQuizzes)) : 0;
  const averageQuizScore = reports.length > 0 
    ? Math.round(reports.reduce((acc, r) => acc + r.averageQuizScore, 0) / reports.length) 
    : 0;
  
  // Assignment statistics  
  const totalAssignments = reports.length > 0 ? Math.max(...reports.map(r => r.totalAssignments)) : 0;
  const averageAssignmentScore = reports.length > 0 
    ? Math.round(reports.reduce((acc, r) => acc + r.averageAssignmentScore, 0) / reports.length) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToCourse}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại chi tiết khóa học
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Danh sách học viên
          </h1>
          <p className="text-gray-600 mt-2">
            Khóa học: {course?.title || 'N/A'}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{students.length}</p>
                <p className="text-sm text-gray-500">Tổng học viên</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{activeStudents}</p>
                <p className="text-sm text-gray-500">Đang học</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{completedStudents}</p>
                <p className="text-sm text-gray-500">Hoàn thành</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{averageProgress}%</p>
                <p className="text-sm text-gray-500">Tiến độ TB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{totalQuizzes}</p>
                <p className="text-sm text-gray-500">Tổng Quiz</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{averageQuizScore}%</p>
                <p className="text-sm text-gray-500">Điểm TB Quiz</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{totalAssignments}</p>
                <p className="text-sm text-gray-500">Tổng Bài tập</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{inactiveStudents}</p>
                <p className="text-sm text-gray-500">Không hoạt động</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Danh sách học viên ({students.length})
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Thông tin chi tiết về các học viên đã đăng ký khóa học
            </p>
          </div>
          
          {students.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có học viên</h3>
              <p className="mt-1 text-sm text-gray-500">
                Khóa học này chưa có học viên nào đăng ký.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {students.map((student) => (
                <li key={student.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {student.fullName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {student.fullName}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800'
                              : student.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.status === 'ACTIVE' 
                              ? 'Đang học'
                              : student.status === 'COMPLETED'
                              ? 'Hoàn thành'
                              : 'Không hoạt động'
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <div className="flex space-x-4 text-xs text-gray-400">
                          <span>Đăng ký: {new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}</span>
                          {student.enrollmentData.lastAccessedAt && (
                            <span>Truy cập cuối: {new Date(student.enrollmentData.lastAccessedAt * 1000).toLocaleDateString('vi-VN')}</span>
                          )}
                        </div>
                        <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                          <span>Quiz: {student.enrollmentData.completedQuizzes}/{student.enrollmentData.totalQuizzes}</span>
                          <span>Điểm TB Quiz: {student.enrollmentData.averageQuizScore?.toFixed(1)}%</span>
                          {student.enrollmentData.totalAssignments > 0 && (
                            <span>Bài tập: {student.enrollmentData.submittedAssignments}/{student.enrollmentData.totalAssignments}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {student.progress}% hoàn thành
                        </p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        {student.enrollmentData.hasCertificate && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              🏆 Có chứng chỉ
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleViewStudentProgress(student.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseStudentList;