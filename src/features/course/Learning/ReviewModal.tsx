import React, { useState } from "react";
import { createReview } from "../api";

interface ReviewModalProps {
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const StarRatingInput: React.FC<{
  rating: number;
  setRating: (rating: number) => void;
}> = ({ rating, setRating }) => (
  <div className="flex items-center justify-center mb-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className={`text-4xl transition-colors duration-150 mx-1 ${
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

const ReviewModal: React.FC<ReviewModalProps> = ({ courseId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      await createReview(courseId, {
        comment: comment,
        rating: rating,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo đánh giá:", error);
      alert("Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <i className="fas fa-times text-xl"></i>
      </button>
      
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đánh giá khóa học</h2>
      
      <StarRatingInput rating={rating} setRating={setRating} />
      
      <textarea
        className="w-full border rounded-lg p-4 text-sm focus:ring-2 focus:ring-[#106c54] focus:border-[#106c54] min-h-[120px]"
        placeholder="Bạn cảm thấy khóa học này như thế nào? Hãy chia sẻ cảm nhận của bạn nhé!"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      
      <button
        className="w-full bg-[#106c54] text-white py-3 rounded-lg mt-6 font-semibold hover:bg-[#0d5a45] disabled:bg-gray-300 transition-colors"
        onClick={handleSubmit}
        disabled={!comment.trim() || isSubmitting}
      >
        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </div>
  );
};

export default ReviewModal;