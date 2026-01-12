import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

/**
 * Helper: Load cart from localStorage safely
 */
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("maesha_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (err) {
    return [];
  }
};

/**
 * Helper: Save cart to localStorage
 */
const saveCartToStorage = (items) => {
  localStorage.setItem("maesha_cart", JSON.stringify(items));
};

export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      const res = await API.post("/orders", orderData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(clearCart()); 
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order failed");
    }
  }
);

const initialState = {
  items: loadCartFromStorage(), // Load data immediately on startup
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (!Array.isArray(state.items)) state.items = [];

      const itemExists = state.items.find((i) => i.id === action.payload.id);
      
      if (itemExists) {
        itemExists.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        });
      }
      saveCartToStorage(state.items); // PERSIST AFTER ADD
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCartToStorage(state.items); // PERSIST AFTER REMOVE
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      saveCartToStorage(state.items); // PERSIST AFTER UPDATE
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("maesha_cart"); // CLEAR STORAGE
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
        state.items = []; 
        localStorage.removeItem("maesha_cart");
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// --- Selectors ---
export const selectCartItems = (state) => state.cart?.items || [];

export const selectCartCount = (state) => {
  const items = state.cart?.items || [];
  return items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
};

export const selectCartTotal = (state) => {
  const items = state.cart?.items || [];
  return items.reduce((total, item) => {
    const hasDiscount = item.discount_price && Number(item.discount_price) > 0;
    const finalPrice = hasDiscount ? Number(item.discount_price) : Number(item.price);
    const qty = Number(item.quantity) || 0;
    return total + (finalPrice * qty);
  }, 0);
};

export default cartSlice.reducer;