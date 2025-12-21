import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Book, Users, Plus, FileText, Calendar, Settings } from "lucide-react";
import { CourseCard } from "../component/CourseCard";
import { useInstructorCourses } from "../hook/useInstructorManager";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { UUID } from "../utils/UUID";
import { Course } from "../type";
import MainLayout from "../../../layouts/MainLayout";

type CourseStatus = "active" | "draft" | "archived";

const EnrollmentInstructor: React.FC = () => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "all">("all");
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: { id: UUID } | null }
  );
  const userId = user?.id;
  const navigate = useNavigate();
  const { courses, loading, error } = useInstructorCourses(userId);

  // Academic Statistics
  const stats = {
    total: courses?.length || 0,
    published: courses?.filter((c) => c.status === "PUBLISHED").length || 0,
    draft: courses?.filter((c) => c.status === "DRAFT").length || 0,
    students: courses?.reduce((acc, course) => acc + 0, 0) || 0,
  };

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, statusFilter]);
  const filterCourses = () => {
    let filtered = courses;
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };
  const handleCourseClick = (courseId: string) => {
    navigate(`/teacher/course/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate("/instructor/courses/create");
  };

  if (loading) {
    return (
      // <MainLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Quản lý khóa học
            </h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
            <span className="ml-3 text-gray-700">Loading courses...</span>
          </div>
        </div>
      </div>
      // </MainLayout>
    );
  }

  if (error) {
    return (
      // <MainLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Quản lý khóa học
            </h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded p-6 text-center">
            <div className="text-red-800 font-medium mb-2">System Error</div>
            <div className="text-red-700 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-900 text-white font-medium hover:bg-green-800 transition-colors"
            >
              Reload System
            </button>
          </div>
        </div>
      </div>
      // </MainLayout>
    );
  }
  return (
    // <MainLayout>
    <div className="min-h-screen bg-gray-100">
      {/* Academic Header */}
      <div className="bg-[#106c54] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                Quản lý Khóa Học
              </h1>
              <p className="text-green-100 mt-1">
                Trang quản lý dành cho giảng viên
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-6">
        {/* Course Management Panel */}
        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Quản lý khóa học
              </h2>
            </div>
          </div>

          {/* Course Table */}
          {filteredCourses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Courses Available
              </h3>
              <p className="text-gray-600 mb-6">
                {courses.length === 0
                  ? "You haven't created any courses yet. Start by creating your first course."
                  : "No courses match your current search criteria."}
              </p>
              {courses.length === 0 && (
                <Link
                  to="/instructor/courses/create"
                  className="inline-flex items-center px-4 py-2 bg-green-900 text-white font-medium hover:bg-green-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Course
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.courseId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-green-900 flex items-center justify-center text-white text-sm font-medium mr-4">
                            {course.title.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.description &&
                              course.description.length > 60
                                ? course.description.substring(0, 60) + "..."
                                : course.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 text-xs font-medium ${
                            course.level === "BEGINNER"
                              ? "bg-green-100 text-green-800"
                              : course.level === "INTERMEDIATE"
                              ? "bg-yellow-100 text-yellow-800"
                              : course.level === "ADVANCED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.category}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-900">{0}</td> */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium ${
                            course.status === "PUBLISHED"
                              ? "bg-green-100 text-green-800"
                              : course.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.status === "PUBLISHED"
                            ? "Published"
                            : course.status === "DRAFT"
                            ? "Draft"
                            : course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCourseClick(course.courseId)}
                            className="text-green-900 hover:text-green-700 font-medium"
                          >
                            Xem
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    // </MainLayout>
  );
};

export default EnrollmentInstructor;
