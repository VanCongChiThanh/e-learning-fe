import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { logoutAsync } from "../features/auth/store/authSlice";
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } flex-shrink-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Coursevo
            </span>
          )}
          <button
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 rounded-lg transition-all duration-200"
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
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 font-semibold"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <i
                      className={`${item.icon} text-lg ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    {!collapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
          <button
            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket group-hover:translate-x-1 transition-transform duration-200"></i>
            {!collapsed && (
              <span className="text-sm font-medium">Đăng xuất</span>
            )}
          </button>
        </div>
      </aside>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with gradient */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/50 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-200/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Main content with subtle pattern */}
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-transparent via-white/30 to-transparent">
          <div className="max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
