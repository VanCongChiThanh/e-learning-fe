import AdminLayout from "../../../layouts/AdminLayout";

const AdminPage: React.FC = () => {
  const stats = [
    {
      label: "Tổng số khoá học",
      value: 128,
      icon: "fa-solid fa-book",
      color: "bg-blue-100 text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Người dùng",
      value: 2450,
      icon: "fa-solid fa-users",
      color: "bg-green-100 text-green-600",
      trend: "+18%",
      trendUp: true,
    },
    {
      label: "Giảng viên",
      value: 85,
      icon: "fa-solid fa-chalkboard-teacher",
      color: "bg-yellow-100 text-yellow-600",
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "Doanh thu (tháng)",
      value: "411,110,000 ₫",
      icon: "fa-solid fa-dollar-sign",
      color: "bg-purple-100 text-purple-600",
      trend: "+24%",
      trendUp: true,
    },
  ];

  // Mock data for charts
  const monthlyRevenue = [
    { month: "T1", value: 180 },
    { month: "T2", value: 220 },
    { month: "T3", value: 195 },
    { month: "T4", value: 280 },
    { month: "T5", value: 310 },
    { month: "T6", value: 411 },
  ];

  const coursesByCategory = [
    { category: "Lập trình", count: 45, color: "bg-blue-500" },
    { category: "Thiết kế", count: 28, color: "bg-purple-500" },
    { category: "Marketing", count: 22, color: "bg-green-500" },
    { category: "Kinh doanh", count: 18, color: "bg-yellow-500" },
    { category: "Khác", count: 15, color: "bg-gray-500" },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));
  const maxCourses = Math.max(...coursesByCategory.map((c) => c.count));

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard Tổng quan
        </h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <i className={`${stat.icon} text-2xl`} />
                </div>
                <span
                  className={`text-sm font-semibold ${
                    stat.trendUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <i
                    className={`fas fa-arrow-${stat.trendUp ? "up" : "down"} mr-1`}
                  ></i>
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Doanh thu 6 tháng gần đây
              </h2>
              <span className="text-sm text-gray-500">(Triệu đồng)</span>
            </div>
            <div className="space-y-3">
              {monthlyRevenue.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium text-gray-600">
                    {data.month}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end px-3 transition-all duration-500"
                      style={{ width: `${(data.value / maxRevenue) * 100}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {data.value}M
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses by Category */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Khóa học theo danh mục
              </h2>
              <span className="text-sm text-gray-500">
                Tổng: {coursesByCategory.reduce((sum, c) => sum + c.count, 0)}
              </span>
            </div>
            <div className="space-y-4">
              {coursesByCategory.map((data) => (
                <div key={data.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {data.category}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {data.count}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${data.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${(data.count / maxCourses) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Hoạt động gần đây
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: "fa-user-plus",
                  color: "text-green-600 bg-green-100",
                  text: "Người dùng",
                  highlight: "Nguyễn Văn A",
                  action: "vừa đăng ký khóa học",
                  target: "ReactJS cho người mới bắt đầu",
                  time: "5 phút trước",
                },
                {
                  icon: "fa-chalkboard-teacher",
                  color: "text-blue-600 bg-blue-100",
                  text: "Giảng viên",
                  highlight: "Trần Thị B",
                  action: "nộp hồ sơ giảng viên",
                  target: "",
                  time: "15 phút trước",
                },
                {
                  icon: "fa-fire",
                  color: "text-orange-600 bg-orange-100",
                  text: "Khóa học",
                  highlight: "Spring Boot Master Class",
                  action: "đã có",
                  target: "20 học viên mới",
                  time: "1 giờ trước",
                },
                {
                  icon: "fa-star",
                  color: "text-yellow-600 bg-yellow-100",
                  text: "Đánh giá mới",
                  highlight: "5 sao",
                  action: "cho khóa học",
                  target: "Python Advanced",
                  time: "2 giờ trước",
                },
                {
                  icon: "fa-dollar-sign",
                  color: "text-purple-600 bg-purple-100",
                  text: "Thanh toán",
                  highlight: "2,500,000 ₫",
                  action: "từ",
                  target: "15 đơn hàng",
                  time: "3 giờ trước",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.color} flex items-center justify-center`}
                  >
                    <i className={`fas ${activity.icon}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      {activity.text}{" "}
                      <span className="font-semibold text-gray-900">
                        {activity.highlight}
                      </span>{" "}
                      {activity.action}{" "}
                      {activity.target && (
                        <span className="font-semibold text-gray-900">
                          {activity.target}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Thống kê nhanh
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">Tỷ lệ hoàn thành</span>
                  <i className="fas fa-chart-line text-blue-600"></i>
                </div>
                <p className="text-2xl font-bold text-blue-900">68%</p>
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-700">Đánh giá TB</span>
                  <i className="fas fa-star text-green-600"></i>
                </div>
                <p className="text-2xl font-bold text-green-900">4.6/5.0</p>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${
                        star <= 4 ? "text-yellow-500" : "text-gray-300"
                      }`}
                    ></i>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-700">
                    Chờ phê duyệt
                  </span>
                  <i className="fas fa-clock text-purple-600"></i>
                </div>
                <p className="text-2xl font-bold text-purple-900">12</p>
                <p className="text-xs text-purple-600 mt-1">
                  Đơn ứng tuyển giảng viên
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-orange-700">Học viên mới</span>
                  <i className="fas fa-user-graduate text-orange-600"></i>
                </div>
                <p className="text-2xl font-bold text-orange-900">+156</p>
                <p className="text-xs text-orange-600 mt-1">
                  Trong 7 ngày qua
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
