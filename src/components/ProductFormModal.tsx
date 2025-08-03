import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductFormData,
} from "../schemas/validationSchemas";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
}

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ProductFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      DesignNo: "",
      TypeOfGarment: "",
      ColorOfGarment: "",
      BlouseColor: "",
      DupptaColor: "",
      Rate: 0,
      FixCode: "",
    },
  });

  const onSubmitForm = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
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
            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
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
            {/* Design Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Design Number *
              </label>
              <input
                {...register("DesignNo")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., DES001"
              />
              {errors.DesignNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.DesignNo.message}
                </p>
              )}
            </div>

            {/* Type of Garment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Garment *
              </label>
              <select
                {...register("TypeOfGarment")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select garment type</option>
                <option value="Bridal Lehenga">Bridal Lehenga</option>
                <option value="Party Wear">Party Wear</option>
                <option value="Anarkali Suit">Anarkali Suit</option>
                <option value="Saree">Saree</option>
                <option value="Gown">Gown</option>
                <option value="Indo-Western">Indo-Western</option>
                <option value="Sharara Suit">Sharara Suit</option>
                <option value="Palazzo Suit">Palazzo Suit</option>
              </select>
              {errors.TypeOfGarment && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.TypeOfGarment.message}
                </p>
              )}
            </div>

            {/* Color of Garment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color of Garment *
              </label>
              <input
                {...register("ColorOfGarment")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Red, Blue, Green"
              />
              {errors.ColorOfGarment && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ColorOfGarment.message}
                </p>
              )}
            </div>

            {/* Blouse Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blouse Color *
              </label>
              <input
                {...register("BlouseColor")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Gold, Silver, White"
              />
              {errors.BlouseColor && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.BlouseColor.message}
                </p>
              )}
            </div>

            {/* Dupatta Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dupatta Color *
              </label>
              <input
                {...register("DupptaColor")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Red, Blue, Green"
              />
              {errors.DupptaColor && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.DupptaColor.message}
                </p>
              )}
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (₹) *
              </label>
              <input
                {...register("Rate", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              {errors.Rate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Rate.message}
                </p>
              )}
            </div>

            {/* Fix Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fix Code
              </label>
              <input
                {...register("FixCode")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1001"
              />
              {errors.FixCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.FixCode.message}
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
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
