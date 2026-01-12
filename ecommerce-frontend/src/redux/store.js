import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReucer from './slices/wishlistSlice'
/**
 * Efficiency: Preloaded State
 * We check localStorage to see if the user has a saved session or cart.
 * This prevents "flickering" where the UI shows 'Logged Out' for a split second on refresh.
 */
const preloadedState = {
  auth: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  cart: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    cart: cartReducer,
    wishlist :wishlistReucer,
  },
  preloadedState, // Injecting the saved data back into Redux on startup
  // DevTools is enabled by default in development mode
});

/**
 * Creative Touch: State Subscriber
 * Every time the cart changes, we automatically sync it to localStorage.
 */
store.subscribe(() => {
  localStorage.setItem("cartItems", JSON.stringify(store.getState().cart.cartItems));
});

export default store;