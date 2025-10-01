import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import type { AppDispatch, RootState } from "../../../app/store";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleGoogleLogin = () => {
    const googleClientId =
      "642950847149-dajc38ob05u32telc151jhaj5qfrchtg.apps.googleusercontent.com";
    const redirectUri = "https://coursevo.vercel.app/oauth2/callback/google";
    const scope = "openid email profile";

    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}`;
  };

  const handleAppleLogin = () => {
    console.log("Login with Apple");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Login Form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-10 bg-white">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Coursevo</h1>
        <p className="text-gray-600 mb-6 text-center">
          Bắt đầu hành trình học tập của bạn với Coursevo
        </p>

        {token && (
          <p className="mb-4 text-center text-green-600 font-medium">
            Đăng nhập thành công! Token: {token}
          </p>
        )}

        {error && (
          <p className="mb-4 text-center text-red-600 font-medium">
            {typeof error === "string" ? error : error.message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Login"}
          </button>
        </form>

        <div className="mt-5 w-full max-w-sm space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-3 border rounded-xl hover:bg-gray-100 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Đăng nhập với Google
          </button>

          <button
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center py-3 border rounded-xl hover:bg-gray-100 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              className="w-5 h-5 mr-3"
            />
            Đăng nhập với Apple
          </button>
        </div>

        <p className="mt-5 text-center text-gray-500 text-sm">
          Bạn chưa có tài khoản?{" "}
          <span className="text-emerald-600 font-medium cursor-pointer">
            <Link to="/register">Đăng ký ngay</Link>
          </span>
        </p>
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
};

export default LoginPage;
