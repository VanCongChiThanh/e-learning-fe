import axiosAuth from "../../api/axiosAuth";

export interface UserInfo {
  first_name: string;
  last_name: string;
  avatar: string;
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const res = await axiosAuth.get(`/v1/me/profile`);
  return res.data;
};

export const updateUserInfo = async (userInfo: Partial<UserInfo>): Promise<UserInfo> => {
  const res = await axiosAuth.patch(`/profile`, userInfo);
  return res.data;
};

export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  folderName?: string
) => {
  const key = folderName ? `${folderName}/${fileName}` : fileName;

  const res = await axiosAuth.post(`/v1/file/presigned-url`, {
    fileName: key,
    fileType,
  });

  return res.data; // { url: string, key: string }
};


export const uploadAvatarToS3 = async (url: string, file: File) => {
  await axiosAuth.put(url, file, {
    headers: { "Content-Type": file.type },
  });
};

