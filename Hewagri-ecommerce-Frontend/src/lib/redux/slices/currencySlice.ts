import { baseUrl } from "@/constants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Currency {
  currency: string;
  rate: number;
}

// Helper function to load currency from localStorage
const loadCurrencyFromStorage = (): string => {
  const savedCurrencyState = localStorage.getItem("currencyState");
  if (savedCurrencyState) {
    const { currency } = JSON.parse(savedCurrencyState);
    return currency;
  }
  return "CDF";
};

const initialState: Currency = {
  currency: "CDF",
  rate: 1,
};

export const fetchRate = createAsyncThunk("currency/fetchRate", async () => {
  const response = await axios.get(`${baseUrl}/api/configurations/get`);

  return response.data.data.taux_change;
});

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
      localStorage.setItem(
        "currencyState",
        JSON.stringify({ currency: state.currency })
      );
    },

    setRate: (state, action: PayloadAction<number>) => {
      state.rate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchRate.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.rate = action.payload;
      }
    );
  },
});

export const { setCurrency, setRate } = currencySlice.actions;

export default currencySlice.reducer;
