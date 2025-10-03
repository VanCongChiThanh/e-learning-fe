import React from "react";
import { Link } from "react-router-dom";

const LearningHeader: React.FC<{ title: string }> = ({ title }) => (
  <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-white border-b">
    <div className="flex items-center gap-4">
      <Link to="/" className="font-bold text-xl text-purple-700">E-Learning</Link>
      <span className="font-semibold text-lg">{title}</span>
    </div>
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 text-gray-700 hover:text-purple-700 font-medium">
        <i className="fas fa-star"></i>
        Để lại đánh giá
      </button>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full border-2 border-gray-400 flex items-center justify-center">
          {/* Progress circle, có thể thay bằng component thực tế */}
          <i className="fas fa-circle-notch"></i>
        </div>
        <span className="text-gray-700 font-medium">Tiến độ học tập</span>
        <i className="fas fa-chevron-down text-xs"></i>
      </div>
      <button className="flex items-center gap-2 border px-3 py-1 rounded hover:bg-purple-50 font-medium">
        <i className="fas fa-share"></i>
        Chia sẻ
      </button>
      <button className="border px-2 py-1 rounded hover:bg-gray-100">
        <i className="fas fa-ellipsis-v"></i>
      </button>
    </div>
  </header>
);

export default LearningHeader;
