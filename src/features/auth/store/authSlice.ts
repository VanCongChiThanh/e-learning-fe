import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginRequest } from "../types/authType";
import {
  loginAdminAPI,
  loginAPI,
  getCurrentUserAPI,
  logoutAPI,
  oauth2LoginAPI,
} from "../api/authAPI";
import { AuthState } from "../types/authType";

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: null,
  loading: false,
  error: null,
  isInitialized: false, // Not initialized yet
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
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (body: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await loginAdminAPI(body);
      return res.data; // { access_token, ... }
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.response?.data || "Login admin failed");
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

// logout async action
export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await logoutAPI(); // gọi POST /oauth/revoke
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);
// OAuth2 login async action
export const oauth2Login = createAsyncThunk(
  "auth/oauth2Login",
  async (
    { provider, code }: { provider: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await oauth2LoginAPI(provider, code);
      return res.data; // { access_token, ... }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "OAuth2 login failed");
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
      state.isInitialized = true;
      localStorage.removeItem("token");
    },
    setInitialized: (state) => {
      state.isInitialized = true;
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
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "error" in action.payload
        ) {
          state.error = {
            code: (action.payload as any).error.code,
            message: (action.payload as any).error.message,
          };
        } else {
          state.error = {
            message: (action.payload as string) || "Login failed",
          };
        }
      })
      // fetch user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isInitialized = true;
      })
      // logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isInitialized = true;
        localStorage.removeItem("token");
      })
      // login admin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "error" in action.payload
        ) {
          state.error = (action.payload as any).error.message;
        } else {
          state.error = (action.payload as string) || "Login admin failed";
        }
      })
      // OAuth2 login
      .addCase(oauth2Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(oauth2Login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(oauth2Login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.error?.message ||
          (action.payload as string) ||
          "OAuth2 login failed";
      });
  },
});

export const { logout, setInitialized } = authSlice.actions;
export default authSlice.reducer;
