import axiosClient from "../../api/axiosClient";
import axiosAuth from "../../api/axiosAuth";
import axios from "axios";

export const getAllCourses = async (params?: {
  order?: string;
  page?: number;
  paging?: number;
  sort?: string;
}) => {
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
export const updateCourseImageUrl = async (
  courseId: string,
  imageUrl: string
) => {
  const res = await axiosAuth.patch(
    `/courses/${courseId}/image`,
    null, // body rỗng
    { params: { imageUrl } }
  );
  return res.data.data;
};

export const getCourseDetailBySlug = async (slug: string) => {
  const res = await axiosAuth.get(`/courses/slug/${slug}`);
  return res.data.data;
};

export const getSections = async (courseId: string) => {
  const res = await axiosAuth.get(`/courses/${courseId}/sections`);
  return res.data.data;
};

export const getLectures = async (sectionId: string) => {
  const res = await axiosAuth.get(`/sections/${sectionId}/lectures`);
  return res.data.data;
};

/// Video lecture upload
export const getPresignedUrlVideoLecture = async (extension: string) => {
  const res = await axiosAuth.post(`/videos/presigned-url`, null, {
    params: { extension },
  });
  return res.data.data;
};

export const uploadVideoLectureToS3 = async (url: string, file: File) => {
  await axios.put(url, file, {
    headers: { "Content-Type": file.type },
  });
};
export const updateVideoLecture = async (
  lectureId: string,
  videoUrl: string
) => {
  const res = await axiosAuth.patch(
    `/sections/{sectionId}/lectures/${lectureId}/video`,
    null,
    { params: { videoUrl } }
  );
  return res.data.data;
};

/// Note
export const noteApi = {
  async getNotes(lectureId: string, userId: string) {
    const res = await axiosAuth.get(`/lectures/${lectureId}/notes`, {
      headers: { "X-User-ID": userId },
    });
    return res.data.data; // giả sử API trả { data: [...] }
  },

  async createNote(lectureId: string, userId: string, content: string) {
    const res = await axiosAuth.post(
      `/lectures/${lectureId}/notes`,
      { content },
      { headers: { "X-User-ID": userId } }
    );
    return res.data.data; // giả sử API trả { data: {...} }
  },

  async deleteNote(lectureId: string, noteId: string, userId: string) {
    await axiosAuth.delete(`/lectures/${lectureId}/notes/${noteId}`, {
      headers: { "X-User-ID": userId },
    });
  },

  async updateNote(
    lectureId: string,
    noteId: string,
    userId: string,
    content: string
  ) {
    const res = await axiosAuth.put(
      `/lectures/${lectureId}/notes/${noteId}`,
      { content },
      { headers: { "X-User-ID": userId } }
    );
    return res.data.data;
  },
};



export const getEventsForLecture = async (lectureId: string) => {
  const response = await axiosAuth.get(`/events/lecture/${lectureId}`);
  return response.data; // Trả về { status: '...', data: [...] }
};

// API 2: Lấy danh sách câu hỏi của một quiz
export const getQuestionsForQuiz = async (quizId: string) => {
  const response = await axiosAuth.get(`/quiz-questions/quiz/${quizId}`);
  return response.data; // Trả về một mảng các câu hỏi [...]
};

// --- THÊM MỚI API 3: Lấy chi tiết một câu hỏi ---
export const getQuestionDetail = async (questionId: string) => {
    const response = await axiosAuth.get(`/quiz-questions/${questionId}`);
    return response.data; // Trả về một đối tượng câu hỏi {...}
};