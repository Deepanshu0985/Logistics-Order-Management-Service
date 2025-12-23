import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  X,
  Truck,
  CheckCircle,
  AlertCircle,
  Package
} from "lucide-react";
import { fetchAvailablePartners } from "../api/partners.api";
import { assignPartner } from "../api/orders.api";

function AssignPartnerModal({ order, onClose, onSuccess }) {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      try {
        const res = await fetchAvailablePartners(order.city);
        setPartners(res.data.data || []);
      } catch (error) {
        console.error("Failed to load partners:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, [order.city]);

  const handleAssign = async () => {
    if (!selected) return;
    setAssigning(true);
    try {
      await assignPartner(order.id, selected);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to assign partner:", error);
    } finally {
      setAssigning(false);
    }
  };

  const selectedPartner = partners.find(p => p.id.toString() === selected);

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Assign Partner</h3>
                <p className="text-[#64748b] text-sm">
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#64748b] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Info */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center border border-[#6366f1]/30">
                <Package className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <div>
                <p className="font-medium text-white">{order.customerName}</p>
                <p className="text-sm text-[#64748b]">{order.city}</p>
              </div>
            </div>
          </div>

          {/* Partner Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#94a3b8] mb-3">
              Select Delivery Partner
            </label>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner" />
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-[#64748b] mx-auto mb-3" />
                <p className="text-[#94a3b8]">No available partners in {order.city}</p>
              </div>
            ) : (
              <select
                className="select"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="">Choose a partner...</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name} • {partner.vehicleType}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Partner Preview */}
          {selectedPartner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-xl p-4 mb-6 border border-[#6366f1]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10b981] to-[#4ade80] flex items-center justify-center text-white font-bold">
                  {selectedPartner.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{selectedPartner.name}</p>
                  <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
                    <Truck className="w-4 h-4" />
                    {selectedPartner.vehicleType}
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-[#4ade80]" />
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="btn btn-secondary flex-1"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary flex-1"
              disabled={!selected || assigning}
              onClick={handleAssign}
            >
              {assigning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Assign Partner
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AssignPartnerModal;
