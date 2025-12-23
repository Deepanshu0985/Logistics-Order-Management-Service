import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  User,
  MapPin,
  UserPlus,
  PackageCheck,
  Truck,
  Loader2
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import AssignPartnerModal from "./AssignPartnerModal";
import { updateOrderStatus } from "../api/orders.api";

function OrdersTable({ orders, onRefresh }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      onRefresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Location</th>
              <th>Status</th>
              <th>Partner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center border border-[#6366f1]/30">
                      <Package className="w-5 h-5 text-[#a78bfa]" />
                    </div>
                    <span className="font-semibold text-white">
                      #{order.orderNumber}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-[#94a3b8]">
                    <User className="w-4 h-4" />
                    <div>
                      <span>{order.customerName}</span>
                      <p className="text-xs text-[#64748b]">{order.customerPhone}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-[#94a3b8]">
                    <MapPin className="w-4 h-4" />
                    {order.city}
                  </div>
                </td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>
                  {order.deliveryPartner ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#4ade80] flex items-center justify-center text-white font-semibold text-xs">
                        {order.deliveryPartner.name?.charAt(0)?.toUpperCase() || "P"}
                      </div>
                      <span className="text-[#94a3b8]">{order.deliveryPartner.name}</span>
                    </div>
                  ) : (
                    <span className="text-[#64748b] italic">Unassigned</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {order.status === "PLACED" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <UserPlus className="w-4 h-4" />
                        Assign
                      </button>
                    )}

                    {order.status === "ASSIGNED" && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleStatusChange(order.id, "PICKED")}
                        disabled={updatingId === order.id}
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                        Picked Up
                      </button>
                    )}

                    {order.status === "PICKED" && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusChange(order.id, "DELIVERED")}
                        disabled={updatingId === order.id}
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <PackageCheck className="w-4 h-4" />
                        )}
                        Delivered
                      </button>
                    )}

                    {order.status === "DELIVERED" && (
                      <span className="text-[#4ade80] text-sm font-medium flex items-center gap-1">
                        <PackageCheck className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Partner Modal */}
      {selectedOrder && (
        <AssignPartnerModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}

export default OrdersTable;
