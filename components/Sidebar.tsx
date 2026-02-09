
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLogEntry, AppView } from '../types';
import { Sparkles, Telescope, Radio, Milestone, Zap } from 'lucide-react';

interface SidebarProps {
  log: NavLogEntry[];
  currentView: AppView;
}

const Sidebar: React.FC<SidebarProps> = ({ log, currentView }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-80 h-full border-r border-gold/20 bg-black/40 backdrop-blur-2xl flex flex-col z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
    >
      <div className="p-8 border-b border-gold/10">
        <div className="flex items-center gap-3 text-gold mb-3">
          <Zap size={22} className="animate-pulse" />
          <h1 className="text-xl font-celestial font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">Astrograph</h1>
        </div>
        <p className="text-[10px] text-slate-500 font-tech tracking-[0.3em] uppercase">Void Interface v3.0</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 flex justify-around border-b border-gold/5 bg-white/5">
          <ViewIcon active={currentView === AppView.DOCKS}><Telescope size={18}/></ViewIcon>
          <ViewIcon active={currentView === AppView.SCAN}><Sparkles size={18}/></ViewIcon>
          <ViewIcon active={currentView === AppView.VOYAGE}><Radio size={18}/></ViewIcon>
          <ViewIcon active={currentView === AppView.CHART}><Milestone size={18}/></ViewIcon>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 font-tech text-[11px] custom-scrollbar"
        >
          {log.map((entry, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l border-gold/30 pl-4 py-1"
            >
              <div className="flex justify-between items-center text-slate-600 mb-1">
                <span className="text-[9px] tracking-tighter">[{entry.timestamp}]</span>
                <span className="text-gold font-bold uppercase tracking-widest text-[9px]">{entry.source}</span>
              </div>
              <div className="text-slate-300 leading-relaxed font-light italic">{entry.message}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gold/20 bg-black/40">
        <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gold shadow-[0_0_10px_#facc15]"
            animate={{ width: ['30%', '85%', '60%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="mt-3 text-[9px] flex justify-between text-slate-500 uppercase tracking-[0.3em] font-tech">
          <span>Stellar Sync</span>
          <span className="text-gold">Active</span>
        </div>
      </div>
    </motion.aside>
  );
};

const ViewIcon: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <div className={`p-3 rounded-full transition-all duration-500 ${active ? 'bg-gold/10 text-gold shadow-[0_0_15px_rgba(250,204,21,0.2)] border border-gold/30 scale-110' : 'text-slate-700 hover:text-slate-400'}`}>
    {children}
  </div>
);

export default Sidebar;
