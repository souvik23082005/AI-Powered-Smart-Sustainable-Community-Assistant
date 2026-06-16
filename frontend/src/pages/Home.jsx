import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero3D from "../components/Hero3D";
import ParticleBackground from "../components/ParticleBackground";
import { FaLeaf, FaHeartbeat, FaGraduationCap, FaCity, FaGlobe, FaRobot, FaExclamationTriangle, FaChartLine } from "react-icons/fa";

export default function Home() {
  const sdgs = [
    { title: "No Poverty", icon: <FaGlobe />, color: "text-red-500" },
    { title: "Good Health", icon: <FaHeartbeat />, color: "text-green-500" },
    { title: "Quality Education", icon: <FaGraduationCap />, color: "text-blue-500" },
    { title: "Sustainable Cities", icon: <FaCity />, color: "text-orange-500" },
    { title: "Climate Action", icon: <FaLeaf />, color: "text-teal-500" }
  ];

  const features = [
    { title: "AI Assistant", desc: "Interact with our Gemini-powered AI for sustainability tips.", icon: <FaRobot className="text-primary text-3xl" /> },
    { title: "Complaint Management", desc: "Report and track civic issues directly to admins.", icon: <FaExclamationTriangle className="text-secondary text-3xl" /> },
    { title: "Carbon Calculator", desc: "Estimate and offset your daily carbon footprint.", icon: <FaChartLine className="text-accent text-3xl" /> },
    { title: "Sustainability Score", desc: "Earn points and badges for your eco-friendly actions.", icon: <FaLeaf className="text-green-500 text-3xl" /> }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 lg:px-24">
        <div className="w-full lg:w-1/2 flex flex-col justify-center mt-20 lg:mt-0 text-center lg:text-left z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Empowering the <br />
              <span className="text-gradient">Smart City</span> of Tomorrow
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg lg:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0"
          >
            Join the revolution of sustainable living. Report issues, track your carbon footprint, and interact with our AI to build a greener, smarter community.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link 
              to="/register" 
              className="glow-btn px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:scale-105 transition-transform text-center shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 rounded-full glass text-white font-semibold text-lg hover:bg-white/10 transition-colors text-center"
            >
              Access Dashboard
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="w-full lg:w-1/2 h-[50vh] lg:h-screen mt-10 lg:mt-0 relative z-10"
        >
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            <Hero3D />
          </Canvas>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 lg:px-24 bg-[rgba(0,0,0,0.5)] border-t border-[rgba(255,255,255,0.05)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Platform <span className="text-gradient">Features</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to contribute to a sustainable ecosystem.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="mb-6 p-4 bg-[rgba(255,255,255,0.05)] rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SDG Showcase Section */}
      <section className="relative z-10 py-24 px-6 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Supporting Global <span className="text-gradient">SDGs</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We actively align our platform with the UN Sustainable Development Goals.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {sdgs.map((sdg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass p-6 rounded-2xl flex items-center gap-4 w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] border-t-2 border-t-[rgba(255,255,255,0.1)] hover:border-t-primary cursor-default"
            >
              <div className={`text-4xl ${sdg.color}`}>
                {sdg.icon}
              </div>
              <h3 className="font-bold text-lg">{sdg.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(255,255,255,0.05)] py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2026 SmartCity Platform. Empowering sustainable living.</p>
      </footer>
    </div>
  );
}