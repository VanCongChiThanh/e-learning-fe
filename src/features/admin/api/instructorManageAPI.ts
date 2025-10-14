// features/admin/api/instructor-manage.api.ts
import axiosAuth from "../../../api/axiosAuth";

// ---- Request/Response Types ----
export interface PageInfo {
  current_page: number;
  next_page: number;
  prev_page: number;
  total_pages: number;
  total_count: number;
}

export interface UserInfoResponse {
  user_id: string;
  name: string;
  avatar: string;
}

export interface InstructorCandidateResponse {
  id: string;
  user_info: UserInfoResponse;
  cv_url: string;
  portfolio_link: string;
  motivation?: string;
  status: ApplicationStatus;
}

export type ApplicationStatus =
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "CANCELED";

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
    order: "asc" | "desc" = "desc",
    status?: ApplicationStatus
  ): Promise<ApiResponse<InstructorCandidateResponse[]>> => {
    const res = await axiosAuth.get(`/instructor/applications/all`, {
      params: { page, paging, sort, order, ...(status && { status }) },
    });
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
      `/instructor/applications/${applicationId}/review`,
      request
    );
    return res.data;
  },
};
