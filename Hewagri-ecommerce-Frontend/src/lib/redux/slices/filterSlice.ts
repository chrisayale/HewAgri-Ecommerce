import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  search: string;
  priceRange: [number | null, number | null];
  categoryIds: number[];
  cooperativeIds: number[];
}

const initialState: FilterState = {
  search: "",
  priceRange: [null, null],
  categoryIds: [],
  cooperativeIds: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setPriceRange(
      state,
      action: PayloadAction<[number | null, number | null]>
    ) {
      state.priceRange = action.payload;
    },
    setCategoryIds(state, action: PayloadAction<number[]>) {
      state.categoryIds = action.payload;
    },
    setCooperativeIds(state, action: PayloadAction<number[]>) {
      state.cooperativeIds = action.payload;
    },
    addCategoryId(state, action: PayloadAction<number>) {
      if (!state.categoryIds.includes(action.payload)) {
        state.categoryIds.push(action.payload);
      }
    },
    removeCategoryId(state, action: PayloadAction<number>) {
      state.categoryIds = state.categoryIds.filter(
        (id) => id !== action.payload
      );
    },
    addCooperativeId(state, action: PayloadAction<number>) {
      if (!state.cooperativeIds.includes(action.payload)) {
        state.cooperativeIds.push(action.payload);
      }
    },
    removeCooperativeId(state, action: PayloadAction<number>) {
      state.cooperativeIds = state.cooperativeIds.filter(
        (id) => id !== action.payload
      );
    },

    clearFilters(state) {
      state.search = "";
      state.priceRange = [null, null];
      state.categoryIds = [];
      state.cooperativeIds = [];
    },
  },
});

// Export actions to be used in components
export const {
  setSearch,
  setPriceRange,
  setCategoryIds,
  setCooperativeIds,
  addCategoryId,
  removeCategoryId,
  addCooperativeId,
  removeCooperativeId,
  clearFilters,
} = filterSlice.actions;

// Export the reducer to be used in the store
export default filterSlice.reducer;
