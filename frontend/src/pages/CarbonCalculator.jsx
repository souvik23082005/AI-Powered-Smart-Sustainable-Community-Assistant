import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { FaBolt, FaCar, FaGasPump, FaCalculator, FaLeaf, FaArrowRight } from "react-icons/fa";

export default function CarbonCalculator() {
  const [electricity, setElectricity] = useState("");
  const [travel, setTravel] = useState("");
  const [fuel, setFuel] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const calculate = async (e) => {
    e.preventDefault();
    if (!electricity && !travel && !fuel) return;
    
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await api.post(
        "/api/carbon/calculate",
        {
          electricity_usage: electricity || 0,
          travel_distance: travel || 0,
          fuel_usage: fuel || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Failed to calculate footprint. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-6 md:p-12 relative overflow-hidden">
      
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 flex-1 flex flex-col">
        
        {/* Header */}
        <div className="mb-10">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <FaCalculator className="text-primary" />
            Carbon <span className="text-gradient">Calculator</span>
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Estimate your monthly carbon emissions and see how your daily habits impact the environment. 
            We'll calculate your footprint and provide actionable suggestions to improve.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          
          {/* Input Form Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2 glass-card p-8 flex flex-col h-fit"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Enter Your Usage</h2>
            
            <form onSubmit={calculate} className="space-y-6">
              
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <FaBolt className="text-yellow-400" /> Electricity Usage
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 350"
                    value={electricity}
                    onChange={(e) => setElectricity(e.target.value)}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all pr-16"
                  />
                  <span className="absolute right-4 text-gray-500 font-medium">kWh</span>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <FaCar className="text-blue-400" /> Travel Distance
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 120"
                    value={travel}
                    onChange={(e) => setTravel(e.target.value)}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all pr-16"
                  />
                  <span className="absolute right-4 text-gray-500 font-medium">km</span>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <FaGasPump className="text-red-400" /> Cooking Fuel / Gas
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all pr-16"
                  />
                  <span className="absolute right-4 text-gray-500 font-medium">kg</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-accent bg-[length:200%_auto] hover:bg-right text-white font-bold py-4 px-4 rounded-xl transition-all duration-500 disabled:opacity-50 mt-4 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Calculate Footprint <FaArrowRight />
                  </>
                )}
              </button>

            </form>
          </motion.div>

          {/* Results Area */}
          <div className="w-full lg:w-1/2 flex flex-col h-full">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="h-full glass-card border-dashed border-2 border-[rgba(255,255,255,0.1)] p-12 flex flex-col items-center justify-center text-center opacity-70"
                >
                  <FaLeaf className={`text-6xl ${error ? 'text-red-400' : 'text-gray-600'} mb-6`} />
                  <h3 className={`text-xl font-bold ${error ? 'text-red-400' : 'text-gray-300'} mb-2`}>
                    {error ? 'Error' : 'Ready to Calculate'}
                  </h3>
                  <p className={`${error ? 'text-red-300' : 'text-gray-500'} max-w-sm`}>
                    {error || "Enter your monthly usage on the left to see your personalized carbon footprint analysis and eco-score."}
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col gap-6"
                >
                  {/* Score Cards */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card p-6 border-t-4 border-t-red-500 relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                        <FaLeaf className="text-9xl" />
                      </div>
                      <p className="text-sm font-semibold text-gray-400 mb-1">Total Emission</p>
                      <h3 className="text-4xl font-extrabold text-white">
                        {result.emission_kg} <span className="text-lg font-normal text-gray-500">kg CO₂</span>
                      </h3>
                    </div>

                    <div className="glass-card p-6 border-t-4 border-t-green-500 relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                        <FaBolt className="text-9xl" />
                      </div>
                      <p className="text-sm font-semibold text-gray-400 mb-1">Earned Eco Score</p>
                      <h3 className="text-4xl font-extrabold text-green-400">
                        +{result.eco_score} <span className="text-lg font-normal text-green-700">pts</span>
                      </h3>
                    </div>
                  </div>

                  {/* Suggestions List */}
                  <div className="glass-card p-8 flex-1">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <span className="text-accent">💡</span> AI Suggestions
                    </h3>
                    <ul className="space-y-4">
                      {result.suggestions.map((s, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start gap-3 bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        >
                          <div className="mt-1 text-primary"><FaArrowRight size={12}/></div>
                          <p className="text-gray-300 leading-relaxed">{s}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <Link to="/carbon-history" className="text-center text-sm text-primary hover:text-accent font-semibold transition-colors mt-2">
                    View full carbon history →
                  </Link>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}