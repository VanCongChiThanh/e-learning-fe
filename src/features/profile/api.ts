import axiosAuth from "../../api/axiosAuth";
export interface UserInfo {
  first_name: string;
  last_name: string;
  avatar: string; // đây sẽ là key trong S3
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const res = await axiosAuth.get(`/users/me/profile`);
  return res.data.data;
};

export const updateUserInfo = async (
  userInfo: Partial<UserInfo>
): Promise<UserInfo> => {
  const res = await axiosAuth.patch(`/users/me/profile`, userInfo);
  return res.data;
};

