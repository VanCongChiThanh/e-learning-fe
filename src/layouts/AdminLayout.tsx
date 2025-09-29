import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { logoutAsync } from "../features/auth/authSlice";
import { Link, useLocation } from "react-router-dom";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "fa-solid fa-house" },
    {
      path: "/admin/courses",
      label: "Quản lý khoá học",
      icon: "fa-solid fa-book-open",
    },
    {
      path: "/admin/users",
      label: "Quản lý người dùng",
      icon: "fa-solid fa-users",
    },
    {
      path: "/admin/instructors",
      label: "Quản lý giảng viên hệ thống",
      icon: "fa-solid fa-chalkboard-user",
    },
    {
      path: "/admin/instructor-approval",
      label: "Danh sách giảng viên chờ duyệt",
      icon: "fa-solid fa-user-check",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white shadow-md flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <span className="text-xl font-bold">Coursevo</span>}
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i
              className={`fa-solid ${
                collapsed ? "fa-angles-right" : "fa-angles-left"
              }`}
            />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      isActive ? "text-blue-600 font-semibold" : "text-gray-700"
                    } hover:bg-gray-100`}
                  >
                    <i
                      className={`${item.icon} text-lg ${
                        isActive ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            className="flex items-center gap-3 w-full p-2 rounded-lg text-red-600 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {!collapsed && "Đăng xuất"}
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
      </div>
    </div>
  );
};

export default AdminLayout;
