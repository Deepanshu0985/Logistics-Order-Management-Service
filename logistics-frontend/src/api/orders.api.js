import api from "./axios";

export const fetchOrders = (params) => {
  return api.get("/orders", { params });
};

export const fetchOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const fetchOrderByNumber = (orderNumber) => {
  return api.get(`/orders/number/${orderNumber}`);
};

export const createOrder = (data) => {
  return api.post("/orders", data);
};

export const assignPartner = (orderId, partnerId) => {
  return api.put(`/orders/${orderId}/assign`, {
    deliveryPartnerId: partnerId,
  });
};

export const updateOrderStatus = (orderId, status) => {
  return api.put(`/orders/${orderId}/status`, { status });
};

// New: Cancel order
export const cancelOrder = (orderId, reason) => {
  return api.put(`/orders/${orderId}/cancel`, { reason });
};

// New: Get order history/audit logs
export const fetchOrderHistory = (orderId) => {
  return api.get(`/orders/${orderId}/history`);
};
