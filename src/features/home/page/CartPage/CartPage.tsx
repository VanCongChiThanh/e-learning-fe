import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layouts/MainLayout";
import { fetchCart, createOrder, paymentOrder } from "../../api";
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

interface CartData {
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
  const navigator = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
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
        notes: notes || "Đặt hàng từ giỏ hàng"
      };

      const response = await createOrder(orderData);
      
      if (response.status === "success") {
        // toast.success("Đặt hàng thành công!");
        // Reload cart để cập nhật trạng thái
        const cartResponse = await fetchCart();
        // if (cartResponse.status === "success") {
        //   setCartData(cartResponse.data);
        //   console.log("Cart after order:", response.data);
        //   const res = await paymentOrder(response.data.id);
        //   navigator(res.data.checkoutUrl);
        //   toast.success("Đặt hàng thành công!");
        //   console.log("Payment response:", res);
        // }
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
        if (window.confirm("Bạn cần đăng nhập để thanh toán. Chuyển đến trang đăng nhập?")) {
          window.location.href = '/login';
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

  const totalCalculatedPrice = cartData ? calculateTotalPrice(cartData.items) : 0;
  const totalCalculatedItems = cartData ? calculateTotalItems(cartData.items) : 0;

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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-600">Thêm khóa học vào giỏ hàng để bắt đầu mua sắm.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {cartData.items.map((item) => (
                <div key={item.courseId} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">Khóa học</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.totalPrice )}
                    </p>
                    {/* {item.addedPrice !== item.totalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(item.totalPrice)}
                      </p>
                    )} */}
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
              <div className="text-sm text-gray-600 mb-6">
                {cartData.totalItems || totalCalculatedItems} khóa học trong giỏ hàng
              </div>

              {/* Notes Section */}
              <div className="mb-6">
                <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 mb-2">
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

              {/* Debug info - uncomment when needed */}
              {/* <div className="text-xs text-gray-500 mb-4 p-3 bg-gray-50 rounded">
                <div>API Price: {cartData.price ? formatPrice(cartData.price) : 'N/A'}</div>
                <div>Calculated Price: {formatPrice(totalCalculatedPrice)}</div>
                <div>API Items: {cartData.totalItems || 'N/A'}</div>
                <div>Calculated Items: {totalCalculatedItems}</div>
              </div> */}
              
              <button 
                onClick={handleCheckout}
                disabled={isProcessingOrder}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  isProcessingOrder 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isProcessingOrder ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Thanh toán'
                )}
              </button>
            </div>
          </div>
        )}
        {paymentData && <PaymentInfo paymentData={paymentData} />}
      </div>
    </MainLayout>
  );
};

export default CartPage;
