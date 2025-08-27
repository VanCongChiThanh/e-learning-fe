import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, getCurrentUserAPI, LoginRequest } from "./authAPI";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: null,
  loading: false,
  error: null,
};

// login async action
export const login = createAsyncThunk(
  "auth/login",
  async (body: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await loginAPI(body);
      return res.data; // API trả về { access_token, ... }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// fetch current user
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCurrentUserAPI();
      return res.data; // API của bạn trả về { status, data: { user } }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Fetch user failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetch user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
