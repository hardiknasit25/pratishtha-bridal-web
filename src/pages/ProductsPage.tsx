import { useState, useEffect } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ExpandableCard } from "../components/ExpandableCard";
import { ProductFormDrawer } from "../components/ProductFormDrawer";
import { SearchBar } from "../components/SearchBar";
import type { ProductDetails } from "../types";
import productData from "../../ProductData.json";

export const ProductsPage = () => {
  // Local state for products and UI
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    product: ProductDetails | null;
  }>({ isOpen: false, product: null });

  // Load products from JSON data on component mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Load from JSON data
        setProducts(productData as ProductDetails[]);
      } catch (err) {
        console.error("Error loading products:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load products";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.DesignNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.TypeOfGarment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ColorOfGarment.toLowerCase().includes(searchTerm.toLowerCase())
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
        setLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        setProducts((prev) =>
          prev.filter((p) => p.DesignNo !== deleteDialog.product!.DesignNo)
        );
        setDeleteDialog({ isOpen: false, product: null });
      } catch (err) {
        console.error("Error deleting product:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete product";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitProduct = async (data: ProductDetails) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (selectedProduct) {
        // Update existing product
        setProducts((prev) =>
          prev.map((p) => (p.DesignNo === selectedProduct.DesignNo ? data : p))
        );
      } else {
        // Add new product
        setProducts((prev) => [...prev, data]);
      }
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save product";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerClose = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Manage your product catalog</p>
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
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
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
              key={product.DesignNo}
              title={product.DesignNo}
              subtitle={product.TypeOfGarment}
              price={product.Rate.toFixed(2)}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product)}
            >
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">
                      Garment Color:
                    </span>
                    <p className="text-gray-600">{product.ColorOfGarment}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Blouse Color:
                    </span>
                    <p className="text-gray-600">{product.BlouseColor}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">
                      Dupatta Color:
                    </span>
                    <p className="text-gray-600">{product.DupptaColor}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Fix Code:</span>
                    <p className="text-gray-600">{product.FixCode}</p>
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
