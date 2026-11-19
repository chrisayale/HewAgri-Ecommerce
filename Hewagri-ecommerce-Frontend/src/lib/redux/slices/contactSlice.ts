import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/constants";

interface ContactState {
  loading: boolean;
  status: number | null;
  error: null | string | any;
}

const initialState: ContactState = {
  loading: false,
  status: null,
  error: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { setStatus } = contactSlice.actions;
export default contactSlice.reducer;
