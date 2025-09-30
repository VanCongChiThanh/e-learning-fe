// features/admin/api/instructor-manage.api.ts
import axiosAuth from "../../../api/axiosAuth";

// ---- Request/Response Types ----
export interface PageInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
}

export interface UserInfoResponse {
  user_id: string;
  name: string;
  avatar: string;
}

export interface InstructorCandidateResponse {
  user_info: UserInfoResponse;
  cv_url: string;
  portfolio_link: string;
  motivation?: string;
}

export interface ApplyInstructorRequest {
  cv_url: string;
  portfolio_link: string;
  motivation: string;
}

export type ApplicationStatus = "APPROVED" | "REJECTED" | "PENDING" | "CANCELED";

export interface ReviewApplicationRequest {
  status: ApplicationStatus;
  reason?: string;
}

export interface ApiResponse<T> {
  status: string; // "success" | "error"
  data: T;
  error?: any;
  meta?: PageInfo;
}

// ---- API Functions ----
export const instructorManageApi = {
  getAllApplications: async (
    page = 1,
    paging = 5,
    sort = "created_at",
    order: "asc" | "desc" = "desc"
  ): Promise<ApiResponse<InstructorCandidateResponse[]>> => {
    const res = await axiosAuth.get(`/instructor/applications/all`, {
      params: { page, paging, sort, order },
    });
    return res.data;
  },

  applyForInstructor: async (
    request: ApplyInstructorRequest
  ): Promise<ApiResponse<null>> => {
    const res = await axiosAuth.post(
      `/instructor/applications/apply`,
      request
    );
    return res.data;
  },

  cancelApplication: async (
    applicationId: string
  ): Promise<ApiResponse<null>> => {
    const res = await axiosAuth.patch(
      `/instructor/applications/${applicationId}/cancel`
    );
    return res.data;
  },

  reviewApplication: async (
    applicationId: string,
    request: ReviewApplicationRequest
  ): Promise<ApiResponse<null>> => {
    const res = await axiosAuth.patch(
      `/instructor/${applicationId}/review`,
      request
    );
    return res.data;
  },
};
