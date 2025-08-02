import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CreateIOrder, IOrder } from "../types";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/apiEndpoints";

// Async thunks for API operations

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (order: CreateIOrder, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_ORDER, order);
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create order";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (order: IOrder, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.UPDATE_ORDER.replace(":id", order._id),
        order
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update order";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (_id: string, { rejectWithValue }) => {
    console.log("Deleting order:", _id);
    try {
      await api.delete(API_ENDPOINTS.DELETE_ORDER.replace(":id", _id));
      return _id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete order";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch orders from API
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ORDERS);
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      return rejectWithValue(errorMessage);
    }
  }
);

// Add search orders async thunk
export const searchOrders = createAsyncThunk(
  "orders/searchOrders",
  async (query: string, { rejectWithValue }) => {
    try {
      console.log("Redux: Starting searchOrders API call with query:", query);
      const params = new URLSearchParams({ query });
      const response = await api.get(
        `${API_ENDPOINTS.SEARCH_ORDERS}?${params}`
      );
      console.log("Redux: Search API call successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Redux: Search API call failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to search orders";
      return rejectWithValue(errorMessage);
    }
  }
);

interface OrderState {
  orders: IOrder[];
  searchResults: IOrder[];
  loading: boolean;
  error: string | null;
  selectedOrder: IOrder | null;
  isSearching: boolean;
}

const initialState: OrderState = {
  orders: [],
  searchResults: [],
  loading: false,
  error: null,
  selectedOrder: null,
  isSearching: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<IOrder | null>) => {
      state.selectedOrder = action.payload;
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
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update order
    builder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (o) => o.OrderNo === action.payload.OrderNo
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete order
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((o) => o.OrderNo !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;

        // Transform dates from strings to Date objects if needed
        const transformedOrders = action.payload?.map((order: IOrder) => ({
          ...order,
          Date:
            typeof order.Date === "string" ? new Date(order.Date) : order.Date,
        }));

        state.orders = transformedOrders || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search orders
      .addCase(searchOrders.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.isSearching = false;
        // Transform dates from strings to Date objects if needed
        const transformedOrders = action.payload?.map((order: IOrder) => ({
          ...order,
          Date:
            typeof order.Date === "string" ? new Date(order.Date) : order.Date,
        }));
        state.searchResults = transformedOrders || [];
      })
      .addCase(searchOrders.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedOrder, clearError, setLoading, setError } =
  orderSlice.actions;

export default orderSlice.reducer;
