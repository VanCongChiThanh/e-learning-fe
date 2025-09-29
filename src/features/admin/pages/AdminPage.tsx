import AdminLayout from "../../../layouts/AdminLayout";

const AdminPage: React.FC = () => {
  const stats = [
    {
      label: "Tổng số khoá học",
      value: 128,
      icon: "fa-solid fa-book",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Người dùng",
      value: 2450,
      icon: "fa-solid fa-users",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Giảng viên",
      value: 85,
      icon: "fa-solid fa-chalkboard-teacher",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Doanh thu (tháng)",
      value: "$12,400",
      icon: "fa-solid fa-dollar-sign",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow flex items-center gap-4"
            >
              <div className={`p-4 rounded-full ${stat.color}`}>
                <i className={`${stat.icon} text-xl`} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder cho biểu đồ / báo cáo */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              📌 Người dùng <b>Nguyễn Văn A</b> vừa đăng ký khoá học{" "}
              <b>ReactJS</b>
            </li>
            <li>
              📌 Giảng viên <b>Trần Thị B</b> nộp hồ sơ giảng viên
            </li>
            <li>
              📌 Khoá học <b>Spring Boot</b> đã có 20 học viên mới
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Biểu đồ thống kê (demo)
          </h2>
          <div className="h-48 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
            📊 Biểu đồ sẽ hiển thị ở đây
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
