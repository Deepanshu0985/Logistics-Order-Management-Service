import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Users,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Plus
} from "lucide-react";
import { fetchPartners, updatePartnerStatus } from "../api/partners.api";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import CreatePartnerModal from "../components/CreatePartnerModal";

function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    busy: 0,
    offline: 0
  });

  const loadPartners = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (city && city.trim()) params.city = city.trim();
      const res = await fetchPartners(params);
      const partnerData = res.data.data.content;
      setPartners(partnerData);
      setTotalPages(res.data.data.totalPages);

      // Calculate stats
      const totalElements = res.data.data.totalElements || partnerData.length;
      const available = partnerData.filter(p => p.status === "AVAILABLE").length;
      const busy = partnerData.filter(p => p.status === "BUSY").length;
      const offline = partnerData.filter(p => p.status === "OFFLINE").length;

      setStats({
        total: totalElements,
        available,
        busy,
        offline
      });
    } catch (error) {
      console.error("Failed to load partners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, [page, city]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updatePartnerStatus(id, status);
      loadPartners();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: "Total Partners",
      value: stats.total,
      color: "purple",
      delay: 0
    },
    {
      icon: UserCheck,
      label: "Available",
      value: stats.available,
      color: "green",
      delay: 0.1
    },
    {
      icon: Truck,
      label: "On Delivery",
      value: stats.busy,
      color: "orange",
      delay: 0.2
    },
    {
      icon: UserX,
      label: "Offline",
      value: stats.offline,
      color: "blue",
      delay: 0.3
    }
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid mb-8">
        {statCards.map((stat) => (
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

      {/* Section Header with Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="section-header"
      >
        <div className="section-title">
          <div className="icon">
            <Truck className="w-5 h-5" />
          </div>
          <h2>Delivery Partners</h2>
        </div>

        <div className="flex items-center gap-3">
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
              style={{ width: '220px' }}
            />
          </div>
          <button
            onClick={loadPartners}
            className="btn btn-secondary"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-success"
          >
            <Plus className="w-4 h-4" />
            Add Partner
          </button>
        </div>
      </motion.div>

      {/* Partners Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {loading ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <div className="spinner" />
          </div>
        ) : partners.length === 0 ? (
          <div className="glass-card">
            <div className="empty-state">
              <Users className="w-16 h-16 mx-auto text-[#64748b]" />
              <h3 className="text-white mt-4">No partners found</h3>
              <p className="text-[#64748b]">
                {city ? `No partners in "${city}"` : "Click 'Add Partner' to register one"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-success mt-4"
              >
                <Plus className="w-4 h-4" />
                Add First Partner
              </button>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>City</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner, index) => (
                  <motion.tr
                    key={partner.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-sm">
                          {partner.name?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <span className="font-medium">{partner.name}</span>
                          {partner.email && (
                            <p className="text-xs text-[#64748b]">{partner.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-[#94a3b8]">{partner.city}</td>
                    <td>
                      <span className="inline-flex items-center gap-2 text-[#94a3b8]">
                        <Truck className="w-4 h-4" />
                        {partner.vehicleType}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={partner.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {partner.status !== "AVAILABLE" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(partner.id, "AVAILABLE")}
                            disabled={updatingId === partner.id}
                          >
                            {updatingId === partner.id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                            Available
                          </button>
                        )}
                        {partner.status !== "OFFLINE" && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleStatusChange(partner.id, "OFFLINE")}
                            disabled={updatingId === partner.id}
                          >
                            {updatingId === partner.id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                            Offline
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && partners.length > 0 && (
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

      {/* Create Partner Modal */}
      {showCreateModal && (
        <CreatePartnerModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadPartners}
        />
      )}
    </div>
  );
}

export default PartnersPage;
