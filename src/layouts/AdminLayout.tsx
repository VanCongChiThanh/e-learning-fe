import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { logoutAsync } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logoutAsync());
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 text-xl font-bold border-b">E-Learning Admin</div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200"
              >
                <i className="fa-solid fa-house text-gray-600"></i>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/courses"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200"
              >
                <i className="fa-solid fa-book-open text-gray-600"></i>
                Quản lý khoá học
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200"
              >
                <i className="fa-solid fa-users text-gray-600"></i>
                Quản lý người dùng
              </Link>
            </li>
            <li>
              <Link
                to="/admin/teachers"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200"
              >
                <i className="fa-solid fa-id-card text-gray-600"></i>
                Quản lý hồ sơ giảng viên
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <button
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-200"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket text-gray-600"></i>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <span className="text-sm text-gray-600">Xin chào, Admin</span>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        <footer className="bg-white text-center p-3 text-sm border-t">
          © 2025 E-Learning Platform
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
