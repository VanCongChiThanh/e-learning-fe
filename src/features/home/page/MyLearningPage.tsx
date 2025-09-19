import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../../../layouts/MainLayout";
const MyLearningPage = () => {
  return (
    <MainLayout>
      <HomeLayout>
        <h2 className="text-2xl font-bold text-[#106c54] mb-6">
          Khóa học của tôi
      </h2>

      <div className="space-y-6">
        {[1, 2, 3].map((id) => (
          <div
            key={id}
            className="bg-white rounded-xl shadow p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                Khóa học {id}
              </h3>
              <p className="text-sm text-gray-600">Tiến độ: {id * 20}%</p>
            </div>
            <button className="bg-[#106c54] text-white px-4 py-2 rounded-lg hover:opacity-90">
              Tiếp tục học
            </button>
          </div>
        ))}
      </div>
    </HomeLayout>
  </MainLayout>
)};

export default MyLearningPage;
