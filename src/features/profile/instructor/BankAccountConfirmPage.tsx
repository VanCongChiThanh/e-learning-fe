import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmBankAccount } from "../api";
import MainLayout from "../../../layouts/MainLayout";

const BankAccountConfirmPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("Mã xác nhận không hợp lệ");
      return;
    }

    const confirmAccount = async () => {
      try {
        await confirmBankAccount(token);
        setStatus("success");
        toast.success("Xác nhận tài khoản ngân hàng thành công!");

        // Redirect to bank account page after 3 seconds
        setTimeout(() => {
          navigate("/instructor-profile/bank-account");
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.error?.message ||
            "Mã xác nhận không hợp lệ hoặc đã hết hạn"
        );
        toast.error("Xác nhận tài khoản ngân hàng thất bại");
      }
    };

    confirmAccount();
  }, [searchParams, navigate]);

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          {status === "loading" && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Đang xác nhận...
              </h2>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <i className="fas fa-check text-3xl text-green-600"></i>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Xác nhận thành công!
              </h2>
              <p className="text-gray-600 mb-4">
                Tài khoản ngân hàng của bạn đã được xác nhận.
              </p>
              <p className="text-sm text-gray-500">
                Đang chuyển hướng đến trang tài khoản ngân hàng...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <i className="fas fa-times text-3xl text-red-600"></i>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Xác nhận thất bại
              </h2>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => navigate("/instructor-profile/bank-account")}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Quay lại trang tài khoản
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BankAccountConfirmPage;
