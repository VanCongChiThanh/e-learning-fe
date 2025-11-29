import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Users, Clock, Plus } from "lucide-react";
import { CourseCard } from "../component/CourseCard";
import { useInstructorCourses } from "../hook/useInstructorManager";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { UUID } from "../utils/UUID";
import { Course } from "../type";
import { title } from "process";

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
    console.log("Create new course");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            // onClick={fetchInstructorCourses}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  console.log("Filtered courses:", filteredCourses);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Khóa học của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi các khóa học bạn đang giảng dạy
            </p>
          </div>
          <button
            onClick={handleCreateCourse}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Tạo khóa học mới</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Book className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng khóa học
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* {courses.filter(course => course.status === 'active').length} */}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nháp</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* {courses.filter(course => course.status === 'draft').length} */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as CourseStatus | "all")
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="draft">Nháp</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <Book className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có khóa học nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {courses.length === 0
                ? "Bắt đầu bằng cách tạo khóa học đầu tiên của bạn."
                : "Không tìm thấy khóa học nào phù hợp với bộ lọc hiện tại."}
            </p>
            {courses.length === 0 && (
              <div className="mt-6">
                <button
                  onClick={handleCreateCourse}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo khóa học mới
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                onCourseClick={handleCourseClick}
                variant="instructor"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentInstructor;
