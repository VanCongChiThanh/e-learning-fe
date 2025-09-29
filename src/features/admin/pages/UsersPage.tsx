import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";

interface User {
  id: string;
  name: string;
  email: string;
  role: "LEARNER" | "INSTRUCTOR" | "ADMIN";
  status: "Hoạt động" | "Khoá";
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
const sampleResponse: ApiResponse<User[]> = {
  status: "success",
  data: [
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "a@example.com",
      role: "LEARNER",
      status: "Hoạt động",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "b@example.com",
      role: "INSTRUCTOR",
      status: "Hoạt động",
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "c@example.com",
      role: "ADMIN",
      status: "Khoá",
    },
  ],
  meta: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 3,
  },
};

const UsersPage: React.FC = () => {
  const { data: users, meta } = sampleResponse;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <h3 className="text-2xl font-bold">Quản lý người dùng</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 w-full md:w-auto">
            <i className="fa-solid fa-user-plus"></i>
            <span>Thêm người dùng</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Họ tên</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Vai trò</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "INSTRUCTOR"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Hoạt động"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center flex gap-3 justify-center">
                      <button
                        title="Sửa"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        title="Xoá"
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <button
                        title="Chi tiết"
                        className="text-yellow-600 hover:text-gray-800"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Không có người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 text-sm text-gray-600 gap-3">
            <span>
              Trang {meta.currentPage}/{meta.totalPages} — Tổng:{" "}
              {meta.totalItems} người dùng
            </span>
            <div className="space-x-2 flex justify-center md:justify-end">
              <button className="px-3 py-1 rounded border hover:bg-gray-100">
                <i className="fa-solid fa-chevron-left"></i> Trước
              </button>
              <button className="px-3 py-1 rounded border hover:bg-gray-100">
                Sau <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
