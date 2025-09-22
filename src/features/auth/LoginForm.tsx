import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import type { AppDispatch, RootState } from "../../app/store";
import styles from "./LoginForm.module.scss";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("ngoloc3304@gmail.com");
  const [password, setPassword] = useState("Ngoloc12@");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div
      className={`max-w-md mx-auto mt-16 p-8 rounded-2xl shadow-lg bg-white ${styles.wrapper}`}
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
        Đăng nhập
      </h2>

      {token && (
        <p className="mb-4 text-center text-green-600 font-medium">
          Đăng nhập thành công! Token: {token}
        </p>
      )}
      {error && (
        <p className="mb-4 text-center text-red-600 font-medium">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${styles.input}`}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${styles.input}`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold transition duration-200 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
