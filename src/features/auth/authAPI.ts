import axiosClient from "../../api/axiosClient";
import axiosAuth from "../../api/axiosAuth";

export interface LoginRequest {
  email: string;
  password: string;
}

// login để lấy token
export const loginAPI = async (body: LoginRequest) => {
  const res = await axiosClient.post("/oauth/token", body);
  return res.data;
};

// lấy thông tin user hiện tại
export const getCurrentUserAPI = async () => {
  const res = await axiosAuth.get("/user");
  return res.data;
};

export const logoutAPI = async () => {
  const res = await axiosAuth.post("/oauth/revoke");
  return res.data;
};