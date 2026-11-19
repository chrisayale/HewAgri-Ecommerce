import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import currencyReducer from "./slices/currencySlice";
import productsReducer from "./slices/productsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import cooperativesReducer from "./slices/cooperativesSlice";
import provincesReducer from "./slices/provincesSlice";
import cartReducer from "./slices/cartSlice";
import filterReducer from "./slices/filterSlice";
import authReducer from "./slices/authSlice";
import territoiresReducer from "./slices/territoireSlice";
import villagesReducer from "./slices/villagesSlice";
import livraisonsReducer from "./slices/livraisonsSlice";
import orderReducer from "./slices/orderSlice";
import contactReducer from "./slices/contactSlice";
import carouselsReducer from "./slices/carouselSlice";

const persistCarouselsConfig = {
  key: "carousels",
  storage,
};
const persitCarouselsReducer = persistReducer(
  persistCarouselsConfig,
  carouselsReducer
);

export const store = configureStore({
  reducer: {
    carousels: persitCarouselsReducer,
    auth: authReducer,
    currency: currencyReducer,
    filter: filterReducer,
    products: productsReducer,
    categories: categoriesReducer,
    cooperatives: cooperativesReducer,
    provinces: provincesReducer,
    territoires: territoiresReducer,
    villages: villagesReducer,
    cart: cartReducer,
    livraisons: livraisonsReducer,
    order: orderReducer,
    contact: contactReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
