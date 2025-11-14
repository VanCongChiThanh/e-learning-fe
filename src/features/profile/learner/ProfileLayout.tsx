import { Link, useLocation } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const location = useLocation();

  const menuItems = [
    {
      path: "/account-profile",
      icon: "fas fa-user",
      label: "Thông tin cá nhân",
    },
    {
      path: "/account-profile/change-password",
      icon: "fas fa-key",
      label: "Đổi mật khẩu",
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden sticky"
              style={{ top: "5.5rem" }}
            >
              <div className="p-4 bg-emerald-600 text-white">
                <h2 className="text-lg font-semibold">Tài khoản</h2>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
                      location.pathname === item.path
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 flex justify-center">
              <div className="w-full max-w-3xl">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
