import React from 'react';
import { motion } from 'motion/react';
import { usePlanet } from '../../context/KokabContext';
import { Activity, ShieldCheck, Heart, Coins, TrendingUp, Info, Package, Zap } from 'lucide-react';

export const PlanetHealthSection: React.FC = () => {
  const { planetHealth } = usePlanet();

  const getMetricColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const metrics = [
    { label: 'اللوجستيات', score: planetHealth.breakdown.logistics, icon: <Package size={18} />, color: 'emerald' },
    { label: 'المالية', score: planetHealth.breakdown.finance, icon: <Coins size={18} />, color: 'amber' },
    { label: 'الروحانيات', score: planetHealth.breakdown.spiritual, icon: <Heart size={18} />, color: 'rose' },
    { label: 'الصحة البدنية', score: planetHealth.breakdown.health, icon: <Zap size={18} />, color: 'blue' },
  ];

  return (
    <div className="glass-card p-6 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
        <ShieldCheck size={120} />
      </div>

      <div className="flex justify-between items-start relative z-10 mb-8">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 flex items-center gap-2">
            مؤشر توازن الكوكب <Info size={10} />
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-[var(--color-primary)]">%{planetHealth.score}</h2>
            <span className={`text-xs font-black uppercase ${getMetricColor(planetHealth.score)}`}>
              {planetHealth.score >= 80 ? 'مثالي' : planetHealth.score >= 50 ? 'مستقر' : 'حرج'}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[var(--color-primary)]">
          <TrendingUp size={24} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {metrics.map((m) => (
          <div key={m.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl bg-${m.color}-500/10 text-${m.color}-500`}>
                {m.icon}
              </div>
              <span className="text-xl font-black">{m.score}</span>
            </div>
            <div>
              <div className="text-[9px] font-black opacity-40 uppercase tracking-tighter mb-1">{m.label}</div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${m.score}%` }}
                  className={`h-full bg-${m.color}-500`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
