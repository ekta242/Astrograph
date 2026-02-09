
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coordinate, AscensionStep } from '../types';
import { Sparkles, Compass, Info, ChevronRight, ChevronLeft, Loader2, Target, Telescope } from 'lucide-react';
import { generateAscensionSteps } from '../geminiService';

interface ConstellationMapProps {
  coordinates: Coordinate[];
  constellationName: string;
  summary?: string;
  onReset: () => void;
}

const ConstellationMap: React.FC<ConstellationMapProps> = ({ coordinates, constellationName, summary, onReset }) => {
  const [isAscending, setIsAscending] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [steps, setSteps] = useState<AscensionStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const scale = (val: number) => (val / 100) * 600;
  
  const pathData = coordinates.length > 0
    ? `M ${scale(coordinates[0].x)} ${scale(coordinates[0].y)} ` + 
      coordinates.slice(1).map(c => `L ${scale(c.x)} ${scale(c.y)}`).join(' ')
    : '';

  const milestones = ["Awakening", "Ascension", "Alignment", "Radiance", "Apex"];

  const handleBeginAscension = async () => {
    if (steps.length > 0) {
      setIsAscending(true);
      return;
    }

    setLoadingSteps(true);
    try {
      const data = await generateAscensionSteps(constellationName, summary || "");
      setSteps(data);
      setIsAscending(true);
    } catch (e) {
      console.error(e);
      alert("Void interference. Could not calculate ascension path.");
    } finally {
      setLoadingSteps(false);
    }
  };

  const currentCoord = coordinates[currentStepIdx] || coordinates[0];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center w-full max-w-6xl px-4"
    >
      <div className={`transition-all duration-700 text-center mb-6 ${isAscending ? 'scale-75 opacity-50 blur-sm pointer-events-none -mt-20' : ''}`}>
        <h2 className="text-5xl font-celestial text-gold tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
          {constellationName}
        </h2>
        <p className="text-slate-400 font-tech text-xs uppercase tracking-[0.5em]">Charted in the Void of Opportunity</p>
      </div>

      {!isAscending && summary && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mb-8 p-4 bg-gold/5 border border-gold/10 rounded-xl text-center"
        >
          <div className="flex items-center justify-center gap-2 text-gold mb-2 text-[10px] font-tech uppercase tracking-widest">
            <Info size={12} />
            Prophecy Decryption
          </div>
          <p className="text-slate-300 text-sm italic leading-relaxed">
            "{summary}"
          </p>
        </motion.div>
      )}

      <div className={`relative w-full overflow-hidden transition-all duration-1000 ease-in-out ${isAscending ? 'h-[70vh] flex flex-col md:flex-row gap-8 items-center justify-center' : 'aspect-video'}`}>
        
        {/* The Map SVG Container */}
        <motion.div 
          className={`relative glass-card rounded-3xl border border-gold/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950/50 transition-all duration-1000 ${isAscending ? 'w-full md:w-1/2 aspect-square max-w-[500px]' : 'w-full h-full p-8'}`}
          animate={isAscending ? { scale: 1 } : { scale: 1 }}
        >
          {/* Chart Grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#facc15 1px, transparent 1px), linear-gradient(90deg, #facc15 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <motion.svg 
            viewBox="0 0 600 350" 
            className="w-full h-full relative z-10 overflow-visible"
            animate={isAscending ? {
              viewBox: `${scale(currentCoord.x) - 100} ${scale(currentCoord.y) - 100} 200 200`
            } : {
              viewBox: "0 0 600 350"
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Lines */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="#facc15"
              strokeWidth={isAscending ? "4" : "1.5"}
              strokeDasharray="5,5"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />

            {/* Stars */}
            {coordinates.map((coord, i) => (
              <motion.g
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isAscending && currentStepIdx === i ? 1.5 : 1, 
                  opacity: 1 
                }}
                transition={{ duration: 0.5 }}
              >
                <circle
                  cx={scale(coord.x)}
                  cy={scale(coord.y)}
                  r={i === 4 ? "8" : "4"}
                  className={`${i === currentStepIdx ? 'fill-gold' : 'fill-gold/40'}`}
                  filter="url(#glow)"
                />
                
                {i === currentStepIdx && (
                  <motion.circle
                    cx={scale(coord.x)}
                    cy={scale(coord.y)}
                    r="20"
                    className="stroke-gold/40 fill-none"
                    animate={{ r: [15, 30, 15], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <text
                  x={scale(coord.x) + 15}
                  y={scale(coord.y) - 15}
                  className={`font-tech font-bold uppercase tracking-widest pointer-events-none transition-all duration-500 ${isAscending ? 'text-[24px]' : 'text-[10px]'} ${i === currentStepIdx ? 'fill-white' : 'fill-white/30'}`}
                >
                  {milestones[i]}
                </text>
              </motion.g>
            ))}
          </motion.svg>

          {isAscending && (
            <div className="absolute top-6 left-6 flex items-center gap-2 text-gold/80 text-[10px] font-tech uppercase tracking-[0.3em] bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-gold/20">
              <Telescope size={12} />
              Phase Focus: {milestones[currentStepIdx]}
            </div>
          )}
        </motion.div>

        {/* Ascension Steps Panel */}
        <AnimatePresence>
          {isAscending && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full md:w-1/2 flex flex-col gap-6"
            >
              <div className="glass-card p-8 rounded-3xl border border-gold/20 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Target size={120} />
                 </div>

                 <div className="relative z-10">
                   <div className="flex justify-between items-center mb-6">
                      <span className="px-3 py-1 bg-gold text-slate-950 font-tech text-[9px] font-bold uppercase tracking-widest rounded-full">
                        Step {currentStepIdx + 1} of 5
                      </span>
                      <div className="text-gold/40 font-tech text-[9px] uppercase tracking-widest">
                        Status: Calibration
                      </div>
                   </div>

                   <h3 className="text-4xl font-celestial text-white mb-4">
                     {steps[currentStepIdx]?.phase}
                   </h3>

                   <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-tech text-gold uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                          <Compass size={12} />
                          Divine Directive
                        </h4>
                        <p className="text-slate-300 text-lg leading-relaxed font-light italic">
                          "{steps[currentStepIdx]?.instruction}"
                        </p>
                      </div>

                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <h4 className="text-[10px] font-tech text-gold/60 uppercase tracking-[0.3em] mb-2">Primary Objective</h4>
                        <p className="text-slate-400 text-sm">
                          {steps[currentStepIdx]?.objective}
                        </p>
                      </div>
                   </div>

                   <div className="mt-10 flex justify-between items-center">
                      <button 
                        onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentStepIdx === 0}
                        className="p-3 rounded-full border border-white/10 hover:border-gold/50 text-white/50 hover:text-gold disabled:opacity-20 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      
                      <div className="flex gap-2">
                        {milestones.map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentStepIdx ? 'bg-gold scale-125 shadow-[0_0_8px_#facc15]' : 'bg-white/10'}`} 
                          />
                        ))}
                      </div>

                      {currentStepIdx < 4 ? (
                        <button 
                          onClick={() => setCurrentStepIdx(prev => Math.min(4, prev + 1))}
                          className="flex items-center gap-2 px-6 py-3 bg-gold text-slate-950 font-tech font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95 transition-all"
                        >
                          Next Phase
                          <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => setIsAscending(false)}
                          className="px-6 py-3 border border-gold text-gold font-tech font-bold uppercase tracking-widest text-xs rounded-full hover:bg-gold hover:text-slate-950 transition-all"
                        >
                          Chart Complete
                        </button>
                      )}
                   </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isAscending && (
        <div className="mt-12 flex gap-6">
          <button 
            onClick={onReset}
            className="px-8 py-3 border border-gold/30 hover:border-gold text-gold/60 hover:text-gold font-tech font-bold uppercase tracking-widest text-xs transition-all rounded-full bg-black/40 backdrop-blur"
          >
            Seek Another Fate
          </button>
          <button 
            onClick={handleBeginAscension}
            disabled={loadingSteps}
            className="flex items-center gap-3 px-10 py-3 bg-gold text-slate-900 font-tech font-bold uppercase tracking-widest text-xs transition-all rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingSteps ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Compass size={16} />
            )}
            {loadingSteps ? 'Calculating Ascension...' : 'Begin Ascension'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ConstellationMap;
