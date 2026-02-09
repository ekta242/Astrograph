
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView, NavLogEntry, ScanResult, VoyageData } from './types';
import Docks from './components/Docks';
import Scan from './components/Scan';
import CelestialQuiz from './components/CelestialQuiz';
import ConstellationMap from './components/ConstellationMap';
import Sidebar from './components/Sidebar';
import StarChartLayout from './components/StarChartLayout';
import ShootingStarEffect from './components/ShootingStarEffect';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DOCKS);
  const [log, setLog] = useState<NavLogEntry[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [voyageData, setVoyageData] = useState<VoyageData | null>(null);
  const [starTrigger, setStarTrigger] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playChime = useCallback(() => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }, []);

  const triggerEffect = () => {
    setStarTrigger(prev => prev + 1);
    playChime();
  };

  const addToLog = (message: string, source: NavLogEntry['source'] = 'CARTOGRAPHER') => {
    setLog(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      source,
      message
    }]);
  };

  useEffect(() => {
    addToLog('Astrograph initialized. Waiting for user dossier.', 'COMMAND');
  }, []);

  const handleNavigate = (newView: AppView) => {
    initAudio();
    triggerEffect();
    setView(newView);
    addToLog(`Adjusting trajectory to ${newView} sector.`);
  };

  return (
    <StarChartLayout>
      <ShootingStarEffect trigger={starTrigger} />
      <div className="flex h-full w-full">
        <Sidebar log={log} currentView={view} />

        <main className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {view === AppView.DOCKS && (
              <Docks key="docks" onStart={() => handleNavigate(AppView.SCAN)} />
            )}
            {view === AppView.SCAN && (
              <Scan 
                key="scan" 
                onActionTrigger={triggerEffect}
                onComplete={(res) => {
                  setScanResult(res);
                  addToLog(`Constellation Identified: ${res.constellationName}`, 'VOID');
                  handleNavigate(AppView.VOYAGE);
                }} 
              />
            )}
            {view === AppView.VOYAGE && (
              <CelestialQuiz 
                key="voyage"
                scanResult={scanResult}
                onComplete={(data) => {
                  setVoyageData(data);
                  addToLog(`Aptitude aligned. Constructing roadmap.`);
                  handleNavigate(AppView.CHART);
                }}
              />
            )}
            {view === AppView.CHART && (
              <ConstellationMap 
                key="chart"
                coordinates={scanResult?.coordinates || []}
                constellationName={scanResult?.constellationName || "Unknown Voyager"}
                summary={scanResult?.summary}
                onReset={() => handleNavigate(AppView.DOCKS)}
              />
            )}
          </AnimatePresence>

          {/* Celestial HUD Decor */}
          <div className="absolute top-10 right-10 flex gap-12 text-[9px] font-tech text-gold/30 tracking-[0.3em] uppercase pointer-events-none">
            <div className="flex flex-col gap-1">
              <span>Nebula Cluster: Alpha-7</span>
              <span>Sync Status: Perfect</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span>Time Dil: 0.0001s</span>
              <span>Sector: Void {view}</span>
            </div>
          </div>
        </main>
      </div>
    </StarChartLayout>
  );
};

export default App;
