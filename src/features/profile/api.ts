import axiosAuth from "../../api/axiosAuth";
export interface UserInfo {
  first_name: string;
  last_name: string;
  avatar: string; // đây sẽ là key trong S3
}
export interface InstructorProfile {
  bio: string;
  headline: string;
  biography: string;
  linkedin: string;
  github: string;
  facebook: string;
  youtube: string;
  personal_website: string;
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const res = await axiosAuth.get(`/users/me/profile`);
  return res.data.data;
};

export const updateUserInfo = async (
  userInfo: Partial<UserInfo>
): Promise<UserInfo> => {
  const res = await axiosAuth.patch(`/users/me/profile`, userInfo);
  return res.data.data;
};


export async function getInstructorProfile(): Promise<InstructorProfile> {
  const res = await axiosAuth.get("/instructor/profile/me");
  return res.data.data; // tuỳ backend trả
}

export async function updateInstructorProfile(
  profile: InstructorProfile
): Promise<InstructorProfile> {
  const res = await axiosAuth.patch("/instructor/profile/me/update", profile);
  return res.data.data;
}