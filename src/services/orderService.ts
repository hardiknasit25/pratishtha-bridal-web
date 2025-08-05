import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

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

/**
 * Download order PDF
 */
export const downloadOrderPDF = async (
  orderId: string,
  orderNo: string,
  customerName: string
): Promise<void> => {
  try {
    console.log("Downloading PDF for order:", orderId);

    const response = await api.get(
      API_ENDPOINTS.GENERATE_ORDER_PDF.replace(":id", orderId),
      {
        responseType: "blob",
      }
    );

    // Create blob URL
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;

    // Set filename: OrderNo_CustomerName.pdf
    const filename = `${orderNo}_${customerName}.pdf`;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("PDF downloaded successfully:", filename);
  } catch (error: unknown) {
    console.error("Failed to download PDF:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (apiError.response?.status === 404) {
        throw new Error("Order not found");
      } else {
        throw new Error(
          apiError.response?.data?.message ||
            "Failed to download PDF. Please try again."
        );
      }
    } else if (error && typeof error === "object" && "message" in error) {
      const networkError = error as { message: string };
      if (networkError.message === "Network Error") {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw new Error("Failed to download PDF. Please try again.");
      }
    } else {
      throw new Error("Failed to download PDF. Please try again.");
    }
  }
};
