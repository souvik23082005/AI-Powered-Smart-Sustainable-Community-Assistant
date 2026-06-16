import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import api from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-white p-6">
        <div className="glass-card p-8 text-center max-w-md border-red-500/30">
          <p className="text-red-400 font-semibold mb-4">⚠️ Failed to Load Analytics</p>
          <p className="text-gray-400 text-sm mb-6">Make sure you are logged in as an administrator to view this portal.</p>
          <Link to="/admin" className="glow-btn bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-xl text-sm font-bold">
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  // Common options for charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20
        }
      }
    }
  };

  // Status Chart
  const statusColors = {
    "Submitted": "rgba(156, 163, 175, 0.8)",
    "Reviewed": "rgba(234, 179, 8, 0.8)",
    "In Progress": "rgba(59, 130, 246, 0.8)",
    "Resolved": "rgba(34, 197, 94, 0.8)"
  };

  const statusData = {
    labels: stats.status_counts.map(item => item.status || "Unknown"),
    datasets: [{
      data: stats.status_counts.map(item => item.count),
      backgroundColor: stats.status_counts.map(item => statusColors[item.status] || "rgba(156, 163, 175, 0.5)"),
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // Category Chart
  const categoryData = {
    labels: stats.type_counts.map(item => item.category || "Unknown"),
    datasets: [{
      data: stats.type_counts.map(item => item.count),
      backgroundColor: [
        "rgba(147, 51, 234, 0.8)", // Primary
        "rgba(0, 230, 118, 0.8)",  // Accent
        "rgba(0, 188, 212, 0.8)",  // Secondary
        "rgba(255, 152, 0, 0.8)",
        "rgba(233, 30, 99, 0.8)",
        "rgba(76, 175, 80, 0.8)"
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // Priority Chart
  const priorityColors = {
    "Low": "rgba(59, 130, 246, 0.8)",
    "Medium": "rgba(234, 179, 8, 0.8)",
    "High": "rgba(249, 115, 22, 0.8)",
    "Critical": "rgba(239, 68, 68, 0.8)"
  };

  const priorityData = {
    labels: stats.priority_counts.map(item => item.priority || "Unknown"),
    datasets: [{
      label: "Number of Complaints",
      data: stats.priority_counts.map(item => item.count),
      backgroundColor: stats.priority_counts.map(item => priorityColors[item.priority] || "rgba(156, 163, 175, 0.5)"),
      borderRadius: 4,
    }]
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-sans relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center relative z-10">
        <Link to="/admin-dashboard" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-1">
          ← Back to Dashboard
        </Link>
        <span className="text-xs text-primary font-mono tracking-wider uppercase bg-primary/10 px-2 py-1 rounded border border-primary/20">
          Analytics Hub
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Platform Analytics
        </h1>
        <p className="text-gray-400 mb-8">
          Aggregate platform statistics, gamification metrics, and complaint resolution tracking.
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-t-4 border-t-blue-500">
            <span className="text-2xl">👥</span>
            <h3 className="text-gray-400 text-sm mt-3 font-semibold">Total Citizens</h3>
            <p className="text-3xl font-extrabold text-white mt-1">{stats.total_users}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-t-4 border-t-orange-500">
            <span className="text-2xl">📋</span>
            <h3 className="text-gray-400 text-sm mt-3 font-semibold">Total Complaints</h3>
            <p className="text-3xl font-extrabold text-white mt-1">{stats.total_complaints}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 border-t-4 border-t-green-500">
            <span className="text-2xl">🏆</span>
            <h3 className="text-gray-400 text-sm mt-3 font-semibold">Avg Eco Points</h3>
            <p className="text-3xl font-extrabold text-green-400 mt-1">{stats.avg_score}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 border-t-4 border-t-cyan-500">
            <span className="text-2xl">🌍</span>
            <h3 className="text-gray-400 text-sm mt-3 font-semibold">Avg CO₂ Emission</h3>
            <p className="text-3xl font-extrabold text-cyan-400 mt-1">
              {stats.carbon_stats?.avg_emission || 0} <span className="text-sm font-normal text-gray-500">kg</span>
            </p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Categories Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-white">Issues by Category</h3>
            <div className="flex-1 h-64 relative">
              {stats.type_counts.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">No data</div>
              ) : (
                <Pie data={categoryData} options={chartOptions} />
              )}
            </div>
          </motion.div>

          {/* Status Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-white">Resolution Status</h3>
            <div className="flex-1 h-64 relative">
              {stats.status_counts.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">No data</div>
              ) : (
                <Doughnut data={statusData} options={{...chartOptions, cutout: '70%'}} />
              )}
            </div>
          </motion.div>

          {/* Priority Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 flex flex-col lg:col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-white">Complaints Priority</h3>
            <div className="flex-1 h-64 relative">
              {stats.priority_counts.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">No data</div>
              ) : (
                <Bar 
                  data={priorityData} 
                  options={{
                    ...chartOptions,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#9ca3af', stepSize: 1 }
                      },
                      x: {
                        grid: { display: false },
                        ticks: { color: '#9ca3af' }
                      }
                    }
                  }} 
                />
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
