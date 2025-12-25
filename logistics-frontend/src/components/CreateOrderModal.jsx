import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, User, Phone, MapPin, Building2, Loader2, Zap } from "lucide-react";
import { createOrder } from "../api/orders.api";

function CreateOrderModal({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        pickupAddress: "",
        deliveryAddress: "",
        city: "",
        autoAssign: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await createOrder(formData);
            if (res.data.success) {
                onSuccess();
                onClose();
            } else {
                setError(res.data.message || "Failed to create order");
            }
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData?.fieldErrors) {
                const errors = Object.values(errorData.fieldErrors).join(", ");
                setError(errors);
            } else {
                setError(errorData?.message || "Failed to create order. Please try again.");
            }
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
                    className="modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="modal-header">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Create New Order</h2>
                                <p className="text-sm text-[#64748b]">Fill in the order details</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-[#64748b] hover:text-white transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-6 mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="modal-body">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">
                                    <User className="w-4 h-4" />
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="John Doe"
                                    required
                                    minLength={2}
                                    maxLength={100}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Phone className="w-4 h-4" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="9876543210"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a 10-digit phone number"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Building2 className="w-4 h-4" />
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="input"
                                placeholder="Mumbai"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <MapPin className="w-4 h-4" />
                                Pickup Address
                            </label>
                            <textarea
                                name="pickupAddress"
                                value={formData.pickupAddress}
                                onChange={handleChange}
                                className="input"
                                placeholder="123 Main Street, Near Metro Station"
                                required
                                rows={2}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <MapPin className="w-4 h-4" />
                                Delivery Address
                            </label>
                            <textarea
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                className="input"
                                placeholder="456 Oak Avenue, Apartment 7B"
                                required
                                rows={2}
                            />
                        </div>

                        {/* Auto-Assign Toggle */}
                        <div className="form-group">
                            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-[#334155] bg-[#1e293b]/50 hover:bg-[#1e293b] transition-colors">
                                <input
                                    type="checkbox"
                                    name="autoAssign"
                                    checked={formData.autoAssign}
                                    onChange={(e) => setFormData(prev => ({ ...prev, autoAssign: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1]"></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <Zap className="w-4 h-4 text-[#f59e0b]" />
                                        Auto-Assign Partner
                                    </div>
                                    <p className="text-xs text-[#64748b] mt-1">
                                        Automatically assign an available delivery partner
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Package className="w-4 h-4" />
                                        Create Order
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

export default CreateOrderModal;
