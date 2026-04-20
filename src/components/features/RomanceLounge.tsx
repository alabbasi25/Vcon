import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Send, Lock, Eye, MessageCircleHeart, MapPin, Map as MapIcon, Unlock, Clock } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';

export const RomanceLounge: React.FC = () => {
  const { romancePrompts, submitRomanceAnswer, currentUser, geoCapsules, unlockGeoCapsule } = usePlanet();
  const [answer, setAnswer] = useState('');

  const activePrompt = romancePrompts[0];

  const handleSubmit = () => {
    if (!answer.trim() || !activePrompt) return;
    submitRomanceAnswer(activePrompt.id, answer);
    setAnswer('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-black">صالون الرومانسية</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">مساحة لتعميق الروابط بعيداً عن ضجيج الحياة</p>
      </div>

      {/* Geo-Locked Time Capsule (Map View) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">كبسولات الزمن الجغرافية</h3>
          <div className="flex items-center gap-1 text-[8px] font-black text-rose-500 uppercase tracking-widest">
            <MapPin size={10} /> {geoCapsules.filter(c => c.isLocked).length} كبسولات مغلقة
          </div>
        </div>

        <div className="glass-card h-64 relative overflow-hidden bg-slate-900/50 border-rose-500/20">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>
          
          {/* Map Pins */}
          {geoCapsules.map(capsule => (
            <motion.div 
              key={capsule.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute cursor-pointer group"
              style={{ left: `${capsule.location.lng}%`, top: `${capsule.location.lat}%` }}
              onClick={() => capsule.isLocked && unlockGeoCapsule(capsule.id)}
            >
              <div className={`p-2 rounded-full transition-all duration-500 ${capsule.isLocked ? 'bg-rose-500/20 text-rose-500' : 'bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'}`}>
                {capsule.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="glass-card p-3 whitespace-nowrap text-center">
                  <div className="text-[10px] font-black">{capsule.title}</div>
                  <div className="text-[8px] opacity-60">{capsule.isLocked ? 'اذهب إلى الموقع لفتحها' : 'تم الفتح بنجاح'}</div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="absolute bottom-4 left-4 right-4 p-3 glass-card bg-black/40 border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <MapIcon size={16} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold">رادار الذكريات</div>
              <div className="text-[8px] opacity-50">هناك ذكرى مخبأة بالقرب من "حديقة الزهور"</div>
            </div>
          </div>
        </div>
      </section>

      <div className="glass-card p-8 bg-gradient-to-br from-rose-500/10 to-purple-500/10 border-rose-500/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-5">
          <Heart size={200} fill="currentColor" />
        </div>
        
        <div className="relative z-10 space-y-8 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/20 text-rose-500 mb-2">
            <Sparkles size={32} />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-black leading-relaxed">
              {activePrompt.question}
            </h3>
            <p className="text-xs opacity-60">سؤال اليوم لتعزيز التواصل العاطفي</p>
          </div>

          {!activePrompt.answers[currentUser] ? (
            <div className="space-y-4">
              <textarea 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="اكتب إجابتك هنا بصدق..."
                className="input-field min-h-[120px] text-center py-4 bg-white/5 border-rose-500/20 focus:border-rose-500"
              />
              <button 
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
              >
                <Send size={18} /> إرسال الإجابة
              </button>
              <p className="text-[10px] opacity-50 italic">لن تظهر إجابتك للطرف الآخر إلا بعد أن يضع إجابته أيضاً</p>
            </div>
          ) : !activePrompt.revealed ? (
            <div className="p-12 glass-card border-rose-500/20 space-y-4">
              <Lock size={48} className="mx-auto text-rose-500 opacity-50" />
              <div className="space-y-1">
                <p className="font-bold">تم حفظ إجابتك بنجاح!</p>
                <p className="text-xs opacity-60">بانتظار إجابة الطرف الآخر للكشف عن المفاجأة...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 text-right">
              <div className="glass-card p-6 border-rose-500/30 bg-rose-500/5">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-rose-500 uppercase">
                  <MessageCircleHeart size={14} /> إجابة فهد
                </div>
                <p className="text-sm leading-relaxed">{activePrompt.answers.F}</p>
              </div>
              <div className="glass-card p-6 border-purple-500/30 bg-purple-500/5">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-purple-500 uppercase">
                  <MessageCircleHeart size={14} /> إجابة بشرى
                </div>
                <p className="text-sm leading-relaxed">{activePrompt.answers.B}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6 text-center space-y-2">
          <div className="text-2xl font-black text-rose-500">١٢</div>
          <div className="text-[10px] font-bold opacity-50 uppercase">لحظة مشتركة</div>
        </div>
        <div className="glass-card p-6 text-center space-y-2">
          <div className="text-2xl font-black text-purple-500">٨٥٪</div>
          <div className="text-[10px] font-bold opacity-50 uppercase">مؤشر التناغم</div>
        </div>
      </div>
    </motion.div>
  );
};
