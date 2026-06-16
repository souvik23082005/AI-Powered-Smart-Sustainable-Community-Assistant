import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLeaf, FaRobot, FaClipboardList, FaExclamationTriangle, FaChartLine, FaSignOutAlt, FaBell, FaTrophy, FaAward } from "react-icons/fa";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    api.get("/api/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(err => {
      console.log(err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { name: "AI Assistant", path: "/chatbot", icon: <FaRobot /> },
    { name: "Report Issue", path: "/report", icon: <FaExclamationTriangle /> },
    { name: "Carbon Calculator", path: "/carbon", icon: <FaLeaf /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <FaTrophy /> },
    { name: "Carbon History", path: "/carbon-history", icon: <FaChartLine /> },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#0c0c0e] border-r border-[rgba(255,255,255,0.05)] flex flex-col hidden md:flex"
      >
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)]">
          <Link to="/" className="text-xl font-bold tracking-tight text-white">
            Smart<span className="text-gradient">City</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
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
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-10 pointer-events-none" />

        {/* Topbar */}
        <header className="h-20 glass-nav px-8 flex items-center justify-between z-10">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
            </button>
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white flex items-center gap-2 justify-end">
                    {user.full_name}
                    {user.level && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                        Lvl {user.level}
                      </span>
                    )}
                  </p>
                  <div className="flex gap-1 justify-end mt-1">
                    {user.badges && user.badges.slice(0, 3).map((b, i) => (
                      <span key={i} title={b} className="text-yellow-500 text-xs"><FaAward /></span>
                    ))}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
                  {user.full_name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-extrabold mb-2">Welcome back!</h2>
            <p className="text-gray-400">Here's your community impact overview.</p>
          </motion.div>

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              
              {/* KPI 1: Sustainability Score */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 border-t-4 border-t-primary"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-400 font-medium">Sustainability Score</h3>
                  <div className="p-2 bg-primary/20 rounded-lg text-primary"><FaLeaf /></div>
                </div>
                <p className="text-4xl font-extrabold text-white">{user.sustainability_score}</p>
                <p className="text-sm text-green-400 mt-2">+5 since last week</p>
              </motion.div>

              {/* KPI 2: Active Reports */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 border-t-4 border-t-secondary"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-400 font-medium">Active Reports</h3>
                  <div className="p-2 bg-secondary/20 rounded-lg text-secondary"><FaExclamationTriangle /></div>
                </div>
                <p className="text-4xl font-extrabold text-white">2</p>
                <p className="text-sm text-gray-400 mt-2">In progress</p>
              </motion.div>

              {/* KPI 3: Carbon Offset */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 border-t-4 border-t-accent"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-400 font-medium">Carbon Offset</h3>
                  <div className="p-2 bg-accent/20 rounded-lg text-accent"><FaChartLine /></div>
                </div>
                <p className="text-4xl font-extrabold text-white">14.2 <span className="text-lg text-gray-400">kg</span></p>
                <p className="text-sm text-gray-400 mt-2">Estimated this month</p>
              </motion.div>
            </div>
          )}

          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {navItems.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to={item.path}
                  className="glass-card p-5 flex flex-col items-center justify-center gap-3 text-center hover:bg-[rgba(255,255,255,0.05)] transition-colors h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-xl text-primary">
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          
        </div>
      </main>

    </div>
  );
}