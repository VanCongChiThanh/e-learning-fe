import { useSearchParams } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';

function PaymentResult() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status"); // VD: PAID
  const orderCode = searchParams.get("orderCode");
  const cancel = searchParams.get("cancel");

  return (
    <div>
      {status === "PAID" ? (
        <HomePage/>
      ) : (
        <h2>❌ Thanh toán thất bại hoặc đã hủy!</h2>
      )}
    </div>
  );
}

export default PaymentResult;
