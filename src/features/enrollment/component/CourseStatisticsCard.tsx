// src/components/CourseStatisticsCard.jsx

import React from "react";
// 1. IMPORT THƯ VIỆN BIỂU ĐỒ (ví dụ: Recharts)
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieLabelRenderProps,
} from "recharts";
interface StatCardProps {
  title: string;
  value: number | string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};

// Component chính
const CourseStatisticsCard = (stats: any) => {
  if (!stats.stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Số liệu & Phân tích
        </h2>
        <p className="text-gray-500">Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }
  // --- Dữ liệu chuẩn bị cho biểu đồ ---
  const completionData = [
    {
      name: "Đã hoàn thành",
      value: stats.stats.completedEnrollments,
    },
    {
      name: "Chưa hoàn thành",
      value: stats.stats.totalEnrollments - stats.stats.completedEnrollments,
    },
  ];
  const COMPLETION_COLORS = ["#10B981", "#FDE68A"];

  const scoreData = [
    {
      name: "Quiz TB",
      score: Number(stats.stats.averageQuizScore?.toFixed(2)),
    },
    {
      name: "Bài tập TB",
      score: Number(stats.stats.averageAssignmentScore?.toFixed(2)),
    },
  ];

  // --- JSX Trả về ---
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Số liệu & Phân tích
      </h2>

      {/* 1. Các thẻ KPI chính */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Tiến độ trung bình"
          value={`${stats.stats.averageProgress}%`}
        />
        <StatCard
          title="Chứng chỉ đã cấp"
          value={stats.stats.certificatesIssued}
        />
        <StatCard
          title="Lượt hoàn thành"
          value={stats.stats.completedEnrollments}
        />
        <StatCard
          title="Tổng giờ xem"
          value={`${stats.stats.totalWatchTime} (phút)`}
        />
      </div>

      {/* 2. Các biểu đồ */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        style={{ height: "300px" }}
      >
        {/* Biểu đồ 1: Tỷ lệ hoàn thành */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
            Tỷ lệ hoàn thành
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={(props: PieLabelRenderProps) => {
                  const { name, percent } = props;
                  return `${name}: ${(percent! * 100).toFixed(0)}%`;
                }}
              >
                {completionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COMPLETION_COLORS[index % COMPLETION_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ 2: Điểm số trung bình */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
            Điểm số trung bình (%)
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="score" fill="#3B82F6" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 2. EXPORT COMPONENT RA NGOÀI
export default CourseStatisticsCard;
