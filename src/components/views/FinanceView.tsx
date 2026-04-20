import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, Target, Plus, ArrowUpRight } from 'lucide-react';
import { useKokab } from '../../context/KokabContext';

export const FinanceView: React.FC = () => {
  const { finance } = useKokab();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-black">المالية المشتركة</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">نخطط لمستقبلنا معاً بكل شفافية</p>
      </div>

      {/* Main Balance */}
      <div className="glass-card p-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-bg-card)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold opacity-80">الميزانية التشغيلية</span>
            <TrendingUp size={20} />
          </div>
          <div className="text-4xl font-black">
            ${finance.operational.toLocaleString()}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
              إضافة مبلغ
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
              سجل العمليات
            </button>
          </div>
        </div>
      </div>

      {/* Future Goals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--color-text-secondary)]">أهدافنا المستقبلية</h3>
          <button className="text-[var(--color-primary)] text-xs font-bold flex items-center gap-1">
            <Plus size={14} /> هدف جديد
          </button>
        </div>

        <div className="space-y-4">
          {finance.futureGoals.length > 0 ? (
            finance.futureGoals.map(goal => (
              <div key={goal.id} className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--color-bg-surface)] text-[var(--color-primary)]">
                      <Target size={18} />
                    </div>
                    <span className="font-bold">{goal.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                    ${goal.current} / ${goal.target}
                  </span>
                </div>
                <div className="w-full h-2 bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                    className="h-full bg-[var(--color-primary)]"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center mx-auto text-[var(--color-text-secondary)]">
                <Target size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-bold">لا توجد أهداف حالياً</p>
                <p className="text-xs text-[var(--color-text-secondary)]">ابدأوا بالتخطيط لرحلتكم القادمة أو منزل الأحلام</p>
              </div>
              <button className="btn-secondary py-2 px-6 text-sm">أضف هدفك الأول</button>
            </div>
          )}
        </div>
      </div>

      {/* Interconnectivity Info */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
          <ArrowUpRight size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-500">نظام التحويل الذكي</h4>
          <p className="text-xs leading-relaxed text-amber-600/80">
            تذكروا: عند إتمام العادات الصحية (مثل شرب الماء أو الرياضة)، يتم تحويل مبلغ بسيط تلقائياً من الميزانية التشغيلية إلى أهدافكم المستقبلية!
          </p>
        </div>
      </div>
    </motion.div>
  );
};
