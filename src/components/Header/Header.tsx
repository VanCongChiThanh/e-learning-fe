import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { logout, logoutAsync } from "../../features/auth/authSlice";
import Dropdown from "../Dropdown/Dropdown";
import { useState } from "react";
import "./Header.scss";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // State
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  return (
    <header className="header-container border-b shadow-sm">
      <div className="inner flex justify-between items-center px-4 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-[#106c54] font-extrabold text-xl md:text-2xl lg:text-3xl">
            Course<span className="text-gray-800">vo</span>
          </div>
        </Link>

        {/* Search box (desktop only) */}
        <div className="search-box hidden md:flex items-center">
          <input type="text" placeholder="Tìm khóa học..." />
          <button>
            <i className="fa-solid fa-search"></i>
          </button>
        </div>

        {/* Nút menu mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Menu desktop */}
        <nav className="right-menu hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative">
            <i className="fa-solid fa-shopping-cart text-xl"></i>
          </Link>

          {/* Notification bell */}
          <button className="notification-btn relative">
            <i className="fa-solid fa-bell text-xl"></i>
            <span className="badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>
          </button>

          {/* Dropdown "Xem thêm" */}
          <Dropdown
            label="Xem thêm"
            isOpen={openDropdown === "more"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "more" ? null : "more")
            }
          >
            <Link to="/reviews">Đánh giá</Link>
            <Link to="/partner">Trở thành đối tác</Link>
            <Link to="/instructor">Trở thành giảng viên</Link>
          </Dropdown>
          {/* Dropdown user hoặc nút đăng nhập */}
          {user ? (
            <Dropdown
              label={
                <div className="flex items-center gap-2">
                  <img
                    src={
                      user.avatar
                        ? user.avatar 
                        : `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.first_name}</span>
                </div>
              }
              isOpen={openDropdown === "user"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "user" ? null : "user")
              }
            >
              <Link
                to="/account-profile"
                className="px-4 py-2 hover:bg-gray-100"
              >
                Trang cá nhân
              </Link>
              {user.role === "ADMIN" && (
                <Link to="/admin" className="px-4 py-2 hover:bg-gray-100">
                  Quản trị
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                Đăng xuất
              </button>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 hover:underline"
            >
              Tham gia miễn phí
            </Link>
          )}
        </nav>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-2 px-4 py-2 bg-gray-50 border-t">
          {/* Thêm ô search cho mobile */}
          <div className="search-box flex items-center mx-auto">
            <input type="text" placeholder="Tìm khóa học..." />
            <button>
              <i className="fa-solid fa-search"></i>
            </button>
          </div>

          <Link to="/reviews">Đánh giá</Link>
          <Link to="/partner">Trở thành đối tác</Link>
          <Link to="/instructor">Trở thành giảng viên</Link>

          {user ? (
            <>
              <Link to="/account-profile">Trang cá nhân</Link>
              {user.role === "ADMIN" && <Link to="/admin">Quản trị</Link>}
              <button onClick={handleLogout} className="text-left text-red-600">
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="text-blue-600">
              Tham gia miễn phí
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
