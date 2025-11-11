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
    const redirectUri = `${process.env.REACT_APP_URL_WEB}/oauth2/callback/google`;
    const scope = "openid email profile";

    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}`;
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
            style={{ transform: "scale(1.2)" }}
          />
        </div>

        {/* Right: Login Form */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white p-10">
            <h1
              className="text-5xl text-center mb-8"
              style={{ fontFamily: "'Cookie', cursive" }}
            >
              Coursevo
            </h1>

            {token && (
              <p className="mb-4 text-center text-green-600 text-sm">
                Đăng nhập thành công! Token: {token}
              </p>
            )}

            {error && (
              <p className="mb-4 text-center text-red-600 text-sm">
                {typeof error === "string" ? error : error.message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Email đăng nhập"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm bg-gray-50 focus:outline-none focus:border-gray-400"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm bg-gray-50 focus:outline-none focus:border-gray-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 mt-3 rounded-sm font-semibold text-white text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="flex items-center my-5">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 font-semibold">
                HOẶC
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path
                  fill="#4285F4"
                  d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
                />
                <path
                  fill="#34A853"
                  d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
                />
                <path
                  fill="#FBBC05"
                  d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
                />
                <path
                  fill="#EA4335"
                  d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
                />
              </svg>
              Đăng nhập với Google
            </button>

            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-sm hover:text-emerald-800"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <div className="text-center mt-6 pt-6 border-t border-gray-300">
              <p className="text-sm">
                Bạn chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
