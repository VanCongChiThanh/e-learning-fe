import axiosAuth from "../../api/axiosAuth";
import axiosClient from "../../api/axiosClient";
import aiAPI from "../../api/aiAPI";
import {
  CareerPlanRequest,
  GenerateCareerPlanPayload,
} from "./types/CareerType";
import { AxiosError } from "axios";
export interface ApplyInstructorRequest {
  cv_url: string;
  portfolio_link: string;
  motivation: string;
  extra_info?: Record<string, any>;
}

export const searchCourses = async (params?: {
  page?: number;
  paging?: number;
  sort?: string;
  order?: string;
  filter?: string; // Spring Filter expression
}) => {
  const response = await axiosClient.get("/courses/page", {
    params: {
      order: params?.order || "desc",
      page: params?.page || 1,
      paging: params?.paging || 12,
      sort: params?.sort || "created_at",
      filter: params?.filter, // Spring Filter string
    },
  });
  return response.data;
};

export const applyInstructor = async (data: ApplyInstructorRequest) => {
  const response = await axiosAuth.post("/instructor/applications/apply", data);
  return response.data;
};

//course detail
export const getCourseDetailBySlug = async (slug: string) => {
  const response = await axiosClient.get(`/courses/slug/${slug}/detail`);
  return response.data.data;
};

export const getSectionsByCourseId = async (courseId: string) => {
  const response = await axiosAuth.get(`/courses/${courseId}/sections`);
  return response.data.data;
};
export const fetchCart = async () => {
  const response = await axiosAuth.get("/cart");
  return response.data;
};
export const addCourseFree = async (courseId: string) => {
  const response = await axiosAuth.post(`/enrollments/enroll/${courseId}`);
  return response.data;
};
export const addToCart = async (data: {
  courseId: string;
  addedPrice: number;
}) => {
  const response = await axiosAuth.post(`/cart/add`, data);
  return response.data;
};

export const removeFromCart = async (courseId: string) => {
  const response = await axiosAuth.delete(`/cart/items/${courseId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosAuth.delete(`/cart/clear`);
  return response.data;
};
export const createOrder = async (data: {
  clearCartAfterOrder: true;
  notes: string;
}) => {
  const response = await axiosAuth.post("/orders/from-cart", data);
  return response.data;
};
export const orderDirectly = async (data: {
  items: [
    {
      courseId: string;
      coursePrice: number;
    }
  ];
  notes: string;
}) => {
  const response = await axiosAuth.post("/orders/", data);
  return response.data;
};
export const paymentOrder = async (orderId: string) => {
  const response = await axiosAuth.post(`/payments/`, {
    orderId: orderId,
    description: "Thanh toan don hang",
  });
  return response.data;
};
export const getCetificateByUserId = async (userId: string) => {
  const response = await axiosAuth.get(`/certificates/user/${userId}`);
  return response.data;
};
export const getCertificateDetailById = async (certificateId: string) => {
  const response = await axiosAuth.get(`/certificates/${certificateId}`);
  return response.data;
};
//career plan

//get course by list id
export const getCourseByListId = async (courseIds: string[]) => {
  const setIds = Array.from(new Set(courseIds)); // loại trùng + chuẩn Set
  const res = await axiosClient.post("/courses/list-ids", setIds);
  return res.data;
};

// gọi AI FastAPI generate lộ trình
export const generateCareerPlan = async (data: GenerateCareerPlanPayload) => {
  const res = await aiAPI.post("/career/generate", data);
  return res.data;
};

// lưu lộ trình career vào Spring
export const saveCareerPlan = async (data: CareerPlanRequest) => {
  const res = await axiosAuth.post("/career-plans/me", data);
  return res.data.data;
};

// lấy lộ trình của user
export const getMyCareerPlan = async () => {
  const res = await axiosAuth.get("/career-plans/me");
  return res.data.data;
};

export const handleCourseEnrollment = async (
  courseId: string,
  coursePrice: number = 0
) => {
  try {
    const result = await addCourseFree(courseId);
    return {
      success: true,
      type: "free",
      data: result,
      message: "Khóa học miễn phí được tìm thấy",
    };
  } catch (freeError: any) {
    const errorMessage =
      freeError?.response?.data?.message || freeError?.message || "";

    if (
      errorMessage.includes("không phải miễn phí") ||
      errorMessage.includes("not free") ||
      freeError?.response?.status === 400
    ) {
      try {
        const cartResult = await addToCart({
          courseId: courseId,
          addedPrice: coursePrice,
        });
        return {
          success: true,
          type: "cart",
          data: cartResult,
          message: "Đã thêm vào giỏ hàng thành công",
        };
      } catch (e: any) {
        return {
          success: false,
          type: "error",
          error: e,
          message: e?.response?.data?.error,
        };
      }
    } else {
      return {
        success: false,
        type: "error",
        error: freeError,
        message: "Có lỗi xảy ra khi xử lý khóa học",
      };
    }
  }
};
