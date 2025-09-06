import axiosAuth from "../../api/axiosAuth";
import axiosClient from "../../api/axiosClient";
import axios from "axios";
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

/**
 * Lấy presigned URL để upload avatar
 * @param extension file extension (ví dụ: ".png", ".jpg")
 * @returns { url, key }
 */
export const getPresignedUrl = async (extension: string) => {
  const res = await axiosAuth.post(`/files/presigned-url`, null, {
    params: { extension },
  });
  return res.data.data;
};



/**
 * Upload file trực tiếp lên S3 qua presigned URL
 */
export const uploadAvatarToS3 = async (url: string, file: File) => {
  await axios.put(url, file, {
    headers: { "Content-Type": file.type },
  });
};

/**
 * Lấy presigned URL để download file
 * @param fileName key file trong S3 (vd: "avatars/123-456.png")
 */
export const getDownloadUrl = async (fileName: string): Promise<string> => {
  const res = await axiosClient.get(`/files/download-url`, {
    params: { fileName },
  });
  return res.data.data; 
};
