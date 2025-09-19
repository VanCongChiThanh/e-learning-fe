import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../../../layouts/MainLayout";
const CareersPage = () => {
  return (
    <MainLayout>
      <HomeLayout>
        <h2 className="text-2xl font-bold text-[#106c54] mb-6">
          Định hướng nghề nghiệp
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Frontend Developer", "Data Analyst", "UI/UX Designer"].map(
          (career, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg text-gray-800">{career}</h3>
              <p className="text-sm text-gray-600 mt-2">
                Khám phá lộ trình học tập để trở thành {career}.
              </p>
              <button className="mt-4 bg-[#106c54] text-white px-4 py-2 rounded-lg hover:opacity-90">
                Khám phá
              </button>
            </div>
          )
        )}
      </div>
    </HomeLayout>
  </MainLayout>
);
};

export default CareersPage;
