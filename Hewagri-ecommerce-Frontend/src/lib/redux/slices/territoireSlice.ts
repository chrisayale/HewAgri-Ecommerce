import { baseUrl } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  territoires: {},
  loading: false,
  error: null,
};

export const fetchTerritoires = createAsyncThunk(
  "territoires/fetchTerritoires",
  async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/territoires/list`);
      return response.data;
    } catch (error: any) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

const territoiresSlice = createSlice({
  name: "territoires",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerritoires.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTerritoires.fulfilled, (state, action) => {
        state.loading = false;
        state.territoires = action.payload;
      })
      .addCase(fetchTerritoires.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default territoiresSlice.reducer;
