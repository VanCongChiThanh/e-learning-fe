import { confirmEmailAPI } from "../api/authAPI";
import { toast } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await confirmEmailAPI(token);
        setStatus("success");
        toast.success("Xác nhận email thành công! Bạn có thể đăng nhập.");
      } catch (err) {
        console.error("Email confirmation failed", err);
        setStatus("error");
        toast.error("Xác nhận email thất bại. Vui lòng thử lại.");
      }
    };
    confirmEmail();
  }, [token]);

  return (
    <div className="confirmation-page text-center">
      {status === "loading" && (
        <i className="fas fa-spinner fa-spin text-blue-500 text-4xl"></i>
      )}
      {status === "success" && (
        <div className="success-message flex flex-col items-center">
          <i className="fas fa-check-circle text-green-500 text-4xl mb-2"></i>
          <p>Xác nhận email thành công! Bạn có thể đăng nhập.</p>
          <Link to="/login">
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded">
              Đăng nhập
            </button>
          </Link>
        </div>
      )}
      {status === "error" && (
        <div className="error-message flex flex-col items-center">
          <i className="fas fa-times-circle text-red-500 text-4xl mb-2"></i>
          <p>Xác nhận email thất bại. Vui lòng thử lại.</p>
        </div>
      )}
    </div>
  );
};
export default ConfirmationPage;
