import axios from "axios";
import { logout } from "../features/auth/authSlice";
import { store } from "../app/store";

const axiosAuth = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào header trước khi gửi request
axiosAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: xử lý response lỗi
axiosAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode = error.response?.data?.error?.code;

    // Token hết hạn
    if (errorCode === "ERR.TOK0102") {
      localStorage.removeItem("token");
      store.dispatch(logout());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default axiosAuth;
