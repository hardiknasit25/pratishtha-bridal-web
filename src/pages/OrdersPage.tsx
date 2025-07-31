import { useState, useEffect } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ExpandableCard } from "../components/ExpandableCard";
import { OrderFormDrawer } from "../components/OrderFormDrawer";
import { SearchBar } from "../components/SearchBar";
import type { IOrder } from "../types";
import orderData from "../../OrderData.json";
import { showToast } from "../components/Toast";

export const OrdersPage = () => {
  // Local state for orders and UI
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    order: IOrder | null;
  }>({ isOpen: false, order: null });

  // Load orders from JSON data on component mount
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Convert string dates to Date objects
        const ordersWithDates = orderData.map((order) => ({
          ...order,
          Date: new Date(order.Date),
        }));

        setOrders(ordersWithDates as IOrder[]);
      } catch (err) {
        console.error("Error loading orders:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load orders";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.OrderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.Agent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (order: IOrder) => {
    setSelectedOrder(order);
  };

  const handleDelete = (order: IOrder) => {
    setDeleteDialog({ isOpen: true, order });
  };

  const confirmDelete = async () => {
    if (deleteDialog.order) {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        setOrders((prev) =>
          prev.filter((o) => o.OrderNo !== deleteDialog.order!.OrderNo)
        );
        setDeleteDialog({ isOpen: false, order: null });
        // Show success message
        showToast.success(
          "Order Deleted",
          `${deleteDialog.order.OrderNo} has been successfully removed.`
        );
      } catch (err) {
        console.error("Error deleting order:", err);
        showToast.error(
          "Delete Failed",
          "Unable to delete the order. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitOrder = async (data: {
    Date: string;
    CustomerName: string;
    Address: string;
    PhoneNo: string;
    Agent: string;
    Transport: string;
    PaymentTerms: string;
    OrderDetails: {
      DesignNo: string;
      Quantity: number;
      UnitPrice: number;
      TotalPrice: number;
    }[];
    totalAmount: number;
    Remark?: string;
  }) => {
    const orderData: IOrder = {
      ...data,
      _id: selectedOrder ? selectedOrder._id : `order_${Date.now()}`, // Preserve existing _id or generate temporary one
      OrderNo: selectedOrder ? selectedOrder.OrderNo : `ORD${Date.now()}`, // Preserve existing OrderNo or generate temporary one
      Date: new Date(data.Date), // Convert string date to Date object
      Remark: data.Remark || "", // Ensure Remark is always a string
    };
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (selectedOrder) {
        // Update existing order
        setOrders((prev) =>
          prev.map((o) => (o.OrderNo === selectedOrder.OrderNo ? orderData : o))
        );
        // Show success message
        showToast.success(
          "Order Updated",
          `${selectedOrder.OrderNo} has been successfully updated.`
        );
      } else {
        // Add new order
        setOrders((prev) => [...prev, orderData]);
        // Show success message
        showToast.success(
          "Order Created",
          `New order for ${data.CustomerName} has been successfully created.`
        );
      }
      setSelectedOrder(null);
    } catch (err) {
      console.error("Error saving order:", err);
      showToast.error(
        "Operation Failed",
        "Unable to save the order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerClose = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage your order catalog</p>
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
          placeholder="Search by Order No, Customer Name, or Agent..."
          onClear={() => setSearchTerm("")}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4 mb-20">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No orders found matching your search."
                : "No orders available."}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <ExpandableCard
              key={order.OrderNo}
              title={order.OrderNo}
              subtitle={order.CustomerName}
              price={order.totalAmount.toFixed(2)}
              onEdit={() => handleEdit(order)}
              onDelete={() => handleDelete(order)}
            >
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-600">
                      {order.Date.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Agent:</span>
                    <p className="text-gray-600">{order.Agent}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700">
                      Transport:
                    </span>
                    <p className="text-gray-600">{order.Transport}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Payment Terms:
                    </span>
                    <p className="text-gray-600">{order.PaymentTerms}</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <p className="text-gray-600">{order.Address}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-600">{order.PhoneNo}</p>
                </div>
                {order.Remark && (
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
                    {order.OrderDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="pl-2 border-l-2 border-gray-200"
                      >
                        <p className="text-gray-600">
                          {detail.DesignNo} - Qty: {detail.Quantity} - ₹
                          {detail.UnitPrice} = ₹{detail.TotalPrice}
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
        <OrderFormDrawer
          order={selectedOrder || undefined}
          mode={selectedOrder ? "edit" : "create"}
          onSubmit={handleSubmitOrder}
          onClose={handleDrawerClose}
        />
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
