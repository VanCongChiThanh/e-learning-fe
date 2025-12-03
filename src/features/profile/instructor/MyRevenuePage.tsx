import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InstructorProfileLayout from "./ProfileLayout";
import { getMyRevenue, MyRevenueResponse } from "../api";

const MyRevenuePage: React.FC = () => {
  const [revenue, setRevenue] = useState<MyRevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  useEffect(() => {
    fetchRevenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);

      // Calculate start and end date from selectedMonth in UTC
      const [year, month] = selectedMonth.split("-").map(Number);

      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      const data = await getMyRevenue({
        start_date: startDate.getTime(),
        end_date: endDate.getTime(),
      });
      setRevenue(data);
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message || "Không thể tải dữ liệu doanh thu"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <InstructorProfileLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Thu nhập của tôi
          </h1>
          <p className="text-gray-600">
            Theo dõi doanh thu và thu nhập từ các khóa học của bạn
          </p>
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <i className="fas fa-calendar-alt text-emerald-600 text-lg"></i>
          <label className="text-sm font-semibold text-gray-700">Tháng:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : revenue ? (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Revenue Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <i className="fas fa-chart-line text-2xl"></i>
                  </div>
                  <div className="text-blue-100 text-sm font-medium">
                    Tổng doanh thu
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(revenue.total_revenue)}
                </div>
                <div className="text-blue-100 text-sm">
                  Từ {revenue.total_courses} khóa học
                </div>
              </div>

              {/* Net Earnings Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <i className="fas fa-wallet text-2xl"></i>
                  </div>
                  <div className="text-emerald-100 text-sm font-medium">
                    Thu nhập ròng
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(revenue.net_earnings)}
                </div>
                <div className="text-emerald-100 text-sm">
                  Sau hoa hồng{" "}
                  {(revenue.commission_percentage * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-emerald-600"></i>
                Chi tiết thu nhập
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-book text-blue-600"></i>
                    </div>
                    <span className="text-gray-700 font-medium">
                      Số khóa học
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {revenue.total_courses}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-dollar-sign text-purple-600"></i>
                    </div>
                    <span className="text-gray-700 font-medium">
                      Tổng doanh thu
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(revenue.total_revenue)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-percent text-orange-600"></i>
                    </div>
                    <span className="text-gray-700 font-medium">
                      Tỷ lệ hoa hồng nền tảng
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    {(revenue.commission_percentage * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-minus-circle text-red-600"></i>
                    </div>
                    <span className="text-gray-700 font-medium">
                      Phí nền tảng
                    </span>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(
                      revenue.total_revenue - revenue.net_earnings
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 bg-emerald-50 rounded-lg px-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-hand-holding-usd text-white"></i>
                    </div>
                    <span className="text-gray-800 font-semibold">
                      Thu nhập ròng của bạn
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(revenue.net_earnings)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <i className="fas fa-lightbulb text-blue-600 mt-0.5"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Lưu ý về thanh toán</p>
                <p>
                  Thu nhập sẽ được chuyển vào tài khoản ngân hàng của bạn vào
                  cuối mỗi tháng. Vui lòng đảm bảo thông tin tài khoản ngân hàng
                  của bạn đã được cập nhật và xác nhận.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <i className="fas fa-chart-bar text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">Không có dữ liệu doanh thu</p>
            <p className="text-gray-400 text-sm mt-2">
              Bạn chưa có doanh thu nào trong tháng này
            </p>
          </div>
        )}
      </div>
    </InstructorProfileLayout>
  );
};

export default MyRevenuePage;
