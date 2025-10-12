import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const HomeLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col px-16" style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Sub Header */}
      <header
        className="
          fixed w-full 
          top-[var(--header-height-mobile,70px)] 
          md:top-[var(--header-height,80px)]
        "
      >
        <div className="mx-2 my-2 flex justify-between items-center">
          {/* Cuộn ngang khi màn nhỏ */}
          <nav className="flex space-x-6 overflow-x-auto scrollbar-hide">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `pb-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#106c54] font-semibold border-b-2 border-[#106c54]"
                    : "text-black-600 hover:text-[#106c54]"
                }`
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/my-learning"
              className={({ isActive }) =>
                `pb-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#106c54] font-semibold border-b-2 border-[#106c54]"
                    : "text-black-600 hover:text-[#106c54]"
                }`
              }
            >
              Khóa học của tôi
            </NavLink>
            <NavLink
              to="/online-degrees"
              className={({ isActive }) =>
                `pb-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#106c54] font-semibold border-b-2 border-[#106c54]"
                    : "text-black-600 hover:text-[#106c54]"
                }`
              }
            >
              Chứng nhận Online
            </NavLink>
            <NavLink
              to="/careers"
              className={({ isActive }) =>
                `pb-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#106c54] font-semibold border-b-2 border-[#106c54]"
                    : "text-black-600 hover:text-[#106c54]"
                }`
              }
            >
              Nghề nghiệp
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-16">{children}</main>
    </div>
  );
};

export default HomeLayout;
