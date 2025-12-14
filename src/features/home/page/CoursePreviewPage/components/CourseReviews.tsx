import { useState, useEffect } from "react";
import {
  getReviewsForCourse,
  getReviewStatistics,
  voteForReview,
  Review,
  ReviewStatistics,
  PaginationMeta,
} from "../../../../course/api";

interface CourseReviewsProps {
  courseId: string;
  averageRating: number;
  totalReviews: number;
}

export default function CourseReviews({
  courseId,
  averageRating: initialAverageRating,
  totalReviews: initialTotalReviews,
}: CourseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStatistics | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reviewsData] = await Promise.all([
          getReviewStatistics(courseId),
          getReviewsForCourse(courseId, {
            page: 1,
            paging: 5,
            sort: "created_At",
            order: "desc",
          }),
        ]);
        setStats(statsData);
        setReviews(reviewsData.data);
        setMeta(reviewsData.meta);
      } catch (error) {
        console.error("Failed to fetch review data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const handleLoadMore = async () => {
    if (!meta || page >= meta.total_pages) return;
    const nextPage = page + 1;
    try {
      const response = await getReviewsForCourse(courseId, {
        page: nextPage,
        paging: 5,
        sort: "created_At",
        order: "desc",
      });
      setReviews((prev) => [...prev, ...response.data]);
      setMeta(response.meta);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more reviews:", error);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return Math.floor(seconds) + " giây trước";
  };

  const handleVote = async (reviewId: string) => {
    // Optimistic update: Cập nhật UI ngay lập tức
    setReviews((prev) =>
      prev.map((r) => {
        if (r.reviewId === reviewId) {
          const currentStatus = (r as any).userVoteStatus;
          const isLiked = currentStatus === "LIKE";
          return {
            ...r,
            likeCount: isLiked ? Math.max(0, r.likeCount - 1) : r.likeCount + 1,
            userVoteStatus: isLiked ? null : "LIKE",
          } as any;
        }
        return r;
      })
    );

    try {
      await voteForReview(courseId, reviewId, "LIKE");
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const ratingDistribution = stats
    ? [
        { stars: 5, percentage: stats.star5Percent, count: stats.star5Count },
        { stars: 4, percentage: stats.star4Percent, count: stats.star4Count },
        { stars: 3, percentage: stats.star3Percent, count: stats.star3Count },
        { stars: 2, percentage: stats.star2Percent, count: stats.star2Count },
        { stars: 1, percentage: stats.star1Percent, count: stats.star1Count },
      ]
    : [
        { stars: 5, percentage: 0, count: 0 },
        { stars: 4, percentage: 0, count: 0 },
        { stars: 3, percentage: 0, count: 0 },
        { stars: 2, percentage: 0, count: 0 },
        { stars: 1, percentage: 0, count: 0 },
      ];

  const displayRating = stats ? stats.averageRating : initialAverageRating;

  return (
    <section className="course-section course-reviews">
      <h2>Đánh giá của học viên</h2>

      <div className="reviews-summary">
        <div className="reviews-rating-overview">
          <div className="average-rating">
            <span className="rating-number">
              {displayRating?.toFixed(1) || "0.0"}
            </span>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-solid fa-star ${
                    star <= (displayRating || 0) ? "filled" : ""
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
                  {Math.round(item.percentage)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => {
          const isLiked = (review as any).userVoteStatus === "LIKE";
          return (
            <div key={review.reviewId} className="review-item">
            <div className="review-header">
              <img
                src={
                  review.userAvatar ||
                  `https://ui-avatars.com/api/?name=${review.userName}&size=48&background=random`
                }
                alt={review.userName}
                className="review-avatar"
              />
              <div className="review-user-info">
                <h4>{review.userName}</h4>
                <div className="review-meta">
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa-solid fa-star ${
                          i < review.rating ? "filled" : ""
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="review-date">
                    {formatTimeAgo(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-actions">
              <button 
                className={`review-helpful ${isLiked ? "text-[#106c54]" : ""}`}
                onClick={() => handleVote(review.reviewId)}
              >
                <i className={`${isLiked ? "fa-solid" : "fa-regular"} fa-thumbs-up`}></i>
                <span>Hữu ích ({review.likeCount})</span>
              </button>
              <button className="review-report">
                <i className="fa-regular fa-flag"></i>
                <span>Báo cáo</span>
              </button>
            </div>
          </div>
          );
        })}
        {!loading && reviews.length === 0 && (
          <p className="text-gray-500 text-center py-4">Chưa có đánh giá nào.</p>
        )}
      </div>

      {meta && page < meta.total_pages && (
        <button
          className="btn-secondary show-more-reviews"
          onClick={handleLoadMore}
        >
          Xem thêm đánh giá
        </button>
      )}
    </section>
  );
}
