import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../../../layouts/MainLayout";

const HomePage = () => {
  const courses = [
    {
      id: 1,
      title: "Google Project Management",
      org: "Google",
      type: "Professional Certificate",
      tag: ["Free Trial", "AI skills"],
      img: "https://picsum.photos/200/120?random=1",
    },
    {
      id: 2,
      title: "Google Digital Marketing & E-commerce",
      org: "Google",
      type: "Professional Certificate",
      tag: ["Free Trial", "AI skills"],
      img: "https://picsum.photos/200/120?random=2",
    },
    {
      id: 3,
      title: "Google AI Essentials",
      org: "Google",
      type: "Specialization",
      tag: ["Free Trial", "AI skills"],
      img: "https://picsum.photos/200/120?random=3",
    },
  ];

  return (
    <MainLayout>
      <HomeLayout>
        {/* Banner gợi ý */}
        <section className="bg-[#eaf5f1] border border-[#cfe8df] rounded-lg p-6 flex items-center gap-4">
          <i className="fa-solid fa-robot text-3xl text-[#106c54]"></i>
          <div>
            <p className="text-gray-800 mb-1">
              Bạn cần hỗ trợ? Hãy chia sẻ một chút về bản thân để tôi có thể đưa
              ra gợi ý phù hợp nhất.
            </p>
            <a href="#" className="text-[#106c54] font-medium hover:underline">
              Đặt mục tiêu
            </a>
          </div>
        </section>

        {/* Most Popular Certificates */}
        <section className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Most Popular Certificates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.slice(0, 2).map((course) => (
              <div
                key={course.id}
                className="border rounded-xl p-4 bg-white hover:shadow-md transition flex gap-4"
              >
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-28 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  {/* Tag */}
                  <div className="flex gap-2 mb-1">
                    {course.tag.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#106c54]/10 text-[#106c54] px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {course.org} {course.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{course.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[#106c54] border border-[#106c54] px-4 py-2 rounded hover:bg-[#106c54] hover:text-white transition">
            Show 8 more
          </button>
        </section>

        {/* Personalized Specializations */}
        <section className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Personalized Specializations for You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.slice(1, 3).map((course) => (
              <div
                key={course.id}
                className="border rounded-xl p-4 bg-white hover:shadow-md transition flex gap-4"
              >
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-28 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  {/* Tag */}
                  <div className="flex gap-2 mb-1">
                    {course.tag.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#106c54]/10 text-[#106c54] px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {course.org} {course.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{course.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-[#106c54] border border-[#106c54] px-4 py-2 rounded hover:bg-[#106c54] hover:text-white transition">
            Show 8 more
          </button>
        </section>
      </HomeLayout>
    </MainLayout>
  );
};

export default HomePage;
