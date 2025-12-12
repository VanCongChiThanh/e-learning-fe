import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layouts/MainLayout";
import {
  fetchCart,
  createOrder,
  paymentOrder,
  removeFromCart,
  clearCart,
} from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PaymentInfo from "./PaymentInfo";
interface CartItem {
  courseId: string;
  title: string;
  totalPrice: number;
  addedPrice: number;
  image?: string;
  slug: string;
}

export interface CartData {
  items: CartItem[];
  price: number;
  totalItems: number;
}

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);

  // States cho xóa khóa học
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [courseToRemove, setCourseToRemove] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // States cho xóa toàn bộ giỏ hàng
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const response = await fetchCart();
        if (response.status === "success") {
          setCartData(response.data);
        } else {
          setError("Không thể tải giỏ hàng");
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Có lỗi xảy ra khi tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm xử lý thanh toán
  const handleCheckout = async () => {
    if (!cartData || cartData.items.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    try {
      setIsProcessingOrder(true);

      const orderData = {
        clearCartAfterOrder: true as const,
        notes: notes || "Đặt hàng từ giỏ hàng",
      };

      const response = await createOrder(orderData);

      if (response.status === "success") {
        const cartResponse = await fetchCart();
        if (cartResponse.status === "success") {
          setCartData(cartResponse.data);
          console.log("Cart after order:", response.data);

          try {
            const res = await paymentOrder(response.data.id);
            if (res.status === "success") {
              setPaymentData(res.data); // ✅ lưu thông tin thanh toán để hiển thị
              toast.success("Đặt hàng thành công! Vui lòng thanh toán.");
            } else {
              toast.error("Không tạo được thanh toán!");
            }
          } catch (err) {
            console.error("Payment error:", err);
            toast.error("Lỗi khi tạo thanh toán!");
          }
        }
        // Reset notes
        setNotes("");
      } else {
        toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      }
    } catch (error: any) {
      console.error("Error creating order:", error);

      // Xử lý lỗi authentication
      if (error.response?.status === 401 || error.response?.status === 403) {
        if (
          window.confirm(
            "Bạn cần đăng nhập để thanh toán. Chuyển đến trang đăng nhập?"
          )
        ) {
          window.location.href = "/login";
        }
      } else {
        toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      }
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      return total + (item.addedPrice || item.totalPrice || 0);
    }, 0);
  };

  const calculateTotalItems = (items: CartItem[]): number => {
    return items.length;
  };

  // Xử lý xóa khóa học khỏi giỏ hàng
  const handleRemoveFromCart = (courseId: string) => {
    setCourseToRemove(courseId);
    setShowRemoveDialog(true);
  };

  const confirmRemoveFromCart = async () => {
    if (!courseToRemove) return;

    try {
      setIsRemoving(true);
      const response = await removeFromCart(courseToRemove);

      if (response.status === "success") {
        // Cập nhật giỏ hàng real-time
        if (cartData) {
          const updatedItems = cartData.items.filter(
            (item) => item.courseId !== courseToRemove
          );
          const newCartData = {
            ...cartData,
            items: updatedItems,
            totalItems: updatedItems.length,
            price: calculateTotalPrice(updatedItems),
          };
          setCartData(newCartData);
        }

        toast.success("Xóa khóa học thành công!");
      } else {
        toast.error(
          response.message || "Không thể xóa khóa học. Vui lòng thử lại!"
        );
      }
    } catch (error: any) {
      console.error("Error removing from cart:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Phên làm việc hết hạn. Vui lòng đăng nhập lại!");
      } else {
        toast.error("Có lỗi xảy ra khi xóa khóa học. Vui lòng thử lại!");
      }
    } finally {
      setIsRemoving(false);
      setShowRemoveDialog(false);
      setCourseToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowRemoveDialog(false);
    setCourseToRemove(null);
  };

  // Xử lý xóa toàn bộ giỏ hàng
  const handleClearCart = () => {
    setShowClearDialog(true);
  };

  const confirmClearCart = async () => {
    try {
      setIsClearing(true);
      const response = await clearCart();

      if (response.status === "success") {
        // Cập nhật giỏ hàng thành rỗng
        setCartData({
          items: [],
          price: 0,
          totalItems: 0,
        });

        toast.success("Đã xóa toàn bộ giỏ hàng!");
      } else {
        toast.error(
          response.message || "Không thể xóa giỏ hàng. Vui lòng thử lại!"
        );
      }
    } catch (error: any) {
      console.error("Error clearing cart:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Phên làm việc hết hạn. Vui lòng đăng nhập lại!");
      } else {
        toast.error("Có lỗi xảy ra khi xóa giỏ hàng. Vui lòng thử lại!");
      }
    } finally {
      setIsClearing(false);
      setShowClearDialog(false);
    }
  };

  const cancelClear = () => {
    setShowClearDialog(false);
  };

  const totalCalculatedPrice = cartData
    ? calculateTotalPrice(cartData.items)
    : 0;
  const totalCalculatedItems = cartData
    ? calculateTotalItems(cartData.items)
    : 0;

  if (loading) {
    return (
      <MainLayout>
        <div className="cart-page max-w-4xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="spinner border-4 border-gray-200 border-t-green-600 rounded-full w-8 h-8 animate-spin"></div>
            <span className="ml-2">Đang tải giỏ hàng...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="cart-page max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Lỗi</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="cart-page max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

        {!cartData || cartData.items.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Giỏ hàng trống
            </h3>
            <p className="text-gray-600">
              Thêm khóa học vào giỏ hàng để bắt đầu mua sắm.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Clear Cart Button */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {cartData.totalItems || totalCalculatedItems} khóa học trong giỏ
                hàng
              </div>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
                disabled={isClearing}
              >
                {isClearing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600 inline"
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
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash-can mr-2"></i>
                    Xóa toàn bộ giỏ hàng
                  </>
                )}
              </button>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {cartData.items.map((item) => (
                <div
                  key={item.courseId}
                  className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">Khóa học</p>
                  </div>

                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </p>
                      {/* {item.addedPrice !== item.totalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(item.totalPrice)}
                        </p>
                      )} */}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromCart(item.courseId)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Xóa khóa học khỏi giỏ hàng"
                      disabled={isRemoving && courseToRemove === item.courseId}
                    >
                      {isRemoving && courseToRemove === item.courseId ? (
                        <svg
                          className="animate-spin h-5 w-5"
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
                      ) : (
                        <i className="fa-solid fa-trash-can text-lg"></i>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Tổng cộng:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(cartData.price || totalCalculatedPrice)}
                </span>
              </div>

              {/* Notes Section */}
              <div className="mb-6">
                <label
                  htmlFor="order-notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ghi chú đơn hàng (tùy chọn)
                </label>
                <textarea
                  id="order-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú cho đơn hàng..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={3}
                  disabled={isProcessingOrder}
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessingOrder}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  isProcessingOrder
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isProcessingOrder ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  "Thanh toán"
                )}
              </button>
            </div>
          </div>
        )}
        {paymentData && <PaymentInfo paymentData={paymentData} />}

        {/* Remove Course Confirmation Dialog */}
        {showRemoveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-200">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <i className="fa-solid fa-exclamation-triangle text-red-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Xác nhận xóa khóa học
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Bạn có chắc muốn xóa khóa học này khỏi giỏ hàng?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={cancelRemove}
                  disabled={isRemoving}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmRemoveFromCart}
                  disabled={isRemoving}
                  className="flex-1 px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isRemoving ? (
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
                      Đang xóa...
                    </span>
                  ) : (
                    "Xóa"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear Cart Confirmation Dialog */}
        {showClearDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-200">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <i className="fa-solid fa-trash-can text-red-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Xác nhận xóa toàn bộ giỏ hàng
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Bạn có muốn xóa tất cả khóa học trong giỏ hàng không?
                  <span className="font-medium text-red-600">
                    Hành động này không thể hoàn tác!
                  </span>
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={cancelClear}
                  disabled={isClearing}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmClearCart}
                  disabled={isClearing}
                  className="flex-1 px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isClearing ? (
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
                      Đang xóa...
                    </span>
                  ) : (
                    "Xóa toàn bộ"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
