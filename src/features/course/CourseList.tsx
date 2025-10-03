import React, { useEffect, useState } from "react";
import { getAllCourses } from "./api";

interface Course {
  courseId: string;
  title: string;
  description: string;
  price: number;
  image: string;
  level: string;
  category: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async (page: number) => {
    setLoading(true);
    try {
      const res = await getAllCourses({ page, paging: 5 }); // paging = 5 khóa mỗi trang
      setCourses(res.data);
      setCurrentPage(res.meta.current_page);
      setTotalPages(res.meta.total_pages);
    } catch (err) {
      setCourses([]);
      setCurrentPage(1);
      setTotalPages(1);
      console.error("Lỗi khi lấy khóa học:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses(1); // Load trang đầu tiên
  }, []);

  if (loading) return <div>Đang tải khóa học...</div>;
  if (!courses.length) return <div>Không có khóa học nào.</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.courseId} className="border rounded-lg p-4 shadow">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-2 font-bold text-lg">{course.title}</h3>
            <p className="text-gray-600">{course.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-blue-600 font-semibold">
                {course.price.toLocaleString()}đ
              </span>
              <span className="bg-gray-200 px-2 py-1 rounded text-xs">{course.level}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchCourses(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => fetchCourses(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseList;
