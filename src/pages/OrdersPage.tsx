import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ExpandableCard } from "../components/ExpandableCard";
import { SearchBar } from "../components/SearchBar";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { Button } from "../components/ui/button";
import type { IOrder } from "../types";
import { showToast } from "../components/Toast";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Loader2, Plus } from "lucide-react";
import {
  deleteOrder,
  clearError,
  fetchOrders,
  searchOrders,
} from "../store/orderSlice";
import { downloadOrderPDF } from "../services/orderService";

export const OrdersPage = () => {
  const navigate = useNavigate();

  // Redux state
  const dispatch = useAppDispatch();
  const { orders, searchResults, loading, error, isSearching } = useAppSelector(
    (state) => state.orders
  );

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    order: IOrder | null;
  }>({ isOpen: false, order: null });

  // Load orders from Redux store on component mount
  useEffect(() => {
    try {
      dispatch(fetchOrders());
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle search with API call
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (value.trim()) {
      setIsSearchActive(true);
      dispatch(searchOrders(value.trim()));
    } else {
      setIsSearchActive(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setIsSearchActive(false);
  };

  // Use search results if searching, otherwise use all orders
  const displayOrders = isSearchActive ? searchResults : orders;
  const isLoading = isSearchActive ? isSearching : loading;

  // Temporarily commented out edit functionality
  // const handleEdit = (order: IOrder) => {
  //   dispatch(setSelectedOrder(order));
  // };

  const handleDelete = (order: IOrder) => {
    setDeleteDialog({ isOpen: true, order });
  };

  const confirmDelete = async () => {
    if (deleteDialog.order) {
      try {
        await dispatch(deleteOrder(deleteDialog.order._id)).unwrap();
        setDeleteDialog({ isOpen: false, order: null });
        showToast.success(
          "Order Deleted",
          `${deleteDialog.order.OrderNo} has been successfully removed.`
        );
        dispatch(fetchOrders());
      } catch (err) {
        console.error("Error deleting order:", err);
        showToast.error(
          "Delete Failed",
          "Unable to delete the order. Please try again."
        );
      }
    }
  };

  const handleAddOrder = () => {
    navigate("/orders/add");
  };

  const handleEditOrder = (order: IOrder) => {
    navigate(`/orders/edit/${order._id}`);
  };

  const handleDownloadPDF = async (order: IOrder) => {
    try {
      await downloadOrderPDF(order._id, order.OrderNo, order.CustomerName);
      showToast.success(
        "PDF Downloaded",
        `PDF for order ${order.OrderNo} has been downloaded successfully.`
      );
    } catch (error: any) {
      console.error("Error downloading PDF:", error);
      showToast.error(
        "Download Failed",
        error.message || "Failed to download PDF. Please try again."
      );
    }
  };

  const handleRefresh = () => {
    dispatch(fetchOrders());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">Manage your order catalog</p>
          </div>
          <Button
            onClick={handleRefresh}
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
              onClick={() => dispatch(fetchOrders())}
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
          placeholder="Search by Order No, Customer Name, or Agent..."
          onClear={handleClearSearch}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4 mb-20">
        {isLoading ? (
          <SkeletonLoader count={6} />
        ) : !displayOrders ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Orders data not available.</p>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No orders found matching your search."
                : "No orders available."}
            </p>
          </div>
        ) : (
          displayOrders.map((order) => (
            <ExpandableCard
              key={order?.OrderNo || Math.random()}
              title={order?.OrderNo || "Unknown"}
              subtitle={order?.CustomerName || "Unknown"}
              price={(order?.totalAmount || 0).toFixed(2)}
              onEdit={() => handleEditOrder(order)}
              onDelete={() => handleDelete(order)}
              onDownloadPDF={() => handleDownloadPDF(order)}
            >
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-600">
                      {order?.Date
                        ? typeof order.Date === "string"
                          ? new Date(order.Date).toLocaleDateString()
                          : order.Date.toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Agent:</span>
                    <p className="text-gray-600">{order?.Agent || "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">
                      Transport:
                    </span>
                    <p className="text-gray-600">{order?.Transport || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Payment Terms:
                    </span>
                    <p className="text-gray-600">
                      {order?.PaymentTerms || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <p className="text-gray-600">{order?.Address || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-600">{order?.PhoneNo || "N/A"}</p>
                </div>
                {order?.Remark && (
                  <div>
                    <span className="font-medium text-gray-700">Remark:</span>
                    <p className="text-gray-600">{order.Remark}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">
                    Order Details:
                  </span>
                  <div className="mt-1 space-y-1">
                    {order?.OrderDetails?.map((detail, index) => (
                      <div
                        key={index}
                        className="pl-2 border-l-2 border-gray-200"
                      >
                        <p className="text-gray-600">
                          {detail?.DesignNo || "N/A"} - Qty:{" "}
                          {detail?.Quantity || 0} - ₹{detail?.UnitPrice || 0} =
                          ₹{detail?.TotalPrice || 0}
                        </p>
                      </div>
                    ))}
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
          onClick={handleAddOrder}
          className="w-14 h-14 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, order: null })}
        onConfirm={confirmDelete}
        title="Delete Order"
        description={`Are you sure you want to delete "${deleteDialog.order?.OrderNo}"? This action cannot be undone and will permanently remove the order from your catalog.`}
        confirmText="Delete Order"
        cancelText="Keep Order"
        type="delete"
      />
    </div>
  );
};
