import { baseUrl } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  villages: {},
  loading: false,
  error: null,
};

export const fetchVillages = createAsyncThunk(
  "villages/fetchVillages",
  async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/villages/list`);
      return response.data;
    } catch (error: any) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

const villagesSlice = createSlice({
  name: "villages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVillages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVillages.fulfilled, (state, action) => {
        state.loading = false;
        state.villages = action.payload;
      })
      .addCase(fetchVillages.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default villagesSlice.reducer;
