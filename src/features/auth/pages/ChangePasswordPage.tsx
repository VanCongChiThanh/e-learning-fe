import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { changePasswordAPI } from "../api/authAPI";

interface ChangePasswordFormData {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    level: number;
    text: string;
    color: string;
  }>({ level: 0, text: "", color: "" });

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    if (strength === 0 || password.length === 0) {
      return { level: 0, text: "", color: "" };
    } else if (strength <= 2) {
      return { level: 1, text: "Yếu", color: "bg-red-500" };
    } else if (strength === 3) {
      return { level: 2, text: "Trung bình", color: "bg-yellow-500" };
    } else {
      return { level: 3, text: "Mạnh", color: "bg-green-600" };
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "new_password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.old_password) {
      newErrors.old_password = "Vui lòng nhập mật khẩu cũ";
    }

    if (formData.new_password.length < 8) {
      newErrors.new_password = "Mật khẩu mới tối thiểu 8 ký tự";
    }

    if (formData.new_password !== formData.confirm_new_password) {
      newErrors.confirm_new_password = "Mật khẩu xác nhận không khớp";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await changePasswordAPI({
        old_password: formData.old_password,
        new_password: formData.new_password,
        confirm_new_password: formData.confirm_new_password,
      });

      setSuccess(true);
      setErrors({}); // Clear all errors when successful
      // Reset form after successful password change
      setFormData({
        old_password: "",
        new_password: "",
        confirm_new_password: "",
      });
      setPasswordStrength({ level: 0, text: "", color: "" });
    } catch (error: any) {
      setSuccess(false); // Clear success message when error occurs
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Đổi mật khẩu thất bại";
      setErrors({ api: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="w-full max-w-6xl flex items-center justify-center gap-8">
        {/* Left: Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <img
            src="/svg/login.png"
            alt="Coursevo Illustration"
            className="w-full h-auto"
            style={{ transform: "scale(2.5)" }}
          />
        </div>

        {/* Right: Change Password Form */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white p-10">
            {/* Logo & Header */}
            <div className="text-center mb-6">
              <h1
                className="text-5xl text-center mb-2"
                style={{ fontFamily: "'Cookie', cursive" }}
              >
                Coursevo
              </h1>
              <p className="text-gray-600 text-sm">Đổi mật khẩu</p>
            </div>

            {success && (
              <p className="mb-4 text-center text-green-600 text-sm">
                Đổi mật khẩu thành công! Đang chuyển hướng...
              </p>
            )}

            {errors.api && (
              <p className="mb-4 text-center text-red-600 text-sm">
                {errors.api}
              </p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Old Password */}
              <div>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 text-sm border rounded-sm bg-gray-50 focus:outline-none focus:border-gray-400 ${
                      errors.old_password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Mật khẩu cũ"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showOldPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.old_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.old_password}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 text-sm border rounded-sm bg-gray-50 focus:outline-none focus:border-gray-400 ${
                      errors.new_password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.new_password}
                  </p>
                )}

                {passwordStrength.level > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      <div
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.level >= 1
                            ? passwordStrength.color
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.level >= 2
                            ? passwordStrength.color
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.level >= 3
                            ? passwordStrength.color
                            : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                    <p
                      className={`text-xs font-medium ${
                        passwordStrength.level === 1
                          ? "text-red-500"
                          : passwordStrength.level === 2
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Độ mạnh: {passwordStrength.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_new_password"
                    value={formData.confirm_new_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 text-sm border rounded-sm bg-gray-50 focus:outline-none focus:border-gray-400 ${
                      errors.confirm_new_password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirm_new_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirm_new_password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 mt-3 rounded-sm font-semibold text-white text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </form>

            {/* Back to Profile Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-300">
              <p className="text-sm">
                <Link
                  to="/profile"
                  className="text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  Quay lại trang cá nhân
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
