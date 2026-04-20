import React from 'react';
import { Moon, Sun, Trees, Flower2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Theme } from '../../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  const themes: { id: Theme; icon: React.ReactNode; label: string; color: string }[] = [
    { id: 'midnight', icon: <Moon size={20} />, label: 'ليلة القهوة', color: 'bg-[#8b5cf6]' },
    { id: 'emerald', icon: <Trees size={20} />, label: 'الغابة العميقة', color: 'bg-[#10B981]' },
    { id: 'light', icon: <Sun size={20} />, label: 'نهاري نقي', color: 'bg-[#6366f1]' },
    { id: 'high-contrast', icon: <Info size={20} />, label: 'تباين عالي', color: 'bg-[#000000]' },
    { id: 'gold', icon: <Sun size={20} />, label: 'شروق الصحراء', color: 'bg-[#b45309]' },
    { id: 'rose', icon: <Flower2 size={20} />, label: 'سحاب وردي', color: 'bg-[#e11d48]' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((t) => (
        <motion.button
          whileTap={{ scale: 0.95 }}
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`relative flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-500 overflow-hidden group ${
            currentTheme === t.id
              ? 'bg-[var(--color-bg-surface)] border-2 border-[var(--color-primary)] shadow-2xl shadow-[var(--color-shadow)]'
              : 'glass opacity-60 border-white/5 hover:border-white/20 hover:opacity-100'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${t.color}`}>
            {t.icon}
          </div>
          <div className="text-right">
            <div className="text-sm font-black">{t.label}</div>
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">ثيم النظام</div>
          </div>
          {currentTheme === t.id && (
            <motion.div 
              layoutId="active-theme"
              className="absolute left-4 w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};
