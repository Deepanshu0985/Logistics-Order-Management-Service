import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Package, TruckIcon, XCircle, CheckCircle, ArrowRight } from "lucide-react";

function NotificationToast({ notification, onClose }) {
    const getIcon = () => {
        switch (notification.type) {
            case "ORDER_CREATED":
                return <Package className="w-5 h-5 text-[#6366f1]" />;
            case "STATUS_CHANGED":
                return <ArrowRight className="w-5 h-5 text-[#f59e0b]" />;
            case "PARTNER_ASSIGNED":
                return <TruckIcon className="w-5 h-5 text-[#10b981]" />;
            case "ORDER_CANCELLED":
                return <XCircle className="w-5 h-5 text-[#ef4444]" />;
            default:
                return <Bell className="w-5 h-5 text-[#64748b]" />;
        }
    };

    const getBgColor = () => {
        switch (notification.type) {
            case "ORDER_CREATED": return "from-[#6366f1]/20 to-[#6366f1]/10 border-[#6366f1]/30";
            case "STATUS_CHANGED": return "from-[#f59e0b]/20 to-[#f59e0b]/10 border-[#f59e0b]/30";
            case "PARTNER_ASSIGNED": return "from-[#10b981]/20 to-[#10b981]/10 border-[#10b981]/30";
            case "ORDER_CANCELLED": return "from-[#ef4444]/20 to-[#ef4444]/10 border-[#ef4444]/30";
            default: return "from-[#64748b]/20 to-[#64748b]/10 border-[#64748b]/30";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`bg-gradient-to-r ${getBgColor()} backdrop-blur-xl border rounded-xl p-4 shadow-xl min-w-[320px] max-w-[400px]`}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon()}</div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">
                            {notification.type.replace("_", " ")}
                        </span>
                        <button
                            onClick={onClose}
                            className="text-[#64748b] hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[#94a3b8] text-sm mt-1">{notification.message}</p>
                    <p className="text-[#64748b] text-xs mt-2">
                        {notification.orderNumber}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export function NotificationContainer({ notifications, onDismiss }) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <NotificationToast
                        key={notification.id || notification.timestamp}
                        notification={notification}
                        onClose={() => onDismiss(notification.id || notification.timestamp)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export default NotificationToast;
