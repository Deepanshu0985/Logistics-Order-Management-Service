import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, LayoutDashboard, Sparkles, LogOut, User, Wifi, WifiOff } from "lucide-react";
import OrdersPage from "./pages/OrdersPage";
import PartnersPage from "./pages/PartnersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationContainer } from "./components/NotificationToast";
import { useWebSocket } from "./hooks/useWebSocket";

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [tab, setTab] = useState("orders");
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev.slice(-4), { ...notification, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const { connected } = useWebSocket(handleNotification);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Logistics Dashboard
                </h1>
                <p className="text-[#64748b] text-sm flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4" />
                  Real-time order & partner management
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* WebSocket Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${connected
                  ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
                  : "bg-[#64748b]/20 text-[#64748b] border border-[#64748b]/30"
                }`}>
                {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {connected ? "Live" : "Offline"}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1e293b] border border-[#334155]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-[#64748b] text-xs">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 p-2 rounded-lg hover:bg-[#334155] transition-colors text-[#64748b] hover:text-white"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Tab Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="tabs inline-flex">
            <button
              className={`tab ${tab === "orders" ? "active" : ""}`}
              onClick={() => setTab("orders")}
            >
              <Package className="w-5 h-5" />
              <span>Orders</span>
            </button>

            <button
              className={`tab ${tab === "partners" ? "active" : ""}`}
              onClick={() => setTab("partners")}
            >
              <Truck className="w-5 h-5" />
              <span>Partners</span>
            </button>
          </div>
        </motion.nav>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={tab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {tab === "orders" ? <OrdersPage /> : <PartnersPage />}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center text-[#64748b] text-sm"
        >
          <p>
            <a href="https://github.com/Deepanshu0985">Github</a>
          </p>
        </motion.footer>
      </div>

      {/* Real-time Notifications */}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}

function AuthWrapper() {
  const { isAuthenticated, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <LoginPage onSwitchToRegister={() => setShowRegister(true)} />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;
