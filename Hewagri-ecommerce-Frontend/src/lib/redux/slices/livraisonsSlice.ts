import { baseUrl } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  livraisons: {},
  loading: true,
  error: null,
};

export const fetchLivraisons = createAsyncThunk(
  "livraisons/fetchLivraisons",
  async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/typeslivraisons/list`);
      return response.data;
    } catch (error: any) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

const livraisonsSlice = createSlice({
  name: "livraisons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLivraisons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLivraisons.fulfilled, (state, action) => {
        state.loading = false;
        state.livraisons = action.payload;
      })
      .addCase(fetchLivraisons.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default livraisonsSlice.reducer;
