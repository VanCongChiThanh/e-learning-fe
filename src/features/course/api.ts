import axiosClient from "../../api/axiosClient";
import axiosAuth from "../../api/axiosAuth";
import axios from "axios";
export const getAllCourses = async (params?: { order?: string; page?: number; paging?: number; sort?: string }) => {
  const response = await axiosClient.get("/courses/page", {
    params: {
      order: params?.order || "desc",
      page: params?.page || 1,
      paging: params?.paging || 5,
      sort: params?.sort || "created_at",
    },
  });
  return response.data;
};

export const getPresignedUrlCourse = async (extension: string) => {
  const res = await axiosAuth.post(`/files/presigned-url`, null, {
    params: { extension },
  });
  return res.data.data;
};

/**
 * Upload file lên S3 qua presigned url
 */
export const uploadCourseImageToS3 = async (url: string, file: File) => {
  await axios.put(url, file, {
    headers: { "Content-Type": file.type },
  });
};

/**
 * Cập nhật url ảnh cho khóa học
 */
export const updateCourseImageUrl = async (courseId: string, imageUrl: string) => {
  const res = await axiosAuth.patch(
    `/courses/${courseId}/image`,
    null, // body rỗng
    { params: { imageUrl } }
  );
  return res.data.data;
};