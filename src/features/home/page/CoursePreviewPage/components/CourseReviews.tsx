interface CourseReviewsProps {
  courseId: string;
  averageRating: number;
  totalReviews: number;
}

export default function CourseReviews({
  courseId,
  averageRating,
  totalReviews,
}: CourseReviewsProps) {
  const ratingDistribution = [
    { stars: 5, percentage: 70, count: Math.floor((totalReviews || 0) * 0.7) },
    { stars: 4, percentage: 20, count: Math.floor((totalReviews || 0) * 0.2) },
    { stars: 3, percentage: 7, count: Math.floor((totalReviews || 0) * 0.07) },
    { stars: 2, percentage: 2, count: Math.floor((totalReviews || 0) * 0.02) },
    { stars: 1, percentage: 1, count: Math.floor((totalReviews || 0) * 0.01) },
  ];

  // Sample reviews
  const sampleReviews = [
    {
      id: "1",
      userName: "Nguyễn Văn A",
      rating: 5,
      date: "2 tuần trước",
      comment:
        "Khóa học rất chi tiết và dễ hiểu. Giảng viên truyền đạt rất tốt và có nhiều ví dụ thực tế.",
      helpful: 12,
    },
    {
      id: "2",
      userName: "Trần Thị B",
      rating: 4,
      date: "1 tháng trước",
      comment:
        "Nội dung tốt nhưng có thể thêm nhiều bài tập thực hành hơn. Nhìn chung rất hài lòng.",
      helpful: 8,
    },
    {
      id: "3",
      userName: "Lê Văn C",
      rating: 5,
      date: "3 tuần trước",
      comment: "Đây là khóa học tốt nhất tôi từng tham gia. Rất đáng đầu tư!",
      helpful: 15,
    },
  ];

  return (
    <section className="course-section course-reviews">
      <h2>Đánh giá của học viên</h2>

      <div className="reviews-summary">
        <div className="reviews-rating-overview">
          <div className="average-rating">
            <span className="rating-number">
              {averageRating?.toFixed(1) || "0.0"}
            </span>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-solid fa-star ${
                    star <= (averageRating || 0) ? "filled" : ""
                  }`}
                ></i>
              ))}
            </div>
            <p className="rating-text">Xếp hạng khóa học</p>
          </div>

          <div className="rating-distribution">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="distribution-row">
                <div className="distribution-bar-container">
                  <div
                    className="distribution-bar"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="distribution-stars">
                  {[...Array(item.stars)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star filled"></i>
                  ))}
                </div>
                <span className="distribution-percentage">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {sampleReviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <img
                src={`https://ui-avatars.com/api/?name=${review.userName}&size=48&background=random`}
                alt={review.userName}
                className="review-avatar"
              />
              <div className="review-user-info">
                <h4>{review.userName}</h4>
                <div className="review-meta">
                  <div className="review-stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star filled"></i>
                    ))}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-actions">
              <button className="review-helpful">
                <i className="fa-regular fa-thumbs-up"></i>
                <span>Hữu ích ({review.helpful})</span>
              </button>
              <button className="review-report">
                <i className="fa-regular fa-flag"></i>
                <span>Báo cáo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-secondary show-more-reviews">
        Xem thêm đánh giá
      </button>
    </section>
  );
}
