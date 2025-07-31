import api from "./api";

export interface OrderDetail {
  DesignNo: string;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
}

export interface Order {
  id?: string;
  OrderNo: string;
  CustomerName: string;
  Address: string;
  PhoneNo: string;
  Agent: string;
  Transport: string;
  PaymentTerms: string;
  Remark: string;
  OrderDetails: OrderDetail[];
  totalAmount: number;
  Date?: string;
}

export interface CreateOrderRequest {
  OrderNo: string;
  CustomerName: string;
  Address: string;
  PhoneNo: string;
  Agent: string;
  Transport: string;
  PaymentTerms: string;
  Remark: string;
  OrderDetails: OrderDetail[];
  totalAmount: number;
}

export interface UpdateOrderRequest extends CreateOrderRequest {
  id: string;
}

export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  // Search orders
  searchOrders: async (query: string, phone?: string) => {
    const params = new URLSearchParams({ q: query });
    if (phone) params.append("phone", phone);
    const response = await api.get(`/orders/search?${params}`);
    return response.data;
  },

  // Get orders by date range
  getOrdersByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get(
      `/orders/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Get order by order number
  getOrderByOrderNo: async (orderNo: string) => {
    const response = await api.get(`/orders/order/${orderNo}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (order: CreateOrderRequest) => {
    const response = await api.post("/orders", order);
    return response.data;
  },

  // Update order
  updateOrder: async (order: UpdateOrderRequest) => {
    const response = await api.put(`/orders/${order.id}`, order);
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: string) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};
