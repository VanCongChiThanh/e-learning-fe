import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UUID } from "crypto";
import { useEnrollments } from "../hook/useEnrollment";
import { EnrollmentWithStats } from "../type";
const StudentProgressDetail: React.FC = () => {
  const { courseId, studentId } = useParams<{
    courseId: string;
    studentId: string;
  }>();
  const navigate = useNavigate();
  const {
    enrollments,
    course,
    fetchCourseById,
    fetchEnrollmentReportByCourseId,
    loading,
  } = useEnrollments();

  const [studentReport, setStudentReport] =
    useState<EnrollmentWithStats | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId as UUID);
      fetchEnrollmentReportByCourseId(courseId as UUID);
    }
  }, [courseId, fetchCourseById, fetchEnrollmentReportByCourseId]);

  // useEffect(() => {
  //   // const reports = enrollments as EnrollmentWithStats[];
  //   const report = reports.find((r) => r.userId === studentId);
  //   setStudentReport(report || null);
  // }, [enrollments, studentId]);

  const handleBackToStudents = () => {
    navigate(`/teacher/course/${courseId}/students`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!studentReport) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Không tìm thấy thông tin học viên
          </p>
          <button
            onClick={handleBackToStudents}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatWatchTime = (minutes: number | null) => {
    if (!minutes) return "0 phút";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToStudents}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại danh sách học viên
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Chi tiết tiến độ học viên
          </h1>
          <p className="text-gray-600 mt-2">
            {studentReport.userEmail} - {course?.title || "N/A"}
          </p>
        </div>

        {/* Student Status Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Thông tin học viên
              </h2>
              <p className="text-gray-600">{studentReport.userEmail}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  studentReport.enrollmentStatus === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : studentReport.enrollmentStatus === "COMPLETED"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {studentReport.enrollmentStatus === "ACTIVE"
                  ? "Đang học"
                  : studentReport.enrollmentStatus === "COMPLETED"
                  ? "Hoàn thành"
                  : "Không hoạt động"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {studentReport.progressPercentage}%
                </p>
                <p className="text-sm text-gray-500">Tiến độ khóa học</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${studentReport.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {formatWatchTime(studentReport.totalWatchTimeMinutes)}
                </p>
                <p className="text-sm text-gray-500">Thời gian học</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {studentReport.averageQuizScore?.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Điểm trung bình Quiz</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quiz Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thành tích Quiz
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng số Quiz:</span>
                <span className="font-semibold">
                  {studentReport.totalQuizzes}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Đã hoàn thành:</span>
                <span className="font-semibold text-blue-600">
                  {studentReport.completedQuizzes}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Đã qua:</span>
                <span className="font-semibold text-green-600">
                  {studentReport.passedQuizzes}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Điểm trung bình:</span>
                <span className="font-semibold text-purple-600">
                  {studentReport.averageQuizScore?.toFixed(1)}%
                </span>
              </div>
              {studentReport.totalQuizzes > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tiến độ Quiz</span>
                    <span>
                      {Math.round(
                        (studentReport.completedQuizzes /
                          studentReport.totalQuizzes) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (studentReport.completedQuizzes /
                            studentReport.totalQuizzes) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thành tích Bài tập
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng số bài tập:</span>
                <span className="font-semibold">
                  {studentReport.totalAssignments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Đã nộp:</span>
                <span className="font-semibold text-blue-600">
                  {studentReport.submittedAssignments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Đã chấm:</span>
                <span className="font-semibold text-orange-600">
                  {studentReport.gradedAssignments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Điểm trung bình:</span>
                <span className="font-semibold text-purple-600">
                  {studentReport.averageAssignmentScore?.toFixed(1)}%
                </span>
              </div>
              {studentReport.totalAssignments > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tiến độ bài tập</span>
                    <span>
                      {Math.round(
                        (studentReport.submittedAssignments /
                          studentReport.totalAssignments) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (studentReport.submittedAssignments /
                            studentReport.totalAssignments) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin thời gian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Ngày đăng ký
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(studentReport.enrollmentDate)}
              </p>
            </div>
            {studentReport.lastAccessedAt && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Truy cập cuối
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(studentReport.lastAccessedAt)}
                </p>
              </div>
            )}
            {studentReport.completionDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Ngày hoàn thành
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(studentReport.completionDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Certificate Information */}
        {studentReport.hasCertificate && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin chứng chỉ
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-12 h-12 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Chứng chỉ đã được cấp
                </p>
                {studentReport.certificateNumber && (
                  <p className="text-sm text-gray-600">
                    Số chứng chỉ: {studentReport.certificateNumber}
                  </p>
                )}
                {studentReport.certificateIssuedDate && (
                  <p className="text-sm text-gray-600">
                    Ngày cấp: {formatDate(studentReport.certificateIssuedDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressDetail;
