import type React from "react";
import { useState } from "react";
import { register } from "../api/authAPI";
import { RegisterRequest } from "../types/authType";
export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    password_confirmation: "",
    role: "LEARNER",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.firstname.trim()) {
      newErrors.firstname = "Vui lòng nhập họ";
    }
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Vui lòng nhập tên";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu tối thiểu 8 ký tự";
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Mật khẩu không khớp";
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
      await register(formData);
      setSuccess(true);
    } catch (error: any) {
      console.log("API ERROR:", error.response?.data);
      const apiError = error.response?.data?.error;
      if (apiError && apiError.message) {
        setErrors({ api: apiError.message });
      } else {
        setErrors({ api: "Đăng ký thất bại" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-white">
        <div className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-md bg-white shadow-xl">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700 mb-1">Coursevo</h1>
            <p className="text-gray-600">Tạo tài khoản học viên</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="font-semibold text-sm text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field mt-1 w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Firstname */}
              <div>
                <label className="font-semibold text-sm text-gray-700">
                  Họ
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={`input-field mt-1 w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.firstname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nguyễn Văn"
                />
                {errors.firstname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstname}
                  </p>
                )}
              </div>

              {/* Lastname */}
              <div>
                <label className="font-semibold text-sm text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={`input-field mt-1 w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.lastname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="A"
                />
                {errors.lastname && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-semibold text-sm text-gray-700">
                Mật khẩu
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field w-full p-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Tối thiểu 8 ký tự"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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

            {/* Confirm Password */}
            <div>
              <label className="font-semibold text-sm text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`input-field w-full p-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.password_confirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập lại mật khẩu"
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
              {errors.password_confirmation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {errors.api && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.api}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-4 rounded-lg bg-green-700 text-white font-semibold shadow hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          {success && (
            <p className="text-green-600 text-center mt-4 font-medium text-sm">
              Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.
            </p>
          )}

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="text-green-700 font-semibold hover:underline"
              >
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Right: Illustration */}
      <div className="md:w-1/2 hidden md:flex items-center justify-center bg-green-50">
        <img
          src="/svg/login.svg"
          alt="Illustration"
          className="max-w-xs md:max-w-md"
        />
      </div>
    </div>
  );
}
