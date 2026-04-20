import React from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Clock, Gift, Shield } from 'lucide-react';
import { useKokab } from '../../context/KokabContext';

export const VaultView: React.FC = () => {
  const { vault } = useKokab();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-black">خزنة الذكريات</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">رسائل للمستقبل ولحظات لا تُنسى</p>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex gap-4 items-center">
        <div className="p-2 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
          <Shield size={20} />
        </div>
        <p className="text-xs font-bold text-[var(--color-primary)]">
          هذا القسم مشفر بالكامل ولا يمكن لأحد غيركما الوصول إليه.
        </p>
      </div>

      {/* Vault Items */}
      <div className="grid grid-cols-1 gap-4">
        {vault.length > 0 ? (
          vault.map(item => {
            const isLocked = item.unlockDate > Date.now();
            return (
              <div key={item.id} className={`glass-card p-6 flex items-center justify-between gap-4 ${isLocked ? 'opacity-75' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLocked ? 'bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]' : 'bg-green-500/10 text-green-500'}`}>
                    {isLocked ? <Lock size={24} /> : <Unlock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)] font-bold">
                      <Clock size={12} />
                      <span>{isLocked ? `يفتح في ${new Date(item.unlockDate).toLocaleDateString('ar-EG')}` : 'متاح الآن'}</span>
                    </div>
                  </div>
                </div>
                {!isLocked && (
                  <button className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Gift size={20} />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass-card p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center mx-auto text-[var(--color-text-secondary)]">
              <Lock size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">الخزنة فارغة</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                اكتبوا رسالة لبعضكما تفتح بعد عام، أو سجلوا لحظة خاصة لمستقبل أطفالكما.
              </p>
            </div>
            <button className="btn-primary w-full">أضف أول ذكرى للخزنة</button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-3">
        <VaultCategory icon={<Gift size={18} />} label="هدايا" />
        <VaultCategory icon={<Clock size={18} />} label="رسائل" />
        <VaultCategory icon={<Shield size={18} />} label="أسرار" />
      </div>
    </motion.div>
  );
};

const VaultCategory: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <button className="glass-card p-4 flex flex-col items-center gap-2 hover:border-[var(--color-primary)]/50 transition-all">
    <div className="text-[var(--color-primary)]">{icon}</div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);
