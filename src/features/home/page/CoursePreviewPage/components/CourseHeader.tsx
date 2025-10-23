import { CourseResponse } from "../types";

interface CourseHeaderProps {
  course: CourseResponse;
}

export default function CourseHeader({ course }: CourseHeaderProps) {
  const getLevelBadge = (level: string) => {
    const levels: Record<string, { label: string; color: string }> = {
      ALL_LEVEL: { label: "Phù hợp cho mọi trình độ học viên", color: "gray" },
      BEGINNER: { label: "Cơ bản", color: "green" },
      INTERMEDIATE: { label: "Trung cấp", color: "blue" },
      ADVANCED: { label: "Nâng cao", color: "purple" },
    };
    return levels[level] || { label: level, color: "gray" };
  };

  const levelBadge = getLevelBadge(course.level);

  return (
    <div className="course-header">
      <div className="container-course-header">
        <div className="breadcrumb">
          <a href="/">Trang chủ</a>
          <span>/</span>
          <a href={`/courses/search?category=${course.category}`}>{course.category}</a>
          <span>/</span>
          <span>{course.title}</span>
        </div>

        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          <div className="rating">
            <span className="rating-number">
              {course.averageRating?.toFixed(1) || "0.0"}
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
            <span className="rating-count">
              ({course.totalReviews} đánh giá)
            </span>
          </div>

          <div className="student-count">
            <i className="fa-solid fa-user-group"></i>
            <span>{course.totalStudents?.toLocaleString()} học viên</span>
          </div>

          <span className={`course-level ${levelBadge.color.toLowerCase()}`}>
            {levelBadge.label}
          </span>
        </div>

        <div className="instructor-info">
          <span>Giảng viên: </span>
          <a href={`/instructor/${course.instructorId}`}>
            {course.instructorName}
          </a>
        </div>

        <div className="course-details">
          <span>
            <i className="fa-regular fa-calendar"></i>
            Cập nhật: {new Date(course.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>

        {course.tags  && (
          <div className="course-tags">
            {course.tags.map((tag) => (
              <span key={tag.tagId} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
