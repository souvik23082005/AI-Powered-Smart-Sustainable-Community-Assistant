import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUpload, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";
import api from "../services/api";

export default function ComplaintForm() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Garbage");
  const [priority, setPriority] = useState("Low");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const categories = [
    "Garbage",
    "Water Leakage",
    "Air Pollution",
    "Noise Pollution",
    "Road Damage",
    "Street Light Failure"
  ];

  const priorities = ["Low", "Medium", "High", "Critical"];

  const submitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const formData = new FormData();
    formData.append("category", category);
    formData.append("priority", priority);
    formData.append("description", description);
    formData.append("location", location);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      await api.post("/api/complaints", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Complaint submitted successfully! +20 Points.");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      alert("Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-card p-8 md:p-12 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-3xl">
            <FaExclamationTriangle />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
          <p className="text-gray-400 mt-2">Help keep our smart city safe and sustainable.</p>
        </div>

        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-lg text-center mb-6 font-semibold"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={submitComplaint} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
              >
                {categories.map((c, i) => (
                  <option key={i} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
              >
                {priorities.map((p, i) => (
                  <option key={i} value={p} className="bg-slate-900">{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              required
              placeholder="Describe the issue in detail..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                required
                placeholder="Street address or landmark"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Evidence (Image)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[rgba(255,255,255,0.2)] hover:border-primary hover:bg-[rgba(255,255,255,0.02)] rounded-xl cursor-pointer transition-all">
              <FaUpload className="text-2xl text-gray-400 mb-2" />
              <span className="text-gray-400 text-sm">{image ? image.name : "Click to upload an image"}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Link 
              to="/dashboard"
              className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              Cancel
            </Link>
            <button
              disabled={loading}
              className="flex-1 glow-btn bg-primary py-3 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}