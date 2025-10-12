import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";

const InstructorManagementPage: React.FC = () => {
  const instructors = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      courses: 5,
      status: "Đang dạy",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      courses: 3,
      status: "Đang dạy",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      courses: 7,
      status: "Đang dạy",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-6">Quản lý giảng viên</h3>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full table-auto text-left border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 border-b">Tên giảng viên</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Số khoá học</th>
                <th className="p-3 border-b">Trạng thái</th>
                <th className="p-3 border-b text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((ins) => (
                <tr key={ins.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{ins.name}</td>
                  <td className="p-3 border-b">{ins.email}</td>
                  <td className="p-3 border-b">{ins.courses}</td>
                  <td className="p-3 border-b">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      {ins.status}
                    </span>
                  </td>
                  <td className="p-3 border-b flex gap-3 justify-center">
                    <button
                      title="Xem chi tiết"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button
                      title="Xem khoá học"
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      <i className="fa-solid fa-book"></i>
                    </button>
                    <button
                      title="Khoá tài khoản"
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-ban"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructorManagementPage;
