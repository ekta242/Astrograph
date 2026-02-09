
import React from 'react';
import { motion } from 'framer-motion';
import { Coordinate } from '../types';
import { RefreshCw, Navigation, Star } from 'lucide-react';

interface ChartProps {
  coordinates: Coordinate[];
  onReset: () => void;
}

const Chart: React.FC<ChartProps> = ({ coordinates, onReset }) => {
  // Convert 0-100 coordinates to viewbox units (e.g. 500x500)
  const scale = (val: number) => (val / 100) * 500;
  
  const pathData = coordinates.length > 0
    ? `M ${scale(coordinates[0].x)} ${scale(coordinates[0].y)} ` + 
      coordinates.slice(1).map(c => `L ${scale(c.x)} ${scale(c.y)}`).join(' ')
    : '';

  const milestones = ["FOUNDATION", "ENTRY LEVEL", "CORE MASTERY", "SPECIALIZATION", "APEX"];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center w-full max-w-4xl"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-tighter mb-2">Professional Roadmap</h2>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">Calculated Career Trajectory</p>
      </div>

      <div className="relative w-full aspect-square max-w-[500px] border border-cyan-900/40 bg-slate-950/80 rounded-lg shadow-2xl p-4 overflow-hidden">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }} 
        />

        <svg viewBox="0 0 500 500" className="w-full h-full relative z-10 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
          {/* Path Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeDasharray="10 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />

          {/* Point Markers */}
          {coordinates.map((coord, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 * i }}
            >
              <circle
                cx={scale(coord.x)}
                cy={scale(coord.y)}
                r={i === 4 ? "8" : "4"}
                className={i === 4 ? "fill-yellow-400" : "fill-cyan-400"}
              />
              <circle
                cx={scale(coord.x)}
                cy={scale(coord.y)}
                r="8"
                className="stroke-cyan-400/30 fill-none"
              >
                <animate attributeName="r" from="4" to="12" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text
                x={scale(coord.x) + 12}
                y={scale(coord.y) - 12}
                className="fill-cyan-400 text-[9px] font-mono font-bold uppercase tracking-widest"
              >
                {milestones[i]}
              </text>
            </motion.g>
          ))}
        </svg>

        {/* HUD overlays */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="p-2 border border-cyan-900/30 bg-slate-900/80 text-[10px] font-mono text-cyan-400 flex items-center gap-2">
            <Star size={10} className="text-yellow-400" />
            APEX DESTINATION LOCKED
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 font-heading font-bold uppercase tracking-widest text-xs transition-all rounded"
        >
          <RefreshCw size={14} />
          New Assessment
        </button>
        <button 
          className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-heading font-bold uppercase tracking-widest text-xs transition-all rounded shadow-lg shadow-cyan-900/20"
        >
          <Navigation size={14} />
          Export Roadmap
        </button>
      </div>
    </motion.div>
  );
};

export default Chart;
