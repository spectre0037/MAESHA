import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

// Fetch user's wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/wishlist");
    return res.data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to fetch wishlist");
  }
});

// Toggle (Add/Remove) wishlist item
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const res = await API.post("/wishlist/toggle", { productId });
      
      // Get the full product details from the current products list in state if it's being added
      // This saves a second API call
      const allProducts = getState().products?.items || [];
      const productDetails = allProducts.find(p => p.id === productId);

      return { 
        productId, 
        isWishlisted: res.data.isWishlisted, 
        product: productDetails // Pass the product info to the reducer
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to toggle wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    // Optional: Clear wishlist on logout
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      /* Fetch Wishlist */
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Toggle Wishlist */
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, isWishlisted, product } = action.payload;

        if (isWishlisted) {
          // Add item if it's not already there
          const exists = state.items.find(item => item.id === productId);
          if (!exists && product) {
            state.items.push(product);
          }
        } else {
          // Remove item
          state.items = state.items.filter(item => item.id !== productId);
        }
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;