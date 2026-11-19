import { baseUrl } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cooperatives: {},
  loading: false,
  error: null,
};

export const fetchCooperatives = createAsyncThunk(
  "cooperatives/fetchCooperatives",
  async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/cooperatives/list`);
      return response.data;
    } catch (error: any) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

const cooperativesSlice = createSlice({
  name: "cooperatives",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCooperatives.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCooperatives.fulfilled, (state, action) => {
        state.loading = false;
        state.cooperatives = action.payload;
      })
      .addCase(fetchCooperatives.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cooperativesSlice.reducer;
