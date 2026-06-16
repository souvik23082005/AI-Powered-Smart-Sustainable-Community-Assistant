import { motion } from "framer-motion";

export default function AnimatedTree() {
  const leafColors = ["#C4B5FD", "#A78BFA", "#8B5CF6", "#DDD6FE", "#D8B4FE", "#E9D5FF"];
  
  const centers = [
    { x: 100, y: 80 },
    { x: 40, y: 90 },
    { x: 160, y: 100 },
    { x: 50, y: 60 },
    { x: 150, y: 70 },
    { x: 80, y: 40 },
    { x: 120, y: 50 },
    { x: 100, y: 30 } // Top
  ];

  const leaves = [];
  let idCounter = 0;

  // Generate static positions for leaves so they don't jump on re-renders
  centers.forEach(center => {
    // 15 leaves per branch center
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 35; 
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      const r = 8 + Math.random() * 12; 
      const color = leafColors[Math.floor(Math.random() * leafColors.length)];
      const delay = Math.random() * 1.5;
      const duration = 3 + Math.random() * 2; 
      const swayX = Math.random() * 6 - 3;
      const swayY = Math.random() * 6 - 3;
      
      leaves.push({ id: idCounter++, x, y, r, color, delay, duration, swayX, swayY });
    }
  });

  const fallingLeaves = Array.from({ length: 8 }).map((_, i) => {
    return {
      id: i,
      startX: 50 + Math.random() * 100,
      startY: 50 + Math.random() * 100,
      endX: -50 - Math.random() * 50,
      endY: 250 + Math.random() * 50,
      scale: 0.5 + Math.random() * 0.5,
      color: leafColors[i % leafColors.length],
      duration: 4 + Math.random() * 3,
      delay: 2 + Math.random() * 5,
      rotateEnd: 180 + Math.random() * 180
    };
  });

  return (
    <div className="w-full h-full flex items-center justify-center overflow-visible pointer-events-none absolute inset-0">
      <motion.svg 
        viewBox="0 0 200 260" 
        className="w-full max-w-[600px] h-[100%] drop-shadow-2xl overflow-visible"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Glow behind the tree */}
        <circle cx="100" cy="100" r="90" fill="#8B5CF6" className="blur-[60px] opacity-20" />

        {/* Trunk and Branches */}
        <motion.g
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        >
          {/* Main Trunk */}
          <path d="M 100 260 Q 100 150 100 80" stroke="#4C1D95" strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Left Branches */}
          <path d="M 100 200 Q 50 140 40 90" stroke="#4C1D95" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M 70 160 Q 30 110 50 60" stroke="#5B21B6" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 100 130 Q 70 80 80 40" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" fill="none" />
          
          {/* Right Branches */}
          <path d="M 100 210 Q 150 160 160 100" stroke="#4C1D95" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M 130 170 Q 180 130 150 70" stroke="#5B21B6" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 100 140 Q 130 90 120 50" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" fill="none" />
          
          {/* Top Branch */}
          <path d="M 100 100 Q 90 60 100 30" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* Leaves */}
        {leaves.map((leaf) => (
          <motion.circle
            key={leaf.id}
            cx={leaf.x}
            cy={leaf.y}
            r={leaf.r}
            fill={leaf.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.1, 1], 
              opacity: 0.85,
              x: [0, leaf.swayX, 0],
              y: [0, leaf.swayY, 0]
            }}
            transition={{
              scale: { duration: 1, delay: 1.5 + leaf.delay, ease: "easeOut" },
              opacity: { duration: 1, delay: 1.5 + leaf.delay },
              x: { duration: leaf.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1.5 + leaf.delay },
              y: { duration: leaf.duration * 1.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1.5 + leaf.delay }
            }}
            className="mix-blend-screen drop-shadow-[0_0_6px_rgba(196,181,253,0.5)]"
          />
        ))}

        {/* Falling Leaves Animation (Wind Effect) */}
        {fallingLeaves.map((leaf) => (
          <motion.path
            key={`falling-${leaf.id}`}
            d="M 0 0 Q 5 5 10 0 Q 5 -5 0 0"
            fill={leaf.color}
            initial={{ 
              x: leaf.startX, 
              y: leaf.startY,
              opacity: 0,
              rotate: 0,
              scale: leaf.scale
            }}
            animate={{
              x: [leaf.startX, leaf.endX],
              y: [leaf.startY, leaf.endY],
              opacity: [0, 0.8, 0],
              rotate: [0, leaf.rotateEnd]
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: "linear"
            }}
            className="drop-shadow-[0_0_4px_rgba(196,181,253,0.5)]"
          />
        ))}

      </motion.svg>
    </div>
  );
}
