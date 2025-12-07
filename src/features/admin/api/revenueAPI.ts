import axiosAuth from "../../../api/axiosAuth";

export interface InstructorInfo {
  user_id: string;
  name: string;
  avatar?: string;
}

export interface InstructorRevenue {
  instructor: InstructorInfo;
  total_courses: number;
  total_revenue: number;
  commission_percentage: number;
  net_earnings: number;
}

export interface BankItem {
  bank_account_id: string;
  bank_name: string;
  account_number_masked: string;
  account_holder_name: string;
  expired_at?: number;
}

export interface BankAccountResponse {
  active_bank?: BankItem;
  pending_bank?: BankItem;
}

export interface InstructorRevenueRequest {
  start_date?: number; // Unix timestamp in milliseconds (Instant)
  end_date?: number; // Unix timestamp in milliseconds (Instant)
}

// Get all instructors revenue
export const getAllInstructorsRevenue = async (
  body?: InstructorRevenueRequest
): Promise<InstructorRevenue[]> => {
  const response = await axiosAuth.post("/instructors/revenues", body);
  return response.data.data;
};

// Get user bank account by admin
export const getUserBankAccountByAdmin = async (
  userId: string
): Promise<BankAccountResponse> => {
  const response = await axiosAuth.get(`/user/${userId}/bank-accounts`);
  return response.data.data;
};
