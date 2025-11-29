import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UUID } from "crypto";
import { useEnrollments } from "../hook/useEnrollment";
import { EnrollmentWithStats, Student } from "../type";

const CourseStudentList: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    enrollmentReport,
    course,
    fetchCourseById,
    fetchEnrollmentReportByCourseId,
    loading,
  } = useEnrollments();

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId as UUID);
      fetchEnrollmentReportByCourseId(courseId as UUID);
    }
  }, [courseId, fetchCourseById, fetchEnrollmentReportByCourseId]);

  const handleBackToCourse = () => {
    navigate(`/teacher/course/${courseId}`);
  };

  const handleViewStudentProgress = (studentId: string) => {
    navigate(`/teacher/course/${courseId}/student/${studentId}/progress`);
  };
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
            Quay lại chi tiết khóa học
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Danh sách học viên
          </h1>
          <p className="text-gray-600 mt-2">
            Khóa học: {course?.title || "N/A"}
          </p>
        </div>

        {/* Students List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Danh sách học viên ({enrollmentReport.length})
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Thông tin chi tiết về các học viên đã đăng ký khóa học
            </p>
          </div>

          {enrollmentReport.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Chưa có học viên
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Khóa học này chưa có học viên nào đăng ký.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {enrollmentReport.map((student) => (
                <li key={student.enrollmentId}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {student.avatar?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {student.userFullName || student.userEmail}
                          </p>
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              student.enrollmentStatus === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : student.enrollmentStatus === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.enrollmentStatus === "ACTIVE"
                              ? "Đang học"
                              : student.enrollmentStatus === "COMPLETED"
                              ? "Hoàn thành"
                              : "Không hoạt động"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {student.userEmail}
                        </p>
                        <div className="flex space-x-4 text-xs text-gray-400">
                          <span>
                            Đăng ký:{" "}
                            {new Date(
                              student.enrollmentDate
                            ).toLocaleDateString("vi-VN")}
                          </span>
                          {student.lastAccessedAt && (
                            <span>
                              Truy cập cuối:{" "}
                              {new Date(
                                student.lastAccessedAt * 1000
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                          <span>
                            Quiz đã hoàn thành: {student.completedQuizzes}/
                            {student.completedQuizzes}
                          </span>
                          <span>
                            Điểm TB Quiz: {student.averageQuizScore.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {student.progressPercentage}% hoàn thành
                        </p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.progressPercentage}%` }}
                          ></div>
                        </div>
                        {student.hasCertificate && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              🏆 Có chứng chỉ
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          handleViewStudentProgress(student.userId)
                        }
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
