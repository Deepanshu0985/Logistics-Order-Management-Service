import {
  Clock,
  UserCheck,
  Truck,
  PackageCheck,
  CircleDot,
  UserX,
  Zap
} from "lucide-react";

const STATUS_CONFIG = {
  // Order statuses
  PLACED: {
    icon: Clock,
    className: "badge-placed",
    label: "Placed"
  },
  ASSIGNED: {
    icon: UserCheck,
    className: "badge-assigned",
    label: "Assigned"
  },
  PICKED: {
    icon: Truck,
    className: "badge-picked",
    label: "In Transit"
  },
  DELIVERED: {
    icon: PackageCheck,
    className: "badge-delivered",
    label: "Delivered"
  },
  // Partner statuses
  AVAILABLE: {
    icon: Zap,
    className: "badge-available",
    label: "Available"
  },
  BUSY: {
    icon: Truck,
    className: "badge-busy",
    label: "On Delivery"
  },
  OFFLINE: {
    icon: UserX,
    className: "badge-offline",
    label: "Offline"
  }
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    icon: CircleDot,
    className: "badge-offline",
    label: status
  };

  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export default StatusBadge;
