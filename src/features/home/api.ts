import axiosAuth from "../../api/axiosAuth";
import axiosClient from "../../api/axiosClient";
import aiAPI from "../../api/aiAPI";
import { CareerPlanRequest,GenerateCareerPlanPayload } from "./types/CareerType";
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
export const addToCart = async (data: {
  courseId: string;
  addedPrice: number;
}) => {
  const response = await axiosAuth.post(`/cart/add`, data);
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