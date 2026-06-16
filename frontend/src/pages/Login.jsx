import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { FaGlobeAmericas } from "react-icons/fa";
import AnimatedTree from "../components/AnimatedTree";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left Side: Animated Brand Area */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-[#050505]">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-secondary rounded-full blur-[150px] opacity-20 pointer-events-none" />
        
        <Link to="/" className="flex items-center gap-2 group z-10 w-fit relative">
          <FaGlobeAmericas className="text-4xl text-primary" />
          <span className="text-2xl font-bold tracking-tight text-white">
            Smart<span className="text-gradient">City</span>
          </span>
        </Link>

        {/* Beautiful Animated SVG Tree in the background */}
        <AnimatedTree />

        <div className="z-10 mt-auto relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold leading-tight mb-6"
          >
            Welcome back to the <br />
            <span className="text-gradient">Sustainable Future</span>.
          </motion.h1>
          <p className="text-gray-400 text-lg max-w-md">
            Log in to manage your carbon footprint, report community issues, and interact with our AI assistant.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-card p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white">Sign In</h2>
            <p className="text-gray-400 mt-2 text-sm">Access your citizen dashboard</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={login} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <button
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:bg-right text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-500 disabled:opacity-50 shadow-[0_0_20px_rgba(147,51,234,0.6)] hover:shadow-[0_0_30px_rgba(0,230,118,0.8)]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:text-accent font-semibold transition-colors">
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}