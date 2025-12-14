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

export interface LectureDataFromApi { // Define a more complete Lecture type for API response
  lectureId: string;
  title: string;
  position: number;
  videoUrl: string; // Assuming the API returns videoUrl directly
}

export const getLectures = async (sectionId: string): Promise<LectureDataFromApi[]> => {
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
// export const getQuestionsForQuiz = async (quizId: string) => {
//   const response = await axiosAuth.get(`/quiz-questions/quiz/${quizId}`);
//   return response.data; // Trả về một mảng các câu hỏi [...]
// };

// --- THÊM MỚI API 3: Lấy chi tiết một câu hỏi ---
export const getQuestionDetail = async (questionId: string) => {
    const response = await axiosAuth.get(`/quiz-questions/${questionId}`);
    return response.data; // Trả về một đối tượng câu hỏi {...}
};


/// code exercise

// Dữ liệu cho một bài tập trong danh sách
export interface ExerciseListItem {
  id: string;
  title: string;
}

// Dữ liệu chi tiết cho một Test Case
export interface TestCase {
  id: string;
  inputData: string;
  expectedOutput: string;
  points: number;
  isHidden: boolean;
  sortOrder: number;
}

// Dữ liệu chi tiết cho một bài tập code
export interface ExerciseDetail {
  id: string;
  lectureId: string;
  title: string;
  problemStatement: string; // Đây là nội dung markdown
  timeLimitSeconds: number;
  createdAt: number;
  testCases: TestCase[];
}

export const getCodeExercisesByLecture = async (lectureId: string): Promise<ExerciseListItem[]> => {
  try {
    const response = await axiosAuth.get(`/code-exercises/by-lecture/${lectureId}`);
    return response.data.data; // Trả về mảng các bài tập
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài tập code:", error);
    throw error;
  }
};


export const getCodeExerciseDetail = async (exerciseId: string): Promise<ExerciseDetail> => {
  try {
    const response = await axiosAuth.get(`/code-exercises/${exerciseId}`);
    return response.data.data; // Trả về đối tượng chi tiết bài tập
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bài tập code:", error);
    throw error;
  }
};


// quizz

// Kiểu dữ liệu cho chi tiết một bài Quiz
export interface QuizDetail {
  id: string;
  lectureId: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  maxAttempts: number;
  numberQuestions: number;
  isActive: boolean;
  createdAt: number;
}

// Kiểu dữ liệu cho một lựa chọn trong câu hỏi trắc nghiệm
export interface QuizOption {
  id: string;
  optionText: string;
}

// Kiểu dữ liệu cho một câu hỏi trắc nghiệm
export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  questionType: string; // MULTIPLE_CHOICE, SINGLE_CHOICE
  sortOrder: number;
  options: QuizOption[];
}

// Kiểu dữ liệu cho một quiz trong danh sách
export interface QuizListItem {
  id: string;
  title: string;
  description: string;
  numberQuestions: number;
}

/**
 * Lấy danh sách các bài quiz của một bài giảng.
 * @param lectureId - ID của bài giảng
 */
export const getQuizzesByLecture = async (lectureId: string): Promise<QuizListItem[]> => {
  const response = await axiosAuth.get(`/quizzes/lecture/${lectureId}`);
  // API trả về một mảng dữ liệu trực tiếp trong response.data
  return Array.isArray(response.data) ? response.data : response.data.data || [];
};

/**
 * Lấy thông tin chi tiết của một bài quiz bằng ID.
 * @param quizId - ID của bài quiz (từ payload của event)
 */
export const getQuizDetail = async (quizId: string): Promise<QuizDetail> => {
  try {
    const response = await axiosAuth.get(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết quiz:", error);
    throw error;
  }
};

/**
 * Lấy tất cả các câu hỏi cho một bài quiz.
 * @param quizId - ID của bài quiz
 */
export const getQuestionsForQuiz = async (quizId: string): Promise<QuizQuestion[]> => {
  try {
    const response = await axiosAuth.get(`/quiz-questions/quiz/${quizId}`);
    // Giả sử API trả về mảng trong response.data.data
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy câu hỏi cho quiz:", error);
    throw error;
  }
};

/**
 * (Placeholder) Gửi kết quả bài làm lên server.
 * Cần được impl ở backend.
 */
export const submitQuizAnswers = async (quizId: string, answers: { questionId: string, selectedOptionId: string }[]) => {
    console.log("Đang gửi bài làm:", { quizId, answers });
    // Giả lập API trả về điểm số sau 1 giây
    await new Promise(resolve => setTimeout(resolve, 1000));
    const score = Math.floor(Math.random() * 101); // Điểm số ngẫu nhiên từ 0-100
    console.log("Nhận kết quả:", { score });
    return { score };
};


// reviews 

export interface PaginationMeta {
  current_page: number;
  next_page: number;
  prev_page: number;
  total_pages: number;
  total_count: number;
}

export interface ReviewReplyMeta {
  reviewId: string;
  likeCount: number;
  dislikeCount: number;
  parentReviewId: string;
}

export interface Review {
  reviewId: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: number; // timestamp
  userAvatar: string | null;
  likeCount: number;
  dislikeCount: number;
  replies: ReviewReplyMeta[];
  userName: string;
}

// Đây là chi tiết cho một reply
export interface ReviewDetail {
  reviewId: string;
  courseId: string;
  userId: string;
  rating: number; // Rating này có thể là 0
  comment: string;
  createdAt: number;
  likeCount: number;
  dislikeCount: number;
  parentReviewId: string;
  userName: string;
  userAvatar?: string | null;
  userVoteStatus: 'LIKE' | 'DISLIKE' | null;
}

// Interface chung cho response từ API
interface ApiResponse<T> {
  status: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  star1Count: number;
  star2Count: number;
  star3Count: number;
  star4Count: number;
  star5Count: number;
  star1Percent: number;
  star2Percent: number;
  star3Percent: number;
  star4Percent: number;
  star5Percent: number;
}

export const getReviewStatistics = async (courseId: string): Promise<ReviewStatistics> => {
  const res = await axiosAuth.get(`/courses/${courseId}/reviews/statistics`);
  return res.data.data;
};

/**
 * Lấy danh sách review cho khóa học (có phân trang)
 */
export const getReviewsForCourse = async (
  courseId: string,
  params: {
    page?: number;
    paging?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    rating?: number; // Thêm filter theo rating
    search?: string; // Thêm filter theo search
  }
): Promise<{ data: Review[]; meta: PaginationMeta }> => {
  const res = await axiosAuth.get<ApiResponse<Review[]>>(
    `/courses/${courseId}/reviews/Page`, // Sửa 'Page' thành 'page'
    {
      params: {
        page: params.page || 1,
        paging: params.paging || 10,
        sort: params.sort || 'created_At',
        order: params.order || 'desc',
        ...params,
      },
    }
  );
  // @ts-ignore - Giả định cấu trúc response trả về đúng như mô tả
  return { data: res.data.data, meta: res.data.meta };
};

/**
 * Tạo một review mới
 */
export const createReview = async (
  courseId: string,
  payload: { comment: string; rating: number }
): Promise<Review> => {
  const res = await axiosAuth.post<ApiResponse<Review>>(
    `/courses/${courseId}/reviews`,
    payload
  );
  return res.data.data;
};

/**
 * Vote (Like/Dislike) cho một review
 */
export const voteForReview = async (
  courseId: string,
  reviewId: string,
  voteType: 'LIKE' | 'DISLIKE'
): Promise<{ status: string; meta: string }> => {
  const res = await axiosAuth.post(
    `/courses/${courseId}/reviews/${reviewId}/vote`,
    null,
    { params: { voteType } }
  );
  return res.data;
};

/**
 * Vote (Like/Dislike) cho một comment
 */
export const voteForComment = async (
  lectureId: string,
  commentId: string,
  voteType: 'LIKE' | 'DISLIKE'
) => {
  const res = await axiosAuth.post(
    `/lectures/${lectureId}/comments/${commentId}/vote`,
    null,
    { params: { voteType } }
  );
  return res.data;
};

export const replyToReview = async (
  courseId: string,
  parentReviewId: string,
  payload: { comment: string; rating: number } // rating set cứng (vd: 0)
): Promise<ReviewDetail> => {
  const res = await axiosAuth.post<ApiResponse<ReviewDetail>>(
    `/courses/${courseId}/reviews/${parentReviewId}/reply`,
    payload
  );
  return res.data.data;
};



export const getReviewDetail = async (
  courseId: string,
  reviewId: string
): Promise<ReviewDetail> => {
  const res = await axiosAuth.get<ApiResponse<ReviewDetail>>(
    `/courses/${courseId}/reviews/${reviewId}`
  );
  return res.data.data;
};

export const checkEnrollment = async (courseId: string): Promise<boolean> => {
  try {
    const res = await axiosAuth.get(`/enrollments/courses/${courseId}/check-exists-enrollment`);
    return res.data.data; // Trả về giá trị boolean từ thuộc tính 'data'
  } catch (error) {
    console.error("Lỗi khi kiểm tra enrollment:", error);
    return false;
  }
};

/**
 * Lấy thông tin enrollment của user hiện tại cho một khóa học.
 * @param courseId - ID của khóa học.
 */
export const getMyEnrollmentForCourse = async (courseId: string): Promise<{ enrollmentId: string }> => {
    try {
        const res = await axiosAuth.get(`/enrollments/course/${courseId}`);
        // API trả về một mảng enrollment, ta lấy phần tử đầu tiên
        const enrollmentData = res.data;
        if (Array.isArray(enrollmentData) && enrollmentData.length > 0) {
            return { enrollmentId: enrollmentData[0].id };
        }
        throw new Error("Không tìm thấy thông tin đăng ký khóa học.");
    } catch (error) {
        console.error("Lỗi khi lấy thông tin enrollment:", error);
        throw error;
    }
};

/**
 * Cập nhật tiến độ xem bài giảng của người dùng.
 * @param payload - Dữ liệu tiến độ bao gồm userId, lectureId, và lastViewAt.
 */
export const updateLectureProgress = async (payload: {
  lastViewAt: string;
  lectureId: string;
  userId: string;
}) => {
  const res = await axiosAuth.put(`/progress/lecture-progress`, payload);
  return res.data;
};

export interface RecentLearningInfo {
  enrollmentId: string;
  enrollmentStatus: string;
  enrollmentProgressPercentage: number;
  lastAccessedAt: number;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseImage: string;
  sectionId: string;
  sectionTitle: string;
  position: number;
  lectureId: string;
  lectureTitle: string;
  lectureVideoUrl: string;
  lectureDuration: number;
  lectureOrder: number;
  progressId: string;
  isLectureCompleted: boolean;
  lastViewedAt: string;
  progressUpdatedAt: number;
  lectureProgressPercentage: number;
  currentLearningStatus: string;
  recommendedAction: string;
}

export const getRecentLearning = async (enrollmentId: string): Promise<RecentLearningInfo> => {
  const response = await axiosAuth.get(`/progress/enrollment/${enrollmentId}/recent-learning`);
  return response.data;
};

export const checkReviewExist = async (courseId: string): Promise<boolean> => {
  try {
    const res = await axiosAuth.get(`/courses/${courseId}/reviews/me/exist`);
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra review exist:", error);
    return false;
  }
};

export const getProgressSummary = async (enrollmentId: string) => {
  const res = await axiosAuth.get(`/progress/enrollment/${enrollmentId}/summary`);
  return res.data;
};