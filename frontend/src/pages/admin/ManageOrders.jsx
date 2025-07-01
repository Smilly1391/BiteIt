import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const storedOrdersRaw = JSON.parse(localStorage.getItem("orders")) || [];
    const parsedOrders = storedOrdersRaw.map((order) => {
      let userObj = order.user;

      // Try to parse user if it's a JSON string, else keep as is
      if (typeof userObj === "string") {
        try {
          userObj = JSON.parse(userObj);
        } catch {
          // If parsing fails, keep userObj as string (likely username)
        }
      }

      return {
        ...order,
        user: userObj || {},
      };
    });
    setOrders(parsedOrders);
  }, []);

  const confirmDelete = (id) => setSelectedOrderId(id);

  const handleDelete = () => {
    const updated = orders.filter((order) => order.id !== selectedOrderId);
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
    setSelectedOrderId(null);
    window.dispatchEvent(new Event("ordersUpdated"));
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mb-6 flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <FaArrowLeft /> Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Manage Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
            <thead>
              <tr className="text-left bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th className="p-3">Order ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b dark:border-gray-700">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">
                    {typeof order.user === "object"
                      ? order.user.username || order.user.email || "—"
                      : order.user || "—"}
                  </td>
                  <td className="p-3">
                    <ul className="list-disc pl-4 text-sm">
                      {order.items?.map((item, index) => (
                        <li key={index}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3">₹{order.total || 0}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="bg-gray-100 dark:bg-gray-700 dark:text-white px-2 py-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-300">
                    {order.date || "—"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => confirmDelete(order.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Delete
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this order?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
