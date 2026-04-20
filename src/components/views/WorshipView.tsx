import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Fingerprint } from 'lucide-react';
import { useKokab } from '../../context/KokabContext';

export const WorshipView: React.FC = () => {
  const { worship, addTasbeeh, currentUser } = useKokab();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-black">القسم الديني</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">نوروا حياتكما بالذكر والطاعة</p>
      </div>

      {/* Streak Card */}
      <div className="glass-card p-6 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent border-[var(--color-primary)]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">سلسلة الطاعات</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">مستمرون منذ {worship.streaks} أيام</p>
            </div>
          </div>
          <div className="text-3xl font-black text-amber-500">
            {worship.streaks} 🔥
          </div>
        </div>
      </div>

      {/* Tasbeeh Counter */}
      <div className="glass-card p-8 flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">مجموع التسبيح اليوم</h3>
          <div className="text-5xl font-black text-[var(--color-primary)]">
            {worship.tasbeeh.total}
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">الهدف: {worship.tasbeeh.target}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (worship.tasbeeh.total / worship.tasbeeh.target) * 100)}%` }}
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
          />
        </div>

        {/* Interaction Area */}
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold">تسبيحك</p>
            <div className="text-2xl font-black">{worship.tasbeeh[currentUser]}</div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-xs font-bold">تسبيح الشريك</p>
            <div className="text-2xl font-black opacity-50">{worship.tasbeeh[currentUser === 'F' ? 'B' : 'F']}</div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addTasbeeh(1)}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] shadow-2xl shadow-[var(--color-shadow)] flex flex-col items-center justify-center text-white gap-2 border-4 border-white/10"
        >
          <Fingerprint size={40} />
          <span className="text-xs font-bold">سبّح</span>
        </motion.button>
      </div>

      {/* Spiritual Tips */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-text-secondary)]">نصيحة اليوم</h3>
        <div className="glass-card p-4 flex gap-4 items-start">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Sparkles size={20} />
          </div>
          <p className="text-sm leading-relaxed">
            "أحب الأعمال إلى الله أدومها وإن قل". حاولوا تخصيص ٥ دقائق يومياً للذكر معاً قبل النوم.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
