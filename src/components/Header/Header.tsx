import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { logoutAsync } from "../../features/auth/store/authSlice";
import { NotificationBell } from "../Notification";
import Dropdown from "../Dropdown/Dropdown";
import { useState } from "react";
import "./Header.scss";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // State
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/courses/search");
    }
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
        <form
          onSubmit={handleSearch}
          className="search-box hidden md:flex items-center"
        >
          <input
            type="text"
            placeholder="Tìm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Tìm kiếm">
            <i className="fa-solid fa-search"></i>
          </button>
        </form>

        {/* Nút menu mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Menu desktop */}
        <nav className="right-menu hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative">
            <i className="fa-solid fa-shopping-cart text-xl"></i>
          </Link>

          {/* Notification bell - chỉ hiển thị khi đã đăng nhập */}
          {user && (
            <div className="notification-btn relative">
              <NotificationBell />
            </div>
          )}
          {/* Dropdown "Xem thêm" */}

          {user?.role === "LEARNER" && (
            <Dropdown
              label="Xem thêm"
              isOpen={openDropdown === "more"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "more" ? null : "more")
              }
            >
              <>
                <Link to="/reviews">Đánh giá</Link>
                <Link to="/partner">Trở thành đối tác</Link>
                <Link to="/instructor-registration">Trở thành giảng viên</Link>
              </>
            </Dropdown>
          )}

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
              {user.role === "LEARNER" && (
                <Link
                  to="/account-profile"
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  Trang cá nhân
                </Link>
              )}
              {user.role === "INSTRUCTOR" && (
                <>
                  <Link
                    to="/instructor-profile"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Hồ sơ giảng viên
                  </Link>
                  <Link
                    to="/instructor/my-courses"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Quản lý khóa học
                  </Link>
                </>
              )}
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
          {/* Search box mobile */}
          <form
            onSubmit={handleSearch}
            className="search-box flex items-center mb-2"
          >
            <input
              type="text"
              placeholder="Tìm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Tìm kiếm">
              <i className="fa-solid fa-search"></i>
            </button>
          </form>

          {/* Nếu chưa login */}
          {!user && (
            <Link to="/login" className="text-blue-600">
              Tham gia miễn phí
            </Link>
          )}

          {/* Nếu đã login */}
          {user && (
            <>
              {/* Learner menu */}
              {user.role === "LEARNER" && (
                <>
                  <Link to="/reviews">Đánh giá</Link>
                  <Link to="/partner">Trở thành đối tác</Link>
                  <Link to="/instructor-registration">
                    Trở thành giảng viên
                  </Link>
                  <Link to="/account-profile">Trang cá nhân</Link>
                </>
              )}

              {/* Instructor menu */}
              {user.role === "INSTRUCTOR" && (
                <>
                  <Link to="/instructor-profile">Hồ sơ giảng viên</Link>
                  <Link to="/instructor/my-courses">Quản lý khóa học</Link>
                </>
              )}

              {/* Admin menu */}
              {user.role === "ADMIN" && <Link to="/admin">Quản trị</Link>}

              {/* Logout cho mọi user */}
              <button onClick={handleLogout} className="text-left text-red-600">
                Đăng xuất
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
