import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/constants";

interface AuthState {
  user: any[] | null;
  token: string | null;
  tokenExpiration: number | null;
  loading: boolean;
  status: number | null;
  message: string | null;
  data: any | null;
  error: null | string | any;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  tokenExpiration: null,
  loading: false,
  status: null,
  message: null,
  data: null,
  error: null,
  isAuthenticated: false,
};

const lsToken =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/users/user/signup`,
        formData
      );

      const { status, message, data } = response.data;
      if (status !== 200) {
        return rejectWithValue({ status, message, data });
      }

      const { token, expires_in, user } = data;
      const expirationTime = Date.now() + expires_in * 1000;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common[
        "x-ecommerce-kgreen-api"
      ] = `Bearer ${token}`;

      return { status, message, user, token, tokenExpiration: expirationTime };
    } catch (error: any) {
      const errorResponse = error.response?.data || {
        status: 500,
        message: error.message,
        data: null,
      };
      return rejectWithValue(errorResponse);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { phone: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/users/user/signin`,
        credentials
      );

      const { status, message, data } = response.data;
      if (status !== 200) {
        return rejectWithValue({ status, message, data });
      }

      const { token, expires_in, user } = data;
      const expirationTime = Date.now() + expires_in * 1000;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common[
        "x-ecommerce-kgreen-api"
      ] = `Bearer ${token}`;

      return { status, message, user, token, tokenExpiration: expirationTime };
    } catch (error: any) {
      const errorResponse = error.response?.data || {
        status: 500,
        message: error.message,
        data: null,
      };
      return rejectWithValue(errorResponse);
    }
  }
);

// Verify User

export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (
    verificationData: { id_user: string; verification_code: number | string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${baseUrl}/api/users/user/verify`,
        verificationData
      );

      const { status, message, data } = response.data;
      if (status !== 200) {
        return rejectWithValue({ status, message, data });
      }

      // Assuming the verification returns token and user information
      const { token, expires_in, user } = data;
      const expirationTime = Date.now() + expires_in * 1000;

      // Set the default axios authorization header
      axios.defaults.headers.common[
        "x-ecommerce-kgreen-api"
      ] = `Bearer ${token}`;

      // Always return the status code along with other data
      return { status, message, user, token, tokenExpiration: expirationTime };
    } catch (error: any) {
      const errorResponse = error.response?.data || {
        status: 500, // Default to 500 if no response status is available
        message: error.message,
        data: null,
      };

      // Always return the status code in the rejected value
      return rejectWithValue({
        status: errorResponse.status,
        message: errorResponse.message,
        data: errorResponse.data,
      });
    }
  }
);

// Resend Verification Code
export const resendVerificationCode = createAsyncThunk(
  "auth/resendVerificationCode",
  async (userData: { id_user: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${baseUrl}/api/users/user/resendcode`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-ecommerce-kgreen-api": `Bearer ${lsToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorResponse = error.response?.data || {
        status: 500,
        message: error.message,
        data: null,
      };
      return rejectWithValue(errorResponse);
    }
  }
);

// Request Password Reset code
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (userData: { phone: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${baseUrl}/api/users/user/resetpassword`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-ecommerce-kgreen-api": `Bearer ${lsToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorResponse = error.response?.data || {
        status: 500,
        message: error.message,
        data: null,
      };
      return rejectWithValue(errorResponse);
    }
  }
);

// Reset password with code
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    userData: { phone: string; verification_code: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${baseUrl}/api/users/user/recoverypassword`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-ecommerce-kgreen-api": `Bearer ${lsToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorResponse = error.response?.data || {
        status: 500,
        message: error.message,
        data: null,
      };
      return rejectWithValue(errorResponse);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.tokenExpiration = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["x-ecommerce-kgreen-api"];
    },
    checkAuthStatus: (state) => {
      const token = localStorage.getItem("token");
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      const user = localStorage.getItem("user");

      if (token) {
        state.token = token;
        state.tokenExpiration = Number(tokenExpiration);
        state.user = user ? JSON.parse(user) : null;
        state.isAuthenticated = true;
        axios.defaults.headers.common[
          "x-ecommerce-kgreen-api"
        ] = `Bearer ${token}`;
      } else {
        state.token = null;
        state.tokenExpiration = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("user");
      }
    },
    resetAuthStatus: (state) => {
      state.status = null;
      state.message = null;
      state.error = null;
    },

    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: any) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tokenExpiration = action.payload.tokenExpiration;
        state.isAuthenticated = true;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.status = action.payload?.status || 500;
        state.message = action.payload?.message || "An error occurred";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: any) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tokenExpiration = action.payload.tokenExpiration;
        state.isAuthenticated = true;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.status = action.payload?.status || 500;
        state.message = action.payload?.message || "An error occurred";
      })

      // Verification
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Resend Verification Code
      .addCase(resendVerificationCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationCode.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(resendVerificationCode.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.status = action.payload?.status || 500;
        state.message = action.payload?.message || "An error occurred";
      })
      // Request Password Reset code
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(requestPasswordReset.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.status = action.payload?.status || 500;
        state.message = action.payload?.message || "An error occurred";
      })

      // Reset password with code
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.status = action.payload?.status || 500;
        state.message = action.payload?.message || "An error occurred";
      });
  },
});

export const { logout, checkAuthStatus, resetAuthStatus, setStatus } =
  authSlice.actions;
export default authSlice.reducer;
