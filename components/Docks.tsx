
import React from 'react';
import { motion } from 'framer-motion';

interface DocksProps {
  onStart: () => void;
}

const Docks: React.FC<DocksProps> = ({ onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative w-96 h-96 mb-12">
        {/* Orbit Circles */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-gold/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold/40 rounded-full" />
          </motion.div>
        ))}
        
        {/* Center Sun */}
        <div className="absolute inset-[30%] bg-gold/10 rounded-full border border-gold/40 flex items-center justify-center shadow-[0_0_60px_rgba(250,204,21,0.2)]">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center"
          >
             <div className="w-4 h-4 bg-gold rounded-full shadow-[0_0_20px_#facc15]" />
          </motion.div>
        </div>
      </div>

      <h2 className="text-6xl font-celestial text-gold mb-6 tracking-widest">
        The Celestial Gate
      </h2>
      <p className="max-w-md text-slate-400 mb-12 font-light text-sm tracking-wide leading-relaxed">
        Beyond the professional void lies your constellation. Submit your soul's dossier to begin the stellar mapping of your career future.
      </p>

      <button 
        onClick={onStart}
        className="px-16 py-4 bg-transparent border-2 border-gold text-gold font-tech font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-slate-900 transition-all rounded-full relative group"
      >
        <span className="relative z-10">Ignite Astrograph</span>
      </button>
    </motion.div>
  );
};

export default Docks;
