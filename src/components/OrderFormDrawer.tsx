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
import { Plus, Loader2 } from "lucide-react";

// Order schema matching database
const orderSchema = z.object({
  Date: z.string().min(1, "Date is required"),
  CustomerName: z.string().min(1, "Customer name is required"),
  Address: z.string().min(1, "Address is required"),
  PhoneNo: z.string().min(10, "Valid phone number is required"),
  Agent: z.string().min(1, "Agent is required"),
  Transport: z.string().min(1, "Transport is required"),
  PaymentTerms: z.string().min(1, "Payment terms are required"),
  Remark: z.string().optional(),
  OrderDetails: z
    .array(
      z.object({
        DesignNo: z.string().min(1, "Design number is required"),
        Quantity: z.number().min(1, "Quantity must be at least 1"),
        UnitPrice: z.number().min(0, "Unit price must be positive"),
        TotalPrice: z.number().min(0, "Total price must be positive"),
      })
    )
    .min(1, "At least one order detail is required"),
  totalAmount: z.number().min(0, "Total amount must be positive"),
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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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
  });

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
    if (order && mode === "edit") {
      // Convert Date object to string for date input
      const orderDate =
        order.Date instanceof Date
          ? order.Date.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
      setValue("Date", orderDate);
      setValue("CustomerName", order.CustomerName || "");
      setValue("Address", order.Address || "");
      setValue("PhoneNo", order.PhoneNo || "");
      setValue("Agent", order.Agent || "");
      setValue("Transport", order.Transport || "");
      setValue("PaymentTerms", order.PaymentTerms || "");
      setValue("Remark", order.Remark || "");
      setValue("totalAmount", order.totalAmount || 0);
      if (order.OrderDetails) {
        setOrderDetails(order.OrderDetails);
        setValue("OrderDetails", order.OrderDetails);
      }
      // Automatically open drawer when editing
      setIsOpen(true);
    }
  }, [order, mode, setValue]);

  const addOrderDetail = () => {
    const newDetail = {
      DesignNo: "",
      Quantity: 1,
      UnitPrice: 0,
      TotalPrice: 0,
    };
    setOrderDetails([...orderDetails, newDetail]);
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
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting order:", error);
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
    if (onClose) {
      onClose();
    }
  };

  // Handle drawer open/close state
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
      setIsKeyboardOpen(false); // Reset keyboard state when drawer closes
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
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="CustomerName">Customer Name *</Label>
              <Input
                id="CustomerName"
                {...register("CustomerName")}
                placeholder="Enter customer name"
                onFocus={() => handleInputFocus("CustomerName")}
                onBlur={handleInputBlur}
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
              <Input id="Date" type="date" {...register("Date")} />
              {errors.Date && (
                <p className="text-sm text-destructive">
                  {errors.Date.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="Address">Address *</Label>
              <Textarea
                id="Address"
                {...register("Address")}
                placeholder="Enter customer address"
                rows={3}
              />
              {errors.Address && (
                <p className="text-sm text-destructive">
                  {errors.Address.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="PhoneNo">Phone Number *</Label>
              <Input
                id="PhoneNo"
                type="tel"
                {...register("PhoneNo")}
                placeholder="Enter phone number"
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
              />
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
                >
                  Add Item
                </Button>
              </div>

              {orderDetails.map((detail, index) => {
                const availableProducts = getAvailableProducts(index);
                const selectedProduct = mockProducts.find(
                  (p) => p.DesignNo === detail.DesignNo
                );

                return (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
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
                          value={detail.Quantity}
                          onChange={(e) =>
                            updateOrderDetail(
                              index,
                              "Quantity",
                              Number(e.target.value)
                            )
                          }
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <Label>Unit Price (₹) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={detail.UnitPrice}
                          onChange={(e) =>
                            updateOrderDetail(
                              index,
                              "UnitPrice",
                              Number(e.target.value)
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Total Price (₹)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={detail.TotalPrice}
                          readOnly
                          className="bg-gray-50"
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
                type="number"
                step="0.01"
                min="0"
                {...register("totalAmount", { valueAsNumber: true })}
                value={orderDetails.reduce(
                  (sum, detail) => sum + detail.TotalPrice,
                  0
                )}
                readOnly
                className="bg-gray-50 font-semibold"
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
              disabled={loading}
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
