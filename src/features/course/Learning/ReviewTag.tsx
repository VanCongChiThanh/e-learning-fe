import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
  getReviewsForCourse,
  createReview,
  voteForReview,
  replyToReview,
  getReviewDetail,
  Review,
  ReviewDetail,
  PaginationMeta,
} from "../api"; // Import các API mới

// --- Helper Components ---

const StarRatingInput: React.FC<{
  rating: number;
  setRating: (rating: number) => void;
}> = ({ rating, setRating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className={`text-3xl transition-colors duration-150 ${
          star <= rating
            ? "text-yellow-400"
            : "text-gray-300 hover:text-yellow-400"
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

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

// Helper: Avatar Component
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
  onReplySubmit: (parentReviewId: string, comment: string) => void;
  isReply?: boolean;
  repliesData?: {
    firstReplyDetail: ReviewDetail | null;
    total: number;
  };
}> = ({
  review,
  courseId,
  onVote,
  onReplySubmit,
  isReply = false,
  repliesData,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyComment, setReplyComment] = useState("");

  const handleReplyClick = () => {
    onReplySubmit(review.reviewId, replyComment);
    setReplyComment("");
    setShowReplyBox(false);
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

  // @ts-ignore
  const avatarUrl = (review as Review).userAvatar || (review as ReviewDetail).userAvatar;

  return (
    // Container chính, không có border
    <div className="mb-6">
      {/* Div nội dung (để xử lý thụt lề) */}
      <div className={`${isReply ? "pl-14 relative" : ""}`}>
        {/* Đường kẻ dọc cho reply */}
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

        {/* Nội dung comment */}
        <p className="text-gray-700 mb-3">{review.comment}</p>

        {/* Các nút actions */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="text-xs font-medium">Hữu ích?</span>
          <button
            className="flex items-center gap-1.5 hover:text-blue-600"
            onClick={() => onVote(review.reviewId, "LIKE")}
          >
            <i className="far fa-thumbs-up"></i>
            <span>{review.likeCount}</span>
          </button>
          <button
            className="flex items-center gap-1.5 hover:text-red-600"
            onClick={() => onVote(review.reviewId, "DISLIKE")}
          >
            <i className="far fa-thumbs-down"></i>
            <span>{review.dislikeCount}</span>
          </button>
          {!isReply && (
            <button
              className="font-bold text-gray-700 hover:underline ml-2"
              onClick={() => setShowReplyBox(!showReplyBox)}
            >
              Phản hồi
            </button>
          )}
        </div>
      </div>

      {/* Box phản hồi (chỉ hiện ở comment gốc) */}
      {showReplyBox && !isReply && (
        <div className="mt-4 pl-14">
          <textarea
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Viết phản hồi của bạn..."
            value={replyComment}
            onChange={(e) => setReplyComment(e.target.value)}
          />
          <button
            className="bg-gray-800 text-white px-4 py-1.5 rounded-md mt-2 text-sm font-medium hover:bg-gray-700 disabled:bg-gray-300"
            onClick={handleReplyClick}
            disabled={!replyComment.trim()}
          >
            Gửi
          </button>
        </div>
      )}

      {/* Vùng hiển thị Reply (tách biệt) */}
      {repliesData && repliesData.firstReplyDetail && (
        <div className="mt-6"> {/* ĐÂY LÀ PHẦN SỬA LỖI LẤN */}
          <ReviewItem
            review={repliesData.firstReplyDetail}
            courseId={courseId}
            onVote={onVote}
            onReplySubmit={onReplySubmit}
            isReply={true}
          />
        </div>
      )}
      {repliesData && repliesData.total > 1 && (
        <div className="pl-14 mt-2 text-sm font-bold text-blue-600 cursor-pointer hover:underline">
          Xem thêm {repliesData.total - 1} phản hồi khác
        </div>
      )}

      {/* Đường kẻ ngang (chỉ ở comment gốc) */}
      {!isReply && <hr className="mt-6" />}
    </div>
  );
};

// --- Main Component ---
interface ReviewTagProps {
  courseId: string;
}
const ReviewTag: React.FC<ReviewTagProps> = ({ courseId }) =>  {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyDetails, setReplyDetails] = useState<Record<string, ReviewDetail>>({});
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] =useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Cập nhật bộ lọc
  const [ratingFilter, setRatingFilter] = useState<number | null>(null); // null là "Tất cả"
  const [search, setSearch] = useState("");

  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Hàm fetch review
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
            
            // SỬA LỖI: Xóa bỏ `if (!replyDetails[firstReplyId])`
            // để tránh sử dụng state "stale"
            try {
              const detail = await getReviewDetail(courseId, firstReplyId);
              newReplyDetails[firstReplyId] = detail;
            } catch (err) {
              console.error(`Lỗi khi tải reply ${firstReplyId}:`, err);
            }
          }
        }

        setReviews((prev) =>
          pageNum === 1 ? response.data : [...prev, ...response.data]
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
    // SỬA LỖI: Xóa `replyDetails` khỏi danh sách phụ thuộc
    [courseId]
  );

  // Fetch lần đầu và khi filter/search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchReviews(1, search, ratingFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [courseId, search, ratingFilter, fetchReviews]); // fetchReviews đã có useCallback

  const handleLoadMore = () => {
    if (meta && meta.current_page < meta.total_pages) {
      fetchReviews(page + 1, search, ratingFilter);
    }
  };

  // Xử lý tạo review
  const handleCreateReview = async () => {
    if (!newReviewComment.trim() || !userId) return;
    try {
      const newReview = await createReview(courseId, {
        comment: newReviewComment,
        rating: newReviewRating,
      });
      setReviews([newReview, ...reviews]);
      setNewReviewComment("");
      setNewReviewRating(5);
    } catch (error) {
      console.error("Lỗi khi tạo đánh giá:", error);
      alert("Không thể gửi đánh giá.");
    }
  };

  // XỬ LÝ VOTE MỚI (Robust)
  const handleVote = async (reviewId: string, voteType: "LIKE" | "DISLIKE") => {
    try {
      // 1. Gửi request vote
      await voteForReview(courseId, reviewId, voteType);

      // 2. Lấy lại chi tiết review/reply để cập nhật UI
      const updatedItem = await getReviewDetail(courseId, reviewId);

      // 3. Cập nhật state cho reviews (comment gốc)
      setReviews((prev) =>
        prev.map((r) => {
          if (r.reviewId === reviewId) {
            return {
              ...r,
              likeCount: updatedItem.likeCount,
              dislikeCount: updatedItem.dislikeCount,
            };
          }
          return r;
        })
      );

      // 4. Cập nhật state cho replyDetails (nếu vote là 1 reply)
      setReplyDetails((prev) => {
        if (prev[reviewId]) {
          return { ...prev, [reviewId]: updatedItem };
        }
        return prev;
      });
    } catch (error) {
      console.error("Lỗi khi vote:", error);
    }
  };

  // Xử lý reply
  const handleReplySubmit = async (parentReviewId: string, comment: string) => {
    try {
      const newReply = await replyToReview(courseId, parentReviewId, {
        comment,
        rating: 5, // Set cứng
      });

      setReplyDetails((prev) => ({ ...prev, [newReply.reviewId]: newReply }));

      setReviews((prevReviews) =>
        prevReviews.map((r) => {
          if (r.reviewId === parentReviewId) {
            const newReplyMeta = {
              reviewId: newReply.reviewId,
              likeCount: 0,
              dislikeCount: 0,
              parentReviewId: parentReviewId,
            };
            return {
              ...r,
              replies: [newReplyMeta, ...(r.replies || [])],
            };
          }
          return r;
        })
      );
    } catch (error) {
      console.error("Lỗi khi reply:", error);
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

      {/* Form tạo đánh giá */}
      {userId && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border">
          <h3 className="font-bold text-lg mb-2">Để lại đánh giá của bạn</h3>
          <StarRatingInput
            rating={newReviewRating}
            setRating={setNewReviewRating}
          />
          <textarea
            className="w-full border rounded-md p-3 mt-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Bạn nghĩ gì về khóa học này?"
            value={newReviewComment}
            onChange={(e) => setNewReviewComment(e.target.value)}
          />
          <button
            className="bg-gray-800 text-white px-6 py-2 rounded-md mt-3 font-medium hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
            onClick={handleCreateReview}
            disabled={!newReviewComment.trim()}
          >
            Gửi đánh giá
          </button>
        </div>
      )}

      {/* Thanh Filter và Search */}
      <h3 className="text-xl font-bold mb-4 text-gray-900">Tất cả đánh giá</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            className="border rounded-md px-4 py-2 w-full pl-10"
            placeholder="Tìm kiếm đánh giá..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        
        {/* BỘ LỌC MỚI */}
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

      {/* Danh sách review */}
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
            onReplySubmit={handleReplySubmit}
            repliesData={{
              firstReplyDetail:
                r.replies?.length > 0
                  ? replyDetails[r.replies?.[0].reviewId]
                  : null,
              total: r.replies?.length || 0,
            }}
          />
        ))}
      </div>

      {/* Nút xem thêm */}
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