import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CourseResponse } from "../types";

interface RelatedCoursesProps {
  courseId: string;
  category: string;
}

export default function RelatedCourses({
  courseId,
  category,
}: RelatedCoursesProps) {
  const [relatedCourses, setRelatedCourses] = useState<CourseResponse[]>([]);

  useEffect(() => {
    // TODO: Fetch related courses by category
    // For now, using sample data
    const sampleCourses: CourseResponse[] = [
      {
        courseId: "c2",
        title: "Khóa học ReactJS nâng cao",
        slug: "reactjs-nang-cao",
        description: "Làm chủ ReactJS với các kỹ thuật nâng cao",
        price: 799000,
        status: "PUBLISHED",
        level: "INTERMEDIATE",
        instructorId: "i1",
        instructorName: "Nguyễn Văn A",
        category: category,
        image:
          "https://khoahochatde.com/wp-content/uploads/2025/07/reactjs-co-ban-den-nang-cao-1.jpg",
        tags: [],
        averageRating: 4.7,
        totalReviews: 450,
        totalLectures: 85,
        totalStudents: 5200,
        createdAt: "2024-01-01",
        deletedAt: null,
      },
      {
        courseId: "c3",
        title: "TypeScript từ cơ bản đến nâng cao",
        slug: "typescript-co-ban-den-nang-cao",
        description: "Học TypeScript một cách toàn diện",
        price: 699000,
        status: "PUBLISHED",
        level: "BEGINNER",
        instructorId: "i2",
        instructorName: "Trần Thị B",
        category: category,
        image:
          "https://itviec.uptech.vn/wp-content/uploads/2025/01/hoc-Typescript-vippro.jpg",
        tags: [],
        averageRating: 4.8,
        totalReviews: 620,
        totalLectures: 72,
        totalStudents: 7800,
        createdAt: "2024-01-15",
        deletedAt: null,
      },
      {
        courseId: "c4",
        title: "Node.js và Express - Xây dựng API",
        slug: "nodejs-express-api",
        description: "Xây dựng RESTful API với Node.js",
        price: 849000,
        status: "PUBLISHED",
        level: "INTERMEDIATE",
        instructorId: "i1",
        instructorName: "Nguyễn Văn A",
        category: category,
        image:
          "https://images.ctfassets.net/aq13lwl6616q/7cS8gBoWulxkWNWEm0FspJ/c7eb42dd82e27279307f8b9fc9b136fa/nodejs_cover_photo_smaller_size.png",
        tags: [],
        averageRating: 4.6,
        totalReviews: 380,
        totalLectures: 68,
        totalStudents: 4100,
        createdAt: "2024-02-01",
        deletedAt: null,
      },
      {
        courseId: "c5",
        title: "MongoDB - Cơ sở dữ liệu NoSQL",
        slug: "mongodb-nosql",
        description: "Làm chủ MongoDB cho ứng dụng hiện đại",
        price: 599000,
        status: "PUBLISHED",
        level: "BEGINNER",
        instructorId: "i3",
        instructorName: "Lê Văn C",
        category: category,
        image:
          "https://studio3t.com/wp-content/uploads/2020/10/best-mongodb-tutorials-and-courses.png",
        tags: [],
        averageRating: 4.5,
        totalReviews: 290,
        totalLectures: 55,
        totalStudents: 3500,
        createdAt: "2024-02-15",
        deletedAt: null,
      },
    ];
    setRelatedCourses(sampleCourses);
  }, [courseId, category]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section className="course-section related-courses">
      <h2>Các khóa học liên quan</h2>
      <div className="related-courses-grid">
        {relatedCourses.map((course) => (
          <Link
            to={`/courses/${course.slug}`}
            key={course.courseId}
            className="related-course-card"
          >
            <div className="course-image">
              <img src={course.image} alt={course.title} />
              {course.level === "BEGINNER" && (
                <span className="course-level beginner">Cơ bản</span>
              )}
              {course.level === "INTERMEDIATE" && (
                <span className="course-level intermediate">Trung cấp</span>
              )}
              {course.level === "ADVANCED" && (
                <span className="course-level advanced">Nâng cao</span>
              )}
            </div>
            <div className="course-info">
              <h3>{course.title}</h3>
              <p className="course-instructor">{course.instructorName}</p>
              <div className="course-rating">
                <span className="rating-number">
                  {course.averageRating?.toFixed(1)}
                </span>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fa-solid fa-star ${
                        star <= (course.averageRating || 0) ? "filled" : ""
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="rating-count">({course.totalReviews})</span>
              </div>
              <div className="course-meta">
                <span className="course-students">
                  <i className="fa-solid fa-user-group"></i>
                  {course.totalStudents?.toLocaleString("vi-VN")} học viên
                </span>
                <span className="course-lectures">
                  <i className="fa-solid fa-circle-play"></i>
                  {course.totalLectures} bài giảng
                </span>
              </div>
              <div className="course-price">{formatPrice(course.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
