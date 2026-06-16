import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal, FaAward, FaStar } from "react-icons/fa";
import api from "../services/api";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/api/leaderboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setLeaders(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      
      {/* Background orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-yellow-500 rounded-full blur-[200px] opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-10 text-center">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-4">
            <FaTrophy className="text-yellow-500" />
            Community <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Recognizing the top citizens driving sustainable impact across our smart city. Earn points by reporting issues and reducing carbon footprint.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {leaders.map((user, idx) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-card p-4 md:p-6 flex items-center gap-4 md:gap-6 ${
                  idx === 0 ? 'border-yellow-500/50 bg-yellow-500/5 scale-[1.02] transform' : 
                  idx === 1 ? 'border-gray-400/50 bg-gray-400/5' :
                  idx === 2 ? 'border-orange-600/50 bg-orange-600/5' : ''
                }`}
              >
                
                <div className="flex-shrink-0 w-12 text-center">
                  {idx === 0 ? <FaMedal className="text-4xl text-yellow-500 mx-auto" /> :
                   idx === 1 ? <FaMedal className="text-3xl text-gray-400 mx-auto" /> :
                   idx === 2 ? <FaMedal className="text-3xl text-orange-600 mx-auto" /> :
                   <span className="text-2xl font-bold text-gray-500">#{idx + 1}</span>}
                </div>

                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user.full_name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate flex items-center gap-2">
                    {user.full_name}
                    {user.level > 1 && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                        Lvl {user.level}
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.badges && user.badges.length > 0 ? (
                      user.badges.map((b, i) => (
                        <span key={i} className="text-[10px] bg-[rgba(255,255,255,0.05)] text-gray-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <FaAward className="text-yellow-500" /> {b}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-gray-600">No badges yet</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-extrabold text-white flex items-center gap-1">
                    {user.sustainability_score} <FaStar className="text-yellow-500 text-sm" />
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Points</p>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
