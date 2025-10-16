import { CourseResponse, SectionResponse } from "../types";

interface CourseSidebarProps {
  course: CourseResponse;
  sections: SectionResponse[];
}

export default function CourseSidebar({
  course,
  sections,
}: CourseSidebarProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle null/undefined sections and lectures safely
  const safeSections = sections || [];

  const totalDuration = safeSections.reduce(
    (acc, section) =>
      acc +
      (section.lectures?.reduce(
        (sum, lecture) => sum + (lecture.duration || 0),
        0
      ) || 0),
    0
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="course-sidebar">
      {/* Course Image with Preview Overlay */}
      <div className="course-card-image">
        <img src={course.image} alt={course.title} />
        <div className="preview-overlay">
          <button className="preview-btn">
            <i className="fa-solid fa-play"></i>
            <span>Xem trước</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="course-card-body">
        {/* Price */}
        <div className="course-price">{formatPrice(course.price)}</div>

        {/* CTA Buttons */}
        <div className="cta-buttons">
          <button className="btn-primary">
            <i className="fa-solid fa-cart-plus"></i>
            Thêm vào giỏ hàng
          </button>
          <button className="btn-secondary">Mua ngay</button>
        </div>

        {/* Money Back Guarantee */}
        <div className="money-back-guarantee">
          <p>Đảm bảo hoàn tiền trong 30 ngày</p>
        </div>

        {/* Course Includes */}
        <div className="course-includes">
          <h3>Khóa học này bao gồm:</h3>
          <ul>
            <li>
              <i className="fa-solid fa-video"></i>
              <span>{formatDuration(totalDuration)} video theo yêu cầu</span>
            </li>
            <li>
              <i className="fa-solid fa-file"></i>
              <span>{course.totalLectures} bài giảng</span>
            </li>
            <li>
              <i className="fa-solid fa-infinity"></i>
              <span>Truy cập trọn đời</span>
            </li>
            <li>
              <i className="fa-solid fa-mobile-screen"></i>
              <span>Truy cập trên điện thoại và TV</span>
            </li>
            <li>
              <i className="fa-solid fa-certificate"></i>
              <span>Chứng chỉ hoàn thành</span>
            </li>
          </ul>
        </div>

        {/* Course Actions - Share & Wishlist */}
        <div className="course-actions">
          <button>
            <i className="fa-regular fa-heart"></i>
            <span>Yêu thích</span>
          </button>
          <button>
            <i className="fa-solid fa-gift"></i>
            <span>Tặng</span>
          </button>
          <button>
            <i className="fa-solid fa-share-nodes"></i>
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
