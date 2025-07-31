import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ProductDetails } from "../types";
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
import { Plus, Loader2 } from "lucide-react";

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

interface ProductFormDrawerProps {
  product?: ProductDetails; // For editing
  mode?: "create" | "edit";
  onSubmit?: (data: ProductFormData) => void;
  onClose?: () => void; // Callback when drawer closes
}

export const ProductFormDrawer = ({
  product,
  mode = "create",
  onSubmit,
  onClose,
}: ProductFormDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
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
    mode: "onChange", // Enable real-time validation
  });

  // Set form values when editing
  useEffect(() => {
    if (product && mode === "edit") {
      setValue("TypeOfGarment", product.TypeOfGarment || "");
      setValue("ColorOfGarment", product.ColorOfGarment || "");
      setValue("BlouseColor", product.BlouseColor || "");
      setValue("DupptaColor", product.DupptaColor || "");
      setValue("Rate", product.Rate || 0);
      setValue("FixCode", product.FixCode || 0);
      // Automatically open drawer when editing
      setIsOpen(true);
    }
  }, [product, mode, setValue]);

  const onSubmitForm = async (data: ProductFormData) => {
    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(data);
      }
      // Don't close drawer immediately, let the parent handle it
      reset();
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    if (onClose) {
      onClose();
    }
  };

  // Handle drawer open/close state
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button className="w-14 h-14 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600">
          <Plus className="w-6 h-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </DrawerTitle>
          <DrawerDescription>
            {mode === "edit"
              ? "Update the product details below."
              : "Fill in the details to add a new product to your catalog."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                         {/* Type of Garment */}
             <div className="space-y-2">
               <Label htmlFor="TypeOfGarment">Type of Garment *</Label>
               <Input
                 id="TypeOfGarment"
                 {...register("TypeOfGarment", {
                   required: "Type of garment is required"
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
                   required: "Color of garment is required"
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
                   required: "Blouse color is required"
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
                   required: "Dupatta color is required"
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
                   min: { value: 0, message: "Rate must be positive" }
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
                   min: { value: 0, message: "Fix code must be positive" }
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
          </form>
        </div>

        <DrawerFooter>
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
                  {mode === "edit" ? "Updating..." : "Adding..."}
                </>
              ) : mode === "edit" ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
