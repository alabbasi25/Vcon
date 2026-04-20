import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Trophy, Timer, Play, CheckCircle2, XCircle, Plus, Zap, Flame, Activity, Heart, ArrowRight } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';

export const Arena: React.FC = () => {
  const { challenges, proposeChallenge, acceptChallenge, rejectChallenge, completeChallenge, currentUser, streaks, fitnessBattle, updateFitnessBattle } = usePlanet();
  const [showAdd, setShowAdd] = useState(false);
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', points: 10, duration: 30 });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    proposeChallenge({
      title: newChallenge.title,
      description: newChallenge.description,
      points: newChallenge.points,
      durationMinutes: newChallenge.duration
    });
    setShowAdd(false);
  };

  const getTimeRemaining = (startTime: number, durationMinutes: number) => {
    const end = startTime + durationMinutes * 60 * 1000;
    const remaining = end - now;
    if (remaining <= 0) return 'انتهى الوقت';
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const streak = streaks[currentUser];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Fitness Battle Mode (Progressive Reveal) */}
      <section className="glass-card-dark p-6 border-emerald-500/20 bg-emerald-500/5 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black">معركة اللياقة (Fitness Battle)</h3>
              <p className="text-[10px] opacity-60">تحدي الخطوات والسعرات الحي</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest">
            <Flame size={10} className="animate-pulse" /> معركة نشطة
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 relative">
          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-black z-10">VS</div>
          
          <div className="space-y-3 text-center">
            <div className="text-[10px] font-bold opacity-50">فهد</div>
            <div className="text-2xl font-black text-emerald-500">{fitnessBattle.F.steps.toLocaleString()}</div>
            <div className="text-[8px] opacity-40 uppercase">خطوة</div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(fitnessBattle.F.steps / 10000) * 100}%` }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>
          <div className="space-y-3 text-center">
            <div className="text-[10px] font-bold opacity-50">بشرى</div>
            <div className="text-2xl font-black text-blue-500">{fitnessBattle.B.steps.toLocaleString()}</div>
            <div className="text-[8px] opacity-40 uppercase">خطوة</div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(fitnessBattle.B.steps / 10000) * 100}%` }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => updateFitnessBattle(currentUser, fitnessBattle[currentUser].steps + 500)}
          className="w-full py-3 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Zap size={16} /> إضافة ٥٠٠ خطوة للمنافسة
        </button>
      </section>

      {/* Streak Section */}
      <div className="glass-card-dark p-6 flex items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Flame size={120} className="absolute -bottom-10 -left-10 text-orange-500 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">سلسلة الإنجاز المتواصلة</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">{streak.count}</span>
            <span className="text-sm font-bold opacity-70">أيام من التحدي</span>
          </div>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 shadow-xl shadow-orange-500/20">
          <Flame size={32} className="animate-bounce" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black">ساحة التحديات</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">اكسر الروتين، ابنِ العادات، واكسب النقاط</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {challenges.length === 0 && (
          <div className="p-12 text-center glass-card opacity-50">
            <Swords size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">لا توجد تحديات نشطة حالياً. ابدأ أول تحدٍ الآن!</p>
          </div>
        )}
        
        {challenges.map(c => (
          <div key={c.id} className={`${c.status === 'active' ? 'glass-card-dark' : 'glass-card'} p-6 space-y-4 relative overflow-hidden transition-all duration-500`}>
            {c.status === 'active' && (
              <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500 animate-pulse" />
            )}
            
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  c.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 
                  c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg">{c.title}</h3>
                  <p className="text-xs opacity-60">{c.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-[var(--color-primary)]">+{c.points}</div>
                <div className="text-[10px] font-bold opacity-50 uppercase">نقطة كوكبية</div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold opacity-70">
                <Timer size={14} /> {c.durationMinutes} دقيقة
              </div>
              <div className="flex items-center gap-2 text-xs font-bold opacity-70">
                <Trophy size={14} /> {c.status === 'pending' ? 'بانتظار القبول' : c.status === 'active' ? 'جاري التحدي' : 'مكتمل'}
              </div>
            </div>

            {c.status === 'pending' && c.proposer !== currentUser && (
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => acceptChallenge(c.id)}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Play size={16} /> قبول التحدي
                </button>
                <button 
                  onClick={() => rejectChallenge(c.id)}
                  className="px-4 py-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}

            {c.status === 'active' && (
              <div className="pt-2 space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest">الوقت المتبقي</div>
                    <div className="text-2xl font-mono font-black text-emerald-400">
                      {getTimeRemaining(c.startTime || 0, c.durationMinutes)}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest">جاري كسب النقاط...</div>
                </div>
                
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ 
                      width: `${Math.max(0, (1 - (now - (c.startTime || 0)) / (c.durationMinutes * 60000)) * 100)}%` 
                    }}
                    transition={{ ease: "linear" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => completeChallenge(c.id, currentUser)}
                    className="flex-1 py-3 rounded-xl bg-white text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 size={18} /> فزت أنا
                  </button>
                  <button 
                    onClick={() => completeChallenge(c.id, currentUser === 'F' ? 'B' : 'F')}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                  >
                    <Trophy size={18} /> فاز {currentUser === 'F' ? 'بشرى' : 'فهد'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
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
              <h3 className="text-xl font-black">طرح تحدٍ جديد</h3>
              <form onSubmit={handlePropose} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">عنوان التحدي</label>
                  <input 
                    type="text" required placeholder="مثلاً: قراءة 30 دقيقة"
                    value={newChallenge.title}
                    onChange={e => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">الوصف</label>
                  <textarea 
                    placeholder="ماذا سنفعل بالضبط؟"
                    value={newChallenge.description}
                    onChange={e => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field min-h-[80px] py-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold opacity-50 uppercase">النقاط</label>
                    <input 
                      type="number"
                      value={newChallenge.points}
                      onChange={e => setNewChallenge(prev => ({ ...prev, points: Number(e.target.value) }))}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold opacity-50 uppercase">المدة (دقيقة)</label>
                    <input 
                      type="number"
                      value={newChallenge.duration}
                      onChange={e => setNewChallenge(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      className="input-field"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-4">إرسال التحدي</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
