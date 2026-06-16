import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaFilter } from "react-icons/fa";
import api from "../services/api";

export default function AdminComplaints() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    
    api.get("/api/admin/complaints", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (active) {
        setData(res.data);
        setLoading(false);
      }
    })
    .catch(err => {
      console.error(err);
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(`/api/admin/update-status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error(err);
      alert("Failed to update complaint status");
    }
  };

  const filteredData = data.filter(c => filter === "All" || c.status === filter);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center relative z-10">
        <Link to="/admin-dashboard" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-1">
          ← Back to Dashboard
        </Link>
        <span className="text-xs text-red-400 font-mono tracking-wider uppercase bg-red-950/40 px-2 py-1 rounded border border-red-900/50">
          Admin Portal
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
              Complaint Management
            </h1>
            <p className="text-gray-400">Review, resolve, and update status of civic complaints.</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-800">
              <FaFilter className="text-gray-400 text-sm" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-sm focus:outline-none text-white appearance-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Statuses</option>
                <option value="Submitted" className="bg-slate-900">Submitted</option>
                <option value="Reviewed" className="bg-slate-900">Reviewed</option>
                <option value="In Progress" className="bg-slate-900">In Progress</option>
                <option value="Resolved" className="bg-slate-900">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-gray-500">
            📭 No complaints found matching filter.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((c) => (
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition duration-300 flex flex-col justify-between"
              >
                {c.image ? (
                  <div 
                    className="relative h-48 bg-slate-950 overflow-hidden border-b border-slate-800 cursor-pointer group"
                    onClick={() => setSelectedImage(`http://127.0.0.1:5000/uploads/${c.image}`)}
                  >
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">View Evidence</span>
                    </div>
                    <img
                      src={`http://127.0.0.1:5000/uploads/${c.image}`}
                      alt={c.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-300 border border-slate-800 z-20">
                      {c.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-4 bg-gradient-to-r from-red-500 to-amber-500"></div>
                )}

                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    {!c.image && (
                      <span className="inline-block bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider text-amber-400 border border-slate-700">
                        {c.category}
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      c.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      c.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      c.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {c.priority || 'Low'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    Filed by: <span className="text-slate-300 font-normal">{c.full_name}</span>
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {c.description || "No description provided."}
                  </p>

                  <div className="space-y-2 text-xs text-gray-500 border-t border-slate-800 pt-3">
                    <p className="flex justify-between">
                      <span>Location:</span>
                      <span className="text-gray-300 font-semibold truncate max-w-[150px]">{c.location || "N/A"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-gray-400">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A"}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.status === "Resolved" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      c.status === "In Progress" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      c.status === "Reviewed" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                      "bg-slate-800 text-gray-400 border border-slate-700"
                    }`}>
                      {c.status || "Submitted"}
                    </span>
                  </div>

                  {/* Admin Action Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    {c.status === "Submitted" && (
                      <>
                        <button onClick={() => updateStatus(c.id, "Reviewed")} className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition font-bold py-2 px-2 rounded-lg text-xs">Mark Reviewed</button>
                        <button onClick={() => updateStatus(c.id, "In Progress")} className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition font-bold py-2 px-2 rounded-lg text-xs">Start Progress</button>
                      </>
                    )}
                    {c.status === "Reviewed" && (
                      <>
                        <button onClick={() => updateStatus(c.id, "In Progress")} className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition font-bold py-2 px-2 rounded-lg text-xs">Start Progress</button>
                        <button onClick={() => updateStatus(c.id, "Resolved")} className="bg-green-500/20 text-green-500 hover:bg-green-500/30 transition font-bold py-2 px-2 rounded-lg text-xs">Resolve (+30)</button>
                      </>
                    )}
                    {c.status === "In Progress" && (
                      <button onClick={() => updateStatus(c.id, "Resolved")} className="col-span-2 bg-green-500 hover:bg-green-600 transition text-black font-bold py-2 px-2 rounded-lg text-xs">Mark as Resolved (+30)</button>
                    )}
                    {c.status === "Resolved" && (
                      <button onClick={() => updateStatus(c.id, "Submitted")} className="col-span-2 bg-slate-800 hover:bg-slate-700 transition text-gray-300 py-2 px-2 rounded-lg text-xs">Reopen Case</button>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white text-3xl hover:text-red-500 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
            <img 
              src={selectedImage} 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}