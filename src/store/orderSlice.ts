import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IOrder } from "../types";
import api from "../services/api";

// Async thunks for API calls using axios
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (order: IOrder, { rejectWithValue }) => {
    try {
      const response = await api.post("/orders", order);
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
      const response = await api.put(`/orders/${order.OrderNo}`, order);
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
  async (orderNo: string, { rejectWithValue }) => {
    try {
      await api.delete(`/orders/${orderNo}`);
      return orderNo;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete order";
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
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      });
  },
});

export const { setSelectedOrder, clearError, setLoading, setError } =
  orderSlice.actions;

export default orderSlice.reducer;
