import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ExpandableCard } from "../components/ExpandableCard";
import { SearchBar } from "../components/SearchBar";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { Button } from "../components/ui/button";
import { Loader2, Plus } from "lucide-react";
import type { ProductDetails } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchProducts,
  deleteProduct,
  searchProducts,
} from "../store/productSlice";
import { showToast } from "../components/Toast";

export const ProductsPage = () => {
  const navigate = useNavigate();

  // Redux state
  const { products, searchResults, loading, error, isSearching } =
    useAppSelector((state) => state.products);

  // Add error boundary for component
  if (error && !loading) {
    console.error("ProductsPage error:", error);
  }

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    product: ProductDetails | null;
  }>({ isOpen: false, product: null });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle search with API call
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (value.trim()) {
      setIsSearchActive(true);
      dispatch(searchProducts(value.trim()));
    } else {
      setIsSearchActive(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setIsSearchActive(false);
  };

  // Use search results if searching, otherwise use all products
  const displayProducts = isSearchActive ? searchResults : products;
  const isLoading = isSearchActive ? isSearching : loading;

  const handleEdit = (product: ProductDetails) => {
    navigate(`/products/edit/${product._id}`);
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
        showToast.success(
          "Product Deleted",
          `${deleteDialog.product.DesignNo} has been successfully removed from your catalog.`
        );
      } catch (err) {
        console.error("Error deleting product:", err);
        showToast.error(
          "Delete Failed",
          "Unable to delete the product. Please try again."
        );
      }
    }
  };

  const handleAddProduct = () => {
    navigate("/products/add");
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
          onChange={handleSearch}
          placeholder="Search by Design No, Type, or Color..."
          onClear={handleClearSearch}
        />
      </div>

      {/* Products List */}
      <div className="space-y-4 mb-20">
        {isLoading ? (
          <SkeletonLoader count={6} />
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No products found matching your search."
                : "No products available."}
            </p>
          </div>
        ) : (
          displayProducts.map((product) => (
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
                    <p className="text-gray-600">
                      {product?.ColorOfGarment || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Blouse Color:
                    </span>
                    <p className="text-gray-600">
                      {product?.BlouseColor || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">
                      Dupatta Color:
                    </span>
                    <p className="text-gray-600">
                      {product?.DupptaColor || "N/A"}
                    </p>
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
        <Button
          onClick={handleAddProduct}
          className="w-14 h-14 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600"
        >
          <Plus className="w-6 h-6" />
        </Button>
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
