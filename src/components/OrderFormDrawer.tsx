import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { IOrder, IOrderDetails } from "../types";
import { mockProducts, type ProductDetails } from "../data/mockData";
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, Loader2, AlertCircle, CheckCircle } from "lucide-react";

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
  order?: IOrder; // For editing
  mode?: "create" | "edit";
  onSubmit?: (data: OrderFormData) => void;
  onClose?: () => void; // Callback when drawer closes
}

export const OrderFormDrawer = ({
  order,
  mode = "create",
  onSubmit,
  onClose,
}: OrderFormDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<IOrderDetails[]>([
    { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
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

  // Watch form values for real-time validation
  const watchedValues = watch();

  // Validate form in real-time
  useEffect(() => {
    const validateForm = async () => {
      try {
        const isValidForm = await trigger();
        setIsFormValid(isValidForm);

        // Clear field errors when form becomes valid
        if (isValidForm) {
          setFieldErrors({});
        }
      } catch (error) {
        console.error("Form validation error:", error);
        setIsFormValid(false);
      }
    };

    // Only validate if form is mounted and not loading
    if (!loading) {
      validateForm();
    }
  }, [watchedValues, trigger, loading]);

  // Get available products (excluding already selected ones)
  const getAvailableProducts = (currentIndex: number): ProductDetails[] => {
    const selectedDesignNos = orderDetails
      .map((detail, index) => (index !== currentIndex ? detail.DesignNo : ""))
      .filter((designNo) => designNo !== "");

    return mockProducts.filter(
      (product) => !selectedDesignNos.includes(product.DesignNo)
    );
  };

  // Set form values when editing
  useEffect(() => {
    console.log("OrderFormDrawer useEffect triggered:", {
      order: !!order,
      mode,
      orderDetails: order?.OrderDetails?.length,
    });

    if (order && mode === "edit") {
      try {
        setIsInitializing(true);

        // Convert Date object to string for date input
        const orderDate =
          order.Date instanceof Date
            ? order.Date.toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

        // Set form values
        setValue("Date", orderDate);
        setValue("CustomerName", order.CustomerName || "");
        setValue("Address", order.Address || "");
        setValue("PhoneNo", order.PhoneNo || "");
        setValue("Agent", order.Agent || "");
        setValue("Transport", order.Transport || "");
        setValue("PaymentTerms", order.PaymentTerms || "");
        setValue("Remark", order.Remark || "");
        setValue("totalAmount", order.totalAmount || 0);

        if (order.OrderDetails && order.OrderDetails.length > 0) {
          setOrderDetails(order.OrderDetails);
          setValue("OrderDetails", order.OrderDetails);
        }

        // Automatically open drawer when editing
        // Add a small delay to ensure form is properly initialized
        setTimeout(() => {
          setIsOpen(true);
          setIsInitializing(false);
        }, 100);

        // Safety timeout to prevent hanging
        const safetyTimeout = setTimeout(() => {
          if (isInitializing) {
            console.warn(
              "Form initialization taking too long, forcing completion"
            );
            setIsInitializing(false);
            setIsOpen(true);
          }
        }, 2000);

        // Cleanup function
        return () => {
          clearTimeout(safetyTimeout);
        };
      } catch (error) {
        console.error("Error setting form values for editing:", error);
        // Don't open drawer if there's an error
        setIsOpen(false);
        setIsInitializing(false);
      }
    } else if (!order && mode === "create") {
      // Reset form when switching to create mode
      reset();
      setOrderDetails([
        { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
      ]);
      setFieldErrors({});
    }
  }, [order, mode, setValue, reset]);

  const addOrderDetail = () => {
    if (orderDetails.length >= 50) {
      setFieldErrors((prev) => ({
        ...prev,
        orderDetails: "Cannot add more than 50 items",
      }));
      return;
    }

    const newDetail = {
      DesignNo: "",
      Quantity: 1,
      UnitPrice: 0,
      TotalPrice: 0,
    };
    setOrderDetails([...orderDetails, newDetail]);
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.orderDetails;
      return newErrors;
    });
  };

  const removeOrderDetail = (index: number) => {
    if (orderDetails.length > 1) {
      const newDetails = orderDetails.filter((_, i) => i !== index);
      setOrderDetails(newDetails);
      setValue("OrderDetails", newDetails);
    }
  };

  const updateOrderDetail = (
    index: number,
    field: keyof IOrderDetails,
    value: string | number
  ) => {
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
      const selectedProduct = mockProducts.find((p) => p.DesignNo === value);
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
  };

  // Enhanced input validation
  const validateInput = (field: string, value: string | number) => {
    let error = "";

    switch (field) {
      case "CustomerName":
        if (!value || String(value).trim().length === 0) {
          error = "Customer name is required";
        } else if (String(value).length < 2) {
          error = "Customer name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(String(value))) {
          error = "Customer name can only contain letters and spaces";
        }
        break;
      case "PhoneNo":
        if (!value || String(value).trim().length === 0) {
          error = "Phone number is required";
        } else if (!/^[0-9+\-\s()]+$/.test(String(value))) {
          error = "Phone number can only contain numbers, spaces, and symbols";
        } else if (String(value).replace(/[^0-9]/g, "").length < 10) {
          error = "Phone number must be at least 10 digits";
        }
        break;
      case "Address":
        if (!value || String(value).trim().length === 0) {
          error = "Address is required";
        } else if (String(value).length < 10) {
          error = "Address must be at least 10 characters";
        }
        break;
      case "Quantity": {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 1) {
          error = "Quantity must be at least 1";
        } else if (numValue > 999) {
          error = "Quantity cannot exceed 999";
        }
        break;
      }
      case "UnitPrice": {
        const priceValue = Number(value);
        if (isNaN(priceValue) || priceValue < 0) {
          error = "Unit price must be positive";
        } else if (priceValue > 999999) {
          error = "Unit price cannot exceed ₹999,999";
        }
        break;
      }
    }

    return error;
  };

  // Handle input change with validation
  const handleInputChange = (field: string, value: string | number) => {
    const error = validateInput(field, value);

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const onSubmitForm = async (data: OrderFormData) => {
    try {
      setLoading(true);

      // Final validation before submission
      const isValidForm = await trigger();
      if (!isValidForm) {
        setLoading(false);
        return;
      }

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
      setFieldErrors({});
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting order:", error);
      setFieldErrors((prev) => ({
        ...prev,
        submit: "Failed to submit order. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setOrderDetails([
      { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
    ]);
    setFieldErrors({});
    if (onClose) {
      onClose();
    }
  };

  // Handle drawer open/close state
  const handleOpenChange = (open: boolean) => {
    try {
      setIsOpen(open);
      if (!open) {
        reset();
        setIsKeyboardOpen(false); // Reset keyboard state when drawer closes
        setFieldErrors({});
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Error handling drawer state change:", error);
      // Fallback: force close the drawer
      setIsOpen(false);
      setIsKeyboardOpen(false);
      setFieldErrors({});
      if (onClose) {
        onClose();
      }
    }
  };

  // Handle input focus for keyboard handling
  const handleInputFocus = (fieldName: string) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setIsKeyboardOpen(true);
    }

    // Add a delay to ensure the keyboard is open
    setTimeout(() => {
      const input = document.getElementById(fieldName);
      if (input) {
        if (isMobile) {
          const scrollContainer = input.closest(".overflow-y-auto");
          if (scrollContainer) {
            // Special handling for the first field to ensure it's at the very top
            if (fieldName === "CustomerName") {
              scrollContainer.scrollTop = 0;
            } else {
              // For other fields, scroll them into view with a small offset
              const inputRect = input.getBoundingClientRect();
              const containerRect = scrollContainer.getBoundingClientRect();
              const offset = inputRect.top - containerRect.top - 20; // 20px padding from top
              scrollContainer.scrollTop += offset;
            }
          } else {
            // Fallback to scrollIntoView if scroll container not found
            input.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        } else {
          // For desktop, just ensure it's visible
          input.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }, 300); // Reduced delay for faster response
  };

  const handleInputBlur = () => {
    setIsKeyboardOpen(false); // Reset keyboard state when input loses focus
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
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button className="w-14 h-14 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600">
          <Plus className="w-6 h-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={`overflow-hidden transition-all duration-300 ${
          isKeyboardOpen ? "max-h-[60vh]" : "max-h-[85vh] sm:max-h-[80vh]"
        }`}
      >
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>
            {mode === "edit" ? "Edit Order" : "Add New Order"}
          </DrawerTitle>
          <DrawerDescription>
            {mode === "edit"
              ? "Update the order details below."
              : "Fill in the details to create a new customer order."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {isInitializing ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mr-3"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="CustomerName"
                  className="flex items-center gap-2"
                >
                  Customer Name *
                  {errors.CustomerName && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  {!errors.CustomerName && watchedValues.CustomerName && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </Label>
                <Input
                  id="CustomerName"
                  {...register("CustomerName")}
                  placeholder="Enter customer name"
                  onFocus={() => handleInputFocus("CustomerName")}
                  onBlur={(e) => {
                    handleInputBlur();
                    handleInputChange("CustomerName", e.target.value);
                  }}
                  className={
                    errors.CustomerName
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {errors.CustomerName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
                  className={
                    errors.Date ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.Date && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
                  {!errors.Address && watchedValues.Address && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </Label>
                <Textarea
                  id="Address"
                  {...register("Address")}
                  placeholder="Enter customer address"
                  rows={3}
                  onFocus={() => handleInputFocus("Address")}
                  onBlur={(e) => {
                    handleInputBlur();
                    handleInputChange("Address", e.target.value);
                  }}
                  className={
                    errors.Address ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.Address && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
                  {!errors.PhoneNo && watchedValues.PhoneNo && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </Label>
                <Input
                  id="PhoneNo"
                  type="tel"
                  {...register("PhoneNo")}
                  placeholder="Enter phone number (e.g., +91 98765 43210)"
                  onFocus={() => handleInputFocus("PhoneNo")}
                  onBlur={(e) => {
                    handleInputBlur();
                    handleInputChange("PhoneNo", e.target.value);
                  }}
                  onKeyPress={(e) => {
                    // Allow only numbers, spaces, +, -, (, )
                    const allowedChars = /[0-9+\-\s()]/;
                    if (!allowedChars.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className={
                    errors.PhoneNo ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.PhoneNo && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
                  onFocus={() => handleInputFocus("Agent")}
                  onBlur={handleInputBlur}
                  className={
                    errors.Agent ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.Agent && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
                  onFocus={() => handleInputFocus("Transport")}
                  onBlur={handleInputBlur}
                  className={
                    errors.Transport
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {errors.Transport && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
                  onFocus={() => handleInputFocus("PaymentTerms")}
                  onBlur={handleInputBlur}
                  className={
                    errors.PaymentTerms
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {errors.PaymentTerms && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
                  onFocus={() => handleInputFocus("Remark")}
                  onBlur={handleInputBlur}
                  className={
                    errors.Remark ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.Remark && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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

                {fieldErrors.orderDetails && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.orderDetails}
                  </p>
                )}

                {orderDetails.map((detail, index) => {
                  const availableProducts = getAvailableProducts(index);
                  const selectedProduct = mockProducts.find(
                    (p) => p.DesignNo === detail.DesignNo
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

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Design No *</Label>
                          <Select
                            value={detail.DesignNo}
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
                                <SelectItem value="" disabled>
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
                                handleInputChange("Quantity", value);
                              }
                            }}
                            onBlur={(e) =>
                              handleInputChange(
                                "Quantity",
                                Number(e.target.value)
                              )
                            }
                            onKeyPress={(e) => {
                              // Allow only numbers and backspace
                              const allowedChars = /[0-9]/;
                              if (
                                !allowedChars.test(e.key) &&
                                e.key !== "Backspace"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            placeholder="1"
                            className={
                              fieldErrors.Quantity
                                ? "border-red-500 focus:border-red-500"
                                : ""
                            }
                          />
                          {fieldErrors.Quantity && (
                            <p className="text-xs text-red-500 mt-1">
                              {fieldErrors.Quantity}
                            </p>
                          )}
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
                                handleInputChange("UnitPrice", value);
                              }
                            }}
                            onBlur={(e) =>
                              handleInputChange(
                                "UnitPrice",
                                Number(e.target.value)
                              )
                            }
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
                            className={
                              fieldErrors.UnitPrice
                                ? "border-red-500 focus:border-red-500"
                                : ""
                            }
                          />
                          {fieldErrors.UnitPrice && (
                            <p className="text-xs text-red-500 mt-1">
                              {fieldErrors.UnitPrice}
                            </p>
                          )}
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
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.totalAmount.message}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {fieldErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.submit}
                  </p>
                </div>
              )}
            </form>
          )}
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
              disabled={loading || !isFormValid}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Creating..."}
                </>
              ) : mode === "edit" ? (
                "Update Order"
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
