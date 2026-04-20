import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface PillarGatewayProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  description: string;
  onClick: () => void;
}

export const PillarGateway: React.FC<PillarGatewayProps> = ({ label, count, icon, color, description, onClick }) => {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-500/20',
    emerald: 'from-emerald-400 to-teal-600 shadow-emerald-500/20',
    purple: 'from-purple-500 to-fuchsia-600 shadow-purple-500/20',
    rose: 'from-rose-500 to-pink-600 shadow-rose-500/20',
    amber: 'from-amber-400 to-orange-600 shadow-amber-500/20'
  };

  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full overflow-hidden glass-card p-6 flex flex-col items-start gap-4 text-right group border border-white/5 active:border-white/20 transition-all"
    >
      <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${colorMap[color]} opacity-[0.03] -translate-x-10 -translate-y-10 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
      
      <div className="flex justify-between items-start w-full relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform duration-500`}>
          {React.cloneElement(icon as React.ReactElement, { size: 28 })}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black">{count}%</span>
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">مستوى الطاقة</span>
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        <h3 className="text-xl font-black">{label}</h3>
        <p className="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed opacity-70">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-black text-[var(--color-primary)] mt-2 group-hover:translate-x-[-4px] transition-transform relative z-10">
        استكشف الركن <ArrowLeft size={14} />
      </div>
    </motion.button>
  );
};
