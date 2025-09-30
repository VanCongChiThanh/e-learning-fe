import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  students: number;
  price: number;
  status: "Đang mở" | "Đã đóng";
}

interface PageInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  error?: any;
  meta?: PageInfo;
}

// ---- Dữ liệu mẫu giả lập response ----
const sampleResponse: ApiResponse<Course[]> = {
  status: "success",
  data: [
    {
      id: "1",
      title: "ReactJS Cơ bản",
      category: "Frontend",
      instructor: "Nguyễn Văn A",
      students: 120,
      price: 599000,
      status: "Đang mở",
    },
    {
      id: "2",
      title: "Spring Boot nâng cao",
      category: "Backend",
      instructor: "Trần Thị B",
      students: 80,
      price: 799000,
      status: "Đang mở",
    },
    {
      id: "3",
      title: "UI/UX Design",
      category: "Design",
      instructor: "Lê Văn C",
      students: 50,
      price: 499000,
      status: "Đã đóng",
    },
  ],
  meta: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 3,
  },
};

const CoursesPage: React.FC = () => {
  const { data: courses, meta } = sampleResponse;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <h3 className="text-2xl font-bold">Quản lý khoá học</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto">
            + Thêm khoá học
          </button>
        </div>

        {/* Responsive Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Tên khoá học</th>
                <th className="px-4 py-3 text-left">Danh mục</th>
                <th className="px-4 py-3 text-left">Giảng viên</th>
                <th className="px-4 py-3 text-center">Học viên</th>
                <th className="px-4 py-3 text-center">Giá</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium">{course.title}</td>
                    <td className="px-4 py-3">{course.category}</td>
                    <td className="px-4 py-3">{course.instructor}</td>
                    <td className="px-4 py-3 text-center">{course.students}</td>
                    <td className="px-4 py-3 text-center">
                      {course.price.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === "Đang mở"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button className="text-blue-600 hover:underline">
                        Sửa
                      </button>
                      <button className="text-red-600 hover:underline">
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Không có khoá học nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>
              Trang {meta.currentPage}/{meta.totalPages} — Tổng:{" "}
              {meta.totalItems} khoá học
            </span>
            <div className="space-x-2">
              <button className="px-3 py-1 rounded border hover:bg-gray-100">
                Trước
              </button>
              <button className="px-3 py-1 rounded border hover:bg-gray-100">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CoursesPage;
