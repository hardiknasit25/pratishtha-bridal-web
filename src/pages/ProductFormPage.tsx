import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createProduct, updateProduct } from "../store/productSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { showToast } from "../components/Toast";

// Product schema matching database
const productSchema = z.object({
  TypeOfGarment: z.string().min(1, "Type of garment is required"),
  ColorOfGarment: z.string().min(1, "Color of garment is required"),
  BlouseColor: z.string().min(1, "Blouse color is required"),
  DupptaColor: z.string().min(1, "Dupatta color is required"),
  Rate: z.number().min(0, "Rate must be a positive number"),
  FixCode: z.number().min(0, "Fix code must be a positive number"),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [productFound, setProductFound] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productId } = useParams<{ productId: string }>();

  const { products } = useAppSelector((state) => state.products);
  const product = productId ? products.find((p) => p._id === productId) : null;
  const isEditMode = !!productId;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      TypeOfGarment: "",
      ColorOfGarment: "",
      BlouseColor: "",
      DupptaColor: "",
      Rate: 0,
      FixCode: 0,
    },
    mode: "onChange",
  });

  // Set form values when product is found (edit mode)
  useEffect(() => {
    if (isEditMode) {
      if (product) {
        setProductFound(true);
        setValue("TypeOfGarment", product.TypeOfGarment || "");
        setValue("ColorOfGarment", product.ColorOfGarment || "");
        setValue("BlouseColor", product.BlouseColor || "");
        setValue("DupptaColor", product.DupptaColor || "");
        setValue("Rate", product.Rate || 0);
        setValue("FixCode", product.FixCode || 0);
      } else if (products.length > 0) {
        // Products loaded but product not found
        setProductFound(false);
      }
    }
  }, [product, products, setValue, isEditMode]);

  const onSubmitForm = async (data: ProductFormData) => {
    try {
      setLoading(true);

      if (isEditMode && product) {
        // Update existing product
        const productData = {
          ...product,
          ...data,
        };

        await dispatch(updateProduct(productData)).unwrap();

        showToast.success(
          "Product Updated",
          `Product ${product.DesignNo} has been successfully updated.`
        );
      } else {
        // Create new product
        const designNo = `DES${Date.now()}`;

        const productData = {
          ...data,
          DesignNo: designNo,
        };

        await dispatch(createProduct(productData)).unwrap();

        showToast.success(
          "Product Added",
          `Product ${designNo} has been successfully added to your catalog.`
        );
      }

      // Navigate back to products page
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      showToast.error(
        isEditMode ? "Update Failed" : "Addition Failed",
        `Unable to ${
          isEditMode ? "update" : "add"
        } the product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  // Show loading state while products are being fetched (edit mode)
  if (isEditMode && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error if product not found (edit mode)
  if (isEditMode && !productFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleCancel}>Back to Products</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Products</span>
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditMode
                ? "Update the product details below."
                : "Fill in the details to add a new product to your catalog."}
            </p>
            {isEditMode && product && (
              <p className="text-sm text-blue-600 mt-2">
                Design No:{" "}
                <span className="font-medium">{product.DesignNo}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type of Garment */}
              <div className="space-y-2">
                <Label htmlFor="TypeOfGarment">Type of Garment *</Label>
                <Input
                  id="TypeOfGarment"
                  {...register("TypeOfGarment", {
                    required: "Type of garment is required",
                  })}
                  placeholder="e.g., Bridal Lehenga"
                  className={errors.TypeOfGarment ? "border-red-500" : ""}
                />
                {errors.TypeOfGarment && (
                  <p className="text-sm text-destructive">
                    {errors.TypeOfGarment.message}
                  </p>
                )}
              </div>

              {/* Color of Garment */}
              <div className="space-y-2">
                <Label htmlFor="ColorOfGarment">Color of Garment *</Label>
                <Input
                  id="ColorOfGarment"
                  {...register("ColorOfGarment", {
                    required: "Color of garment is required",
                  })}
                  placeholder="e.g., Red"
                  className={errors.ColorOfGarment ? "border-red-500" : ""}
                />
                {errors.ColorOfGarment && (
                  <p className="text-sm text-destructive">
                    {errors.ColorOfGarment.message}
                  </p>
                )}
              </div>

              {/* Blouse Color */}
              <div className="space-y-2">
                <Label htmlFor="BlouseColor">Blouse Color *</Label>
                <Input
                  id="BlouseColor"
                  {...register("BlouseColor", {
                    required: "Blouse color is required",
                  })}
                  placeholder="e.g., Gold"
                  className={errors.BlouseColor ? "border-red-500" : ""}
                />
                {errors.BlouseColor && (
                  <p className="text-sm text-destructive">
                    {errors.BlouseColor.message}
                  </p>
                )}
              </div>

              {/* Dupatta Color */}
              <div className="space-y-2">
                <Label htmlFor="DupptaColor">Dupatta Color *</Label>
                <Input
                  id="DupptaColor"
                  {...register("DupptaColor", {
                    required: "Dupatta color is required",
                  })}
                  placeholder="e.g., Red"
                  className={errors.DupptaColor ? "border-red-500" : ""}
                />
                {errors.DupptaColor && (
                  <p className="text-sm text-destructive">
                    {errors.DupptaColor.message}
                  </p>
                )}
              </div>

              {/* Rate */}
              <div className="space-y-2">
                <Label htmlFor="Rate">Rate (₹) *</Label>
                <Input
                  id="Rate"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("Rate", {
                    valueAsNumber: true,
                    required: "Rate is required",
                    min: { value: 0, message: "Rate must be positive" },
                  })}
                  placeholder="0.00"
                  className={errors.Rate ? "border-red-500" : ""}
                />
                {errors.Rate && (
                  <p className="text-sm text-destructive">
                    {errors.Rate.message}
                  </p>
                )}
              </div>

              {/* Fix Code */}
              <div className="space-y-2">
                <Label htmlFor="FixCode">Fix Code *</Label>
                <Input
                  id="FixCode"
                  type="number"
                  min="0"
                  {...register("FixCode", {
                    valueAsNumber: true,
                    required: "Fix code is required",
                    min: { value: 0, message: "Fix code must be positive" },
                  })}
                  placeholder="e.g., 1001"
                  className={errors.FixCode ? "border-red-500" : ""}
                />
                {errors.FixCode && (
                  <p className="text-sm text-destructive">
                    {errors.FixCode.message}
                  </p>
                )}
              </div>
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
                    {isEditMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Product" : "Add Product"}
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
