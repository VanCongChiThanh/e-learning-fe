import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../../layouts/AdminLayout";
import {
  getAllInstructorsRevenue,
  getUserBankAccountByAdmin,
  InstructorRevenue,
  BankAccountResponse,
} from "../api/revenueAPI";

const RevenuePage: React.FC = () => {
  const [revenues, setRevenues] = useState<InstructorRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Month filter
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Payment status tracking (local only - no API)
  const [paidInstructors, setPaidInstructors] = useState<Set<string>>(
    new Set()
  );

  // Bank account dialog
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorRevenue | null>(null);
  const [bankData, setBankData] = useState<BankAccountResponse | null>(null);
  const [loadingBank, setLoadingBank] = useState(false);
  const [showBankDialog, setShowBankDialog] = useState(false);

  useEffect(() => {
    fetchRevenues();
    // Reset payment status when month changes
    setPaidInstructors(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const fetchRevenues = async () => {
    try {
      setLoading(true);

      // Calculate start and end date from selectedMonth in UTC
      const [year, month] = selectedMonth.split("-").map(Number);

      // Use UTC to avoid timezone offset issues
      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));


      const data = await getAllInstructorsRevenue({
        start_date: startDate.getTime(),
        end_date: endDate.getTime(),
      });

      setRevenues(data);
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message || "Không thể tải dữ liệu doanh thu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewBankAccount = async (instructor: InstructorRevenue) => {
    setSelectedInstructor(instructor);
    setShowBankDialog(true);
    setLoadingBank(true);
    setBankData(null);

    try {
      const data = await getUserBankAccountByAdmin(
        instructor.instructor.user_id
      );
      setBankData(data);
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message ||
          "Không thể tải thông tin tài khoản ngân hàng"
      );
    } finally {
      setLoadingBank(false);
    }
  };

  const closeBankDialog = () => {
    setShowBankDialog(false);
    setSelectedInstructor(null);
    setBankData(null);
  };

  const handleMarkAsPaid = (userId: string) => {
    setPaidInstructors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
        toast.info("Đã hủy đánh dấu thanh toán");
      } else {
        newSet.add(userId);
        toast.success("Đã đánh dấu đã thanh toán");
      }
      return newSet;
    });
  };

  // Filter
  const filteredRevenues = revenues.filter((rev) =>
    rev.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate totals
  const totalRevenue = revenues.reduce(
    (sum, rev) => sum + rev.total_revenue,
    0
  );
  const totalEarnings = revenues.reduce(
    (sum, rev) => sum + rev.net_earnings,
    0
  );
  const totalCourses = revenues.reduce(
    (sum, rev) => sum + rev.total_courses,
    0
  );

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thống kê doanh thu giảng viên
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi doanh thu của tất cả giảng viên
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Tổng doanh thu</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <i className="fas fa-dollar-sign text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm mb-1">
                  Thu nhập giảng viên
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalEarnings)}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <i className="fas fa-hand-holding-usd text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Tổng khóa học</p>
                <p className="text-2xl font-bold">{totalCourses}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <i className="fas fa-book text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên giảng viên..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              <i className="fas fa-calendar-alt mr-2"></i>
              Tháng:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giảng viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng số khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng doanh thu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % Hoa hồng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thu nhập
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRevenues.length > 0 ? (
                    filteredRevenues.map((rev) => (
                      <tr
                        key={rev.instructor.user_id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {rev.instructor.avatar ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={rev.instructor.avatar}
                                  alt={rev.instructor.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                  {rev.instructor.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {rev.instructor.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {rev.instructor.user_id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {rev.total_courses}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-600">
                            {formatCurrency(rev.total_revenue)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {(rev.commission_percentage * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-emerald-600">
                            {formatCurrency(rev.net_earnings)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {paidInstructors.has(rev.instructor.user_id) ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <i className="fas fa-check-circle mr-1"></i>
                              Đã thanh toán
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              <i className="fas fa-clock mr-1"></i>
                              Chưa thanh toán
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewBankAccount(rev)}
                              className="text-emerald-600 hover:text-emerald-900 font-medium"
                              title="Xem tài khoản ngân hàng"
                            >
                              <i className="fas fa-university mr-1"></i>
                              TK NH
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() =>
                                handleMarkAsPaid(rev.instructor.user_id)
                              }
                              className={`font-medium ${
                                paidInstructors.has(rev.instructor.user_id)
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-blue-600 hover:text-blue-900"
                              }`}
                              title={
                                paidInstructors.has(rev.instructor.user_id)
                                  ? "Hủy đánh dấu"
                                  : "Đánh dấu đã thanh toán"
                              }
                            >
                              <i
                                className={`fas ${
                                  paidInstructors.has(rev.instructor.user_id)
                                    ? "fa-times-circle"
                                    : "fa-check-circle"
                                } mr-1`}
                              ></i>
                              {paidInstructors.has(rev.instructor.user_id)
                                ? "Hủy"
                                : "Thanh toán"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <i className="fas fa-search text-4xl mb-3 text-gray-300"></i>
                        <p>Không tìm thấy giảng viên nào</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Bank Account Dialog */}
        {showBankDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Dialog Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  {selectedInstructor?.instructor.avatar ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={selectedInstructor.instructor.avatar}
                      alt={selectedInstructor.instructor.name}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
                      {selectedInstructor?.instructor.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Thông tin tài khoản ngân hàng
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedInstructor?.instructor.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeBankDialog}
                  className="text-gray-400 hover:text-gray-600"
                  title="Đóng"
                  aria-label="Đóng dialog"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {/* Dialog Content */}
              <div className="p-6">
                {loadingBank ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                      <p className="mt-3 text-gray-600">
                        Đang tải thông tin...
                      </p>
                    </div>
                  </div>
                ) : bankData ? (
                  <div className="space-y-4">
                    {/* Active Bank */}
                    {bankData.active_bank && (
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 mb-3">
                          <i className="fas fa-check-circle text-emerald-600 text-lg"></i>
                          <h3 className="font-semibold text-gray-800">
                            Tài khoản đang sử dụng
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ngân hàng:</span>
                            <span className="font-medium">
                              {bankData.active_bank.bank_name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số tài khoản:</span>
                            <span className="font-mono font-medium text-blue-600">
                              {bankData.active_bank.account_number_masked}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Chủ tài khoản:
                            </span>
                            <span className="font-medium">
                              {bankData.active_bank.account_holder_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending Bank */}
                    {bankData.pending_bank && (
                      <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-3">
                          <i className="fas fa-clock text-yellow-600 text-lg"></i>
                          <h3 className="font-semibold text-gray-800">
                            Đang chờ xác nhận
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ngân hàng:</span>
                            <span className="font-medium">
                              {bankData.pending_bank.bank_name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số tài khoản:</span>
                            <span className="font-mono font-medium text-blue-600">
                              {bankData.pending_bank.account_number_masked}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Chủ tài khoản:
                            </span>
                            <span className="font-medium">
                              {bankData.pending_bank.account_holder_name}
                            </span>
                          </div>
                          {bankData.pending_bank.expired_at && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Hết hạn:</span>
                              <span className="text-yellow-700 text-xs">
                                {new Date(
                                  bankData.pending_bank.expired_at * 1000
                                ).toLocaleString("vi-VN")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* No bank account */}
                    {!bankData.active_bank && !bankData.pending_bank && (
                      <div className="text-center py-12 text-gray-500">
                        <i className="fas fa-university text-4xl mb-3 text-gray-300"></i>
                        <p>Giảng viên chưa đăng ký tài khoản ngân hàng</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-exclamation-circle text-4xl mb-3 text-red-300"></i>
                    <p>Không thể tải thông tin tài khoản</p>
                  </div>
                )}
              </div>

              {/* Dialog Footer */}
              <div className="flex justify-end p-6 border-t">
                <button
                  onClick={closeBankDialog}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RevenuePage;
