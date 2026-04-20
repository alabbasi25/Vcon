import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, CheckCircle, Target, Flame, Plus, X, Trophy } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';

export const PersonalGrowth: React.FC = () => {
  const { currentUser, habits, updateHabitProgress, addHabit } = usePlanet();
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', target: 10, unit: '', color: 'blue' as const });

  const myHabits = habits[currentUser] || [];
  const completedToday = myHabits.filter(h => h.progress >= h.target).length;
  const totalDailyProgress = myHabits.reduce((acc, h) => acc + Math.min(100, (h.progress / h.target) * 100), 0) / (myHabits.length || 1);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addHabit(newHabit);
    setShowAdd(false);
    setNewHabit({ title: '', target: 10, unit: '', color: 'blue' });
  };

  const colorMap = {
    blue: 'bg-blue-500 text-blue-500 bg-blue-500/10',
    emerald: 'bg-emerald-500 text-emerald-500 bg-emerald-500/10',
    purple: 'bg-purple-500 text-purple-500 bg-purple-500/10'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">غراس الكوكب</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">تطوير الذات هو وقود الكوكب للحياة</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      {/* Daily Summary Card */}
      {myHabits.length > 0 && (
        <div className="glass-card p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={80} />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">إنجازك اليومي</h3>
              <div className="text-3xl font-black">{Math.round(totalDailyProgress)}%</div>
              <p className="text-[10px] opacity-60 font-bold">لقد أتممت {completedToday} من أصل {myHabits.length} عادات إيجابية اليوم.</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="32" cy="32" r="28"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * totalDailyProgress) / 100}
                  className="text-emerald-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame size={20} className="text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">قائمة العادات اليومية</h3>
          <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest">تحديث تلقائي كل ٢٤ ساعة</div>
        </div>
        {myHabits.length === 0 && (
          <div className="p-12 text-center glass-card opacity-50">
            <Target size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">ابدأ بإضافة عاداتك الشخصية لتتبع نموك.</p>
          </div>
        )}

        {myHabits.map(habit => {
          const isCompleted = habit.progress >= habit.target;
          return (
            <div 
              key={habit.id} 
              className={`glass-card p-6 space-y-4 border-2 transition-all ${isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-transparent'}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white' : `${colorMap[habit.color].split(' ')[2]} ${colorMap[habit.color].split(' ')[1]}`}`}>
                    {isCompleted ? <CheckCircle size={20} /> : <Target size={20} />}
                  </div>
                  <div>
                    <h3 className={`font-bold transition-all ${isCompleted ? 'text-emerald-500' : ''}`}>{habit.title}</h3>
                    <p className="text-[10px] opacity-50">الهدف: {habit.target} {habit.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black">{habit.progress}</div>
                  <div className="text-[10px] opacity-50">{habit.unit}</div>
                </div>
              </div>
              
              <div className="h-2 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (habit.progress / habit.target) * 100)}%` }}
                  className={`h-full transition-all ${isCompleted ? 'bg-emerald-500' : colorMap[habit.color].split(' ')[0]}`}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1 text-[10px] text-orange-500 font-bold">
                  <Flame size={12} /> {Math.floor((Date.now() - habit.lastUpdated) / 86400000) === 0 ? 'نشط اليوم' : 'بانتظار التحديث'}
                </div>
                {!isCompleted && (
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateHabitProgress(habit.id, habit.progress + 1)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full ${colorMap[habit.color].split(' ')[2]} ${colorMap[habit.color].split(' ')[1]}`}
                  >
                    +1 {habit.unit}
                  </motion.button>
                )}
                {isCompleted && (
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                    تم الإنجاز بنجاح ✨
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-sm p-8 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">إضافة عادة جديدة</h3>
                <button onClick={() => setShowAdd(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <ModernInput 
                  label="اسم العادة" required
                  value={newHabit.title}
                  onChange={e => setNewHabit(prev => ({ ...prev, title: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <ModernInput 
                    label="الهدف الرقمي" type="number" required
                    value={newHabit.target}
                    onChange={e => setNewHabit(prev => ({ ...prev, target: Number(e.target.value) }))}
                  />
                  <ModernInput 
                    label="الوحدة (مثلاً: صفحة)" required
                    value={newHabit.unit}
                    onChange={e => setNewHabit(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">اللون المميز</label>
                  <div className="flex gap-2">
                    {(['blue', 'emerald', 'purple'] as const).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewHabit(prev => ({ ...prev, color: c }))}
                        className={`w-8 h-8 rounded-full ${colorMap[c].split(' ')[0]} ${newHabit.color === c ? 'ring-2 ring-offset-2 ring-[var(--color-primary)]' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-4">حفظ العادة</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
