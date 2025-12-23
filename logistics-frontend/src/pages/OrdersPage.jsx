import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  TruckIcon,
  AlertCircle,
  Plus,
  Search,
  RefreshCw,
  Filter
} from "lucide-react";
import { fetchOrders } from "../api/orders.api";
import OrdersTable from "../components/OrdersTable";
import Pagination from "../components/Pagination";
import CreateOrderModal from "../components/CreateOrderModal";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    placed: 0,
    inProgress: 0,
    delivered: 0
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (city) params.city = city;
      if (status) params.status = status;

      const res = await fetchOrders(params);
      const orderData = res.data.data.content;
      setOrders(orderData);
      setTotalPages(res.data.data.totalPages);

      // Calculate stats
      const totalElements = res.data.data.totalElements || orderData.length;
      const placed = orderData.filter(o => o.status === "PLACED").length;
      const inProgress = orderData.filter(o => ["ASSIGNED", "PICKED"].includes(o.status)).length;
      const delivered = orderData.filter(o => o.status === "DELIVERED").length;

      setStats({
        total: totalElements,
        placed,
        inProgress,
        delivered
      });
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, city, status]);

  const handleClearFilters = () => {
    setCity("");
    setStatus("");
    setPage(0);
  };

  const statCards = [
    {
      icon: Package,
      label: "Total Orders",
      value: stats.total,
      color: "purple",
      delay: 0
    },
    {
      icon: Clock,
      label: "Pending",
      value: stats.placed,
      color: "orange",
      delay: 0.1
    },
    {
      icon: TruckIcon,
      label: "In Transit",
      value: stats.inProgress,
      color: "blue",
      delay: 0.2
    },
    {
      icon: CheckCircle2,
      label: "Delivered",
      value: stats.delivered,
      color: "green",
      delay: 0.3
    }
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "PLACED", label: "Placed" },
    { value: "ASSIGNED", label: "Assigned" },
    { value: "PICKED", label: "Picked" },
    { value: "DELIVERED", label: "Delivered" }
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: stat.delay }}
            className="stat-card"
          >
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section Header with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="section-header"
      >
        <div className="section-title">
          <div className="icon">
            <Package className="w-5 h-5" />
          </div>
          <h2>Recent Orders</h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* City Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Filter by city..."
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(0);
              }}
              className="input pl-10"
              style={{ width: '180px' }}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              className="input pl-10"
              style={{ width: '150px' }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(city || status) && (
            <button
              onClick={handleClearFilters}
              className="btn btn-secondary btn-sm"
            >
              Clear
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={loadOrders}
            className="btn btn-secondary"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Create Order */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {loading ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <div className="spinner" />
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card">
            <div className="empty-state">
              <AlertCircle className="w-16 h-16 mx-auto text-[#64748b]" />
              <h3 className="text-white mt-4">No orders found</h3>
              <p className="text-[#64748b]">
                {city || status ? "Try adjusting your filters" : "Click 'New Order' to create one"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary mt-4"
              >
                <Plus className="w-4 h-4" />
                Create First Order
              </button>
            </div>
          </div>
        ) : (
          <OrdersTable orders={orders} onRefresh={loadOrders} />
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </motion.div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadOrders}
        />
      )}
    </div>
  );
}

export default OrdersPage;
