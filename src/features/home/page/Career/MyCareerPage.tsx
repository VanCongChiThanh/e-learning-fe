import { useEffect, useState } from "react";
import { getMyCareerPlan } from "../../api";
import CareerSectionCard from "../../components/CareerSectionCard";
import { CareerPlanSection } from "../../types/CareerType";
import MainLayout from "../../../../layouts/MainLayout";
import HomeLayout from "../../layout/HomeLayout";
import { useNavigate } from "react-router-dom";
const MyCareerPage = () => {
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    getMyCareerPlan().then(setPlan);
  }, []);
  const navigate = useNavigate();
  if (!plan) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mr-3"></div>
        Đang tải lộ trình học...
      </div>
    );
  }

  return (
    <MainLayout>
      <HomeLayout>
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
          {/* ===== HEADER ===== */}
          <div className="flex justify-between items-center">
            <h1
              className="
                text-3xl font-extrabold tracking-tight 
                text-gray-900
              "
            >
              Lộ trình phát triển nghề nghiệp của bạn
            </h1>

            <button
              onClick={() => navigate("/career/questions")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm underline-offset-2 hover:underline transition"
            >
              <i className="fas fa-edit"></i> Chỉnh sửa lộ trình
            </button>
          </div>

          {/* ===== INFO BLOCKS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border shadow-sm flex flex-col gap-2 hover:shadow-md transition">
              <span className="text-sm text-gray-500">Vai trò hướng tới</span>
              <span className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                👨‍💻 {plan.role}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border shadow-sm flex flex-col gap-2 hover:shadow-md transition">
              <span className="text-sm text-gray-500">
                Mục tiêu nghề nghiệp
              </span>
              <span className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                🎯 {plan.goal}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border shadow-sm flex flex-col gap-2 hover:shadow-md transition">
              <span className="text-sm text-gray-500">Tiến độ lộ trình</span>
              <span className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                📊 <span className="text-emerald-600">0% hoàn thành</span>
              </span>
            </div>
          </div>

          {/* ===== SECTION LIST ===== */}
          <div className="space-y-6 mt-6">
            {plan.sections?.map((section: CareerPlanSection, index: number) => (
              <CareerSectionCard key={index} {...section} />
            ))}
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex justify-end items-center gap-4 text-gray-500 text-sm py-6">
            <span>📌 Lộ trình này có hữu ích không?</span>
            <button className="hover:text-emerald-600 transition">👍 Có</button>
            <button className="hover:text-emerald-600 transition">
              👎 Không
            </button>
          </div>
        </div>
      </HomeLayout>
    </MainLayout>
  );
};

export default MyCareerPage;
