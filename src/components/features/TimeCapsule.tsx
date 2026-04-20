import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hourglass, Lock, Unlock, Send, Calendar, Clock, Plus, X } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';

export const TimeCapsule: React.FC = () => {
  const { timeCapsules, addTimeCapsule, currentUser } = usePlanet();
  const [showAdd, setShowAdd] = useState(false);
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !unlockDate) return;
    addTimeCapsule(content, new Date(unlockDate).getTime());
    setContent('');
    setUnlockDate('');
    setShowAdd(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black">كبسولة الزمن</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">رسائل مشفرة للمستقبل البعيد</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {timeCapsules.length === 0 && (
          <div className="p-12 text-center glass-card opacity-50">
            <Hourglass size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">لا توجد رسائل في الكبسولة حالياً. ابدأ بتوثيق لحظاتك للمستقبل.</p>
          </div>
        )}

        {timeCapsules.map(msg => {
          const isUnlocked = Date.now() >= msg.unlockDate;
          return (
            <div key={msg.id} className={`glass-card p-6 space-y-4 relative overflow-hidden ${!isUnlocked ? 'opacity-80' : 'border-purple-500/30'}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isUnlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-purple-500/10 text-purple-500'}`}>
                    {isUnlocked ? <Unlock size={24} /> : <Lock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{isUnlocked ? 'رسالة من الماضي' : 'رسالة مشفرة'}</h3>
                    <p className="text-[10px] opacity-50 uppercase font-bold tracking-widest">
                      {isUnlocked ? `كتبت في ${new Date(msg.timestamp).toLocaleDateString('ar-EG')}` : `تفتح في ${new Date(msg.unlockDate).toLocaleDateString('ar-EG')}`}
                    </p>
                  </div>
                </div>
              </div>

              {isUnlocked ? (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 italic text-sm leading-relaxed">
                  "{msg.content}"
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (Date.now() - msg.timestamp) / (msg.unlockDate - msg.timestamp) * 100)}%` }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold opacity-50">
                    <span>جاري الانتظار...</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {Math.ceil((msg.unlockDate - Date.now()) / (1000 * 60 * 60 * 24))} يوم متبقي</span>
                  </div>
                </div>
              )}
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
                <h3 className="text-xl font-black">إيداع في الكبسولة</h3>
                <button onClick={() => setShowAdd(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">الرسالة</label>
                  <textarea 
                    required placeholder="ماذا تريد أن تقول لنفسك أو لشريكك في المستقبل؟"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="input-field min-h-[120px] py-4"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">تاريخ فتح الكبسولة</label>
                  <input 
                    type="date" required
                    value={unlockDate}
                    onChange={e => setUnlockDate(e.target.value)}
                    className="input-field py-4"
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                  <Send size={18} /> إيداع الرسالة
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
