
import React from 'react';
import { motion } from 'framer-motion';
import { AppView } from '../types';

interface FogOfWarProps {
  currentView: AppView;
}

const FogOfWar: React.FC<FogOfWarProps> = ({ currentView }) => {
  // Logic to determine fog density
  const getFogIntensity = () => {
    switch (currentView) {
      case AppView.DOCKS: return 0.2;
      case AppView.SCAN: return 0.5;
      case AppView.VOYAGE: return 0.8;
      case AppView.CHART: return 0.4;
      default: return 0.2;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Fog Vignette */}
      <motion.div 
        animate={{ opacity: getFogIntensity() }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)]"
      />
      
      {/* Moving Particles (Plankton) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-100/10 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: Math.random() * 2 
            }}
            animate={{ 
              y: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Static Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default FogOfWar;
