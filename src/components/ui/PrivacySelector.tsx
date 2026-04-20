import React from 'react';
import { Lock, Eye, Users } from 'lucide-react';
import { PrivacyState } from '../../types';
import { motion } from 'motion/react';

interface PrivacySelectorProps {
  state: PrivacyState;
  onChange: (state: PrivacyState) => void;
}

export const PrivacySelector: React.FC<PrivacySelectorProps> = ({ state, onChange }) => {
  const options: { id: PrivacyState; icon: React.ReactNode; label: string; color: string }[] = [
    { id: 'private', icon: <Lock size={16} />, label: 'خاص', color: 'bg-red-500' },
    { id: 'shared', icon: <Users size={16} />, label: 'مشترك', color: 'bg-green-500' },
    { id: 'public', icon: <Eye size={16} />, label: 'عام', color: 'bg-amber-500' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[var(--color-text-secondary)] mr-1">خصوصية العنصر</label>
      <div className="grid grid-cols-3 gap-2 p-1 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)]">
        {options.map((opt) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`relative flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
              state === opt.id
                ? 'text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)]'
            }`}
          >
            {state === opt.id && (
              <motion.div
                layoutId="privacy-bg"
                className={`absolute inset-0 ${opt.color} shadow-lg`}
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{opt.icon}</span>
            <span className="relative z-10 text-xs font-bold">{opt.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
