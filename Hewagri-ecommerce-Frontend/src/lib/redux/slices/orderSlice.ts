import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/constants";
import { WindowIcon } from "@heroicons/react/24/solid";
import { OrdersPage } from "@/pagesComponents";

interface OrderState {
  order: any;
  status: string;
  loading: boolean;
  error: string | null;
  orders: any;
}

// Define the initial state
const initialState: OrderState = {
  order: null,
  status: "idle",
  loading: false,
  error: null,
  orders: {},
};

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// Define the async thunk for creating an order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/marketplace/command`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-ecommerce-kgreen-api": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

// list all orders
export const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/commandes/list/byowner/`, {
      headers: {
        "Content-Type": "application/json",
        "x-ecommerce-kgreen-api": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw Error(error.response?.data?.error || error.message);
  }
});

// fetch single order
export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async (transactionId: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/commandes/list/bytransaction/${transactionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-ecommerce-kgreen-api": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

// Retry order payment
export const retryOrder = createAsyncThunk(
  "order/retryOrder",
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/marketplace/command/retry`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-ecommerce-kgreen-api": `Bearer ${token}`,
          },
        }
      );

      console.log(orderData);

      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

// Create the slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state: any, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state: any, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
        state.orders = {};
      })
      // Fetch single order
      .addCase(fetchOrder.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state: any, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
        state.order = null;
      })
      // retry order payment
      .addCase(retryOrder.pending, (state) => {
        state.status = "loading";
        // state.loading = true;
        state.error = null;
      })
      .addCase(retryOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(retryOrder.rejected, (state: any, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
        OrdersPage;
      });
  },
});

export const { resetStatus } = orderSlice.actions;
// Export actions and reducer
export default orderSlice.reducer;
