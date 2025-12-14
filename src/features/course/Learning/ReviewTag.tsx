import React, { useState, useEffect, useCallback } from "react";
import {
  getReviewsForCourse,
  voteForReview,
  getReviewDetail,
  getReviewStatistics,
  ReviewStatistics,
  Review,
  ReviewDetail,
  PaginationMeta,
  ReviewReplyMeta, // Đảm bảo đã import
} from "../api"; 

// --- Helper Components (Không thay đổi) ---

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ))}
  </div>
);

const Avatar: React.FC<{ name: string; avatarUrl?: string | null }> = ({
  name,
  avatarUrl,
}) => {
  const avatarInitial = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-10 h-10 rounded-full bg-gray-200 object-cover"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm">
      {avatarInitial}
    </div>
  );
};

// Helper: Component render 1 review (hoặc 1 reply)
const ReviewItem: React.FC<{
  review: Review | ReviewDetail;
  courseId: string;
  onVote: (reviewId: string, voteType: "LIKE" | "DISLIKE") => void;
  isReply?: boolean;
  isOptimistic?: boolean;
}> = ({
  review,
  onVote,
  isReply = false,
  isOptimistic = false,
}) => {
  const formatTimeAgo = (timestamp: number) => {
    if (isOptimistic) return "vài giây trước";

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

  // @ts-ignore
  const avatarUrl = (review as Review).userAvatar || (review as ReviewDetail).userAvatar;
  
  // SỬA: Logic hiển thị màu cho nút vote
  // Giả định review object đã có 'userVoteStatus'
  const isLiked = (review as any).userVoteStatus === 'LIKE';
  const isDisliked = (review as any).userVoteStatus === 'DISLIKE';

  return (
    <div className={`mb-6 ${isOptimistic ? "opacity-60" : ""}`}>
      <div className={`${isReply ? "pl-14 relative" : ""}`}>
        {isReply && (
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>
        )}

        <div className="flex items-center gap-3 mb-2">
          <Avatar name={review.userName} avatarUrl={avatarUrl} />
          <div>
            <div className="font-bold text-gray-900">{review.userName}</div>
            <div className="flex items-center gap-2">
              {!isReply && (
                <StarRatingDisplay rating={(review as Review).rating} />
              )}
              <span className="ml-1 text-gray-500 text-sm">
                {formatTimeAgo(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-3">{review.comment}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="text-xs font-medium">Hữu ích?</span>
          <button
            // SỬA: Cập nhật class dựa trên trạng thái like
            className={`flex items-center gap-1.5 hover:text-blue-600 ${isLiked ? 'text-blue-600' : ''}`}
            onClick={() => onVote(review.reviewId, "LIKE")}
            disabled={isOptimistic} 
          >
            <i className="far fa-thumbs-up"></i>
            <span>{review.likeCount}</span>
          </button>
          <button
            // SỬA: Cập nhật class dựa trên trạng thái dislike
            className={`flex items-center gap-1.5 hover:text-red-600 ${isDisliked ? 'text-red-600' : ''}`}
            onClick={() => onVote(review.reviewId, "DISLIKE")}
            disabled={isOptimistic} 
          >
            <i className="far fa-thumbs-down"></i>
            <span>{review.dislikeCount}</span>
          </button>
        </div>
      </div>

      {!isReply && <hr className="mt-6" />}
    </div>
  );
};

// --- Main Component ---
interface ReviewTagProps {
  courseId: string;
  refreshTrigger?: number;
}
const ReviewTag: React.FC<ReviewTagProps> = ({ courseId, refreshTrigger = 0 }) =>  {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyDetails, setReplyDetails] = useState<Record<string, ReviewDetail>>({});
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] =useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);

  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchStatistics = useCallback(async () => {
    if (!courseId) return;
    try {
      const stats = await getReviewStatistics(courseId);
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to fetch review statistics", error);
    }
  }, [courseId]);

  const fetchReviews = useCallback(
    async (pageNum: number, searchStr: string, rating: number | null) => {
      if (!courseId) return;
      setIsLoading(true);
      try {
        const response = await getReviewsForCourse(courseId, {
          page: pageNum,
          search: searchStr || undefined,
          rating: rating === null ? undefined : rating,
        });

        const newReplyDetails: Record<string, ReviewDetail> = {};
        for (const review of response.data) {
          if (review.replies && review.replies.length > 0) {
            const firstReplyId = review.replies[0].reviewId;
            
            if (firstReplyId.startsWith('optimistic-')) continue;

            try {
              const detail = await getReviewDetail(courseId, firstReplyId);
              newReplyDetails[firstReplyId] = detail;
            } catch (err) {
              console.error(`Lỗi khi tải reply ${firstReplyId}:`, err);
            }
          }
        }

        setReviews((prev) =>
          pageNum === 1
            ? response.data
            : [
                ...prev.filter((r) => !(r as any).isOptimistic),
                ...response.data,
              ]
        );
        setMeta(response.meta);
        setPage(response.meta.current_page);
        setReplyDetails((prev) => ({ ...prev, ...newReplyDetails }));
      } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [courseId]
  );

  useEffect(() => {
    fetchStatistics();
    const handler = setTimeout(() => {
      fetchReviews(1, search, ratingFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [courseId, search, ratingFilter, fetchReviews, refreshTrigger, fetchStatistics]); 

  const handleLoadMore = () => {
    if (meta && meta.current_page < meta.total_pages) {
      fetchReviews(page + 1, search, ratingFilter);
    }
  };

  // ### SỬA TOÀN BỘ LOGIC `handleVote` ###
  const handleVote = async (reviewId: string, newVoteType: "LIKE" | "DISLIKE") => {
    // 1. Lưu state cũ
    const originalReviews = reviews;
    const originalReplyDetails = replyDetails;

    // 2. Hàm logic lạc quan
    const updateLogic = <T extends Review | ReviewDetail>(item: T): T => {
      // Giả định item có 'userVoteStatus'
      const currentVote = (item as any).userVoteStatus; 

      let newLikeCount = item.likeCount;
      let newDislikeCount = item.dislikeCount;
      let newVoteStatus: 'LIKE' | 'DISLIKE' | null = null;

      if (newVoteType === 'LIKE') {
        if (currentVote === 'LIKE') {
          // Case 1: Đã Like, bấm Like -> Bỏ Like
          newLikeCount--;
          newVoteStatus = null;
        } else if (currentVote === 'DISLIKE') {
          // Case 2: Đã Dislike, bấm Like -> Bỏ Dislike, Thêm Like
          newLikeCount++;
          newDislikeCount--;
          newVoteStatus = 'LIKE';
        } else {
          // Case 3: Chưa vote, bấm Like -> Thêm Like
          newLikeCount++;
          newVoteStatus = 'LIKE';
        }
      } else { // newVoteType === 'DISLIKE'
        if (currentVote === 'DISLIKE') {
          // Case 4: Đã Dislike, bấm Dislike -> Bỏ Dislike
          newDislikeCount--;
          newVoteStatus = null;
        } else if (currentVote === 'LIKE') {
          // Case 5: Đã Like, bấm Dislike -> Bỏ Like, Thêm Dislike
          newDislikeCount++;
          newLikeCount--;
          newVoteStatus = 'DISLIKE';
        } else {
          // Case 6: Chưa vote, bấm Dislike -> Thêm Dislike
          newDislikeCount++;
          newVoteStatus = 'DISLIKE';
        }
      }

      return {
        ...item,
        likeCount: newLikeCount,
        dislikeCount: newDislikeCount,
        userVoteStatus: newVoteStatus, // Cập nhật trạng thái vote
      };
    };

    // 3. Cập nhật UI ngay
    setReviews((prev) =>
      prev.map((r) => (r.reviewId === reviewId ? updateLogic(r) : r))
    );
    setReplyDetails((prev) => {
      if (prev[reviewId]) {
        return { ...prev, [reviewId]: updateLogic(prev[reviewId]) };
      }
      return prev;
    });

    // 4. Gọi API
    try {
      // Gửi request lên server
      await voteForReview(courseId, reviewId, newVoteType);
      
      // 5. Thành công: Lấy lại data "thật" để đồng bộ (phòng trường hợp có lỗi)
      const updatedItem = await getReviewDetail(courseId, reviewId);
      
      setReviews((prev) =>
        prev.map((r) =>
          r.reviewId === reviewId
            ? { 
                ...r, 
                likeCount: updatedItem.likeCount, 
                dislikeCount: updatedItem.dislikeCount,
                userVoteStatus: updatedItem.userVoteStatus // Đồng bộ trạng thái vote
              }
            : r
        )
      );
      setReplyDetails((prev) => {
        if (prev[reviewId]) {
          return { ...prev, [reviewId]: updatedItem };
        }
        return prev;
      });

    } catch (error) {
      console.error("Lỗi khi vote:", error);
      alert("Vote không thành công. Đang hoàn tác.");
      // 6. Thất bại: Rollback
      setReviews(originalReviews);
      setReplyDetails(originalReplyDetails);
    }
  };

  const filterOptions = [
    { label: "Tất cả", value: null },
    { label: "5 sao", value: 5 },
    { label: "4 sao", value: 4 },
    { label: "3 sao", value: 3 },
    { label: "2 sao", value: 2 },
    { label: "1 sao", value: 1 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Phản hồi của học viên
      </h2>

      {/* Review Summary Section */}
      {statistics && (
        <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center min-w-[150px]">
              <span className="text-5xl font-bold text-gray-800">
                {statistics.averageRating.toFixed(1)}
              </span>
              <div className="flex my-2 text-yellow-400 text-lg">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className={`fa-solid fa-star ${
                      i < Math.round(statistics.averageRating) ? "" : "text-gray-300"
                    }`}
                  ></i>
                ))}
              </div>
              <p className="text-gray-500 font-medium">Xếp hạng khóa học</p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const percent = statistics[`star${star}Percent` as keyof ReviewStatistics] || 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="flex text-yellow-400 text-xs gap-0.5 min-w-[60px]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star ${
                            i < star ? "filled" : "text-gray-300"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">
                      {Math.round(percent)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold mb-4 text-gray-900">Tất cả đánh giá</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center border border-gray-300 rounded-full bg-white px-1 py-1 shadow-sm focus-within:ring-2 focus-within:ring-[#106c54] focus-within:border-transparent transition-all">
          <input
            type="text"
            className="flex-1 px-4 py-1.5 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            placeholder="Tìm kiếm đánh giá..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button className="w-9 h-9 rounded-full bg-[#106c54] text-white flex items-center justify-center hover:bg-[#0d5a45] transition-colors flex-shrink-0">
            <i className="fas fa-search text-sm"></i>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                setRatingFilter(opt.value);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                ratingFilter === opt.value
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
        {isLoading && page === 1 && (
          <div className="text-center p-10">Đang tải đánh giá...</div>
        )}
        {!isLoading && reviews.length === 0 && (
          <div className="text-center p-10 text-gray-500">
            Chưa có đánh giá nào.
          </div>
        )}

        {reviews.map((r) => (
          <ReviewItem
            key={r.reviewId} 
            review={r}
            courseId={courseId}
            onVote={handleVote}
            isOptimistic={!!(r as any).isOptimistic}
          />
        ))}
      </div>

      {meta && meta.current_page < meta.total_pages && (
        <div className="text-center mt-8">
          <button
            className="bg-gray-800 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewTag;