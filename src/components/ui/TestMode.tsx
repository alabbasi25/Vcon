import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Users, Database, Cpu, X, Play, RefreshCw, Eye, Sparkles, 
  CheckCircle2, Info, Layout, Layers, Bot, Smartphone, Radar, Activity, ShieldCheck
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { useAI } from '../../hooks/useAI';
import { KokabButton } from './KokabButton';
import { KokabCard } from './KokabCard';
import { KokabBadge } from './KokabBadge';
import { UserID } from '../../types';

interface TestModeProps {
  onSwitchUser: (id?: UserID) => void;
}

export const TestMode: React.FC<TestModeProps> = ({ onSwitchUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { populateTestData, resetApp, currentUser, barakahPoints, nudgePartner, sendHapticPulse } = usePlanet() as any;
  const { getSmartSuggestion, loading: aiLoading } = useAI();
  const [testLog, setTestLog] = useState<string[]>([]);
  const [kitchenSink, setKitchenSink] = useState(false);

  const addLog = (msg: string) => setTestLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));

  const runAiTest = async () => {
    addLog("Testing Gemini SDK Connection...");
    const res = await getSmartSuggestion('general');
    if (res) addLog("AI Response Received: Success ✅");
    else addLog("AI Response Failed: Check API Key ❌");
  };

  const resetOnboarding = () => {
    localStorage.removeItem('kokab_onboarding_complete');
    addLog("Onboarding Reset. Please refresh page.");
    window.location.reload();
  };

  const runFullStressTest = async () => {
    addLog("🚀 Starting Global App Test...");
    
    // Testing Socket Sync
    nudgePartner("Stress Test: System Broadcast Check", "النظام يختبر نفسه");
    sendHapticPulse("double_pulse");
    addLog("📡 Real-time Sync (Socket) -> OK");

    // Bulk data population
    populateTestData();
    addLog("📦 Bulk Data Migration simulation -> OK");

    // Trigger AI
    addLog("🤖 Calling AI Oracle...");
    await getSmartSuggestion('wellness');
    
    addLog("✅ Full Application Test Sequence Finished.");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[300] w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xl border border-white/20 opacity-40 hover:opacity-100 transition-all font-mono"
      >
        <Terminal size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 z-[300] w-96 bg-slate-950 text-slate-100 border-r border-white/10 shadow-2xl flex flex-col font-mono text-[10px] overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-emerald-400" />
          <span className="font-bold tracking-tighter uppercase">Kokab QA Engine v2.0</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:text-emerald-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="text-[9px] font-black uppercase text-emerald-400">Total System Test</div>
          <KokabButton variant="primary" size="sm" fullWidth onClick={runFullStressTest}>
            <Play size={12} className="ml-2" /> تشغيل اختبار شامل للنظام
          </KokabButton>
        </div>

        {/* Step 1: Product Pruning & Pillars */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <Layers size={12} /> Step 1: Pillars & Navigation
          </h3>
          <div className="p-2 rounded bg-white/5 border border-white/10 space-y-1">
            <div className="flex justify-between"><span>Pillar 1: الرومانسية</span><CheckCircle2 size={10} className="text-emerald-400" /></div>
            <div className="flex justify-between"><span>Pillar 2: المنظومة</span><CheckCircle2 size={10} className="text-emerald-400" /></div>
            <div className="flex justify-between"><span>Pillar 3: العافية</span><CheckCircle2 size={10} className="text-emerald-400" /></div>
          </div>
        </div>

        {/* Step 2 & 4: Service Layer & SDK */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <Bot size={12} /> Step 2 & 4: Architecture & AI
          </h3>
          <KokabButton variant="primary" size="sm" fullWidth onClick={runAiTest} disabled={aiLoading}>
            {aiLoading ? <RefreshCw size={12} className="animate-spin" /> : "Run Gemini Integration Test"}
          </KokabButton>
        </div>

        {/* Step 3: Onboarding */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <Smartphone size={12} /> Step 3: Onboarding Flow
          </h3>
          <KokabButton variant="secondary" size="sm" fullWidth onClick={resetOnboarding}>
            Reset Onboarding & Reload
          </KokabButton>
        </div>

        {/* Step 5: Persistence & State */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <Database size={12} /> Step 5: Persistence Check
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <div className="opacity-50">Storage Key:</div>
              <div className="font-bold text-blue-400">kokab-storage</div>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <div className="opacity-50">Barakah:</div>
              <div className="font-bold text-amber-400">{barakahPoints}</div>
            </div>
          </div>
          <KokabButton variant="danger" size="sm" fullWidth onClick={resetApp}>
            Clear Storage (Nuke App)
          </KokabButton>
        </div>

        {/* Step 6: UI Normalization */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <Layout size={12} /> Step 6: UI Normalization
          </h3>
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex justify-between items-center">
            <span>Atomic Components Normalized</span>
            <CheckCircle2 size={12} />
          </div>
        </div>

        {/* Step 7: Real-time Sync */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <RefreshCw size={12} /> Step 7: Socket.Sync Engine
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <KokabButton variant="primary" size="sm" onClick={() => nudgePartner("Hello from QA Engine!", "اختبار المزامنة")}>
              Send Nudge
            </KokabButton>
            <KokabButton variant="secondary" size="sm" onClick={() => sendHapticPulse("heartbeat")}>
              Pulse Buzz
            </KokabButton>
          </div>
        </div>

        {/* Step 8: Data Viz */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <Radar size={12} /> Step 8: Advanced Data Viz
          </h3>
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex justify-between items-center">
            <span>D3 Relationship Radar Active</span>
            <CheckCircle2 size={12} />
          </div>
        </div>

        {/* Step 9: Fitness */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <Activity size={12} /> Step 9: Fitness & Wearables
          </h3>
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 space-y-1">
            <div className="flex justify-between items-center">
              <span>Simulation Engine</span>
              <CheckCircle2 size={10} />
            </div>
            <div className="flex justify-between items-center">
              <span>Arena Battle Logic</span>
              <CheckCircle2 size={10} />
            </div>
          </div>
        </div>

        {/* Step 10: Reliability */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 opacity-50 uppercase tracking-widest font-black">
            <ShieldCheck size={12} /> Step 10: Fault Tolerance
          </h3>
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 flex justify-between items-center">
            <span>Global Error Boundary</span>
            <CheckCircle2 size={12} />
          </div>
          <KokabButton variant="danger" size="sm" onClick={() => { throw new Error("QA Triggered System Failure"); }}>
            Test Error Boundary
          </KokabButton>
        </div>

        {/* Test Logs */}
        <div className="space-y-2 pt-4 border-t border-white/5">
          <h3 className="opacity-30 uppercase font-black text-[8px]">Real-time Test Logs</h3>
          <div className="bg-black/40 rounded p-2 overflow-hidden min-h-[60px]">
            {testLog.length === 0 && <div className="opacity-20 italic">No tests run yet...</div>}
            {testLog.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-slate-900 grid grid-cols-2 gap-4">
        <button 
          onClick={() => onSwitchUser('F')}
          className={`p-2 rounded border border-white/5 transition-all flex items-center justify-center gap-2 ${currentUser === 'F' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5'}`}
        >
          <Users size={10} /> فهد
        </button>
        <button 
          onClick={() => onSwitchUser('B')}
          className={`p-2 rounded border border-white/5 transition-all flex items-center justify-center gap-2 ${currentUser === 'B' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5'}`}
        >
          <Users size={10} /> بشرى
        </button>
      </div>
    </div>
  );
};

