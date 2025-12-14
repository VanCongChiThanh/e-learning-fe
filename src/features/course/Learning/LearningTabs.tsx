import React from "react";

const tabs = [
  "Tổng quan",
  "Ghi chú",
  "Thông báo",
  "Đánh giá",
  "Coding Exercise",
  "Sự kiện",
  "Quiz",
  "Thảo luận",
];

const LearningTabs: React.FC<{ active: string; setActive: (tab: string) => void }> = ({ active, setActive }) => (
  <nav className="flex gap-6 border-b mt-4 px-4">
    {tabs.map(tab => (
      <button
        key={tab}
        className={`pb-2 font-medium ${active === tab ? "border-[#106c54] text-[#106c54]" : "border-transparent text-gray-600 hover:text-[#106c54]"}`}
        onClick={() => setActive(tab)}
      >
        {tab}
      </button>
    ))}
  </nav>
);

export default LearningTabs;