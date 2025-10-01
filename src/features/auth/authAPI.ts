import axiosClient from "../../api/axiosClient";
import axiosAuth from "../../api/axiosAuth";

export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  password_confirmation: string;
  role: string;
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

//ADMIN
// login admin dùng chung endpoint /oauth/token
export const loginAdminAPI = async (body: LoginRequest) => {
  const res = await axiosClient.post("admin/oauth/token", body);
  return res.data; // { access_token, ... }
};

// lấy thông tin admin hiện tại dùng chung /user
export const getCurrentAdminAPI = async () => {
  const res = await axiosAuth.get("/user");
  return res.data; // { id, first_name, last_name, email, role, ... }
};

// logout admin dùng chung /oauth/revoke
export const logoutAdminAPI = async () => {
  const res = await axiosAuth.post("/oauth/revoke");
  return res.data;
};

//confirm email
export const confirmEmailAPI = async (token: string) => {
  const res = await axiosClient.get(`/user/confirmation`, {
    params: { confirmation_token: token },
  });
  return res.data;
};

// OAuth2 login
export const oauth2LoginAPI = async (provider: string, code: string) => {
  const res = await axiosClient.get(`/oauth2/${provider}/login`, {
    params: { code },
  });
  return res.data;
};
//sign up
export const register = async (body: RegisterRequest) => {
  const res = await axiosClient.post("/user/sign-up", body);
  return res.data
}