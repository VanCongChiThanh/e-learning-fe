import { useState, useEffect } from "react";

interface Props {
  label: string;
  step: number;
  totalSteps: number;
  onNext: (value: string) => void;
  onBack: () => void;
  initialValue?: string; // 👈 thêm dòng này
}

const suggestionsMap: Record<string, string[]> = {
  role: [
    "Software Engineer",
    "AI Engineer",
    "Frontend Developer",
    "DevOps Engineer",
  ],
  goal: [
    "Thăng tiến lên Senior",
    "Chuyển hướng sang lĩnh vực AI",
    "Làm việc từ xa với mức lương cao",
    "Tìm cơ hội nghề nghiệp ở nước ngoài",
  ],
  experience: ["Beginner", "1–2 năm", "3–5 năm", "Senior 5+ năm"],
  preferredStack: ["Java", "React", "Python + AI", "Cloud & DevOps"],
};

const CareerQuestionStep = ({
  label,
  step,
  totalSteps,
  onNext,
  onBack,
  initialValue,
}: Props) => {
  const [value, setValue] = useState("");

  // reset input khi đổi step + nếu có giá trị cũ thì fill lại
  useEffect(() => {
    setValue(initialValue ?? "");
  }, [step, initialValue]);

  const keys = Object.keys(suggestionsMap);
  const currentKey = keys[step - 1];
  const suggestions = suggestionsMap[currentKey] || [];

  const handleNext = () => {
    if (value.trim() === "") return;
    onNext(value);
  };

  const handleSuggestionClick = (val: string) => {
    onNext(val);
  };

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <img
          src="/svg/mascot.png"
          alt=""
          className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"

        />
        <h2 className="text-3xl font-semibold text-center">{label}</h2>
      </div>

      <input
        className="w-full border rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        placeholder="Nhập câu trả lời..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${(step / totalSteps) * 100}%`,
            background: "linear-gradient(90deg, #10b981, #3b82f6)", // emerald → blue
          }}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              className="px-3 py-2 text-sm border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          disabled={step === 1}
          className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Trở lại
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition duration-200"
        >
          Tiếp tục
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        {step}/{totalSteps} câu hỏi
      </p>
    </div>
  );
};

export default CareerQuestionStep;
