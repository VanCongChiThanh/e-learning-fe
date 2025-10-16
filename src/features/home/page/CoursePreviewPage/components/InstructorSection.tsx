interface InstructorSectionProps {
  instructorId: string;
  instructorName: string;
}

export default function InstructorSection({
  instructorId,
  instructorName,
}: InstructorSectionProps) {
  return (
    <section className="course-section instructor-section">
      <h2>Giảng viên</h2>
      <div className="instructor-card">
        <div className="instructor-header">
          <img
            src={`https://ui-avatars.com/api/?name=${instructorName}&size=128&background=random`}
            alt={instructorName}
            className="instructor-avatar"
          />
          <div className="instructor-info">
            <h3>
              <a href={`/instructor/${instructorId}`}>{instructorName}</a>
            </h3>
            <p className="instructor-title">Chuyên gia</p>
            <div className="instructor-stats">
              <div className="stat-item">
                <i className="fa-solid fa-star"></i>
                <span>4.8 Xếp hạng giảng viên</span>
              </div>
              <div className="stat-item">
                <i className="fa-solid fa-certificate"></i>
                <span>1,250 Đánh giá</span>
              </div>
              <div className="stat-item">
                <i className="fa-solid fa-user-group"></i>
                <span>12,543 Học viên</span>
              </div>
              <div className="stat-item">
                <i className="fa-solid fa-circle-play"></i>
                <span>8 Khóa học</span>
              </div>
            </div>
          </div>
        </div>
        <div className="instructor-bio">
          <p>
            Là một chuyên gia với nhiều năm kinh nghiệm trong ngành, tôi đam mê
            chia sẻ kiến thức và giúp học viên phát triển kỹ năng của họ. Tôi
            tin rằng học tập là một hành trình suốt đời và tôi cam kết mang đến
            những khóa học chất lượng cao nhất.
          </p>
        </div>
      </div>
    </section>
  );
}
