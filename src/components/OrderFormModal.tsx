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
                {...register("OrderNo")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="e.g., ORD001"
              />
              {errors.OrderNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.OrderNo.message}
                </p>
              )}
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                {...register("CustomerName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter customer name"
              />
              {errors.CustomerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.CustomerName.message}
                </p>
              )}
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                {...register("PhoneNo")}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter phone number"
              />
              {errors.PhoneNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.PhoneNo.message}
                </p>
              )}
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date *
              </label>
              <input
                {...register("Date")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              {errors.Date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Date.message}
                </p>
              )}
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount (₹) *
              </label>
              <input
                {...register("totalAmount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="0.00"
              />
              {errors.totalAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.totalAmount.message}
                </p>
              )}
            </div>

            {/* Agent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent *
              </label>
              <input
                {...register("Agent")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter agent name"
              />
              {errors.Agent && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Agent.message}
                </p>
              )}
            </div>

            {/* Transport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transport *
              </label>
              <select
                {...register("Transport")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select transport</option>
                <option value="Express Delivery">Express Delivery</option>
                <option value="Standard Delivery">Standard Delivery</option>
                <option value="Premium Delivery">Premium Delivery</option>
                <option value="Pickup">Pickup</option>
                <option value="Local Delivery">Local Delivery</option>
              </select>
              {errors.Transport && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Transport.message}
                </p>
              )}
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms *
              </label>
              <select
                {...register("PaymentTerms")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select payment terms</option>
                <option value="Full Payment">Full Payment</option>
                <option value="50% Advance">50% Advance</option>
                <option value="30% Advance">30% Advance</option>
                <option value="25% Advance">25% Advance</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
              {errors.PaymentTerms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.PaymentTerms.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                {...register("Address")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter customer address"
              />
              {errors.Address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Address.message}
                </p>
              )}
            </div>

            {/* Remark */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark
              </label>
              <textarea
                {...register("Remark")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Additional notes..."
              />
              {errors.Remark && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Remark.message}
                </p>
              )}
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
