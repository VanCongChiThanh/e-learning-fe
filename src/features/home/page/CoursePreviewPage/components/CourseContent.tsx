import { CourseResponse, SectionResponse } from "../types";

interface CourseContentProps {
  course: CourseResponse;
  sections: SectionResponse[];
  expandedSections: Set<string>;
  toggleSection: (sectionId: string) => void;
}

export default function CourseContent({
  course,
  sections,
  expandedSections,
  toggleSection,
}: CourseContentProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle null/undefined sections safely
  const safeSections = sections || [];

  const totalLectures = safeSections.reduce(
    (acc, section) => acc + (section.lectures?.length || 0),
    0
  );

  const totalDuration = safeSections.reduce(
    (acc, section) =>
      acc +
      (section.lectures?.reduce(
        (sum, lecture) => sum + (lecture.duration || 0),
        0
      ) || 0),
    0
  );

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  return (
    <>
      {/* What You'll Learn */}
      <section className="what-you-learn">
        <h2>Bạn sẽ học được gì</h2>
        <div className="learning-objectives">
          <div className="objective-item">
            <i className="fa-solid fa-check"></i>
            <span>
              Nắm vững kiến thức cơ bản và nâng cao về {course.category}
            </span>
          </div>
          <div className="objective-item">
            <i className="fa-solid fa-check"></i>
            <span>Áp dụng kiến thức vào các dự án thực tế</span>
          </div>
          <div className="objective-item">
            <i className="fa-solid fa-check"></i>
            <span>Xây dựng portfolio ấn tượng cho sự nghiệp của bạn</span>
          </div>
          <div className="objective-item">
            <i className="fa-solid fa-check"></i>
            <span>Chuẩn bị tốt cho các buổi phỏng vấn kỹ thuật</span>
          </div>
        </div>
      </section>

      {/* Course Content / Curriculum */}
      <section className="course-curriculum">
        <h2>Nội dung khóa học</h2>
        <div className="curriculum-header">
          <div className="curriculum-stats">
            {safeSections.length} phần • {totalLectures} bài giảng •{" "}
            {formatTotalDuration(totalDuration)}
          </div>
          <button
            className="expand-all-btn"
            onClick={() => {
              // Toggle all sections
              if (expandedSections.size === safeSections.length) {
                toggleSection("");
              }
            }}
          >
            Mở rộng tất cả
          </button>
        </div>

        {safeSections.map((section) => {
          const sectionDuration =
            section.lectures?.reduce(
              (sum, lecture) => sum + (lecture.duration || 0),
              0
            ) || 0;
          const isExpanded = expandedSections.has(section.sectionId);

          return (
            <div key={section.sectionId} className="curriculum-section">
              <div
                className={`section-header ${isExpanded ? "expanded" : ""}`}
                onClick={() => toggleSection(section.sectionId)}
              >
                <div className="section-title">
                  <i
                    className={`fa-solid fa-chevron-right ${
                      isExpanded ? "rotated" : ""
                    }`}
                  ></i>
                  <span>{section.title}</span>
                </div>
                <div className="section-meta">
                  <span>
                    {section.lectures?.length || 0} bài giảng •{" "}
                    {formatTotalDuration(sectionDuration)}
                  </span>
                </div>
              </div>

              {isExpanded &&
                section.lectures &&
                section.lectures.length > 0 && (
                  <div className="lectures-list">
                    {section.lectures.map((lecture, index) => (
                      <div key={lecture.lectureId} className="lecture-item">
                        <div className="lecture-info">
                          <i className="fa-solid fa-circle-play"></i>
                          <span className="lecture-position">{index + 1}</span>
                          <span>{lecture.title}</span>
                        </div>
                        <div className="lecture-duration">
                          {lecture.duration && formatDuration(lecture.duration)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </section>

      {/* Requirements */}
      <section className="course-requirements">
        <h2>Yêu cầu</h2>
        <ul>
          <li>Không yêu cầu kinh nghiệm trước về lập trình</li>
          <li>Một máy tính có kết nối internet</li>
          <li>Tinh thần học hỏi và sẵn sàng thực hành</li>
        </ul>
      </section>

      {/* Description */}
      <section className="course-description-section">
        <h2>Mô tả</h2>
        <p>{course.description}</p>
      </section>
    </>
  );
}
