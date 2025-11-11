import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordAPI } from "../api/authAPI";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPasswordAPI(email);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Kiểm tra email của bạn
          </h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email{" "}
            <span className="font-medium text-gray-800">{email}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Nếu bạn không nhận được email trong vài phút, vui lòng kiểm tra thư
            mục spam hoặc thử lại.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="w-full px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
            >
              Gửi lại email
            </button>
            <Link
              to="/login"
              className="block w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-emerald-700">Coursevo</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Quên mật khẩu?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="email@example.com"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
