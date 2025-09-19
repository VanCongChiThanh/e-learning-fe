import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../../../layouts/MainLayout";
const OnlineDegreesPage = () => {
  return (
    <MainLayout>
      <HomeLayout>
        <h2 className="text-2xl font-bold text-[#106c54] mb-6">
          Bằng cấp Online
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((id) => (
          <div
            key={id}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg text-gray-800">
              Chương trình {id}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Được hợp tác cùng Đại học uy tín, mang đến lộ trình học chính quy
              và bằng cấp giá trị.
            </p>
            <button className="mt-4 bg-[#106c54] text-white px-4 py-2 rounded-lg hover:opacity-90">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </HomeLayout>
    </MainLayout>
  );
};

export default OnlineDegreesPage;
