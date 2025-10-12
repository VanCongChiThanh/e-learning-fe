export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | ApiError | null;
}

export interface ApiError {
  code?: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  password_confirmation: string;
  role: string;
}