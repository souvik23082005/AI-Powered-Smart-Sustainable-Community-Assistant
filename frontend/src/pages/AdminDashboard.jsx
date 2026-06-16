import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaClipboardList, FaChartBar, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const navItems = [
    { name: "Complaint Mgmt", path: "/admin/complaints", icon: <FaClipboardList /> },
    { name: "System Analytics", path: "/admin/analytics", icon: <FaChartBar /> },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#0c0c0e] border-r border-[rgba(255,255,255,0.05)] flex flex-col hidden md:flex"
      >
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-2">
          <FaShieldAlt className="text-red-500 text-xl" />
          <span className="text-xl font-bold tracking-tight text-white">
            Admin<span className="text-red-500">Portal</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span className="text-lg text-red-400">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <FaSignOutAlt />
            <span className="font-medium">Admin Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-[150px] opacity-10 pointer-events-none" />

        {/* Topbar */}
        <header className="h-20 glass-nav px-8 flex items-center justify-between z-10">
          <h1 className="text-2xl font-bold">System Administration</h1>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">System Admin</p>
              <p className="text-xs text-red-400">Superuser</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-extrabold mb-2">Platform Overview</h2>
            <p className="text-gray-400">Manage community complaints and view system analytics.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* KPI 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 border-t-4 border-t-red-500"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 font-medium">System Status</h3>
                <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-white">Healthy</p>
              <p className="text-sm text-gray-400 mt-2">All services operational</p>
            </motion.div>
          </div>

          <h3 className="text-xl font-bold mb-4">Management Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {navItems.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to={item.path}
                  className="glass-card p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-[rgba(255,255,255,0.05)] transition-colors h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-3xl text-red-500">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-xl">{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          
        </div>
      </main>

    </div>
  );
}