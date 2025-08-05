import React, { useState } from "react";
import { downloadOrderPDF } from "../services/orderService";
import { showToast } from "./Toast";

const PDFTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [customerName, setCustomerName] = useState("");

  const handleDownloadPDF = async () => {
    if (!orderId || !orderNo || !customerName) {
      showToast.error("Missing Information", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await downloadOrderPDF(orderId, orderNo, customerName);
      showToast.success(
        "PDF Downloaded",
        `PDF for order ${orderNo} has been downloaded successfully.`
      );

      // Clear form after successful download
      setOrderId("");
      setOrderNo("");
      setCustomerName("");
    } catch (error: any) {
      showToast.error(
        "Download Failed",
        error.message || "Failed to download PDF. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">PDF Download Test</h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order ID
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter order ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order No
          </label>
          <input
            type="text"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="Enter order number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={loading || !orderId || !orderNo || !customerName}
          className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          {loading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Enter the order ID from your database</li>
          <li>• Enter the order number (e.g., ORD001)</li>
          <li>• Enter the customer name</li>
          <li>• Click "Download PDF" to test the functionality</li>
          <li>
            • The PDF will be downloaded with filename: OrderNo_CustomerName.pdf
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PDFTest;
