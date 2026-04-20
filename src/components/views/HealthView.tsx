import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Activity, CheckCircle2, Circle, Plus, Zap } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { FitConnect } from '../ui/FitConnect';

export const HealthView: React.FC = () => {
  const { vitals, logHydration, hydrationLogs, currentUser, googleFitConnected, syncGoogleFitData } = usePlanet();

  const partnerId = currentUser === 'F' ? 'B' : 'F';
  const myHydration = hydrationLogs.filter(l => l.userId === currentUser).reduce((sum, l) => sum + l.amount, 0);
  const partnerHydration = hydrationLogs.filter(l => l.userId === partnerId).reduce((sum, l) => sum + l.amount, 0);
  const targetHydration = 2500; // 2.5L target

  const habits = [
    { id: 'h1', name: 'المشي الصباحي', progress: 80 },
    { id: 'h2', name: 'تمارين الإطالة', progress: 40 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-black">الصحة والنشاط</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">نهتم ببعضنا لنبقى معاً دائماً</p>
      </div>

      {/* Google Fit Connection */}
      <FitConnect />

      {/* Fitness Sync Action */}
      {googleFitConnected && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={syncGoogleFitData}
          className="w-full p-4 glass-card bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-[var(--color-primary)]" />
            <span className="text-xs font-bold">تزامن البيانات الآن</span>
          </div>
          <Activity size={14} className="opacity-40 group-hover:rotate-180 transition-transform duration-500" />
        </motion.button>
      )}

      {/* Water Tracker */}
      <div className="glass-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Droplets size={20} />
            </div>
            <h3 className="font-bold">متابعة الارتواء</h3>
          </div>
          <span className="text-xs font-bold text-[var(--color-text-secondary)]">
            {(myHydration + partnerHydration) / 1000}L / {targetHydration / 1000}L
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider opacity-60">
              <span>أنت</span>
              <span>{myHydration}ml</span>
            </div>
            <div className="h-2 bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (myHydration / (targetHydration / 2)) * 100)}%` }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider opacity-60">
              <span>الشريك</span>
              <span>{partnerHydration}ml</span>
            </div>
            <div className="h-2 bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (partnerHydration / (targetHydration / 2)) * 100)}%` }}
                className="h-full bg-blue-400/50"
              />
            </div>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => logHydration(250)}
          className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> سجل كوب (250ml)
        </motion.button>
      </div>

      {/* Shared Habits */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-text-secondary)]">عاداتنا الصحية</h3>
        <div className="space-y-3">
          {habits.map(habit => (
            <div key={habit.name} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-bg-surface)] text-[var(--color-primary)]">
                  <Activity size={18} />
                </div>
                <span className="font-bold">{habit.name}</span>
              </div>
              <div className="flex gap-2">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]"
                >
                  <Circle size={20} />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
