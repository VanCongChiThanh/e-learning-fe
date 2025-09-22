import HomeLayout from "../layout/HomeLayout";
import { Link } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
const MyLearningPage = () => {
  const courses = [
    { id: 1, name: "Khóa học 1", slug: "lap-trinh-spring-boot-co-ban", progress: 20 },
    { id: 2, name: "Khóa học 2", slug: "spring-boot-nang-cao", progress: 40 },
    { id: 3, name: "Khóa học 3", slug: "reactjs-cho-nguoi-moi-bat-dau", progress: 60 },
  ];

  return (
    <MainLayout>
      <HomeLayout>  
        <h2 className="text-2xl font-bold text-[#106c54] mb-6">
          Khóa học của tôi
        </h2>

        <div className="space-y-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Tiến độ: {course.progress}%
                </p>
              </div>
              <Link
                to={`/learning/${course.slug}`}
                className="bg-[#106c54] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                Tiếp tục học
              </Link>
            </div>
          ))}
        </div>
      </HomeLayout>
    </MainLayout>
  );
};

export default MyLearningPage;
