import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | any;
};

type CartState = {
  items: { [id: string]: CartItem };
  totalQuantity: number;
  totalPrice: number;
};

// Utility function to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Load cart from localStorage if available
const loadCartFromLocalStorage = (): CartState => {
  if (isLocalStorageAvailable()) {
    const storedCart = localStorage.getItem("cart");
    return storedCart
      ? JSON.parse(storedCart)
      : {
          items: {},
          totalQuantity: 0,
          totalPrice: 0,
        };
  }

  return {
    items: {},
    totalQuantity: 0,
    totalPrice: 0,
  };
};

// Save cart to localStorage if available
const saveCartToLocalStorage = (state: CartState) => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem("cart", JSON.stringify(state));
  }
};

const initialState: CartState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItem = state.items[newItem.id];

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items[newItem.id] = {
          ...newItem,
          quantity: 1,
        };
      }

      state.totalQuantity += 1;
      state.totalPrice += newItem.price;

      saveCartToLocalStorage(state);
    },

    addItemWithQuantity(
      state,
      action: PayloadAction<{ item: CartItem; quantity: number }>
    ) {
      const { item, quantity } = action.payload;
      const existingItem = state.items[item.id];

      if (existingItem) {
        // Update existing item
        const previousQuantity = existingItem.quantity;
        const previousPrice = existingItem.price * previousQuantity;

        // Update quantity and price
        existingItem.quantity = quantity;
        const newPrice = item.price * quantity;

        state.totalQuantity = state.totalQuantity - previousQuantity + quantity;
        state.totalPrice = state.totalPrice - previousPrice + newPrice;
      } else {
        // Add new item
        state.items[item.id] = {
          ...item,
          quantity,
        };
        state.totalQuantity += quantity;
        state.totalPrice += item.price * quantity;
      }

      saveCartToLocalStorage(state);
    },

    removeItemFromCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.items[id];

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;

        delete state.items[id];

        saveCartToLocalStorage(state);
      }
    },

    increaseQuantity(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.items[id];

      if (existingItem) {
        existingItem.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += existingItem.price;

        saveCartToLocalStorage(state);
      }
    },

    decreaseQuantity(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.items[id];

      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= existingItem.price;

        saveCartToLocalStorage(state);
      } else if (existingItem && existingItem.quantity === 1) {
        state.totalQuantity -= 1;
        state.totalPrice -= existingItem.price;

        delete state.items[id];
      }

      saveCartToLocalStorage(state);
    },

    clearCart(state) {
      state.items = {};
      state.totalQuantity = 0;
      state.totalPrice = 0;

      saveCartToLocalStorage(state);
    },
  },
});

export const {
  addItemToCart,
  addItemWithQuantity,
  removeItemFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
