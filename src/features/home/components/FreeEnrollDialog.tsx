import React, { useEffect, useState } from "react";

interface FreeEnrollDialogProps {
  isOpen: boolean;
  courseName: string;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const FreeEnrollDialog: React.FC<FreeEnrollDialogProps> = ({
  isOpen,
  courseName,
  isProcessing,
  onConfirm,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Tắt scroll của body khi mở popup
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight =
        "var(--removed-body-scroll-bar-size, 0px)";

      setShouldRender(true);
      // Delay để tạo hiệu ứng fade-in mượt
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // Bật lại scroll của body khi đóng popup
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      setIsVisible(false);
      // Delay để tạo hiệu ứng fade-out trước khi unmount
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }

    // Cleanup function khi component unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Chỉ đóng khi click vào backdrop, không phải modal content
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      data-free-enroll-backdrop
      data-free-enroll-visible={isVisible}
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center p-4
        transition-all duration-200 ease-out
        ${
          isVisible
            ? "bg-black bg-opacity-60 backdrop-blur-sm"
            : "bg-black bg-opacity-0"
        }
      `}
      onClick={handleBackdropClick}
      style={{
        zIndex: 9999,
        backdropFilter: isVisible ? "blur(3px)" : "blur(0px)",
        WebkitBackdropFilter: isVisible ? "blur(3px)" : "blur(0px)",
      }}
    >
      <div
        data-free-enroll-content
        className={`
          bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto
          transform transition-all duration-200 ease-out
          ${
            isVisible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }
        `}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header với icon và tiêu đề */}
        <div className="px-6 pt-6 pb-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-4 shadow-sm">
              <i className="fa-solid fa-gift text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Xác nhận đăng ký khóa học
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bạn có muốn đăng ký khóa học{" "}
              <span className="font-medium text-gray-800">"{courseName}"</span>{" "}
              không?
              <br />
              <span className="text-xs text-green-600 mt-1 inline-block">
                💡 Nếu khóa học miễn phí, bạn sẽ được đăng ký ngay. Nếu không,
                sẽ được thêm vào giỏ hàng.
              </span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="
                flex-1 px-4 py-3 
                border border-gray-300 rounded-lg 
                text-sm font-medium text-gray-700 
                bg-white hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-150
              "
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className="
                flex-1 px-4 py-3 
                bg-gradient-to-r from-green-600 to-green-700 
                border border-transparent rounded-lg 
                text-sm font-medium text-white 
                hover:from-green-700 hover:to-green-800 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150 shadow-sm hover:shadow-md
              "
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                </span>
              ) : (
                "Xác nhận đăng ký"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeEnrollDialog;

// CSS cho các trường hợp cần thiết (nếu Tailwind chưa load đầy đủ)
const inlineStyles = `
  /* Đảm bảo popup luôn hiển thị đúng */
  [data-free-enroll-backdrop] {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 9999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 1rem !important;
  }
  
  [data-free-enroll-content] {
    position: relative !important;
    background: white !important;
    border-radius: 0.75rem !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    max-width: 28rem !important;
    width: 100% !important;
    margin: 0 auto !important;
    max-height: 90vh !important;
    overflow-y: auto !important;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
  }
  
  [data-free-enroll-visible="true"] [data-free-enroll-content] {
    animation: fadeIn 0.2s ease-out forwards;
  }
  
  [data-free-enroll-visible="false"] [data-free-enroll-content] {
    animation: fadeOut 0.2s ease-out forwards;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 640px) {
    [data-free-enroll-backdrop] {
      padding: 0.75rem !important;
    }
    
    [data-free-enroll-content] {
      max-height: 95vh !important;
    }
  }
  
  /* Scrollbar styling for content */
  [data-free-enroll-content]::-webkit-scrollbar {
    width: 6px;
  }
  
  [data-free-enroll-content]::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  [data-free-enroll-content]::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  [data-free-enroll-content]::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

// Inject CSS một lần duy nhất
if (typeof document !== "undefined") {
  if (!document.head.querySelector("[data-free-enroll-dialog-styles]")) {
    const styleElement = document.createElement("style");
    styleElement.textContent = inlineStyles;
    styleElement.setAttribute("data-free-enroll-dialog-styles", "true");
    document.head.appendChild(styleElement);
  }
}
