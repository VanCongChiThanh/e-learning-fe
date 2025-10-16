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