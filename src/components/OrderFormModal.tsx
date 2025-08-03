import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderFormData } from "../schemas/validationSchemas";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
}

export const OrderFormModal = ({
  isOpen,
  onClose,
  onSubmit,
}: OrderFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      OrderNo: "",
      Date: new Date(),
      CustomerName: "",
      PhoneNo: "",
      Address: "",
      Agent: "",
      Transport: "",
      PaymentTerms: "",
      Remark: "",
      OrderDetails: [
        {
          DesignNo: "",
          Quantity: 1,
          UnitPrice: 0,
          TotalPrice: 0,
        },
      ],
      totalAmount: 0,
    },
  });

  const onSubmitForm = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Order</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {/* Order Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Number *
              </label>
              <input
                {...register("orderNo")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="e.g., ORD001"
              />
              {errors.orderNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.orderNo.message}
                </p>
              )}
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                {...register("customerName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                {...register("customerPhone")}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter phone number"
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerPhone.message}
                </p>
              )}
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...register("customerEmail")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter email address"
              />
              {errors.customerEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerEmail.message}
                </p>
              )}
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date *
              </label>
              <input
                {...register("date")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount (₹) *
              </label>
              <input
                {...register("total", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="0.00"
              />
              {errors.total && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.total.message}
                </p>
              )}
            </div>

            {/* Agent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent *
              </label>
              <input
                {...register("agent")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter agent name"
              />
              {errors.agent && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agent.message}
                </p>
              )}
            </div>

            {/* Transport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transport *
              </label>
              <select
                {...register("transport")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select transport</option>
                <option value="Express Delivery">Express Delivery</option>
                <option value="Standard Delivery">Standard Delivery</option>
                <option value="Premium Delivery">Premium Delivery</option>
                <option value="Pickup">Pickup</option>
                <option value="Local Delivery">Local Delivery</option>
              </select>
              {errors.transport && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.transport.message}
                </p>
              )}
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms *
              </label>
              <select
                {...register("paymentTerms")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select payment terms</option>
                <option value="Full Payment">Full Payment</option>
                <option value="50% Advance">50% Advance</option>
                <option value="30% Advance">30% Advance</option>
                <option value="25% Advance">25% Advance</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
              {errors.paymentTerms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentTerms.message}
                </p>
              )}
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date
              </label>
              <input
                {...register("deliveryDate")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Additional notes..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
