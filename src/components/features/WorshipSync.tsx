import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Zap, 
  Fingerprint, 
  Wifi, 
  WifiOff,
  Trophy,
  Sparkles,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Heart,
  Moon,
  Sun,
  Plus,
  X,
  Clock,
  Check,
  Lock
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';

const AZKAR_DATA = [
  { id: 'sabah', title: 'أذكار الصباح', icon: <Sun size={20} />, color: 'bg-amber-500', target: 50 },
  { id: 'masaa', title: 'أذكار المساء', icon: <Moon size={20} />, color: 'bg-indigo-500', target: 50 },
];

export const WorshipSync: React.FC = () => {
  const { 
    worship, 
    syncTasbeeh, 
    currentUser, 
    partnerStatus, 
    populateTestData, 
    quranTracker, 
    logQuranVerses,
    athkar,
    incrementAthkarCount,
    addAthkar
  } = usePlanet();
  
  const [activeView, setActiveView] = useState<'quran' | 'azkar'>('azkar');
  const [selectedCategory, setSelectedCategory] = useState<'morning' | 'evening' | 'custom'>('morning');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAthkar, setNewAthkar] = useState({ 
    text: '', 
    target: 33, 
    category: 'custom' as any,
    isDaily: true,
    reminderTime: '',
    startTime: '',
    endTime: ''
  });

  const isAthkarAvailable = (item: any) => {
    if (!item.startTime || !item.endTime) return { available: true };
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startH, startM] = item.startTime.split(':').map(Number);
    const [endH, endM] = item.endTime.split(':').map(Number);
    
    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;
    
    const available = currentTime >= startTime && currentTime <= endTime;
    return { available, reason: `متاح فقط بين ${item.startTime} و ${item.endTime}` };
  };
  
  const activeSession = worship[0];
  const isPartnerOnline = partnerStatus?.status === 'online';

  const partnerId = currentUser === 'F' ? 'B' : 'F';
  const myCount = activeSession?.syncCounter?.[currentUser] || 0;
  const partnerCount = activeSession?.syncCounter?.[partnerId] || 0;

  // Quranic Sync Logic
  const today = new Date().toISOString().split('T')[0];
  const myTodayLog = quranTracker.logs[currentUser].find(l => l.date === today)?.verses || 0;
  const partnerTodayLog = quranTracker.logs[partnerId].find(l => l.date === today)?.verses || 0;
  
  const totalVerses = 6236; 

  const filteredAthkar = athkar.filter(a => {
    const isCompletedByMe = (a.count[currentUser] || 0) >= a.target;
    return a.category === selectedCategory && !isCompletedByMe;
  });

  const handleInteraction = (id?: string) => {
    if (typeof id === 'string') {
      incrementAthkarCount(id);
    } else if (activeSession) {
      syncTasbeeh(activeSession.id, (activeSession.syncCounter?.[currentUser] || 0) + 1);
    }

    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    let startTime = newAthkar.startTime;
    let endTime = newAthkar.endTime;

    if (newAthkar.category === 'morning' && !startTime) {
      startTime = '05:00';
      endTime = '10:00';
    } else if (newAthkar.category === 'evening' && !startTime) {
      startTime = '17:00';
      endTime = '22:00';
    }

    addAthkar({
      ...newAthkar,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      notificationTime: newAthkar.reminderTime || undefined
    });
    setShowAddModal(false);
    setNewAthkar({ text: '', target: 33, category: 'custom', isDaily: true, reminderTime: '', startTime: '', endTime: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 md:space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black">المحراب الروحاني</h2>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">مساحة للصفاء والمزامنة الإيمانية</p>
        </div>
        
        {/* View Switcher Tabs */}
        <div className="flex p-1 bg-white/5 rounded-2xl md:w-64">
          <button
            onClick={() => setActiveView('azkar')}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeView === 'azkar' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40 hover:opacity-100'
            }`}
          >
            الأذكار
          </button>
          <button
            onClick={() => setActiveView('quran')}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeView === 'quran' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40 hover:opacity-100'
            }`}
          >
            الورد القرآني
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'azkar' ? (
          <motion.div
            key="azkar-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Azkar Category Tabs */}
            <section className="flex gap-2 p-1 bg-white/5 rounded-2xl overflow-x-auto no-scrollbar">
              {(['morning', 'evening', 'custom'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 min-w-[80px] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedCategory === cat ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'opacity-40'
                  }`}
                >
                  {cat === 'morning' ? 'أذكار الصباح' : cat === 'evening' ? 'أذكار المساء' : 'ذكر مخصص'}
                </button>
              ))}
            </section>

            {/* Athkar List */}
            <section className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black uppercase tracking-widest opacity-60">الأوراد المتاحة</h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center gap-1.5 hover:bg-[var(--color-primary)] hover:text-white transition-all transform active:scale-95"
                >
                  <Plus size={14} />
                  <span className="text-[10px] font-bold">إضافة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredAthkar.map(item => {
                    const { available, reason } = isAthkarAvailable(item);
                    const progress = (item.count[currentUser] || 0) / item.target;
                    
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`glass-card p-5 space-y-4 border-white/5 group transition-all duration-300 ${!available ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-[var(--color-primary)]/30 shadow-xl'}`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-sm font-bold leading-relaxed">{item.text}</p>
                          <div className="text-right flex-shrink-0">
                            {item.startTime && (
                              <div className="flex items-center gap-1 text-[8px] font-black py-1 px-2 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/10">
                                <Clock size={10} /> {item.startTime}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-black">
                            <span className="opacity-40">المستهدف: {item.target}</span>
                            <span className="text-[var(--color-primary)]">{item.count[currentUser]}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress * 100}%` }}
                              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                            />
                          </div>
                        </div>

                        {!available ? (
                          <div className="pt-2 text-[8px] text-rose-500 font-bold bg-rose-500/5 p-2 rounded-lg text-center border border-rose-500/10 uppercase tracking-wider">
                            {reason}
                          </div>
                        ) : (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleInteraction(item.id)}
                              className="flex-1 py-3 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white text-[10px] font-black flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95 shadow-[var(--color-primary)]/20"
                            >
                              <Plus size={14} /> +1
                            </button>
                            <button
                              onClick={() => {
                                for (let i = item.count[currentUser]; i < item.target; i++) {
                                  incrementAthkarCount(item.id);
                                }
                                if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
                              }}
                              className="px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-bold border border-emerald-500/10"
                            >
                              تم
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {filteredAthkar.length === 0 && (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[32px]">
                    <div className="w-16 h-16 rounded-3xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-sm font-black opacity-40">هنيئاً لك! لقد أتممت أورادك لهذه الفئة</p>
                  </div>
                )}
              </div>
            </section>

            {/* Live Sync Feature (Moved to bottom of Azkar or separate section) */}
            <section className="glass-card p-6 md:p-10 flex flex-col items-center gap-8 relative overflow-hidden bg-purple-500/5 border-purple-500/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                  className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  animate={{ width: `${(activeSession.progress / activeSession.target) * 100}%` }}
                />
              </div>
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-[8px] font-black text-purple-500 uppercase tracking-widest border border-purple-500/20">
                  <Wifi size={10} className={isPartnerOnline ? 'animate-pulse' : ''} />
                  {isPartnerOnline ? 'مزامنة حية نشطة' : 'وضع فردي'}
                </div>
                <h3 className="text-xl font-black">جلسة تسبيح مشتركة</h3>
                
                <div className="flex items-center gap-12 pt-4">
                  <div className="text-center space-y-1">
                    <div className="text-[10px] opacity-40 font-bold">أنت</div>
                    <div className="text-5xl font-black tabular-nums">{myCount}</div>
                  </div>
                  <div className="w-px h-16 bg-white/10" />
                  <div className="text-center space-y-1">
                    <div className="text-[10px] opacity-40 font-bold">الشريك</div>
                    <div className="text-5xl font-black tabular-nums text-purple-500">{partnerCount}</div>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleInteraction()}
                className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-500 shadow-2xl relative group ${
                  isPartnerOnline 
                    ? 'bg-purple-600 text-white shadow-purple-600/40' 
                    : 'bg-white/5 text-white/20 border-2 border-white/5'
                }`}
              >
                {!isPartnerOnline && <Lock size={20} className="absolute top-8 opacity-40" />}
                <Fingerprint size={48} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest font-sans">تفاعل</span>
                {isPartnerOnline && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-purple-400"
                  />
                )}
              </motion.button>

              <p className="text-[10px] font-medium opacity-30 text-center max-w-[200px] leading-relaxed italic">
                 "لا يزال لسانك رطباً من ذكر الله"
              </p>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="quran-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="glass-card p-6 md:p-8 space-y-8 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
               {/* Decorative Background Element */}
               <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
               
               <div className="flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                     <BookOpen size={28} />
                   </div>
                   <div>
                     <h3 className="text-lg font-black italic">نور الهدى</h3>
                     <p className="text-[10px] opacity-60 font-medium">سجل ختمتكم المشتركة لعام 2024</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-2xl font-black text-emerald-500 tabular-nums">
                     {Math.round(((myTodayLog + partnerTodayLog) / totalVerses) * 100 * 10 || 0) / 10}%
                   </div>
                   <div className="text-[8px] font-black opacity-30 uppercase tracking-widest">إنجاز الختمة</div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 <div className="space-y-4 p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                   <div className="flex justify-between items-end">
                     <div>
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-wider block mb-1">وردك اليوم</span>
                        <span className="text-2xl font-black text-emerald-400 tabular-nums">{myTodayLog}</span>
                        <span className="text-[10px] opacity-40 mr-1 italic">آية</span>
                     </div>
                     <span className="text-[8px] font-black opacity-20 uppercase">أنت</span>
                   </div>
                   <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${Math.min(100, (myTodayLog / 50) * 100)}%` }}
                       className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                     />
                   </div>
                 </div>

                 <div className="space-y-4 p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                   <div className="flex justify-between items-end">
                     <div>
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-wider block mb-1">ورد الشريك</span>
                        <span className="text-2xl font-black text-blue-400 tabular-nums">{partnerTodayLog}</span>
                        <span className="text-[10px] opacity-40 mr-1 italic">آية</span>
                     </div>
                     <span className="text-[8px] font-black opacity-20 uppercase">الشريك</span>
                   </div>
                   <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${Math.min(100, (partnerTodayLog / 50) * 100)}%` }}
                       className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                     />
                   </div>
                 </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-3 pt-4 relative z-10">
                 <div className="relative flex-1">
                   <input 
                     type="number"
                     min="1"
                     placeholder="كم آية قرأت اليوم؟"
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-center"
                     id="quranVersesInput"
                   />
                 </div>
                 <button 
                   onClick={() => {
                     const input = document.getElementById('quranVersesInput') as HTMLInputElement;
                     const val = parseInt(input.value);
                     if (val > 0) {
                       logQuranVerses(val);
                       input.value = '';
                     }
                   }}
                   className="px-8 py-4 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-600/20 text-white text-xs font-black flex items-center justify-center gap-3 transition-transform active:scale-95 group"
                 >
                   <CheckCircle2 size={18} className="group-hover:rotate-12 transition-transform" /> 
                   تسجيل القراءة
                 </button>
               </div>

               <p className="text-[9px] opacity-30 text-center italic mt-4">
                 يتم مزامنة التقدم فورياً مع الشريك لبث روح التنافس في الخير
               </p>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Info Card */}
      <div className="p-5 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-center mb-8">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center flex-shrink-0">
          <Zap size={18} />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">تلميحة الكوكب</h4>
          <p className="text-[10px] leading-relaxed text-blue-600/60 font-medium">
            يتم تحديث العدادات الروحية بشكل دوري. جرب التسبيح المشترك لتعيشا معاً نبض الاهتزاز في هواتفكما في ذات اللحظة.
          </p>
        </div>
      </div>

      {/* Modals & Popups */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0" />
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-bg-card)] w-full max-w-sm rounded-[40px] p-8 border border-white/10 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black italic tracking-tight">ذكر جديد</h3>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full glass flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <ModernInput 
                  label="النص المبارك" required
                  value={newAthkar.text}
                  onChange={e => setNewAthkar(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="مثال: سبحان الله وبحمده"
                />
                <div className="grid grid-cols-2 gap-4">
                  <ModernInput 
                    label="الهدف" type="number" required
                    value={newAthkar.target}
                    onChange={e => setNewAthkar(prev => ({ ...prev, target: Number(e.target.value) }))}
                  />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase opacity-40 px-2">الفئة</label>
                    <select 
                      value={newAthkar.category}
                      onChange={e => setNewAthkar(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-xs font-bold font-sans outline-none appearance-none"
                    >
                      <option value="morning">صباح</option>
                      <option value="evening">مساء</option>
                      <option value="custom">خاص</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-[9px] font-black uppercase opacity-30 tracking-widest mb-4 px-2">ضبط الوقت (اختياري)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase opacity-40 px-1">يفتح من</label>
                      <input 
                        type="time" 
                        value={newAthkar.startTime}
                        onChange={e => setNewAthkar(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-[10px] font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase opacity-40 px-1">حتى الساعة</label>
                      <input 
                        type="time" 
                        value={newAthkar.endTime}
                        onChange={e => setNewAthkar(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-[10px] font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-5 rounded-[24px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-black text-sm shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  حفظ الذكر في القائمة
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

