import React from "react";
import { Link } from "react-router-dom";

const LearningHeader: React.FC<{ title: string }> = ({ title }) => (
  <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
    {/* Logo giống Header chính */}
    <div className="flex items-center gap-4">
      <Link to="/" className="flex items-center gap-2">
        <div className="text-[#106c54] font-extrabold text-xl">
          Course<span className="text-gray-800">vo</span>
        </div>
      </Link>
      <span className="text-gray-400">|</span>
      <span className="font-semibold text-lg text-gray-800">{title}</span>
    </div>

    {/* Right menu với màu sắc phù hợp */}
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 text-gray-700 hover:text-[#106c54] font-medium transition-colors">
        <i className="fas fa-star"></i>
        Để lại đánh giá
      </button>
      
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full border-2 border-[#106c54] flex items-center justify-center">
          <i className="fas fa-circle-notch text-[#106c54] text-sm"></i>
        </div>
        <span className="text-gray-700 font-medium">Tiến độ học tập</span>
        <i className="fas fa-chevron-down text-xs text-gray-500"></i>
      </div>
      
      <button className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 font-medium transition-colors">
        <i className="fas fa-share text-[#106c54]"></i>
        Chia sẻ
      </button>
      
      <button className="border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
        <i className="fas fa-ellipsis-v text-gray-600"></i>
      </button>
    </div>
  </header>
);

export default LearningHeader;