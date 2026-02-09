
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Star, Sparkles, Loader2 } from 'lucide-react';
import { analyzeCaptainLog } from '../geminiService';
import { ScanResult } from '../types';

interface ScanProps {
  onComplete: (res: ScanResult) => void;
  onActionTrigger?: () => void;
}

const Scan: React.FC<ScanProps> = ({ onComplete, onActionTrigger }) => {
  const [loading, setLoading] = useState(false);
  const [logText, setLogText] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onActionTrigger?.();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartScan = async () => {
    if (!logText && !image) return;
    onActionTrigger?.();
    setLoading(true);
    try {
      const result = await analyzeCaptainLog(logText, image || undefined);
      onComplete(result);
    } catch (error) {
      console.error(error);
      alert("Void interference detected. Check your signal strength.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-3xl w-full glass-card p-12 rounded-[2rem] relative overflow-hidden"
    >
      <div className="flex items-center gap-6 mb-12">
        <div className="p-4 bg-gold/10 rounded-2xl text-gold border border-gold/20 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
          <Star size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-celestial text-gold tracking-widest uppercase">The Soul's Dossier</h2>
          <p className="text-slate-500 text-xs font-tech tracking-[0.2em] uppercase">Transferring core data to the Oracle</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">Transcription of Intent</label>
          <textarea 
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-6 rounded-2xl focus:outline-none focus:border-gold/50 text-slate-200 min-h-[160px] transition-all font-light text-sm leading-relaxed"
            placeholder="Whisper your ambitions to the void... your professional history, core competencies, and future vision."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative border-2 border-dashed border-white/10 rounded-2xl h-40 flex flex-col items-center justify-center hover:border-gold/30 transition-all cursor-pointer group bg-white/5 overflow-hidden">
            {image ? (
              <img src={image} className="w-full h-full object-cover rounded-2xl opacity-60" />
            ) : (
              <>
                <Upload className="text-white/20 group-hover:text-gold transition-colors mb-4" size={24} />
                <span className="text-[10px] text-white/40 font-tech tracking-widest uppercase">Visual Artifacts (Resume/Portfolio)</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center gap-3">
             <div className="flex items-center gap-2 text-gold">
                <Sparkles size={16} />
                <span className="text-[10px] font-tech uppercase tracking-widest">Cartographer Protocol</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-tech tracking-wider uppercase">
               The Cartographer analyzes experience, latent talent, and market resonance to predict your professional apex.
             </p>
          </div>
        </div>

        <button 
          onClick={handleStartScan}
          disabled={loading || (!logText && !image)}
          className="w-full py-5 bg-gold text-slate-900 font-tech font-bold uppercase tracking-[0.5em] rounded-full transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:scale-[1.02] active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Mapping Starfields
            </>
          ) : (
            'Initiate Stellar Mapping'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Scan;
