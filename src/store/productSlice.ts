import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AddProduct, ProductDetails } from "../types";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/apiEndpoints";

// Async thunks for API calls using axios
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Redux: Starting fetchProducts API call...");
      const response = await api.get(API_ENDPOINTS.GET_PRODUCTS);
      console.log("Redux: API call successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Redux: API call failed:", error);
      console.error("Redux: Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        name: error instanceof Error ? error.name : "Unknown",
        status: (
          error as {
            response?: { status?: number; statusText?: string; data?: unknown };
          }
        )?.response?.status,
        statusText: (
          error as {
            response?: { status?: number; statusText?: string; data?: unknown };
          }
        )?.response?.statusText,
        data: (
          error as {
            response?: { status?: number; statusText?: string; data?: unknown };
          }
        )?.response?.data,
      });
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch products";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: AddProduct, { rejectWithValue }) => {
    try {
      console.log("Creating product:", product);
      const response = await api.post(API_ENDPOINTS.CREATE_PRODUCT, product);
      console.log("Create product response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create product error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product: ProductDetails, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.UPDATE_PRODUCT.replace(":id", product._id),
        product
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(API_ENDPOINTS.DELETE_PRODUCT.replace(":id", id));
      return id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      return rejectWithValue(errorMessage);
    }
  }
);

interface ProductState {
  products: ProductDetails[];
  loading: boolean;
  error: string | null;
  selectedProduct: ProductDetails | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (
      state,
      action: PayloadAction<ProductDetails | null>
    ) => {
      state.selectedProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Redux: createProduct.fulfilled - payload:", action.payload);
        // Ensure the response data is properly structured
        if (action.payload && typeof action.payload === "object") {
          const newProduct = action.payload as ProductDetails;
          console.log("Redux: Adding new product to state:", newProduct);
          state.products.push(newProduct);
          console.log("Redux: Products array after adding:", state.products);
        } else {
          console.error("Redux: Invalid payload received:", action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        console.error("Redux: createProduct.rejected - error:", action.payload);
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedProduct, clearError, setLoading, setError } =
  productSlice.actions;

export default productSlice.reducer;
