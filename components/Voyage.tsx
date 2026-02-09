
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fixed: Changed generateUnderwaterQuiz to generateCelestialQuiz to match the exports in geminiService
import { generateCelestialQuiz } from '../geminiService';
import { ScanResult, VoyageData, QuizQuestion } from '../types';
import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

interface VoyageProps {
  scanResult: ScanResult | null;
  onComplete: (data: VoyageData) => void;
}

const Voyage: React.FC<VoyageProps> = ({ scanResult, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!scanResult) return;
      try {
        // Fixed: Called generateCelestialQuiz and passed a combined context string for better model performance
        const q = await generateCelestialQuiz(scanResult.constellationName + ": " + (scanResult.summary || "Voyager"));
        setQuestions(q);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
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
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
        <p className="font-heading uppercase tracking-widest text-cyan-500">Preparing Assessment...</p>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-full max-w-xl"
    >
      {/* Background Sphere Glow */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full" />

      <div className="glass p-10 rounded-[3rem] text-center border-t-2 border-cyan-400/40 shadow-2xl relative z-10">
        <div className="mb-6 flex justify-center">
          <div className="px-4 py-1 bg-cyan-900/50 rounded-full border border-cyan-400/30 text-[10px] uppercase font-bold text-cyan-400 tracking-widest">
            Question {currentIdx + 1} / {questions.length}
          </div>
        </div>

        <h3 className="text-2xl font-heading font-bold mb-8 text-white leading-tight">
          {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(i)}
              className="w-full p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-slate-300 text-sm font-medium transition-all text-left flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-[10px] group-hover:border-cyan-500">
                {String.fromCharCode(65 + i)}
              </div>
              {opt}
            </motion.button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-cyan-900/20 flex justify-between items-center px-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <ShieldCheck size={14} />
            SCAN STABILITY: HIGH
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <AlertTriangle size={14} className={scanResult?.threatLevel === 'HIGH' ? 'text-red-500' : 'text-yellow-500'} />
            THREAT: {scanResult?.threatLevel}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Voyage;
