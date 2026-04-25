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
  Lock,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';
import { getAINoorDailyContent, getAINoorQuiz } from '../../services/aiService';

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
    addQuranTarget,
    updateQuranTargetProgress,
    athkar,
    incrementAthkarCount,
    addAthkar,
    addNotification,
    sendMessage
  } = usePlanet();
  
  const [activeView, setActiveView] = useState<'quran' | 'azkar' | 'minhaaj' | 'noor'>('azkar');
  
  // Azkar State
  const [selectedCategory, setSelectedCategory] = useState<'morning' | 'evening' | 'custom'>('morning');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAthkar, setNewAthkar] = useState({ 
    text: '', target: 33, category: 'custom' as any, isDaily: true, reminderTime: '', startTime: '', endTime: '' 
  });

  // Quran Goal State
  const [quranGoalType, setQuranGoalType] = useState<'read' | 'memorize'>('read');
  const [quranRange, setQuranRange] = useState('');
  const [quranTargetVerses, setQuranTargetVerses] = useState(10);
  const [quranRecurrence, setQuranRecurrence] = useState<'daily'|'weekly'|'monthly'>('daily');

  // Minhaaj State
  const [sharedGoals, setSharedGoals] = useState({ fasting: false, nightPrayer: false, charity: false });

  // Noor State
  const [noorDaily, setNoorDaily] = useState<string | null>(null);
  const [noorQuiz, setNoorQuiz] = useState<any>(null);
  const [noorLoading, setNoorLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [myQuizAnswer, setMyQuizAnswer] = useState('');

  const loadNoorContent = async () => {
    if (!noorDaily) {
      setNoorLoading(true);
      const content = await getAINoorDailyContent();
      setNoorDaily(content);
      setNoorLoading(false);
    }
  };

  const loadNoorQuiz = async () => {
    setQuizLoading(true);
    setQuizAnswered(false);
    setMyQuizAnswer('');
    const quiz = await getAINoorQuiz();
    setNoorQuiz(quiz);
    setQuizLoading(false);
  };

  useEffect(() => {
    if (activeView === 'noor' && !noorDaily) {
      loadNoorContent();
    }
  }, [activeView]);

  const handlePrayForPartner = () => {
    sendMessage({
      id: Math.random().toString(),
      senderId: currentUser,
      text: `لقد قام (${currentUser === 'F' ? 'فهد' : 'بشرى'}) بالدعاء لك بظهر الغيب اليوم 🤍`,
      timestamp: Date.now(),
      type: 'text',
      status: 'sent',
      reactions: {}
    });
    addNotification({
      title: 'دعاء الشريك المحب',
      content: 'تم إرسال إشعار الدُّعاء لـ شريكك بنجاح.',
      type: 'spiritual'
    });
  };

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
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    let startTime = newAthkar.startTime;
    let endTime = newAthkar.endTime;
    if (newAthkar.category === 'morning' && !startTime) { startTime = '05:00'; endTime = '10:00'; }
    else if (newAthkar.category === 'evening' && !startTime) { startTime = '17:00'; endTime = '22:00'; }
    addAthkar({ ...newAthkar, startTime: startTime || undefined, endTime: endTime || undefined, notificationTime: newAthkar.reminderTime || undefined });
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
        <div className="flex p-1 bg-white/5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveView('azkar')}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeView === 'azkar' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40 hover:opacity-100'
            }`}
          >
            الأذكار
          </button>
          <button
            onClick={() => setActiveView('quran')}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeView === 'quran' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40 hover:opacity-100'
            }`}
          >
            الورد القرآني
          </button>
          <button
            onClick={() => setActiveView('minhaaj')}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeView === 'minhaaj' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40 hover:opacity-100'
            }`}
          >
            المنهاج
          </button>
          <button
            onClick={() => setActiveView('noor')}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeView === 'noor' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40 hover:opacity-100'
            }`}
          >
            AI نور
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'azkar' && (
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
                  animate={{ width: `${((activeSession?.progress || 0) / (activeSession?.target || 1)) * 100}%` }}
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
        )}

        {activeView === 'quran' && (
          <motion.div
            key="quran-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="glass-card p-6 md:p-8 space-y-8 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
               <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
               
               <div className="flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                     <BookOpen size={28} />
                   </div>
                   <div>
                     <h3 className="text-lg font-black italic">نور الهدى</h3>
                     <p className="text-[10px] opacity-60 font-medium">سجل ختمتكم واستمرارية الحفظ/القراءة</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-2xl font-black text-emerald-500 tabular-nums">
                     {Math.round(((myTodayLog + partnerTodayLog) / totalVerses) * 100 * 10 || 0) / 10}%
                   </div>
                   <div className="text-[8px] font-black opacity-30 uppercase tracking-widest">إنجاز الختمة الكلية</div>
                 </div>
               </div>

               {/* Configurations for Quran tracking */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 border-t border-white/5 pt-6 mt-6">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase opacity-40 px-2">نوع الهدف</label>
                   <div className="flex bg-white/5 rounded-xl p-1">
                     <button onClick={() => setQuranGoalType('read')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${quranGoalType === 'read' ? 'bg-emerald-500 text-white' : 'opacity-50'}`}>قراءة</button>
                     <button onClick={() => setQuranGoalType('memorize')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${quranGoalType === 'memorize' ? 'bg-emerald-500 text-white' : 'opacity-50'}`}>حفظ</button>
                   </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase opacity-40 px-2">النطاق</label>
                   <input 
                     type="text" 
                     placeholder="مثال: سورة الكهف، الجزء 30..." 
                     value={quranRange}
                     onChange={(e) => setQuranRange(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase opacity-40 px-2">التكرار والجدولة</label>
                   <div className="flex gap-2">
                     <select 
                       value={quranRecurrence}
                       onChange={(e) => setQuranRecurrence(e.target.value as any)}
                       className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none appearance-none"
                     >
                       <option value="daily" className="text-black">يومي</option>
                       <option value="weekly" className="text-black">أسبوعي</option>
                       <option value="monthly" className="text-black">شهري</option>
                     </select>
                     <input 
                       type="time" 
                       className="w-24 bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs font-bold outline-none text-center"
                     />
                   </div>
                 </div>
                 <div className="space-y-1.5 flex-[0.5]">
                   <label className="text-[10px] font-black uppercase opacity-40 px-2">الآيات</label>
                   <input 
                     type="number"
                     min="1"
                     value={quranTargetVerses}
                     onChange={(e) => setQuranTargetVerses(Number(e.target.value))}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none text-center"
                   />
                 </div>
               </div>

               <div className="flex justify-end mt-2 relative z-10 border-b border-white/5 pb-4 mb-4">
                 <button 
                   onClick={() => {
                     if (quranRange) {
                       addQuranTarget({ type: quranGoalType, rangeName: quranRange, targetVerses: quranTargetVerses });
                       setQuranRange('');
                     }
                   }}
                   className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black hover:bg-emerald-600 transition-colors"
                 >
                   إضافة الهدف
                 </button>
               </div>

               {/* Target List */}
               {quranTracker.targets && quranTracker.targets.length > 0 && (
                 <div className="space-y-4 relative z-10 border-b border-white/5 pb-6 mb-6">
                   <h4 className="text-xs font-black uppercase tracking-widest opacity-60">أهداف النطاقات</h4>
                   <div className="grid grid-cols-1 gap-4">
                     {quranTracker.targets.map(target => (
                       <div key={target.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                             {target.type === 'read' ? <BookOpen size={20} /> : <Zap size={20} />}
                           </div>
                           <div>
                             <h5 className="font-bold text-sm text-emerald-400">{target.rangeName}</h5>
                             <p className="text-[10px] opacity-60">الهدف: {target.targetVerses} آيات | {target.type === 'read' ? 'قراءة' : 'حفظ'}</p>
                           </div>
                         </div>
                         <div className="flex items-center justify-end gap-3 w-full md:w-auto">
                           <div className="w-full md:w-32">
                             <div className="flex justify-between text-[10px] font-bold mb-1 opacity-60">
                               <span>{target.completedVerses[currentUser] || 0}</span>
                               <span>{Math.round(((target.completedVerses[currentUser] || 0) / Math.max(1, target.targetVerses)) * 100)}%</span>
                             </div>
                             <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min(100, ((target.completedVerses[currentUser] || 0) / Math.max(1, target.targetVerses)) * 100)}%` }}
                                 className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                               />
                             </div>
                           </div>
                           <div className="flex border border-white/10 rounded-lg overflow-hidden shrink-0 h-8">
                             <input 
                               type="number"
                               min="1"
                               placeholder="+1"
                               className="w-12 bg-white/5 text-xs text-center outline-none px-1"
                               id={`inc-${target.id}`}
                             />
                             <button 
                               onClick={() => {
                                 const input = document.getElementById(`inc-${target.id}`) as HTMLInputElement;
                                 const val = parseInt(input.value) || 1;
                                 if (val > 0) {
                                   updateQuranTargetProgress(target.id, val);
                                   input.value = '';
                                 }
                               }}
                               className="px-2 bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors text-[10px]"
                             >
                               أتممت
                             </button>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 <div className="space-y-4 p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                   <div className="flex justify-between items-end">
                     <div>
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-wider block mb-1">محصلتك اليوم</span>
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
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-wider block mb-1">الشريك</span>
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

               <div className="flex flex-col sm:flex-row gap-3 pt-4 relative z-10 border-t border-white/5 mt-4">
                 <div className="relative flex-1">
                   <input 
                     type="number"
                     min="1"
                     placeholder="كم آية أتممت اليوم؟"
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
                   تسجيل الإنجاز
                 </button>
               </div>
            </section>
          </motion.div>
        )}

        {activeView === 'minhaaj' && (
          <motion.div
            key="minhaaj-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <section className="glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                  <Heart size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black">المنهاج (أهداف مشتركة)</h3>
                  <p className="text-xs opacity-60">"تَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى"</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-colors" onClick={() => setSharedGoals(prev => ({ ...prev, fasting: !prev.fasting }))}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${sharedGoals.fasting ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/20 text-transparent'}`}>
                      <Check size={14} />
                    </div>
                    <span className="font-bold text-sm">صيام نافلة (مثال: الإثنين والخميس)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 glass rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-colors" onClick={() => setSharedGoals(prev => ({ ...prev, nightPrayer: !prev.nightPrayer }))}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${sharedGoals.nightPrayer ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/20 text-transparent'}`}>
                      <Check size={14} />
                    </div>
                    <span className="font-bold text-sm">قيام الليل</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 glass rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-colors" onClick={() => setSharedGoals(prev => ({ ...prev, charity: !prev.charity }))}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${sharedGoals.charity ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/20 text-transparent'}`}>
                      <Check size={14} />
                    </div>
                    <span className="font-bold text-sm">صدقة السر مشتركة</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-center">
                <Heart size={32} className="mx-auto text-rose-500 opacity-50" />
                <div className="space-y-1 mb-4">
                  <h4 className="font-black text-sm">دعاء بظهر الغيب</h4>
                  <p className="text-xs opacity-50 max-w-sm mx-auto">لَا يَرُدُّ القَضَاءَ إِلَّا الدُّعَاءُ.. اكتب دعائك سراً وسيرسل له إشعاراً بأنك دعوت له</p>
                </div>
                <div className="flex bg-white/5 max-w-sm mx-auto rounded-full p-1 border border-rose-500/10 focus-within:border-rose-500/50 transition-colors">
                  <input 
                    type="text" 
                    placeholder="اللهم احفظ شريكي..." 
                    className="flex-1 bg-transparent px-4 text-xs outline-none"
                    id="prayInput"
                  />
                  <button onClick={() => {
                    handlePrayForPartner();
                    (document.getElementById('prayInput') as HTMLInputElement).value = '';
                  }} className="px-6 py-2 rounded-full bg-rose-500/20 text-rose-500 font-bold hover:bg-rose-500 hover:text-white transition-colors text-xs">
                    إرسال
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeView === 'noor' && (
          <motion.div
            key="noor-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Daily Wisdom */}
              <section className="glass-card p-6 border-amber-500/20 col-span-full md:col-span-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-black text-lg text-amber-500">إشراقة نور</h3>
                </div>
                <div className="flex-1 bg-white/5 p-6 rounded-3xl relative border border-white/5">
                   {noorLoading ? (
                     <div className="h-full min-h-[150px] flex items-center justify-center space-x-2 space-x-reverse opacity-50">
                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></span>
                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{animationDelay: '0.4s'}}></span>
                     </div>
                   ) : (
                     <p className="text-sm font-medium leading-loose text-justify opacity-90">{noorDaily}</p>
                   )}
                </div>
                <button onClick={loadNoorContent} className="mt-4 w-full py-3 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold hover:bg-amber-500/20 transition-colors">
                  تحديث الإشراقة
                </button>
              </section>

              {/* Quiz System */}
              <section className="glass-card p-6 border-purple-500/20 col-span-full md:col-span-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-purple-500">مسابقة نور الثنائية</h3>
                    <p className="text-[10px] opacity-50">اختبر معلوماتك الدينية مع شريكك</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {!noorQuiz ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
                      <Trophy size={48} className="text-purple-500/30 mb-2" />
                      <p className="text-xs opacity-60 max-w-[200px]">قم بتوليد سؤال لتبدأ التحدي المعرفي مع شريكك.</p>
                      <button onClick={loadNoorQuiz} disabled={quizLoading} className="px-6 py-3 rounded-2xl bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                        {quizLoading ? 'جاري التوليد...' : 'ابدأ التحدي'}
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {!quizAnswered ? (
                        <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                          <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl font-bold text-sm leading-relaxed">
                            {noorQuiz.question}
                          </div>
                          <input 
                            type="text" 
                            placeholder="اكتب إجابتك هنا..." 
                            value={myQuizAnswer}
                            onChange={e => setMyQuizAnswer(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-purple-500"
                          />
                          <button onClick={() => setQuizAnswered(true)} disabled={!myQuizAnswer.trim()} className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold disabled:opacity-50">
                            اعتماد الإجابة وكشف النتيجة
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div key="answer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                           <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl space-y-2">
                             <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">الإجابة الصحيحة</div>
                             <div className="font-bold text-sm">{noorQuiz.answer}</div>
                           </div>
                           
                           <div className="glass p-5 rounded-2xl space-y-2">
                             <div className="text-[10px] font-black uppercase tracking-widest opacity-50">السياق / الشرح</div>
                             <div className="text-xs leading-relaxed opacity-80">{noorQuiz.explanation}</div>
                           </div>
                           
                           <button onClick={loadNoorQuiz} disabled={quizLoading} className="w-full py-3 rounded-xl border border-purple-500 text-purple-500 font-bold hover:bg-purple-500/10 transition-colors disabled:opacity-50">
                             {quizLoading ? 'جاري التوليد...' : 'سؤال جديد'}
                           </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </section>
            </div>
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
                  <h4 className="text-[9px] font-black uppercase opacity-30 tracking-widest mb-4 px-2">إعدادات إضافية</h4>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-[10px] font-black uppercase">تتبع يومي مستمر</span>
                    <button 
                      type="button"
                      onClick={() => setNewAthkar(prev => ({ ...prev, isDaily: !prev.isDaily }))}
                      className={`w-10 h-6 rounded-full transition-colors relative ${newAthkar.isDaily ? 'bg-amber-500' : 'bg-white/10'}`}
                    >
                      <motion.div 
                        layout
                        className="w-4 h-4 bg-white rounded-full mx-1 shadow-sm"
                        animate={{ x: newAthkar.isDaily ? 16 : 0 }}
                      />
                    </button>
                  </div>
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

