import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, LayoutDashboard, Sparkles } from "lucide-react";
import OrdersPage from "./pages/OrdersPage";
import PartnersPage from "./pages/PartnersPage";

function App() {
  const [tab, setTab] = useState("orders");
  const [mounted, setMounted] = useState(false);

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
          <div className="flex items-center gap-4 mb-2">
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
            Built with ❤️ for efficient logistics management
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
