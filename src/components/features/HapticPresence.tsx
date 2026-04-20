import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Heart, Zap, Waves, Sparkles, MessageCircle, Activity } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';

export const HapticPresence: React.FC = () => {
  const { currentUser, partnerStatus, sendHapticPulse } = usePlanet();
  const [activePulse, setActivePulse] = useState<string | null>(null);

  const sendPulse = (type: string) => {
    setActivePulse(type);
    sendHapticPulse(type);
    if ('vibrate' in navigator) {
      if (type === 'heart') navigator.vibrate([200, 100, 200, 100, 400]);
      else if (type === 'zap') navigator.vibrate(50);
      else if (type === 'appreciation') navigator.vibrate([100, 50, 100, 50, 100]);
      else navigator.vibrate(500);
    }
    setTimeout(() => setActivePulse(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-black">بوابة الهمس الرقمي</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">تواصل صامت عبر لغة الجسد الرقمية</p>
      </div>

      {/* Heartbeat Mimic Section */}
      <div className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Pulsing Background Rings */}
          <motion.div 
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-48 h-48 rounded-full border-2 border-rose-500/20"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute w-48 h-48 rounded-full border-2 border-rose-500/30"
          />
        </div>

        <motion.button 
          onClick={() => sendPulse('heart')}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          className={`relative z-10 w-48 h-48 rounded-full glass-card flex flex-col items-center justify-center transition-all duration-500 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.2)] ${activePulse === 'heart' ? 'bg-rose-500 text-white' : 'text-rose-500'}`}
        >
          <Heart size={64} fill={activePulse === 'heart' ? 'currentColor' : 'none'} className={activePulse === 'heart' ? 'animate-bounce' : ''} />
          <div className="mt-2 text-[10px] font-black uppercase tracking-widest">نبضة قلب حية</div>
          {partnerStatus?.status === 'online' && (
            <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-green-500 text-white text-[8px] font-black flex items-center gap-1">
              <Activity size={10} /> الشريك متصل
            </div>
          )}
        </motion.button>

        {/* Floating Pulse Options */}
        <div className="absolute inset-0 pointer-events-none">
          <PulseButton 
            icon={<Fingerprint size={20} />} 
            label="لمسة حضور" 
            color="blue" 
            pos="top-10 left-10" 
            onClick={() => sendPulse('pulse')}
          />
          <PulseButton 
            icon={<Sparkles size={20} />} 
            label="تقدير" 
            color="amber" 
            pos="top-10 right-10" 
            onClick={() => sendPulse('appreciation')}
          />
          <PulseButton 
            icon={<Waves size={20} />} 
            label="هدوء" 
            color="cyan" 
            pos="bottom-10 left-10" 
            onClick={() => sendPulse('wave')}
          />
          <PulseButton 
            icon={<Zap size={20} />} 
            label="تنبيه" 
            color="rose" 
            pos="bottom-10 right-10" 
            onClick={() => sendPulse('zap')}
          />
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${partnerStatus?.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm font-bold">الشريك {partnerStatus?.status === 'online' ? 'متصل الآن' : 'غير متصل'}</span>
        </div>
        <p className="text-xs opacity-60 leading-relaxed">
          عندما تضغط على البوابة، سيهتز هاتف شريكك بلطف ليشعر بوجودك بجانبه دون الحاجة للكلمات.
        </p>
      </div>
    </motion.div>
  );
};

const PulseButton: React.FC<{ icon: React.ReactNode; label: string; color: string; pos: string; onClick: () => void }> = ({ icon, label, color, pos, onClick }) => (
  <button 
    onClick={onClick}
    className={`absolute ${pos} pointer-events-auto p-4 rounded-2xl glass-card flex flex-col items-center gap-2 hover:scale-110 transition-transform group`}
  >
    <div className={`text-${color}-500 group-hover:animate-bounce`}>{icon}</div>
    <span className="text-[10px] font-bold opacity-50">{label}</span>
  </button>
);
