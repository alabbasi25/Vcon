import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Focus, BellOff, Coffee, Zap, Timer, Play, Square, ShieldCheck } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';

export const FocusSync: React.FC = () => {
  const { focusStates, toggleFocusMode, currentUser } = usePlanet();
  const [task, setTask] = useState('');

  const myFocus = focusStates[currentUser];
  const partnerFocus = focusStates[currentUser === 'F' ? 'B' : 'F'];

  const handleToggle = () => {
    toggleFocusMode(!myFocus.isActive, task);
    if (!myFocus.isActive) setTask('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-black">وضع التركيز المتزامن</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">بيئة هادئة للإنتاجية والتعلم</p>
      </div>

      <div className={`glass-card p-8 text-center space-y-8 transition-all duration-500 ${myFocus.isActive ? 'border-blue-500 bg-blue-500/5' : ''}`}>
        <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center transition-all duration-500 ${myFocus.isActive ? 'bg-blue-500 text-white shadow-2xl shadow-blue-500/40 rotate-12' : 'bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]'}`}>
          <Focus size={48} />
        </div>

        <div className="space-y-4">
          {myFocus.isActive ? (
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-blue-500">جاري التركيز...</h3>
              <p className="text-sm opacity-60">تم كتم جميع الإشعارات غير الضرورية</p>
              {myFocus.task && <div className="mt-4 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 font-bold text-xs inline-block">{myFocus.task}</div>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">مستعد للبدء؟</h3>
                <p className="text-sm opacity-60">سيتم إخطار الطرف الآخر ببدء جلستك</p>
              </div>
              <input 
                type="text" 
                placeholder="ماذا ستنجز الآن؟"
                value={task}
                onChange={e => setTask(e.target.value)}
                className="input-field text-center"
              />
            </div>
          )}
        </div>

        <button 
          onClick={handleToggle}
          className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
            myFocus.isActive 
              ? 'bg-rose-500 text-white shadow-rose-500/20' 
              : 'bg-blue-500 text-white shadow-blue-500/20'
          }`}
        >
          {myFocus.isActive ? <><Square size={20} /> إنهاء الجلسة</> : <><Play size={20} /> بدء التركيز</>}
        </button>
      </div>

      {/* Partner Status */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${partnerFocus.isActive ? 'bg-amber-500/10 text-amber-500' : 'bg-[var(--color-bg-surface)] opacity-50'}`}>
            <Coffee size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm">حالة الشريك</h4>
            <p className="text-xs opacity-60">
              {partnerFocus.isActive ? `في مهمة تعليمية الآن: ${partnerFocus.task || 'مركز'}` : 'متاح حالياً'}
            </p>
          </div>
        </div>
        {partnerFocus.isActive && (
          <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase animate-pulse">
            يرجى الهدوء
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase">
            <BellOff size={12} /> الإشعارات
          </div>
          <div className="text-sm font-bold">صامتة تماماً</div>
        </div>
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase">
            <ShieldCheck size={12} /> الخصوصية
          </div>
          <div className="text-sm font-bold">محمية بالكامل</div>
        </div>
      </div>
    </motion.div>
  );
};
