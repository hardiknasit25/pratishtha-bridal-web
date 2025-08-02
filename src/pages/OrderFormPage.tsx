import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createOrder, updateOrder } from "../store/orderSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Loader2, ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { showToast } from "../components/Toast";
import type { IOrderDetails, ProductDetails, IOrder } from "../types";
import { fetchProducts } from "../store/productSlice";

// Order schema with validation
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
});

type OrderFormData = z.infer<typeof orderSchema>;

export const OrderFormPage = () => {
  const [orderDetails, setOrderDetails] = useState<IOrderDetails[]>([
    { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orderId } = useParams<{ orderId: string }>();

  const { orders } = useAppSelector((state) => state.orders);
  const { products } = useAppSelector((state) => state.products);
  const order = orderId ? orders.find((o) => o._id === orderId) : null;
  const isEditMode = !!orderId;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      Date: new Date().toISOString().split("T")[0],
      CustomerName: "",
      Address: "",
      PhoneNo: "",
      Agent: "",
      Transport: "",
      PaymentTerms: "",
      Remark: "",
    },
    mode: "onChange",
  });

  // Set form values when order is found (edit mode)
  useEffect(() => {
    dispatch(fetchProducts());
    if (isEditMode) {
      if (order) {
        setOrderFound(true);
        setValue(
          "Date",
          order.Date instanceof Date
            ? order.Date.toISOString().split("T")[0]
            : ""
        );
        setValue("CustomerName", order.CustomerName || "");
        setValue("Address", order.Address || "");
        setValue("PhoneNo", order.PhoneNo || "");
        setValue("Agent", order.Agent || "");
        setValue("Transport", order.Transport || "");
        setValue("PaymentTerms", order.PaymentTerms || "");
        setValue("Remark", order.Remark || "");
        setOrderDetails(
          order.OrderDetails || [
            { DesignNo: "", Quantity: 1, UnitPrice: 0, TotalPrice: 0 },
          ]
        );
      } else if (orders.length > 0) {
        // Orders loaded but order not found
        setOrderFound(false);
      }
    }
  }, [order, orders, setValue, isEditMode]);

  // Get available products (excluding already selected ones)
  const getAvailableProducts = (currentIndex: number): ProductDetails[] => {
    if (!products || !Array.isArray(products)) {
      return [];
    }

    const selectedDesignNos = orderDetails
      .map((detail, index) => (index !== currentIndex ? detail.DesignNo : ""))
      .filter((designNo) => designNo !== "");

    return products.filter(
      (product: ProductDetails) => !selectedDesignNos.includes(product.DesignNo)
    );
  };

  const addOrderDetail = () => {
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
  };

  const removeOrderDetail = (index: number) => {
    if (orderDetails.length > 1) {
      const newDetails = orderDetails.filter((_, i) => i !== index);
      setOrderDetails(newDetails);
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
  };

  const onSubmitForm = async (data: OrderFormData) => {
    try {
      setLoading(true);

      if (isEditMode && order) {
        // Update existing order
        const orderData: IOrder = {
          ...order,
          ...data,
          Date: new Date(data.Date),
          OrderDetails: orderDetails,
          totalAmount: orderDetails.reduce(
            (sum, detail) => sum + detail.TotalPrice,
            0
          ),
          Remark: data.Remark || "",
        };

        await dispatch(updateOrder(orderData)).unwrap();

        showToast.success(
          "Order Updated",
          `Order ${order.OrderNo} has been successfully updated.`
        );
      } else {
        const orderData = {
          ...data,
          Date: new Date(data.Date),
          OrderDetails: orderDetails,
          totalAmount: orderDetails.reduce(
            (sum, detail) => sum + detail.TotalPrice,
            0
          ),
          Remark: data.Remark || "",
        };

        await dispatch(createOrder(orderData)).unwrap();

        showToast.success("Order Created");
      }

      // Navigate back to orders page
      navigate("/orders");
    } catch (error) {
      console.error("Error saving order:", error);
      showToast.error(
        isEditMode ? "Update Failed" : "Creation Failed",
        `Unable to ${
          isEditMode ? "update" : "create"
        } the order. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/orders");
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

  // Show loading state while orders are being fetched (edit mode)
  if (isEditMode && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  // Show error if order not found (edit mode)
  if (isEditMode && !orderFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleCancel}>Back to Orders</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Orders</span>
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Order" : "Create New Order"}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditMode
                ? "Update the order details below."
                : "Fill in the details to create a new customer order."}
            </p>
            {isEditMode && order && (
              <p className="text-sm text-blue-600 mt-2">
                Order No: <span className="font-medium">{order.OrderNo}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div className="space-y-2">
                  <Label htmlFor="CustomerName">Customer Name *</Label>
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

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="PhoneNo">Phone Number *</Label>
                  <Input
                    id="PhoneNo"
                    type="tel"
                    {...register("PhoneNo")}
                    placeholder="Enter phone number"
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
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="Address">Address *</Label>
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
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOrderDetail}
                  disabled={orderDetails.length >= 50}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </Button>
              </div>

              {orderDetails.map((detail, index) => {
                const availableProducts = getAvailableProducts(index);
                const selectedProduct = products?.find(
                  (p: ProductDetails) => p.DesignNo === detail.DesignNo
                );

                return (
                  <div
                    key={index}
                    className="border rounded-lg p-6 space-y-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">
                        Item {index + 1}
                      </h4>
                      {orderDetails.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOrderDetail(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Design No */}
                      <div className="space-y-2">
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

                      {/* Quantity */}
                      <div className="space-y-2">
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

                      {/* Unit Price */}
                      <div className="space-y-2">
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
                          placeholder="0.00"
                        />
                      </div>

                      {/* Total Price */}
                      <div className="space-y-2">
                        <Label>Total Price (₹)</Label>
                        <Input
                          type="text"
                          value={formatCurrency(detail.TotalPrice)}
                          readOnly
                          className="bg-gray-100 font-semibold"
                        />
                      </div>
                    </div>

                    {/* Show selected product details */}
                    {selectedProduct && (
                      <div className="bg-blue-50 p-4 rounded-lg text-sm">
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
            <div className="space-y-2 border-t pt-6">
              <Label htmlFor="totalAmount" className="text-lg font-medium">
                Total Amount (₹)
              </Label>
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
                className="bg-gray-100 font-semibold text-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !isValid}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Order" : "Create Order"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
