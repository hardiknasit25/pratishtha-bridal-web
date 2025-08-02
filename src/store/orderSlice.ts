import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IOrder } from "../types";
import { mockDataService } from "../services/mockDataService";

// Async thunks for mock data operations

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (order: IOrder, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await mockDataService.simulateDelay();

      // For mock data, we'll just return the order with a generated ID
      const newOrder = {
        ...order,
        _id: `order_${Date.now()}`,
        OrderNo: order.OrderNo || `ORD${Date.now()}`,
      };

      return newOrder;
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
      // Simulate API delay
      await mockDataService.simulateDelay();

      // For mock data, we'll just return the updated order
      return order;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update order";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderNo: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await mockDataService.simulateDelay();

      // For mock data, we'll just return the order number to delete
      return orderNo;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete order";
      return rejectWithValue(errorMessage);
    }
  }
);

// Initialize with mock data (for development)
export const initializeWithMockData = createAsyncThunk(
  "orders/initializeWithMockData",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await mockDataService.simulateDelay();

      // Load orders from mock data service
      const orders = await mockDataService.loadOrders();

      return orders;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load mock data";
      return rejectWithValue(errorMessage);
    }
  }
);

interface OrderState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
  selectedOrder: IOrder | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null,
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
      })
      // Update order
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
      })
      // Delete order
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
      })
      // Initialize with mock data
      .addCase(initializeWithMockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeWithMockData.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(initializeWithMockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedOrder, clearError, setLoading, setError } =
  orderSlice.actions;

export default orderSlice.reducer;
