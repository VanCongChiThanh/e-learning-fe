import type React from "react";
import { useState } from "react";
import { changePasswordAPI } from "../../auth/api/authAPI";

interface ChangePasswordFormData {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export default function ChangePasswordForm() {
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

    // Clear all errors when user starts typing
    if (errors[name] || errors.api) {
      const newErrors = { ...errors };
      delete newErrors[name];
      delete newErrors.api;
      setErrors(newErrors);
    }

    // Also clear success message when user starts editing
    if (success) {
      setSuccess(false);
    }

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
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          ✓ Đổi mật khẩu thành công!
        </div>
      )}

      {errors.api && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium mb-2">Mật khẩu cũ</label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden ${
                errors.old_password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-emerald-200"
              }`}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Hiện/ẩn mật khẩu cũ"
            >
              <i
                className={`fas ${showOldPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
          {errors.old_password && (
            <p className="text-red-500 text-xs mt-1">{errors.old_password}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium mb-2">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden ${
                errors.new_password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-emerald-200"
              }`}
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Hiện/ẩn mật khẩu mới"
            >
              <i
                className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
          {errors.new_password && (
            <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>
          )}

          {passwordStrength.level > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    passwordStrength.level >= 1
                      ? passwordStrength.color
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    passwordStrength.level >= 2
                      ? passwordStrength.color
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
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
          <label className="block text-sm font-medium mb-2">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_new_password"
              value={formData.confirm_new_password}
              onChange={handleChange}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden ${
                errors.confirm_new_password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-emerald-200"
              }`}
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Hiện/ẩn xác nhận mật khẩu"
            >
              <i
                className={`fas ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </button>
          </div>
          {errors.confirm_new_password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirm_new_password}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}
