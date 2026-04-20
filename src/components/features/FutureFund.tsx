import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Target, ShieldCheck, Lock, Unlock, Image as ImageIcon, CheckCircle2, XCircle, Coins, ArrowUpRight, Timer, Plus, X } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';

export const FutureFund: React.FC = () => {
  const { assets, unlockAsset, approveVisionBoard, currentUser, coinStaking, stakeCoins, addFinancialGoal } = usePlanet();
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: 5000,
    imageUrl: '',
    visualDescription: '',
    requiresDualAuth: true
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    addFinancialGoal(newGoal);
    setShowAdd(false);
    setNewGoal({ name: '', target: 5000, imageUrl: '', visualDescription: '', requiresDualAuth: true });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-black">خزينة الأصول والاستثمار</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">بناء المستقبل، خطوة بخطوة</p>
      </div>

      {/* Coin Staking Section */}
      <section className="glass-card p-6 border-amber-500/20 bg-amber-500/5 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Coins size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black">تجميد العملات (Coin Staking)</h3>
              <p className="text-[10px] opacity-60">جمدوا مدخراتكم للحصول على مكافآت</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-black text-amber-500">+{coinStaking.rewardRate}%</div>
            <div className="text-[8px] opacity-40 uppercase">عائد سنوي</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[8px] opacity-40 uppercase font-bold">المبلغ المجمد</div>
            <div className="text-xl font-black text-amber-500">{coinStaking.amount.toLocaleString()} <span className="text-[10px] opacity-50">عملة</span></div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[8px] opacity-40 uppercase font-bold">الأرباح المتراكمة</div>
            <div className="text-xl font-black text-green-500">+{coinStaking.rewards.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => stakeCoins(1000)}
            className="flex-1 py-4 rounded-2xl bg-amber-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ArrowUpRight size={16} /> تجميد ١٠٠٠ عملة
          </button>
          <div className="px-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
            <Timer size={18} />
          </div>
        </div>
        
        <p className="text-[8px] text-center opacity-40 italic">يتم احتساب الأرباح كل ٢٤ ساعة بناءً على نشاطكما المشترك</p>
      </section>

      <div className="grid grid-cols-1 gap-6">
        {assets.map(asset => {
          const progress = (asset.current / asset.target) * 100;
          const isApproved = asset.isApprovedByF && asset.isApprovedByB;
          
          return (
            <div key={asset.id} className="glass-card overflow-hidden flex flex-col">
              {/* Vision Board Image Section */}
              <div className="relative h-48 bg-black/20 overflow-hidden">
                {asset.imageUrl ? (
                  <motion.img 
                    src={asset.imageUrl} 
                    alt={asset.name}
                    className="w-full h-full object-cover transition-all duration-1000"
                    style={{ filter: `grayscale(${100 - progress}%)` }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] opacity-20">
                    <ImageIcon size={48} />
                    <span className="text-[10px] font-bold mt-2">لا توجد صورة للرؤية</span>
                  </div>
                )}
                
                {/* Progress Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="space-y-1">
                    <h3 className="text-white font-black text-lg">{asset.name}</h3>
                    <p className="text-white/60 text-[10px] font-medium max-w-[200px]">{asset.visualDescription}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-black text-2xl">{Math.round(progress)}%</div>
                    <div className="text-white/50 text-[8px] font-bold uppercase tracking-widest">اكتمال الرؤية</div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Vision Board Sync Status */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isApproved ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
                      <Target size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold">تزامن لوحة الرؤية</div>
                      <div className="text-[8px] opacity-50">{isApproved ? 'تم التوافق على الهدف' : 'في انتظار توافق الشريكين'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => approveVisionBoard(asset.id)}
                      disabled={currentUser === 'F' ? asset.isApprovedByF : asset.isApprovedByB}
                      className={`p-2 rounded-lg transition-all ${
                        (currentUser === 'F' ? asset.isApprovedByF : asset.isApprovedByB)
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <div className="flex items-center gap-1 ml-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${asset.isApprovedByF ? 'bg-green-500' : 'bg-white/10'}`} />
                      <div className={`w-1.5 h-1.5 rounded-full ${asset.isApprovedByB ? 'bg-green-500' : 'bg-white/10'}`} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <div className="text-[10px] opacity-50">تم ادخاره</div>
                    <div className="text-lg font-black">${asset.current.toLocaleString()}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] opacity-50">الهدف المالي</div>
                    <div className="text-lg font-black opacity-30">${asset.target.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="h-2 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                  />
                </div>

                {asset.requiresDualAuth && (
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-amber-500 font-bold">
                        <ShieldCheck size={12} /> حصالة الأحلام المشفرة
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[8px] font-bold ${asset.isLocked ? 'bg-rose-500/10 text-rose-500' : 'bg-green-500/10 text-green-500'}`}>
                        {asset.isLocked ? 'مغلقة' : 'مفتوحة'}
                      </div>
                    </div>
                    
                    {asset.isLocked ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => unlockAsset(asset.id)}
                            disabled={asset.unlockRequests.includes(currentUser)}
                            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold transition-all ${asset.unlockRequests.includes(currentUser) ? 'bg-green-500/20 text-green-500' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'}`}
                          >
                            {asset.unlockRequests.includes(currentUser) ? <ShieldCheck size={14} /> : <Lock size={14} />}
                            {asset.unlockRequests.includes(currentUser) ? 'في انتظار الشريك' : 'طلب فتح القفل'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="w-full py-3 rounded-xl bg-green-500 text-white text-[10px] font-bold flex items-center justify-center gap-2">
                        <Unlock size={14} /> سحب مبلغ (القفل مفتوح)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => setShowAdd(true)}
        className="btn-primary w-full py-5 flex items-center justify-center gap-2 shadow-2xl shadow-[var(--color-primary)]/20"
      >
        <TrendingUp size={20} /> إضافة هدف مستقبلي جديد
      </button>

      <AnimatePresence>
        {showAdd && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="modal-content overflow-y-auto no-scrollbar max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black">هدف مستقبلي جديد</h3>
                  <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">تخطيط لمستقبل الكوكب</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-6">
                <ModernInput 
                  label="اسم الهدف" required
                  value={newGoal.name}
                  onChange={e => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                />
                <ModernInput 
                  label="المبلغ المستهدف ($)" type="number" required
                  value={newGoal.target}
                  onChange={e => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                />
                <ModernInput 
                  label="رابط صورة الرؤية"
                  value={newGoal.imageUrl}
                  onChange={e => setNewGoal(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40">وصف بصري للهدف</label>
                  <textarea 
                    value={newGoal.visualDescription}
                    onChange={e => setNewGoal(prev => ({ ...prev, visualDescription: e.target.value }))}
                    placeholder="اوصف كيف سيبدو هذا الهدف عند تحقيقه..."
                    className="w-full h-24 glass border-white/10 rounded-xl px-4 py-3 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-amber-500 flex items-center gap-2">
                      <ShieldCheck size={14} /> حصالة مشفرة
                    </div>
                    <div className="text-[8px] opacity-40 italic">تتطلب موافقة الطرفين للسحب</div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setNewGoal(prev => ({ ...prev, requiresDualAuth: !prev.requiresDualAuth }))}
                    className={`w-12 h-6 rounded-full transition-all relative ${newGoal.requiresDualAuth ? 'bg-amber-500' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: newGoal.requiresDualAuth ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                <button type="submit" className="btn-primary w-full py-5 text-sm shadow-2xl shadow-[var(--color-primary)]/20">
                  إضافة الهدف المالي
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
