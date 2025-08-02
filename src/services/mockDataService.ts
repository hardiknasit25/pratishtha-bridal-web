import type { IOrder } from "../types";

export const mockDataService = {
  // Load orders from JSON file
  loadOrders: async (): Promise<IOrder[]> => {
    try {
      // Import the JSON data dynamically
      const orderData = await import("../../OrderData.json");

      // Convert string dates to Date objects and add _id
      const ordersWithDates = orderData.default.map((order: any) => ({
        ...order,
        _id: order.OrderNo, // Use OrderNo as _id for now
        Date: new Date(order.Date),
      }));

      return ordersWithDates;
    } catch (error) {
      console.error("Error loading mock data:", error);
      throw new Error("Failed to load mock data");
    }
  },

  // Simulate API delay
  simulateDelay: (ms: number = 500): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
