import React, { useEffect } from "react";
import { useEnrollments } from "../hook/useEnrollment";
import { UUID } from "../utils/UUID";
import { useSelector } from "react-redux";
import View from "../component/View";
import { RootState } from "../../../app/store";
import HomeLayout from "../../home/layout/HomeLayout";

// --- CÁC THÀNH PHẦN GIAO DIỆN PHỤ (ĐÃ CẬP NHẬT) ---
const featuredCourses = [
  {
    id: 1,
    title: "JavaScript từ cơ bản đến nâng cao",
    instructor: "Nguyễn Văn A",
    rating: 4.8,
    students: 15420,
    image: "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=400",
    price: "299,000đ",
    originalPrice: "499,000đ",
  },
  {
    id: 2,
    title: "React & Redux Complete Guide",
    instructor: "Trần Thị B",
    rating: 4.9,
    students: 12350,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    price: "399,000đ",
    originalPrice: "599,000đ",
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    instructor: "Lê Văn C",
    rating: 4.7,
    students: 8920,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
    price: "449,000đ",
    originalPrice: "699,000đ",
  },
];

// Dữ liệu ảo cho cảm nhận học viên
const studentReviews = [
  {
    id: 1,
    name: "Hoàng Minh Tuấn",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    review:
      "Khóa học rất chất lượng, giảng viên nhiệt tình. Tôi đã học được rất nhiều kiến thức bổ ích.",
    course: "JavaScript Advanced",
    rating: 5,
    date: "2 ngày trước",
  },
  {
    id: 2,
    name: "Nguyễn Thu Hương",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    review:
      "Nội dung dễ hiểu, bài tập thực tế giúp tôi áp dụng ngay vào công việc.",
    course: "React Development",
    rating: 5,
    date: "5 ngày trước",
  },
  {
    id: 3,
    name: "Phạm Đức Anh",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    review:
      "Giảng viên giải thích rất kỹ, video chất lượng cao. Đáng đồng tiền bát gạo!",
    course: "Backend Mastery",
    rating: 5,
    date: "1 tuần trước",
  },
];
const FeaturedCourseCard = ({ course }: { course: any }) => (
  // Giữ nguyên component này
  <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
    <img
      src={course.image}
      alt={course.title}
      className="w-full h-40 object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 text-md mb-2 line-clamp-2 h-12">
        {course.title}
      </h3>
      <p className="text-sm text-gray-600 mb-2">Bởi {course.instructor}</p>

      <div className="flex items-center mb-3">
        <span className="text-sm font-bold text-yellow-500 mr-1">
          {course.rating}
        </span>
        <div className="flex text-yellow-500 text-xs">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(course.rating) ? "fill-current" : "text-gray-300"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-gray-600 ml-2">
          ({course.students.toLocaleString()} HV)
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-[#106c54]">{course.price}</span>
        <span className="text-sm text-gray-500 line-through">
          {course.originalPrice}
        </span>
      </div>
    </div>
  </div>
);

const ReviewCard = ({ review }: { review: any }) => (
  // Giữ nguyên component này
  <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
    <div className="flex-1">
      <p className="text-gray-600 mb-4 text-sm">"{review.review}"</p>
    </div>
    <div className="border-t border-gray-100 pt-4 mt-auto">
      <div className="flex items-center space-x-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">{review.name}</h4>
          <span className="text-xs text-gray-500">
            Học viên {review.course}
          </span>
        </div>
        <div className="flex text-yellow-500">
          {[...Array(review.rating)].map((_, i) => (
            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- COMPONENT MỚI: HEADER BANNER ---
const HeaderBanner = () => (
  <div className="bg-gradient-to-r from-[#106c54] to-[#0f7a5c] text-white rounded-xl shadow-lg p-8 md:p-12 mb-10">
    <h1 className="text-3xl md:text-4xl font-bold mb-2">Chào mừng trở lại!</h1>
    <p className="text-lg text-gray-200">
      Hãy tiếp tục hành trình học tập của bạn và khám phá những điều mới mẻ.
    </p>
  </div>
);

// --- COMPONENT MỚI: SKELETON LOADER ---
const LoadingSkeleton = () => (
  <HomeLayout>
    <div className="max-w-7xl mx-auto p-6 md:p-8 animate-pulse">
      {/* Skeleton cho Header Banner */}
      <div className="bg-gray-300 h-36 rounded-xl mb-10"></div>

      {/* Skeleton cho phần "Khóa học đang học" */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="w-full h-40 bg-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton cho "Khóa học nổi bật" */}
      <div className="mb-12">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="w-full h-40 bg-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </HomeLayout>
);

const EnrollmentLearn: React.FC = () => {
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: { id: UUID } | null }
  );
  const userId = user?.id;
  const { enrollments, loading, error } = useEnrollments(userId as UUID);
  // --- XỬ LÝ TRẠNG THÁI LOADING (ĐÃ CẬP NHẬT) ---
  if (loading) {
    return <LoadingSkeleton />;
  }

  // --- XỬ LÝ TRẠNG THÁI ERROR (Giữ nguyên) ---
  if (error) {
    return (
      <HomeLayout>
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            Lỗi server xuất hiện: {error}
          </div>
        </div>
      </HomeLayout>
    );
  }
  // --- GIAO DIỆN MỚI (ĐÃ CẬP NHẬT) ---
  return (
    <>
      <HomeLayout>
        <div className="min-h-screen bg-gray-100">
          {" "}
          {/* Thay đổi bg-gray-50 thành bg-gray-100 để tăng độ tương phản */}
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Header Banner MỚI */}
            <HeaderBanner />

            {/* PHẦN 1: KHÓA HỌC CỦA TÔI */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                {/* Icon sách */}
                <svg
                  className="w-6 h-6 mr-3 text-[#106c54]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25"
                  />
                </svg>
                Khóa học đang học
              </h2>

              {enrollments && enrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment) => (
                    <View key={enrollment.id} enrollment={enrollment} />
                  ))}
                </div>
              ) : (
                // Trạng thái trống
                <div className="text-center py-16">
                  Chưa đăng ký khóa học nào. Hãy khám phá và bắt đầu học ngay!
                </div>
              )}
            </div>

            {/* PHẦN 2: KHÓA HỌC NỔI BẬT */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  {/* Icon ngôi sao */}
                  <svg
                    className="w-6 h-6 mr-3 text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.518a.562.562 0 01.31.95l-4.286 3.118a.563.563 0 00-.182.63l1.634 4.83a.562.562 0 01-.812.622l-4.302-3.118a.563.563 0 00-.652 0l-4.302 3.118a.562.562 0 01-.812-.622l1.634-4.83a.563.563 0 00-.182-.63L.64 9.87a.562.562 0 01.31-.95h5.518a.563.563 0 00.475-.31L11.48 3.5z"
                    />
                  </svg>
                  Khóa học nổi bật
                </h2>
                <button className="text-sm font-medium text-[#106c54] hover:text-[#0d5643]">
                  Xem tất cả
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <FeaturedCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* PHẦN 3: CẢM NHẬN HỌC VIÊN */}
            <div>
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  {/* Icon bình luận */}
                  <svg
                    className="w-6 h-6 mr-3 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                    />
                  </svg>
                  Cảm nhận học viên
                </h2>
                <button className="text-sm font-medium text-[#106c54] hover:text-[#0d5643]">
                  Xem thêm đánh giá
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default EnrollmentLearn;
