import React, { useEffect, useState } from "react";
import axiosAuth from "../../../api/axiosAuth";
import { Link } from "react-router-dom";

interface Course {
  courseId: string;
  title: string;
  description: string;
  image: string;
  level: string;
  category: string;
}

const MyCoursesInstructor: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        // Gọi API lấy tất cả khóa học mà instructor đã tạo
        const res = await axiosAuth.get("/courses/page", {
          params: {
            order: "desc",
            page: 1,
            paging: 10,
            sort: "created_at",
            // Có thể cần thêm filter theo instructorId nếu backend hỗ trợ
          },
        });
        setCourses(res.data.data);
        console.log("Instructor courses:", res.data.data);
      } catch {
        setCourses([]);
      }
      setLoading(false);
    }
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý khóa học của tôi</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : !courses.length ? (
        <div>Bạn chưa tạo khóa học nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.courseId} className="border rounded-lg p-4 shadow">
              <img
                src={`${course.image}`}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-bold text-lg">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
              <div className="mt-2 flex justify-end">
                <Link
                  to={`/instructor/courses/${course.courseId}/edit`}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Chỉnh sửa
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesInstructor;