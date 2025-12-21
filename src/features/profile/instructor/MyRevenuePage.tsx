import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InstructorProfileLayout from "./ProfileLayout";
import {
  getMyRevenue,
  MyRevenueResponse,
  getMyCourseRevenue,
  InstructorCourseRevenueResponse,
  getCourseTransactions,
  CourseTransactionResponse,
} from "../api";

const MyRevenuePage: React.FC = () => {
  const [revenue, setRevenue] = useState<MyRevenueResponse | null>(null);
  const [courses, setCourses] = useState<InstructorCourseRevenueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Course detail modal states
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] =
    useState<InstructorCourseRevenueResponse | null>(null);
  const [transactions, setTransactions] = useState<CourseTransactionResponse[]>(
    []
  );
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "courses">(
    "overview"
  );

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

      const revenueData = await getMyRevenue({
        start_date: startDate.getTime(),
        end_date: endDate.getTime(),
      });

      setRevenue(revenueData);
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message || "Không thể tải dữ liệu doanh thu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourseList = async () => {
    setActiveTab("courses");

    if (courses.length === 0) {
      try {
        setLoadingTransactions(true);

        const [year, month] = selectedMonth.split("-").map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const coursesData = await getMyCourseRevenue({
          start_date: startDate.getTime(),
          end_date: endDate.getTime(),
        });

        setCourses(coursesData);
      } catch (err: any) {
        toast.error(
          err.response?.data?.error?.message || "Không thể tải dữ liệu khóa học"
        );
      } finally {
        setLoadingTransactions(false);
      }
    }
  };

  const handleViewCourseDetail = async (
    course: InstructorCourseRevenueResponse
  ) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
    setLoadingTransactions(true);

    try {
      const [year, month] = selectedMonth.split("-").map(Number);
      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      const data = await getCourseTransactions(
        course.course_id,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setTransactions(data);
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message || "Không thể tải giao dịch khóa học"
      );
    } finally {
      setLoadingTransactions(false);
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
          <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 rounded-t-lg">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "overview"
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-chart-pie mr-2"></i>
                  Thu nhập của tôi
                </button>
                <button
                  onClick={handleViewCourseList}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "courses"
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-book mr-2"></i>
                  Doanh thu các khóa học
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" ? (
              /* Overview Tab */
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
                      Thu nhập sẽ được chuyển vào tài khoản ngân hàng của bạn
                      vào cuối mỗi tháng. Vui lòng đảm bảo thông tin tài khoản
                      ngân hàng của bạn đã được cập nhật và xác nhận.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Courses Tab */
              <div>
                {loadingTransactions ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                      <p className="mt-4 text-gray-600">
                        Đang tải dữ liệu khóa học...
                      </p>
                    </div>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <i className="fas fa-book text-emerald-600"></i>
                      Doanh thu theo khóa học
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Khóa học
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Số lượng bán
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tổng doanh thu
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thu nhập ròng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {courses.map((course) => (
                            <tr
                              key={course.course_id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {course.title}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-700">
                                  {formatCurrency(course.price)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-700">
                                  {course.total_sales}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-blue-600">
                                  {formatCurrency(course.gross_revenue)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-emerald-600">
                                  {formatCurrency(course.net_earnings)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleViewCourseDetail(course)}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  <i className="fas fa-eye mr-1"></i>
                                  Chi tiết
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <i className="fas fa-book-open text-5xl text-gray-300 mb-3"></i>
                    <p className="text-lg font-medium text-gray-600">
                      Bạn chưa có khóa học nào
                    </p>
                    <p className="text-sm mt-1 text-gray-500">
                      Hãy tạo khóa học để bắt đầu kiếm thu nhập
                    </p>
                  </div>
                )}
              </div>
            )}
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

        {/* Course Detail Modal */}
        {showCourseDetail && selectedCourse && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCourseDetail(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Chi tiết giao dịch
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedCourse.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowCourseDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Đóng"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Số lượng bán</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {selectedCourse.total_sales}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 mb-1">
                      Tổng doanh thu
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatCurrency(selectedCourse.gross_revenue)}
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-emerald-700 mb-1">
                      Thu nhập ròng
                    </p>
                    <p className="text-2xl font-bold text-emerald-900">
                      {formatCurrency(selectedCourse.net_earnings)}
                    </p>
                  </div>
                </div>

                {/* Transactions Table */}
                {loadingTransactions ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                      <p className="mt-3 text-gray-600">
                        Đang tải giao dịch...
                      </p>
                    </div>
                  </div>
                ) : transactions.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Danh sách giao dịch ({transactions.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mã đơn hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email học viên
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tổng tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thu nhập
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thời gian
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr
                              key={transaction.order_id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-mono text-gray-600">
                                  {transaction.order_id.slice(0, 8)}...
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-700">
                                  {transaction.student_email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-blue-600">
                                  {formatCurrency(transaction.gross_amount)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-emerald-600">
                                  {formatCurrency(transaction.net_amount)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                  {new Date(
                                    transaction.created_at * 1000
                                  ).toLocaleString("vi-VN", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                    <p>Không có giao dịch nào trong tháng này</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 border-t bg-gray-50">
                <button
                  onClick={() => setShowCourseDetail(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorProfileLayout>
  );
};

export default MyRevenuePage;
