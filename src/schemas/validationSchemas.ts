import { z } from "zod";

// Product Schema
export const productSchema = z.object({
  designNo: z.string().min(1, "Design number is required"),
  typeOfGarment: z.string().min(1, "Type of garment is required"),
  rate: z.number().min(0, "Rate must be a positive number"),
  inStock: z.boolean(),
  description: z.string().optional(),
  category: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Order Schema
export const orderSchema = z.object({
  orderNo: z.string().min(1, "Order number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerEmail: z
    .string()
    .email("Valid email is required")
    .optional()
    .or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  total: z.number().min(0, "Total must be a positive number"),
  agent: z.string().min(1, "Agent is required"),
  transport: z.string().min(1, "Transport is required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
  deliveryDate: z.string().optional(),
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

// Order Detail Schema
export const orderDetailSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be a positive number"),
  amount: z.number().min(0, "Amount must be a positive number"),
});

export type OrderDetailFormData = z.infer<typeof orderDetailSchema>;
