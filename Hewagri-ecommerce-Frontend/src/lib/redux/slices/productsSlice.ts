import { MARKETPLACE_URL } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductsType {
  products: any;
  loading: boolean;
  error: null | string | any;
}

const initialState: ProductsType = {
  products: {},
  loading: true,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const response = await axios.get(
        `${MARKETPLACE_URL}?page_size=100&page_number=1`
      );
      return response.data;
    } catch (error: any) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string) => {
    try {
      const response = await axios.get(
        `${MARKETPLACE_URL}/product/${productId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //single products
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state: any, action) => {
        state.loading = false;
        const product = action.payload;
        state.products[product.id] = product;
      })
      .addCase(fetchProductById.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
