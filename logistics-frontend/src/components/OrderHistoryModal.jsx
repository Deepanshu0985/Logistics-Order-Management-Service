import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, User, ArrowRight, Package, TruckIcon, XCircle, CheckCircle } from "lucide-react";
import { fetchOrderHistory } from "../api/orders.api";

function OrderHistoryModal({ orderId, orderNumber, onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const response = await fetchOrderHistory(orderId);
                setHistory(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load history");
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, [orderId]);

    const getActionIcon = (action) => {
        switch (action) {
            case "CREATED":
                return <Package className="w-5 h-5 text-[#6366f1]" />;
            case "STATUS_CHANGED":
                return <ArrowRight className="w-5 h-5 text-[#f59e0b]" />;
            case "PARTNER_ASSIGNED":
                return <TruckIcon className="w-5 h-5 text-[#10b981]" />;
            case "CANCELLED":
                return <XCircle className="w-5 h-5 text-[#ef4444]" />;
            default:
                return <Clock className="w-5 h-5 text-[#64748b]" />;
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case "CREATED": return "bg-[#6366f1]/20 border-[#6366f1]/30";
            case "STATUS_CHANGED": return "bg-[#f59e0b]/20 border-[#f59e0b]/30";
            case "PARTNER_ASSIGNED": return "bg-[#10b981]/20 border-[#10b981]/30";
            case "CANCELLED": return "bg-[#ef4444]/20 border-[#ef4444]/30";
            default: return "bg-[#64748b]/20 border-[#64748b]/30";
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-overlay"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="modal-content max-w-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Order History</h2>
                                <p className="text-sm text-[#64748b]">{orderNumber}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-[#64748b] hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="py-12 flex justify-center">
                            <div className="spinner" />
                        </div>
                    ) : error ? (
                        <div className="py-8 text-center text-[#ef4444]">{error}</div>
                    ) : history.length === 0 ? (
                        <div className="py-8 text-center text-[#64748b]">No history found</div>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {history.map((entry, index) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative pl-8 pb-4 ${index !== history.length - 1 ? "border-l-2 border-[#1e293b] ml-2" : ""}`}
                                >
                                    {/* Timeline dot */}
                                    <div className={`absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full border ${getActionColor(entry.action)} flex items-center justify-center`}>
                                        {getActionIcon(entry.action)}
                                    </div>

                                    {/* Content */}
                                    <div className="bg-[#0f172a]/50 rounded-lg p-4 ml-4 border border-[#1e293b]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">{entry.action.replace("_", " ")}</span>
                                            <span className="text-xs text-[#64748b]">{formatDate(entry.createdAt)}</span>
                                        </div>
                                        <p className="text-[#94a3b8] text-sm">{entry.notes}</p>
                                        {entry.oldValue && entry.newValue && (
                                            <div className="flex items-center gap-2 mt-2 text-sm">
                                                <span className="px-2 py-1 rounded bg-[#1e293b] text-[#64748b]">{entry.oldValue}</span>
                                                <ArrowRight className="w-4 h-4 text-[#64748b]" />
                                                <span className="px-2 py-1 rounded bg-[#10b981]/20 text-[#10b981]">{entry.newValue}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-2 text-xs text-[#64748b]">
                                            <User className="w-3 h-3" />
                                            {entry.performedBy}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Close button */}
                    <div className="mt-6 flex justify-end">
                        <button onClick={onClose} className="btn btn-secondary">
                            Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default OrderHistoryModal;
