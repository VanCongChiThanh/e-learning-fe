import React from "react";

interface PaymentInfoProps {
  paymentData: any;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ paymentData }) => {
  if (!paymentData) return null;

  const { amount, status, checkoutUrl, order, qrCode } = paymentData;

  const handlePayNow = () => {
    window.location.href = checkoutUrl;
  };

  return (
    <div className="p-4 border rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-semibold mb-3 text-green-700">
        Thông tin thanh toán
      </h3>
      <p>
        <strong>Mã đơn hàng:</strong> {order?.orderNumber}
      </p>
      <p>
        <strong>Số tiền:</strong> {amount?.toLocaleString()} VND
      </p>
      <p>
        <strong>Trạng thái:</strong> {status}
      </p>

      {/* {qrCode && (
        <div className="mt-3">
          <p><strong>Quét QR để thanh toán:</strong></p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
              qrCode
            )}`}
            alt="QR Code thanh toán"
            className="mt-2"
          />
        </div>
      )} */}

      <button
        onClick={handlePayNow}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Thanh toán ngay
      </button>
    </div>
  );
};

export default PaymentInfo;
