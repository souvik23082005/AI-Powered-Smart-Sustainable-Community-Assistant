import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartLine, FaLeaf } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CarbonHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/api/carbon/history", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // Sort oldest to newest for the chart
      const sorted = res.data.slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setHistory(sorted);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const chartData = {
    labels: history.map(h => new Date(h.created_at).toLocaleDateString()),
    datasets: [
      {
        fill: true,
        label: 'Carbon Emissions (kg CO2)',
        data: history.map(h => h.emission_kg),
        borderColor: '#00E676', // Primary green
        backgroundColor: 'rgba(0, 230, 118, 0.2)', // Semi-transparent primary
        tension: 0.4,
        pointBackgroundColor: '#00BCD4', // Accent color
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00E676',
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#00E676',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9CA3AF',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const totalEmissions = history.reduce((sum, item) => sum + item.emission_kg, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <FaChartLine className="text-primary" />
              Carbon <span className="text-gradient">History</span>
            </h1>
            <p className="text-gray-400 mt-2">Track your carbon footprint over time.</p>
          </div>

          <div className="glass-card px-6 py-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-full text-red-400">
              <FaLeaf />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Recorded Emissions</p>
              <p className="text-2xl font-bold text-white">{totalEmissions} <span className="text-sm font-normal">kg CO2</span></p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-16 text-center border-2 border-dashed border-[rgba(255,255,255,0.1)] flex flex-col items-center justify-center min-h-[400px]"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(147,51,234,0.3)]"
            >
              <FaLeaf className="text-5xl text-primary opacity-80" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-3 text-white">Your Carbon Canvas is Blank!</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              You haven't recorded any carbon emissions yet. Start tracking your environmental impact to see detailed analytics, trends, and personalized insights here.
            </p>
            <Link to="/carbon" className="relative group overflow-hidden bg-gradient-to-r from-primary to-accent hover:bg-right text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(0,230,118,0.6)]">
              Start Tracking Now
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col"
            >
              <h3 className="text-xl font-bold mb-6">Emission Trend</h3>
              <div className="flex-1 w-full relative">
                <Line data={chartData} options={options} />
              </div>
            </motion.div>

            {/* List Area */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 overflow-hidden flex flex-col"
            >
              <h3 className="text-xl font-bold mb-6">Recent Records</h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {[...history].reverse().map((h) => (
                  <div key={h.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 flex justify-between items-center hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                    <div>
                      <p className="font-semibold text-white capitalize">Eco Score: <span className="text-green-400">{h.eco_score}</span></p>
                      <p className="text-xs text-gray-500">{new Date(h.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-400">{h.emission_kg} kg</p>
                      <p className="text-xs text-gray-500">
                        {h.electricity_usage} kWh | {h.travel_distance} km
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        )}

      </div>
    </div>
  );
}