import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cancelOrder } from "../api/orders.api";

function CancelOrderModal({ order, onClose, onSuccess }) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reason.length < 5) {
            setError("Please provide a reason (at least 5 characters)");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await cancelOrder(order.id, reason);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel order");
        } finally {
            setLoading(false);
        }
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
                    className="modal-content max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ef4444] to-[#dc2626] flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Cancel Order</h2>
                                <p className="text-sm text-[#64748b]">{order.orderNumber}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-[#64748b] hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Warning */}
                    <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-[#f59e0b] mt-0.5" />
                        <div>
                            <p className="text-[#f59e0b] font-medium">This action cannot be undone</p>
                            <p className="text-[#f59e0b]/70 text-sm mt-1">
                                Cancelling this order will notify the customer and release any assigned delivery partner.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="label">Cancellation Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setError("");
                                }}
                                className="input w-full"
                                rows={3}
                                placeholder="Why is this order being cancelled?"
                                required
                            />
                            {error && (
                                <p className="text-[#ef4444] text-sm mt-2">{error}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Keep Order
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn"
                                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <XCircle className="w-5 h-5" />
                                        Cancel Order
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default CancelOrderModal;
