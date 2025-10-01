import axiosAuth from "../api/axiosAuth";
import axios from "axios";
import axiosClient from "../api/axiosClient";
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
export const uploadFileToS3 = async (url: string, file: File) => {
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

