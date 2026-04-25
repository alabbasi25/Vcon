import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, CheckCircle, Target, Flame, Plus, X, Trophy, Activity, Moon, Droplets, Scale, BrainCircuit, HeartHandshake, BookOpen, MessageCircle } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getAITherapistAdvice } from '../../services/aiService';

const weightData = [
  { day: 'السبت', weight: 75.2 },
  { day: 'الأحد', weight: 75.0 },
  { day: 'الإثنين', weight: 74.8 },
  { day: 'الثلاثاء', weight: 75.1 },
  { day: 'الأربعاء', weight: 74.5 },
  { day: 'الخميس', weight: 74.3 },
  { day: 'الجمعة', weight: 74.0 },
];

export const PersonalGrowth: React.FC = () => {
  const { currentUser, partnerStatus, addNotification, sendMessage, habits, updateHabitProgress, addHabit } = usePlanet();
  const [activeTab, setActiveTab] = useState<'physical' | 'mental' | 'growth' | 'ai'>('physical');

  // Growth tab state
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', target: 10, unit: '', color: 'blue' as const, isShared: false });
  const myHabits = habits[currentUser] || [];
  const partner = currentUser === 'F' ? 'B' : 'F';
  const partnerHabits = habits[partner] || [];
  const completedToday = myHabits.filter(h => h.progress >= h.target).length;
  const totalDailyProgress = myHabits.reduce((acc, h) => acc + Math.min(100, (h.progress / h.target) * 100), 0) / (myHabits.length || 1);

  // Mental Health tab state
  const [stressLevel, setStressLevel] = useState(5);
  const [mentalLoad, setMentalLoad] = useState('');

  // AI Therapist state
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSupportRequest = () => {
    sendMessage({
      id: Math.random().toString(),
      senderId: currentUser,
      text: `أشعر بضغوطات حالياً، أحتاج إلى دعم/حب إضافي 🤍`,
      timestamp: Date.now(),
      type: 'text',
      status: 'sent',
      reactions: {}
    });
    addNotification({
      title: 'طلب دعم عاطفي',
      content: 'تم إرسال إشعار طلب الدعم لشريكك بنجاح.',
      type: 'love'
    });
  };

  const handleAskTherapist = async () => {
    if (!mentalLoad.trim()) return;
    setIsAiLoading(true);
    const response = await getAITherapistAdvice(mentalLoad, stressLevel);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const handleAddHabit = (e: React.FormEvent) => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-black">واجهة النمو</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">تطوير مستمر، جسدياً ونفسياً وروحياً</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/5 rounded-2xl w-full overflow-x-auto no-scrollbar border border-white/5">
        <button onClick={() => setActiveTab('physical')} className={`flex-shrink-0 px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'physical' ? 'bg-blue-500 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}>
          اللياقة البدنية
        </button>
        <button onClick={() => setActiveTab('mental')} className={`flex-shrink-0 px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'mental' ? 'bg-purple-500 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}>
          الصحة النفسية
        </button>
        <button onClick={() => setActiveTab('growth')} className={`flex-shrink-0 px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'growth' ? 'bg-emerald-500 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}>
          التطوير
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex-shrink-0 px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'ai' ? 'bg-rose-500 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}>
          AI النفسي
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'physical' && (
          <motion.div key="physical" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 space-y-4 text-center border-blue-500/20">
                <Activity className="mx-auto text-blue-500 opacity-80" size={24} />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider opacity-60">التمرين اليومي</h4>
                  <p className="text-xl font-black text-blue-400">مقاومة (45د)</p>
                </div>
              </div>
              <div className="glass-card p-4 space-y-4 text-center border-indigo-500/20">
                <Moon className="mx-auto text-indigo-500 opacity-80" size={24} />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider opacity-60">مدة النوم</h4>
                  <p className="text-xl font-black text-indigo-400">7 س 20 د</p>
                </div>
              </div>
              <div className="glass-card p-4 space-y-4 text-center border-cyan-500/20 col-span-2">
                <Droplets className="mx-auto text-cyan-500 opacity-80" size={24} />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider opacity-60">عداد شرب الماء (حلقات النشاط)</h4>
                  <div className="mt-4 flex justify-center gap-4">
                     {/* Using visual rings as requested */}
                     {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                       <div key={i} className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${i <= 5 ? 'border-cyan-500 text-cyan-500' : 'border-white/10 text-transparent'}`}>
                         <CheckCircle size={12} />
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Scale className="text-emerald-500" size={20} />
                <h3 className="font-bold text-sm">تتبع الوزن</h3>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <XAxis dataKey="day" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={['dataMin - 1', 'auto']} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} width={30} />
                    <Tooltip contentStyle={{ backgroundColor: '#000000dd', border: 'none', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'mental' && (
          <motion.div key="mental" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
            <div className="glass-card p-6 space-y-6 border-purple-500/20">
              <div className="flex items-center gap-3 text-purple-400">
                <BrainCircuit size={24} />
                <h3 className="font-bold">سجل الصحة النفسية</h3>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider opacity-60">مستوى التوتر (1-10)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={stressLevel} 
                    onChange={e => setStressLevel(Number(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-2xl font-black text-purple-400 w-12 text-center">{stressLevel}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider opacity-60">تدوين "الحمل الذهني"</label>
                <textarea 
                  rows={4}
                  placeholder="ما الذي يشغل تفكيرك؟ اكتبه لتفريغ عقلك..."
                  value={mentalLoad}
                  onChange={e => setMentalLoad(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setActiveTab('ai'); }} className="px-6 py-3 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-colors border border-white/10">
                  تحليل بواسطة AI
                </button>
                <button className="px-6 py-3 rounded-xl bg-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500 hover:text-white transition-colors">
                  حفظ السجل
                </button>
              </div>
            </div>

            <div className="glass-card p-6 border-rose-500/20 text-center space-y-4">
              <HeartHandshake size={32} className="mx-auto text-rose-500 opacity-80" />
              <div>
                <h4 className="font-bold text-sm mb-1">زر طلب الدعم</h4>
                <p className="text-xs opacity-60 max-w-[250px] mx-auto">إشعار صامت لشريكك: "أشعر بضغوطات حالياً، أحتاج إلى دعم/حب إضافي"</p>
              </div>
              <button onClick={handleSupportRequest} className="w-full max-w-[200px] py-3 rounded-full bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                إرسال طلب الدعم 🤍
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'growth' && (
          <motion.div key="growth" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
            <div className="glass-card p-6 border-emerald-500/20 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="text-emerald-500" size={20} />
                  <h3 className="font-bold text-sm">تتبع العادات</h3>
                </div>
                <button onClick={() => setShowAdd(true)} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              
              {myHabits.length === 0 ? (
                <div className="text-center py-6 opacity-50">
                  <p className="text-xs">لم تتم إضافة عادات بعد.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myHabits.map(habit => {
                    const isTaskCompleted = habit.progress >= habit.target;
                    const partnerHabit = habit.isShared ? partnerHabits.find(h => h.id === habit.id) : null;
                    const isPartnerCompleted = partnerHabit && partnerHabit.progress >= partnerHabit.target;
                    
                    return (
                    <div key={habit.id} className="bg-white/5 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-sm flex items-center gap-2">
                            {habit.title}
                            {habit.isShared && <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-md">تحدي مشترك</span>}
                          </div>
                          <div className="text-[10px] opacity-60 mt-1">الهدف: {habit.target} {habit.unit}</div>
                        </div>
                        <button onClick={() => updateHabitProgress(habit.id, habit.progress + 1)} disabled={isTaskCompleted} className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center disabled:opacity-30 self-start shrink-0">
                           {isTaskCompleted ? <CheckCircle size={14} /> : <Plus size={14} />}
                        </button>
                      </div>
                      
                      <div className="space-y-2 mt-1">
                        {/* Current User Progress */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] w-6 shrink-0 font-bold opacity-60">أنت</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (habit.progress / habit.target) * 100)}%` }} className="h-full bg-emerald-500" />
                          </div>
                          <span className="text-[10px] w-8 text-right font-black text-emerald-400">{habit.progress}</span>
                        </div>
                        
                        {/* Partner Progress if shared */}
                        {habit.isShared && partnerHabit && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] w-6 shrink-0 font-bold opacity-60">{partner === 'F' ? 'فهد' : 'بشرى'}</span>
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (partnerHabit.progress / partnerHabit.target) * 100)}%` }} className={`h-full ${isPartnerCompleted ? 'bg-amber-500' : 'bg-white/30'}`} />
                            </div>
                            <span className="text-[10px] w-8 text-right font-black opacity-60">{partnerHabit.progress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>

            <div className="glass-card p-6 border-amber-500/20 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="text-amber-500" size={20} />
                <h3 className="font-bold text-sm">توصيات النمو والملاحظات</h3>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed opacity-80 list-disc list-inside px-2">
                <li>كتاب: "العادات الذرية" لجيمس كلير</li>
                <li>رواية: "يوتوبيا"</li>
                <li>تمرين تنفس: 4-7-8 للهدوء قبل النوم</li>
              </ul>
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-2">دعم الشريك (ملاحظات مشتركة)</h4>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs italic text-amber-500/80">
                  "فخور جداً بالتزامك في القراءة هذا الأسبوع يا بطل! 🤍"
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div key="ai" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
            <div className="glass-card p-6 border-rose-500/20 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <MessageCircle size={100} />
              </div>
              
              <div className="relative z-10 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-rose-400">المستشار النفسي الذكي</h3>
                  <p className="text-[10px] opacity-60 max-w-[200px]">يقرأ الحمل الذهني ويقترح حلولاً علمية (CBT/Mindfulness).</p>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                {(!mentalLoad || mentalLoad === '') && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-medium">
                    الرجاء تدوين "الحمل الذهني" في قسم (الصحة النفسية) ليتمكن الذكاء الاصطناعي من تحليل الموقف بدقة.
                  </div>
                )}
                
                <button 
                  onClick={handleAskTherapist} 
                  disabled={!mentalLoad.trim() || isAiLoading}
                  className="w-full py-3 rounded-xl bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all hover:bg-rose-600"
                >
                  {isAiLoading ? 'جاري التحليل...' : 'اطلب استشارة بناءً على حملك الذهني'}
                </button>

                {aiResponse && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm leading-loose">
                    <div className="text-[10px] font-black uppercase text-rose-500 mb-3 tracking-widest">إجابة المستشار</div>
                    <div className="whitespace-pre-wrap">{aiResponse}</div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-sm p-8 relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">إضافة عادة للنمو</h3>
                <button onClick={() => setShowAdd(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddHabit} className="space-y-4">
                <ModernInput label="اسم العادة" required value={newHabit.title} onChange={e => setNewHabit(prev => ({ ...prev, title: e.target.value }))} />
                <div className="grid grid-cols-2 gap-4">
                  <ModernInput label="الهدف الرقمي" type="number" required value={newHabit.target} onChange={e => setNewHabit(prev => ({ ...prev, target: Number(e.target.value) }))} />
                  <ModernInput label="الوحدة (مثل: دقيقة)" required value={newHabit.unit} onChange={e => setNewHabit(prev => ({ ...prev, unit: e.target.value }))} />
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div 
                    onClick={() => setNewHabit(prev => ({ ...prev, isShared: !prev.isShared }))}
                     className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${newHabit.isShared ? 'bg-emerald-500' : 'bg-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${newHabit.isShared ? 'translate-x-[-16px]' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-bold text-white/80">عادة مشتركة (تحدي)</span>
                </div>
                <button type="submit" className="btn-primary w-full py-4 bg-emerald-500 hover:bg-emerald-600 border-none shadow-emerald-500/20">حفظ العادة</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

