
import React from 'react';
import { motion } from 'framer-motion';

const StarChartLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stars = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5
  }));

  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden">
      {/* Starfield */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
          className="absolute bg-white rounded-full pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            boxShadow: star.size > 2 ? '0 0 4px rgba(255,255,255,0.8)' : 'none'
          }}
        />
      ))}

      {/* Nebula Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-900/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default StarChartLayout;
