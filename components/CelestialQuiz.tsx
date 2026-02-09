
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCelestialQuiz } from '../geminiService';
import { ScanResult, VoyageData, QuizQuestion } from '../types';
import { Telescope, CircleDot, Disc, Settings } from 'lucide-react';

interface CelestialQuizProps {
  scanResult: ScanResult | null;
  onComplete: (data: VoyageData) => void;
}

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{displayed}</span>;
};

const HighTechTelescope: React.FC = () => {
  const blades = Array.from({ length: 12 });

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* outer mechanical ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-gold/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div 
            key={deg} 
            className="absolute w-1 h-3 bg-gold/30" 
            style={{ top: '0', left: '50%', transform: `rotate(${deg}deg) translateY(-4px)`, transformOrigin: '0 192px' }} 
          />
        ))}
      </motion.div>

      {/* Focus Gear */}
      <motion.div
        className="absolute inset-6 rounded-full border-4 border-dashed border-gold/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Housing */}
      <div className="absolute inset-10 rounded-full bg-slate-950 border-4 border-gold/40 shadow-[0_0_80px_rgba(250,204,21,0.15)] overflow-hidden flex items-center justify-center">
        {/* The Iris Aperture */}
        <div className="absolute inset-0">
          {blades.map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-slate-900 border-l border-gold/5"
              initial={{ rotate: i * 30 }}
              animate={{ 
                rotate: [i * 30, i * 30 + 15, i * 30],
                clipPath: [
                  'polygon(50% 50%, 100% 0, 100% 30%)',
                  'polygon(50% 50%, 100% 20%, 100% 80%)',
                  'polygon(50% 50%, 100% 0, 100% 30%)'
                ]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.05
              }}
              style={{ originX: "50%", originY: "50%" }}
            />
          ))}
        </div>

        {/* Lens Glass/Refraction */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_50%)]" />

        {/* Interior HUD */}
        <div className="relative z-20 flex flex-col items-center">
          <motion.div
            animate={{ 
              scale: [0.95, 1.05, 0.95],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="text-gold"
          >
            <Telescope size={60} strokeWidth={1} />
          </motion.div>
          
          <div className="mt-6 flex flex-col items-center gap-2">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <Settings size={12} className="animate-spin text-gold/60" />
              <span className="text-[10px] font-tech text-gold tracking-[0.4em] uppercase">Lens Aligning</span>
            </motion.div>
            <div className="w-24 h-0.5 bg-gold/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gold"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Outer Flares */}
      <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05)_0%,transparent_70%)] pointer-events-none"
      />
    </div>
  );
};

const CelestialQuiz: React.FC<CelestialQuizProps> = ({ scanResult, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!scanResult) return;
      try {
        const q = await generateCelestialQuiz(scanResult.constellationName + ": " + (scanResult.summary || "Voyager"));
        setQuestions(q);
      } catch (e) {
        console.error(e);
      } finally {
        // Extended delay for the telescope animation to be fully appreciated
        setTimeout(() => setLoading(false), 4000);
      }
    };
    fetchQuiz();
  }, [scanResult]);

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === questions[currentIdx].correctIndex;
    if (isCorrect) setScore(s => s + 1);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete({ questions, currentQuestionIndex: currentIdx, score: score + (isCorrect ? 1 : 0) });
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="flex flex-col items-center justify-center"
      >
        <HighTechTelescope />
      </motion.div>
    );
  }

  const q = questions[currentIdx];

  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="relative w-full max-w-2xl"
    >
      <div className="glass-card p-10 md:p-14 rounded-[2.5rem] border-t-4 border-gold/40 shadow-2xl relative z-10 overflow-hidden">
        {/* Card HUD Background */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Disc size={120} className="animate-spin-slow" />
        </div>

        <div className="mb-10 flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h4 className="text-[10px] font-tech text-gold tracking-[0.5em] uppercase flex items-center gap-2">
              <CircleDot size={12} className="animate-pulse" />
              Void Frequency
            </h4>
            <div className="text-slate-500 font-tech text-[9px] uppercase tracking-widest">
              Sector: {scanResult?.constellationName.split(' ')[0]} / {currentIdx + 1}-03
            </div>
          </div>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={`w-8 h-1 rounded-full transition-all duration-500 ${i <= currentIdx ? 'bg-gold shadow-[0_0_8px_#facc15]' : 'bg-white/10'}`} 
              />
            ))}
          </div>
        </div>

        <h3 className="text-3xl font-celestial mb-12 text-white leading-snug min-h-[90px]">
          <TypewriterText key={currentIdx} text={q.question} />
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(250, 204, 21, 0.08)', borderColor: 'rgba(250, 204, 21, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(i)}
              className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm font-light transition-all text-left flex items-center gap-5 group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[11px] font-tech text-gold group-hover:border-gold group-hover:bg-gold/10">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="leading-relaxed group-hover:text-white transition-colors">{opt}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CelestialQuiz;
