import React, { useEffect } from "react";
import { useEnrollments } from "../hook/useEnrollment";
import { UUID } from "../utils/UUID";
import { useSelector } from "react-redux";
import View from "../component/View";
import { RootState } from "../../../app/store";

const EnrollmentLearn: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth as { user: { id: UUID } | null });
  const userId = user?.id;
  
  const {
    enrollments,
    loading,
    error,
    fetchCourseById,
    fetchEnrollmentById,
    fetchEnrollments,
    coursesMap,
    getCourseFromMap,
  } = useEnrollments(userId as UUID);

  useEffect(() => {
    const loadCourses = async () => {
      if (!enrollments || enrollments.length === 0) return;
      
      const courseIds = enrollments
        .map(e => e.courseId)
        .filter(id => id && !coursesMap[id]); 
      
      if (courseIds.length > 0) {
        for (const courseId of courseIds) {
          await fetchCourseById(courseId);
        }
      }
    };
    
    loadCourses();
  }, [enrollments, coursesMap, fetchCourseById]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={() => fetchEnrollments()}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dữ liệu ảo cho khóa học nổi bật
  const featuredCourses = [
    {
      id: 1,
      title: "JavaScript từ cơ bản đến nâng cao",
      instructor: "Nguyễn Văn A",
      rating: 4.8,
      students: 15420,
      image: "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=400",
      price: "299,000đ",
      originalPrice: "499,000đ"
    },
    {
      id: 2,
      title: "React & Redux Complete Guide",
      instructor: "Trần Thị B",
      rating: 4.9,
      students: 12350,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      price: "399,000đ",
      originalPrice: "599,000đ"
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      instructor: "Lê Văn C",
      rating: 4.7,
      students: 8920,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
      price: "449,000đ",
      originalPrice: "699,000đ"
    }
  ];

  // Dữ liệu ảo cho cảm nhận học viên
  const studentReviews = [
    {
      id: 1,
      name: "Hoàng Minh Tuấn",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      review: "Khóa học rất chất lượng, giảng viên nhiệt tình. Tôi đã học được rất nhiều kiến thức bổ ích.",
      course: "JavaScript Advanced",
      rating: 5,
      date: "2 ngày trước"
    },
    {
      id: 2,
      name: "Nguyễn Thu Hương",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      review: "Nội dung dễ hiểu, bài tập thực tế giúp tôi áp dụng ngay vào công việc.",
      course: "React Development",
      rating: 5,
      date: "5 ngày trước"
    },
    {
      id: 3,
      name: "Phạm Đức Anh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      review: "Giảng viên giải thích rất kỹ, video chất lượng cao. Đáng đồng tiền bát gạo!",
      course: "Backend Mastery",
      rating: 5,
      date: "1 tuần trước"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Khóa học của tôi</h1>
          <p className="text-gray-600">Tiếp tục hành trình học tập của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cột trái - Khóa học nổi bật */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Khóa học nổi bật
              </h2>
              
              <div className="space-y-4">
                {featuredCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">Bởi {course.instructor}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">({course.rating})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-[#106c54]">{course.price}</span>
                        <span className="text-xs text-gray-500 line-through">{course.originalPrice}</span>
                      </div>
                      <span className="text-xs text-gray-500">{course.students.toLocaleString()} HV</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-[#106c54] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#0d5643] transition-colors">
                Xem tất cả khóa học
              </button>
            </div>
          </div>

          {/* Phần chính - Khóa học của tôi (2 cột) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Khóa học đang học</h2>
              
              {enrollments && enrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrollments.map((enrollment) => (
                    <View
                      key={enrollment.id}
                      enrollment={enrollment}
                      course={getCourseFromMap(enrollment.courseId)?.data}
                      fetchCourseById={fetchCourseById}
                      fetchEnrollmentById={fetchEnrollmentById}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
                  <p className="text-gray-500">Hãy khám phá các khóa học nổi bật bên cạnh!</p>
                </div>
              )}
            </div>
          </div>

          {/* Cột phải - Cảm nhận học viên */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Cảm nhận học viên
              </h2>
              
              <div className="space-y-4">
                {studentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={review.avatar} 
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-800 text-sm">{review.name}</h4>
                          <div className="flex text-yellow-500">
                            {[...Array(review.rating)].map((_, i) => (
                              <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">{review.review}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">{review.course}</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 border border-[#106c54] text-[#106c54] py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#106c54] hover:text-white transition-colors">
                Xem thêm đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentLearn;