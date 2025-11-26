import { useLocation, useNavigate } from "react-router-dom";
import CareerSectionCard from "../../components/CareerSectionCard";
import { saveCareerPlan } from "../../api";
import { CareerPlanSection } from "../../types/CareerType";

const CareerPreviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const plan = state || null;
  const answers = state?.answers || null;

  if (!plan) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">Chưa có dữ liệu lộ trình.</p>
        <button className="btn-primary" onClick={() => navigate("/career")}>
          Tạo lộ trình mới
        </button>
      </div>
    );
  }

  const save = async () => {
    const payload = {
      ...plan,
      answers: answers,
    };
    await saveCareerPlan(payload);
    navigate("/career");
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-6 py-4 border-b">
        <img
          src="/svg/logo.png"
          alt="Coursevo Logo"
          className="h-3 sm:h-4 lg:h-5 w-auto select-none"
          draggable="false"
        />
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:underline font-medium"
        >
          Thoát
        </button>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-8 pb-32">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Lộ trình nghề nghiệp của bạn
          </h1>
          <p className="text-lg font-medium text-gray-600">
            {plan.role} · {plan.goal}
          </p>
        </div>

        <div className="space-y-6">
          {plan.sections?.map((s: CareerPlanSection, i: number) => (
            <CareerSectionCard key={i} {...s} />
          ))}
        </div>
      </div>

      {/* Save button fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-6 shadow-lg flex justify-end">
        <button
          onClick={save}
          className="px-6 py-3 rounded-lg text-white font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
        >
          <i className="fa fa-save mr-2"></i> Lưu lộ trình học
        </button>
      </div>
    </div>
  );
};

export default CareerPreviewPage;
