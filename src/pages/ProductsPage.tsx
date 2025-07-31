import { useState, useEffect } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ExpandableCard } from "../components/ExpandableCard";
import { ProductFormDrawer } from "../components/ProductFormDrawer";
import { SearchBar } from "../components/SearchBar";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import type { AddProduct, ProductDetails } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../store/productSlice";

export const ProductsPage = () => {
  // Redux state
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );

  // Add error boundary for component
  if (error && !loading) {
    console.error("ProductsPage error:", error);
  }

  // Local state for UI
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    product: ProductDetails | null;
  }>({ isOpen: false, product: null });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = (products || []).filter(
    (product) =>
      product?.DesignNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.TypeOfGarment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.ColorOfGarment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: ProductDetails) => {
    setSelectedProduct(product);
  };

  const handleDelete = (product: ProductDetails) => {
    setDeleteDialog({ isOpen: true, product });
  };

  const confirmDelete = async () => {
    if (deleteDialog.product) {
      try {
        await dispatch(deleteProduct(deleteDialog.product._id)).unwrap();
        setDeleteDialog({ isOpen: false, product: null });
        // Show success message
        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const handleSubmitProduct = async (
    data: Omit<ProductDetails, "DesignNo" | "_id">
  ) => {
    try {
      if (selectedProduct) {
        // Update existing product - preserve DesignNo and id
        const updatedProduct: ProductDetails = {
          ...data,
          _id: selectedProduct._id,
          DesignNo: selectedProduct.DesignNo,
        };
        await dispatch(updateProduct(updatedProduct)).unwrap();
        // Show success message
        alert("Product updated successfully!");
      } else {
        // Add new product - generate temporary DesignNo and id for demo
        const newProduct: AddProduct = {
          ...data,
        };
        console.log("Submitting new product:", newProduct);
        const result = await dispatch(createProduct(newProduct)).unwrap();
        console.log("Product creation result:", result);
        // Show success message
        alert("Product created successfully!");
      }
      // Clear selected product after successful submission
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product. Please try again.");
    }
  };

  const handleDrawerClose = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Button
            onClick={() => dispatch(fetchProducts())}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>↻</span>
            )}
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by Design No, Type, or Color..."
          onClear={() => setSearchTerm("")}
        />
      </div>

      {/* Products List */}
      <div className="space-y-4 mb-20">
        {loading ? (
          <SkeletonLoader count={6} type="product" />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No products found matching your search."
                : "No products available."}
            </p>
          </div>
        ) : (
                     filteredProducts.map((product) => (
             <ExpandableCard
               key={product?._id || product?.DesignNo || Math.random()}
               title={product?.DesignNo || "Unknown"}
               subtitle={product?.TypeOfGarment || "Unknown"}
               price={(product?.Rate || 0).toFixed(2)}
               onEdit={() => handleEdit(product)}
               onDelete={() => handleDelete(product)}
             >
                             <div className="space-y-2 text-sm">
                 <div className="grid grid-cols-2 gap-2">
                   <div>
                     <span className="font-medium text-gray-700">
                       Garment Color:
                     </span>
                     <p className="text-gray-600">{product?.ColorOfGarment || "N/A"}</p>
                   </div>
                   <div>
                     <span className="font-medium text-gray-700">
                       Blouse Color:
                     </span>
                     <p className="text-gray-600">{product?.BlouseColor || "N/A"}</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <div>
                     <span className="font-medium text-gray-700">
                       Dupatta Color:
                     </span>
                     <p className="text-gray-600">{product?.DupptaColor || "N/A"}</p>
                   </div>
                   <div>
                     <span className="font-medium text-gray-700">Fix Code:</span>
                     <p className="text-gray-600">{product?.FixCode || "N/A"}</p>
                   </div>
                 </div>
               </div>
            </ExpandableCard>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <ProductFormDrawer
          product={selectedProduct || undefined}
          mode={selectedProduct ? "edit" : "create"}
          onSubmit={handleSubmitProduct}
          onClose={handleDrawerClose}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, product: null })}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteDialog.product?.DesignNo}"? This action cannot be undone and will permanently remove the product from your catalog.`}
        confirmText="Delete Product"
        cancelText="Keep Product"
        type="delete"
      />
    </div>
  );
};
