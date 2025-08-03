import { z } from "zod";

// Product Schema
export const productSchema = z.object({
  DesignNo: z.string().min(1, "Design number is required"),
  TypeOfGarment: z.string().min(1, "Garment type is required"),
  ColorOfGarment: z.string().min(1, "Garment color is required"),
  BlouseColor: z.string().min(1, "Blouse color is required"),
  DupptaColor: z.string().min(1, "Dupatta color is required"),
  Rate: z.number().min(0, "Rate must be a positive number"),
  FixCode: z.string().optional(),
});

// Order Detail Schema
export const orderDetailSchema = z.object({
  DesignNo: z.string().min(1, "Design number is required"),
  Quantity: z.number().min(1, "Quantity must be at least 1"),
  UnitPrice: z.number().min(0, "Unit price must be a positive number"),
  TotalPrice: z.number().min(0, "Total price must be a positive number"),
});

// Order Schema
export const orderSchema = z.object({
  OrderNo: z.string().min(1, "Order number is required"),
  Date: z.date(),
  CustomerName: z.string().min(1, "Customer name is required"),
  PhoneNo: z.string().min(1, "Phone number is required"),
  Address: z.string().min(1, "Address is required"),
  Agent: z.string().min(1, "Agent is required"),
  Transport: z.string().optional(),
  PaymentTerms: z.string().optional(),
  Remark: z.string().optional(),
  OrderDetails: z
    .array(orderDetailSchema)
    .min(1, "At least one order detail is required"),
  totalAmount: z.number().min(0, "Total amount must be a positive number"),
});

// Type exports
export type ProductFormData = z.infer<typeof productSchema>;
export type OrderDetailFormData = z.infer<typeof orderDetailSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
