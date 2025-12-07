import axiosAuth from "../../api/axiosAuth";
export interface UserInfo {
  first_name: string;
  last_name: string;
  avatar: string; // đây sẽ là key trong S3
}
export interface InstructorProfile {
  bio: string;
  headline: string;
  biography: string;
  linkedin: string;
  github: string;
  facebook: string;
  youtube: string;
  personal_website: string;
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const res = await axiosAuth.get(`/users/me/profile`);
  return res.data.data;
};

export const updateUserInfo = async (
  userInfo: Partial<UserInfo>
): Promise<UserInfo> => {
  const res = await axiosAuth.patch(`/users/me/profile`, userInfo);
  return res.data.data;
};

export async function getInstructorProfile(): Promise<InstructorProfile> {
  const res = await axiosAuth.get("/instructor/profile/me");
  return res.data.data; // tuỳ backend trả
}

export async function updateInstructorProfile(
  profile: InstructorProfile
): Promise<InstructorProfile> {
  const res = await axiosAuth.patch("/instructor/profile/me/update", profile);
  return res.data.data;
}

// Get instructor profile by ID (public view)
export interface InstructorProfileResponse {
  bio: string | null;
  headline: string | null;
  biography: string | null;
  linkedin: string | null;
  github: string | null;
  facebook: string | null;
  youtube: string | null;
  personal_website: string | null;
  user_info: {
    user_id: string;
    name: string;
    avatar: string | null;
  };
}

export async function getInstructorProfileById(
  userId: string
): Promise<InstructorProfileResponse> {
  const res = await axiosAuth.get(`/instructor/profile/${userId}`);
  return res.data.data;
}

// Bank Account APIs
export interface BankItem {
  bank_account_id: string;
  bank_name: string;
  account_number_masked: string;
  account_holder_name: string;
  expired_at?: string; // ISO timestamp, only for pending
}

export interface BankAccountResponse {
  active_bank: BankItem | null; // Currently active bank account
  pending_bank: BankItem | null; // Pending verification, can be null
}

export interface BankAccountRequest {
  bank_name: string;
  account_number: string;
  account_holder_name: string;
}

export const getMyBankAccount = async (): Promise<BankAccountResponse> => {
  const res = await axiosAuth.get("/user/bank-accounts");
  return res.data.data;
};

export const createBankAccount = async (
  request: BankAccountRequest
): Promise<BankAccountResponse> => {
  const res = await axiosAuth.post("/user/bank-accounts", request);
  return res.data.data;
};

export const updateBankAccount = async (
  request: BankAccountRequest
): Promise<BankAccountResponse> => {
  const res = await axiosAuth.patch("/user/bank-accounts", request);
  return res.data.data;
};

export const confirmBankAccount = async (token: string): Promise<void> => {
  await axiosAuth.patch("/user/bank-accounts/confirm", null, {
    params: { token },
  });
};

// Get my revenue as instructor
export interface MyRevenueRequest {
  start_date?: number; // Unix timestamp in milliseconds
  end_date?: number; // Unix timestamp in milliseconds
}

export interface MyRevenueResponse {
  total_courses: number;
  total_revenue: number;
  commission_percentage: number;
  net_earnings: number;
}

export const getMyRevenue = async (
  body?: MyRevenueRequest
): Promise<MyRevenueResponse> => {
  const res = await axiosAuth.post("/instructors/me/revenue", body);
  return res.data.data;
};

// Get courses revenue by instructor
export interface InstructorCourseRevenueResponse {
  course_id: string;
  title: string;
  price: number;
  total_sales: number;
  gross_revenue: number;
  net_earnings: number;
}

export const getMyCourseRevenue = async (
  body?: MyRevenueRequest
): Promise<InstructorCourseRevenueResponse[]> => {
  const res = await axiosAuth.post("/instructors/me/courses/revenue", body);
  return res.data.data;
};

// Get course transactions
export interface CourseTransactionResponse {
  order_id: string;
  student_email: string;
  gross_amount: number;
  net_amount: number;
  created_at: string; // ISO timestamp
}

export const getCourseTransactions = async (
  courseId: string,
  startDate?: string,
  endDate?: string
): Promise<CourseTransactionResponse[]> => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const res = await axiosAuth.get(`/courses/${courseId}/transactions`, {
    params,
  });
  return res.data.data;
};
