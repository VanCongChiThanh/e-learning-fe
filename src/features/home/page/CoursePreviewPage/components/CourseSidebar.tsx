import { useState } from "react";
import { CourseResponse, SectionResponse } from "../types";
import { toast } from "react-toastify";
import { orderDirectly, paymentOrder } from "../../../api";
import PaymentInfo from "../../CartPage/PaymentInfo";
import FreeEnrollDialog from "../../../components/FreeEnrollDialog";
import { useCourseEnrollment } from "../../../hooks/useCourseEnrollment";

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

  const [isProcessingBuyNow, setIsProcessingBuyNow] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showBuyNowFlow, setShowBuyNowFlow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    isProcessing: isProcessingCart,
    showFreeEnrollDialog,
    isProcessingEnroll,
    currentCourse,
    handleEnrollClick,
    handleConfirmFreeEnroll,
    handleCancelFreeEnroll,
  } = useCourseEnrollment();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await handleEnrollClick({
      courseId: course.courseId,
      title: course.title,
      price: course.price || 0,
    });
  };

  const handleShowBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBuyNowFlow(true);
  };

  const handleShowConfirmation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const handleCancelBuyNow = () => {
    setShowBuyNowFlow(false);
    setShowConfirmation(false);
    setNotes("");
  };

  const handleConfirmPurchase = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessingBuyNow) return;

    try {
      setIsProcessingBuyNow(true);
      const response = await orderDirectly({
        items: [
          {
            courseId: course.courseId,
            coursePrice: course.price || 0,
          },
        ],
        notes: notes,
      });

      if (response.status == "success") {
        try {
          const res = await paymentOrder(response.data.id);
          if (res.status === "success") {
            setPaymentData(res.data);
            toast.success("Đặt hàng thành công! Vui lòng thanh toán.");
            setShowBuyNowFlow(false);
            setShowConfirmation(false);
          } else {
            toast.error("Không tạo được thanh toán!");
          }
        } catch (err) {
          console.error("Payment error:", err);
          toast.error("Lỗi khi tạo thanh toán!");
        }
      } else {
        toast.error(response.message || "Đặt hàng thất bại!");
      }
    } catch (error) {
      console.error("Error ordering directly:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setIsProcessingBuyNow(false);
    }
  };

  return (
    <div className="course-sidebar">
      <div className="course-card-image">
        <img src={course.image} alt={course.title} />
        <div className="preview-overlay">
          <button className="preview-btn">
            <i className="fa-solid fa-play"></i>
            <span>Xem trước</span>
          </button>
        </div>
      </div>

      <div className="course-card-body">
        <div className="course-price">{formatPrice(course.price)}</div>

        <div className="cta-container">
          {paymentData ? (
            <PaymentInfo paymentData={paymentData} />
          ) : showBuyNowFlow ? (
            <div className="buy-now-flow">
              {!showConfirmation ? (
                <>
                  <div className="form-group" style={{ marginBottom: "10px" }}>
                    <label
                      htmlFor="notes"
                      style={{ display: "block", marginBottom: "5px" }}
                    >
                      Ghi chú (tùy chọn):
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bạn có lưu ý gì cho đơn hàng?"
                      rows={2}
                      style={{ width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                  <button
                    className="mt-4 bg-green-600 w-full text-white px-4 py-2 rounded-md hover:bg-green-700"
                    onClick={handleShowConfirmation}
                  >
                    Thanh toán
                  </button>
                  <button
                    className=" text-green-600 px-4 py-1 rounded-md border-2 w-full hover:bg-green-200"
                    onClick={handleCancelBuyNow}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <div className="confirmation-step">
                  <p style={{ textAlign: "center", fontWeight: "bold" }}>
                    Bạn chắc chắn muốn mua?
                  </p>
                  <button
                    className="mt-4 bg-green-600 w-full text-white px-4 py-2 rounded-md hover:bg-green-700"
                    onClick={handleConfirmPurchase}
                    disabled={isProcessingBuyNow}
                  >
                    {isProcessingBuyNow ? "Đang xử lý..." : "Mua ngay"}
                  </button>
                  <button
                    className=" text-green-600 mt-2 px-4 py-1 rounded-md border-2 w-full hover:bg-green-200"
                    onClick={() => setShowConfirmation(false)}
                    disabled={isProcessingBuyNow}
                  >
                    Quay lại
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={handleClick}
                disabled={isProcessingCart || isProcessingEnroll}
              >
                {isProcessingCart ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-graduation-cap mr-2"></i>
                    Đăng ký / Thêm vào giỏ
                  </>
                )}
              </button>
              <button className="btn-secondary" onClick={handleShowBuyNow}>
                Mua ngay
              </button>
            </div>
          )}
        </div>

        <div className="money-back-guarantee">
          <p>Đảm bảo hoàn tiền trong 30 ngày</p>
        </div>

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

      <FreeEnrollDialog
        isOpen={showFreeEnrollDialog}
        courseName={currentCourse?.title || course.title}
        isProcessing={isProcessingEnroll}
        onConfirm={handleConfirmFreeEnroll}
        onCancel={handleCancelFreeEnroll}
      />
    </div>
  );
}
