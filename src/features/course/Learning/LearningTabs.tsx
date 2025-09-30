import React from "react";

const tabs = [
  "Tổng quan",
  "Ghi chú",
  "Thông báo",
  "Đánh giá",
  "Công cụ học tập",
];

const LearningTabs: React.FC<{ active: string; setActive: (tab: string) => void }> = ({ active, setActive }) => (
  <nav className="flex gap-6 border-b mt-4 px-4">
    {tabs.map(tab => (
      <button
        key={tab}
        className={`pb-2 font-medium ${active === tab ? "border-b-2 border-purple-600 text-purple-700" : "text-gray-600"}`}
        onClick={() => setActive(tab)}
      >
        {tab}
      </button>
    ))}
  </nav>
);

export default LearningTabs;