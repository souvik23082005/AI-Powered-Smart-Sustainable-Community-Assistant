import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ParticleBackground() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = 40;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0.2 + Math.random() * 0.3,
            filter: "blur(1px)"
          }}
          animate={{
            y: ["0%", "-50%", "0%"],
            x: ["0%", "30%", "0%"],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay
          }}
        />
      ))}
      {/* Background Gradient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[150px] opacity-20" />
    </div>
  );
}
