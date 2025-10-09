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
  category?: string;
  level?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/courses/page", {
    params: {
      order: params?.order || "desc",
      page: params?.page || 1,
      paging: params?.paging || 12,
      sort: params?.sort || "created_at",
      category: params?.category,
      level: params?.level,
      search: params?.search,
    },
  });
  return response.data;
};
export const applyInstructor = async (data: ApplyInstructorRequest) => {
  const response = await axiosAuth.post(
    "/instructor/applications/apply",
    data
  );
  return response.data;
};

