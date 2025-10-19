import { UUID } from "crypto";
import axiosAuth from "../../api/axiosAuth";
import axiosClient from "../../api/axiosClient";
export interface ApplyInstructorRequest {
  cv_url: string; // cv_url trong JSON
  portfolioLink: string; // portfolio_link trong JSON
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
}
export const fetchCart = async () => {
  const response = await axiosAuth.get("/cart");
  return response.data;
}
export const addToCart = async (data: {
  courseId: string;
  addedPrice: number;
}) => {
  const response = await axiosAuth.post(`/cart/add`, data);
  return response.data;
}
export const createOrder = async (data: {
  clearCartAfterOrder: true,
  notes: string
}) => {
  const response = await axiosAuth.post("/orders/from-cart", data);
  return response.data;
}
export const paymentOrder = async (orderId: string) => {
  const response = await axiosAuth.post(`/payments/`, {
    orderId: orderId,
    description: "Thanh toan don hang"
  });
  return response.data;
}