import axios from "axios";
import { logout } from "../features/auth/authSlice";
import { store } from "../app/store";

const axiosAuth = axios.create({
  baseURL: "http://localhost:8105/api/v1",
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
    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      store.dispatch(logout());
      window.location.href = "/login";
      // Có thể redirect về login
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;
