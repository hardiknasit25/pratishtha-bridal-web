import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppSelector } from "../hooks/redux";
import type { IOrderDetails, ProductDetails } from "../types";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

// Enhanced Order schema with better validation
const orderSchema = z.object({
  Date: z.string().min(1, "Date is required"),
  CustomerName: z
    .string()
    .min(1, "Customer name is required")
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Customer name can only contain letters and spaces"
    ),
  Address: z
    .string()
    .min(1, "Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
  PhoneNo: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[0-9+\-\s()]+$/,
      "Phone number can only contain numbers, spaces, and symbols"
    )
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  Agent: z
    .string()
    .min(1, "Agent is required")
    .min(2, "Agent name must be at least 2 characters")
    .max(100, "Agent name must be less than 100 characters"),
  Transport: z
    .string()
    .min(1, "Transport is required")
    .min(2, "Transport must be at least 2 characters")
    .max(100, "Transport must be less than 100 characters"),
  PaymentTerms: z
    .string()
    .min(1, "Payment terms are required")
    .min(2, "Payment terms must be at least 2 characters")
    .max(200, "Payment terms must be less than 200 characters"),
  Remark: z
    .string()
    .max(1000, "Remark must be less than 1000 characters")
    .optional(),
  OrderDetails: z
    .array(
      z.object({
        DesignNo: z.string().min(1, "Design number is required"),
        Quantity: z
          .number()
          .min(1, "Quantity must be at least 1")
          .max(999, "Quantity cannot exceed 999"),
        UnitPrice: z
          .number()
          .min(0, "Unit price must be positive")
          .max(999999, "Unit price cannot exceed ₹999,999"),
        TotalPrice: z
          .number()
          .min(0, "Total price must be positive")
          .max(999999999, "Total price cannot exceed ₹999,999,999"),
      })
    )
    .min(1, "At least one order detail is required")
    .max(50, "Cannot add more than 50 items"),
  totalAmount: z
    .number()
    .min(0, "Total amount must be positive")
    .max(999999999, "Total amount cannot exceed ₹999,999,999"),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormDrawerProps {
  onSubmit?: (data: OrderFormData) => void;
  onClose?: () => void; // Callback when drawer closes
}

export const OrderFormDrawer = ({
  onSubmit,
  onClose,
}: OrderFormDrawerProps) => {
  const [orderDetails, setOrderDetails] = useState<IOrderDetails[]>([
    { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      Date: new Date().toISOString().split("T")[0], // Today's date as default
      CustomerName: "",
      Address: "",
      PhoneNo: "",
      Agent: "",
      Transport: "",
      PaymentTerms: "",
      Remark: "",
      OrderDetails: [
        { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
      ],
      totalAmount: 0,
    },
    mode: "onChange", // Enable real-time validation
  });

  // Get products from Redux store
  const { products } = useAppSelector((state) => state.products);

  // Get available products (excluding already selected ones)
  const getAvailableProducts = (currentIndex: number): ProductDetails[] => {
    // Add safety check for products
    if (!products || !Array.isArray(products)) {
      console.warn("Products is not available or not an array:", products);
      return [];
    }

    const selectedDesignNos = orderDetails
      .map((detail, index) => (index !== currentIndex ? detail.DesignNo : ""))
      .filter((designNo) => designNo !== "");

    return products.filter(
      (product: ProductDetails) => !selectedDesignNos.includes(product.DesignNo)
    );
  };

  // Reset form when component mounts
  useEffect(() => {
    reset();
    setOrderDetails([
      { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
    ]);
  }, [reset]);

  const addOrderDetail = () => {
    try {
      if (orderDetails.length >= 50) {
        return;
      }

      const newDetail = {
        DesignNo: "",
        Quantity: 1,
        UnitPrice: 0,
        TotalPrice: 0,
      };

      setOrderDetails((prev) => [...prev, newDetail]);
    } catch (error) {
      console.error("Error adding order detail:", error);
    }
  };

  const removeOrderDetail = (index: number) => {
    try {
      if (orderDetails.length > 1) {
        const newDetails = orderDetails.filter((_, i) => i !== index);
        setOrderDetails(newDetails);
        setValue("OrderDetails", newDetails);
      }
    } catch (error) {
      console.error("Error removing order detail:", error);
    }
  };

  const updateOrderDetail = (
    index: number,
    field: keyof IOrderDetails,
    value: string | number
  ) => {
    try {
      const newDetails = [...orderDetails];
      newDetails[index] = { ...newDetails[index], [field]: value };

      // Calculate total price for this detail
      if (field === "Quantity" || field === "UnitPrice") {
        const quantity =
          field === "Quantity" ? Number(value) : newDetails[index].Quantity;
        const unitPrice =
          field === "UnitPrice" ? Number(value) : newDetails[index].UnitPrice;
        newDetails[index].TotalPrice = quantity * unitPrice;
      }

      // If DesignNo is selected, auto-fill the UnitPrice
      if (field === "DesignNo") {
        const selectedProduct = products?.find(
          (p: ProductDetails) => p.DesignNo === value
        );
        if (selectedProduct) {
          newDetails[index].UnitPrice = selectedProduct.Rate;
          newDetails[index].TotalPrice =
            newDetails[index].Quantity * selectedProduct.Rate;
        }
      }

      setOrderDetails(newDetails);
      setValue("OrderDetails", newDetails);

      // Calculate total amount
      const totalAmount = newDetails.reduce(
        (sum, detail) => sum + detail.TotalPrice,
        0
      );
      setValue("totalAmount", totalAmount);
    } catch (error) {
      console.error("Error updating order detail:", error);
    }
  };

  const onSubmitForm = async (data: OrderFormData) => {
    try {
      setLoading(true);

      const orderData = {
        ...data,
        OrderDetails: orderDetails,
        totalAmount: orderDetails.reduce(
          (sum, detail) => sum + detail.TotalPrice,
          0
        ),
        Remark: data.Remark || "",
      };

      if (onSubmit) {
        await onSubmit(orderData);
      }
      reset();
      setOrderDetails([
        { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
      ]);
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setOrderDetails([
      { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
    ]);
    if (onClose) {
      onClose();
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="w-14 h-14 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600"
          onClick={() => console.log("Drawer trigger clicked")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-hidden transition-all duration-300 max-h-[85vh] sm:max-h-[80vh]">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>Add New Order</DrawerTitle>
          <DrawerDescription>
            Fill in the details to create a new customer order.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="space-y-4 pb-4"
          >
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="CustomerName" className="flex items-center gap-2">
                Customer Name *
                {errors.CustomerName && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {!errors.CustomerName && watch("CustomerName") && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </Label>
              <Input
                id="CustomerName"
                {...register("CustomerName")}
                placeholder="Enter customer name"
                className={errors.CustomerName ? "border-red-500" : ""}
              />
              {errors.CustomerName && (
                <p className="text-sm text-destructive">
                  {errors.CustomerName.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="Date">Date *</Label>
              <Input
                id="Date"
                type="date"
                {...register("Date")}
                className={errors.Date ? "border-red-500" : ""}
              />
              {errors.Date && (
                <p className="text-sm text-destructive">
                  {errors.Date.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="Address" className="flex items-center gap-2">
                Address *
                {errors.Address && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {!errors.Address && watch("Address") && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </Label>
              <Textarea
                id="Address"
                {...register("Address")}
                placeholder="Enter customer address"
                rows={3}
                className={errors.Address ? "border-red-500" : ""}
              />
              {errors.Address && (
                <p className="text-sm text-destructive">
                  {errors.Address.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="PhoneNo" className="flex items-center gap-2">
                Phone Number *
                {errors.PhoneNo && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {!errors.PhoneNo && watch("PhoneNo") && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </Label>
              <Input
                id="PhoneNo"
                type="tel"
                {...register("PhoneNo")}
                placeholder="Enter phone number (e.g., +91 98765 43210)"
                onKeyPress={(e) => {
                  // Allow only numbers, spaces, +, -, (, )
                  const allowedChars = /[0-9+\-\s()]/;
                  if (!allowedChars.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={errors.PhoneNo ? "border-red-500" : ""}
              />
              {errors.PhoneNo && (
                <p className="text-sm text-destructive">
                  {errors.PhoneNo.message}
                </p>
              )}
            </div>

            {/* Agent */}
            <div className="space-y-2">
              <Label htmlFor="Agent">Agent *</Label>
              <Input
                id="Agent"
                {...register("Agent")}
                placeholder="Enter agent name"
                className={errors.Agent ? "border-red-500" : ""}
              />
              {errors.Agent && (
                <p className="text-sm text-destructive">
                  {errors.Agent.message}
                </p>
              )}
            </div>

            {/* Transport */}
            <div className="space-y-2">
              <Label htmlFor="Transport">Transport *</Label>
              <Input
                id="Transport"
                {...register("Transport")}
                placeholder="e.g., Express Delivery"
                className={errors.Transport ? "border-red-500" : ""}
              />
              {errors.Transport && (
                <p className="text-sm text-destructive">
                  {errors.Transport.message}
                </p>
              )}
            </div>

            {/* Payment Terms */}
            <div className="space-y-2">
              <Label htmlFor="PaymentTerms">Payment Terms *</Label>
              <Input
                id="PaymentTerms"
                {...register("PaymentTerms")}
                placeholder="e.g., 50% Advance"
                className={errors.PaymentTerms ? "border-red-500" : ""}
              />
              {errors.PaymentTerms && (
                <p className="text-sm text-destructive">
                  {errors.PaymentTerms.message}
                </p>
              )}
            </div>

            {/* Remark */}
            <div className="space-y-2">
              <Label htmlFor="Remark">Remark</Label>
              <Textarea
                id="Remark"
                {...register("Remark")}
                placeholder="Additional notes..."
                rows={3}
                className={errors.Remark ? "border-red-500" : ""}
              />
              {errors.Remark && (
                <p className="text-sm text-destructive">
                  {errors.Remark.message}
                </p>
              )}
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Order Details *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOrderDetail}
                  disabled={orderDetails.length >= 50}
                >
                  Add Item
                </Button>
              </div>

              {Array.isArray(orderDetails) &&
                orderDetails.map((detail, index) => {
                  const availableProducts = getAvailableProducts(index);
                  const selectedProduct = products?.find(
                    (p: ProductDetails) => p.DesignNo === detail.DesignNo
                  );

                  return (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {orderDetails.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOrderDetail(index)}
                            className="text-red-500"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <Label>Design No *</Label>
                          <Select
                            value={detail.DesignNo || undefined}
                            onValueChange={(value) =>
                              updateOrderDetail(index, "DesignNo", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableProducts.length > 0 ? (
                                availableProducts.map((product) => (
                                  <SelectItem
                                    key={product.DesignNo}
                                    value={product.DesignNo}
                                  >
                                    {product.DesignNo} - {product.TypeOfGarment}{" "}
                                    (₹{product.Rate})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-products" disabled>
                                  No products available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Quantity *</Label>
                          <Input
                            type="number"
                            min="1"
                            max="999"
                            value={detail.Quantity}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= 0) {
                                updateOrderDetail(index, "Quantity", value);
                              }
                            }}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <Label>Unit Price (₹) *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="999999"
                            value={detail.UnitPrice}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= 0) {
                                updateOrderDetail(index, "UnitPrice", value);
                              }
                            }}
                            onKeyPress={(e) => {
                              // Allow only numbers, decimal point, and backspace
                              const allowedChars = /[0-9.]/;
                              if (
                                !allowedChars.test(e.key) &&
                                e.key !== "Backspace"
                              ) {
                                e.preventDefault();
                              }
                              // Prevent multiple decimal points
                              if (
                                e.key === "." &&
                                e.currentTarget.value.includes(".")
                              ) {
                                e.preventDefault();
                              }
                            }}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label>Total Price (₹)</Label>
                          <Input
                            type="text"
                            value={formatCurrency(detail.TotalPrice)}
                            readOnly
                            className="bg-gray-50 font-semibold"
                          />
                        </div>
                      </div>

                      {/* Show selected product details */}
                      {selectedProduct && (
                        <div className="bg-blue-50 p-3 rounded-lg text-sm">
                          <p className="font-medium text-blue-800">
                            Selected: {selectedProduct.DesignNo} -{" "}
                            {selectedProduct.TypeOfGarment}
                          </p>
                          <p className="text-blue-600">
                            Color: {selectedProduct.ColorOfGarment} | Blouse:{" "}
                            {selectedProduct.BlouseColor} | Dupatta:{" "}
                            {selectedProduct.DupptaColor}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Total Amount */}
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (₹) *</Label>
              <Input
                id="totalAmount"
                type="text"
                value={formatCurrency(
                  orderDetails.reduce(
                    (sum, detail) => sum + detail.TotalPrice,
                    0
                  )
                )}
                readOnly
                className="bg-gray-50 font-semibold text-lg"
              />
              {errors.totalAmount && (
                <p className="text-sm text-destructive">
                  {errors.totalAmount.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <DrawerFooter className="flex-shrink-0 border-t bg-white">
          <div className="flex space-x-2">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button
              onClick={handleSubmit(onSubmitForm)}
              disabled={loading || !isValid}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Order"
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
