import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { FaShieldAlt } from "react-icons/fa";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/admin/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden text-foreground">
      {/* Background orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-red-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-card p-10 relative z-10"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
            <FaShieldAlt className="text-3xl text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-gray-400 mt-2 text-sm">Secure Access Required</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              required
              placeholder="admin"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>

          <button
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-2 transition-all duration-200"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-background px-4 py-3.5 rounded-xl transition-all group-hover:bg-opacity-0">
              <span className="text-white font-bold group-hover:text-white relative z-10 block w-full">
                {loading ? "Authenticating..." : "Login as Admin"}
              </span>
            </div>
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">
              ← Return to Home
            </Link>
        </div>
      </motion.div>
    </div>
  );
}