import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, User, Phone, Mail, Building2, Truck, Loader2 } from "lucide-react";
import { createPartner } from "../api/partners.api";

function CreatePartnerModal({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        city: "",
        vehicleType: "bike",
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
            const res = await createPartner(formData);
            if (res.data.success) {
                onSuccess();
                onClose();
            } else {
                setError(res.data.message || "Failed to create partner");
            }
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData?.fieldErrors) {
                const errors = Object.values(errorData.fieldErrors).join(", ");
                setError(errors);
            } else {
                setError(errorData?.message || "Failed to create partner. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const vehicleTypes = [
        { value: "bike", label: "🏍️ Bike" },
        { value: "scooter", label: "🛵 Scooter" },
        { value: "car", label: "🚗 Car" },
        { value: "van", label: "🚐 Van" },
        { value: "truck", label: "🚚 Truck" },
    ];

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
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#4ade80] flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Add Delivery Partner</h2>
                                <p className="text-sm text-[#64748b]">Register a new partner</p>
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
                                    Partner Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Rahul Kumar"
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
                                    name="phone"
                                    value={formData.phone}
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
                                <Mail className="w-4 h-4" />
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="rahul@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <Truck className="w-4 h-4" />
                                    Vehicle Type
                                </label>
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    {vehicleTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                className="btn btn-success flex-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Users className="w-4 h-4" />
                                        Add Partner
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

export default CreatePartnerModal;
