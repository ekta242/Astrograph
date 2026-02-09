
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  top: string;
  left: string;
  angle: number;
}

interface ShootingStarEffectProps {
  trigger: number;
}

const ShootingStarEffect: React.FC<ShootingStarEffectProps> = ({ trigger }) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newStars = Array.from({ length: 3 }).map((_, i) => ({
        id: Date.now() + i,
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 50}%`,
        angle: 45 + Math.random() * 20,
      }));
      setStars((prev) => [...prev, ...newStars]);

      // Cleanup stars after animation
      const timer = setTimeout(() => {
        setStars((prev) => prev.filter(s => !newStars.find(ns => ns.id === s.id)));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ x: -100, y: -100, opacity: 0, scale: 0 }}
            animate={{ 
              x: 800, 
              y: 800, 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              rotate: `${star.angle}deg`,
              width: '150px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #facc15, white)',
              boxShadow: '0 0 10px #facc15'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ShootingStarEffect;
