import React, { useEffect, useState } from "react";
import axiosAuth from "../../api/axiosAuth";

interface Course {
  courseId: string;
  title: string;
  description: string;
  image: string;
  level: string;
  category: string;
  totalLectures?: number;
  completedLectures?: number; // Số bài đã hoàn thành (giả sử backend trả về)
}

const MyCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyCourses() {
      setLoading(true);
      try {
        const res = await axiosAuth.get("/courses/page", {
          params: {
            order: "desc",
            page: 1,
            paging: 5,
            sort: "created_at",
          },
        });
        setCourses(res.data.data);
      } catch {
        setCourses([]);
      }
      setLoading(false);
    }
    fetchMyCourses();
  }, []);

  return (
    <div className="container mx-auto py-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">Khóa học của tôi</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : !courses.length ? (
        <div>Bạn chưa đăng ký khóa học nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const total = course.totalLectures || 1;
            const completed = course.completedLectures || 0;
            const percent = Math.round((completed / total) * 100);

            return (
              <div key={course.courseId} className="border rounded-lg p-4 shadow">
                <img
                  src={`${course.image}`}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="mt-2 font-bold text-lg">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
                <div className="mt-2 flex justify-end items-center">
                  <span className="bg-gray-200 px-2 py-1 rounded text-xs">{course.level}</span>
                </div>
                {/* Thanh tiến độ */}
                <div className="mt-4">
                  <div className="text-sm mb-1">Tiến độ: {percent}%</div>
                  <div className="w-full bg-gray-200 rounded h-3">
                    <div
                      className="bg-blue-500 h-3 rounded"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;