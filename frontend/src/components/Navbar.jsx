import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGlobeAmericas } from "react-icons/fa";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-4 flex items-center justify-between"
    >
      <Link to="/" className="flex items-center gap-2 group">
        <FaGlobeAmericas className="text-3xl text-primary group-hover:text-accent transition-colors duration-300" />
        <span className="text-xl font-bold tracking-tight text-white">
          Smart<span className="text-gradient">City</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link 
          to="/login" 
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link 
          to="/register" 
          className="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c084fc_0%,#3b82f6_50%,#c084fc_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-opacity-80 transition-all">
            Get Started
          </span>
        </Link>
      </div>
    </motion.nav>
  );
}
