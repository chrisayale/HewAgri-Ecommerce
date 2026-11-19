import { baseUrl } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  carousels: {},
  loading: true,
  error: null,
};

export const fetchCarousels = createAsyncThunk(
  "carousels/fetchCarousels",
  async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/services/carousels`);
      return response.data;
    } catch (error: any) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

const carouselsSlice = createSlice({
  name: "carousels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarousels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarousels.fulfilled, (state, action) => {
        state.loading = false;
        state.carousels = action.payload;
      })
      .addCase(fetchCarousels.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default carouselsSlice.reducer;
