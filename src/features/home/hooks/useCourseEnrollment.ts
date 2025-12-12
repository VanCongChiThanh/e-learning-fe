import { useState } from "react";
import { toast } from "react-toastify";
import { handleCourseEnrollment } from "../api";

interface Course {
  courseId: string;
  title: string;
  price: number;
}

export const useCourseEnrollment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFreeEnrollDialog, setShowFreeEnrollDialog] = useState(false);
  const [isProcessingEnroll, setIsProcessingEnroll] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // Xử lý click nút thêm vào giỏ hàng/đăng ký khóa học
  const handleEnrollClick = async (course: Course) => {
    if (isProcessing) return;

    // Hiển thị popup ngay lập tức
    setCurrentCourse(course);
    setShowFreeEnrollDialog(true);
    setIsProcessing(true);

    // Logic xử lý sẽ được thực hiện khi user click "Đồng ý" trong popup
  };

  // Xử lý xác nhận đăng ký khóa học
  const handleConfirmFreeEnroll = async () => {
    if (!currentCourse || isProcessingEnroll) return;

    try {
      setIsProcessingEnroll(true);

      // Sử dụng handleCourseEnrollment để xử lý logic
      const result = await handleCourseEnrollment(
        currentCourse.courseId,
        currentCourse.price
      );

      // Đóng dialog trước
      setShowFreeEnrollDialog(false);

      if (result.success) {
        if (result.type === "free") {
          toast.success(
            `Đăng ký khóa học "${currentCourse.title}" thành công! Bạn có thể bắt đầu học ngay bây giờ.`,
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );

          window.dispatchEvent(
            new CustomEvent("courseEnrolled", {
              detail: {
                courseId: currentCourse.courseId,
                courseName: currentCourse.title,
                response: result.data,
              },
            })
          );
        } else if (result.type === "cart") {
          toast.success(`Đã thêm "${currentCourse.title}" vào giỏ hàng!`);
        }
      } else {
        // Xử lý lỗi
        const errorMessage =
          result.message || "Có lỗi xảy ra khi xử lý khóa học";
        toast.error(`${errorMessage}. Vui lòng thử lại!`);
        console.error("Course enrollment error:", result.error);
      }

      // Reset state
      setCurrentCourse(null);
    } catch (error: any) {
      console.error("Error in handleConfirmFreeEnroll:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Có lỗi xảy ra khi xử lý khóa học";

      toast.error(`${errorMessage}. Vui lòng thử lại!`);
    } finally {
      setIsProcessingEnroll(false);
      setIsProcessing(false);
    }
  };

  // Xử lý hủy đăng ký khóa học miễn phí
  const handleCancelFreeEnroll = () => {
    setShowFreeEnrollDialog(false);
    setCurrentCourse(null);
    setIsProcessing(false);
  };

  return {
    isProcessing,
    showFreeEnrollDialog,
    isProcessingEnroll,
    currentCourse,
    handleEnrollClick,
    handleConfirmFreeEnroll,
    handleCancelFreeEnroll,
  };
};
