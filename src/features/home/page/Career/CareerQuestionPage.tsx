import { useState } from "react";
import CareerQuestionStep from "../../components/CareerQuestionStep";
import { generateCareerPlan } from "../../api";
import { useNavigate } from "react-router-dom";
import { GenerateCareerPlanPayload } from "../../types/CareerType";

const questions = [
  { key: "role", label: "Vị trí việc làm bạn muốn?" },
  {
    key: "goal",
    label: "Mục tiêu nghề nghiệp trong 6–12 tháng tới của bạn là gì?",
  },
  { key: "experience", label: "Kinh nghiệm của bạn hiện tại?" },
  {
    key: "preferredStack",
    label: "Công nghệ hoặc lĩnh vực bạn muốn tập trung?",
  },
];

const CareerQuestionPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const handleNext = async (value: string) => {
    const q = questions[step];
    const newAnswers = { ...answers, [q.key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    const payload: GenerateCareerPlanPayload = {
      role: newAnswers.role,
      goal: newAnswers.goal,
      answers: newAnswers,
    };
    const res = await generateCareerPlan(payload);
    setLoading(false);
    navigate("/career/preview", {
      state: {
        ...res.data,
        answers: newAnswers, // thêm phần trả lời của user
      },
    });
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
      <div className="flex-1 flex flex-col justify-start items-center pt-10 px-4">
        <CareerQuestionStep
          label={questions[step].label}
          step={step + 1}
          totalSteps={questions.length}
          onNext={handleNext}
          onBack={handleBack}
          initialValue={answers[questions[step].key]}
        />
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur flex flex-col items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            <p className="mt-4 text-emerald-700 font-semibold animate-pulse">
              AI đang phân tích và xây dựng lộ trình học của bạn...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerQuestionPage;
