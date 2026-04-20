import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Frown, Meh, Heart, Zap, Coffee, CloudRain, Save, History, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry } from '../../types';

const MOODS_BASE = [
  { id: 'happy', icon: <Smile size={24} />, label: 'سعيد' },
  { id: 'loving', icon: <Heart size={24} />, label: 'محب' },
  { id: 'excited', icon: <Zap size={24} />, label: 'متحمس' },
  { id: 'neutral', icon: <Meh size={24} />, label: 'عادي' },
  { id: 'tired', icon: <Coffee size={24} />, label: 'متعب' },
  { id: 'stressed', icon: <CloudRain size={24} />, label: 'مضغوط' },
  { id: 'sad', icon: <Frown size={24} />, label: 'حزين' },
];

const COLORS = [
  'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 
  'bg-purple-500', 'bg-indigo-500', 'bg-gray-500', 'bg-pink-500', 'bg-cyan-500'
];

const MOOD_VALUES: Record<string, number> = {
  excited: 5,
  loving: 5,
  happy: 4,
  neutral: 3,
  tired: 2,
  stressed: 1,
  sad: 0
};

export const MoodTracker: React.FC = () => {
  const { moodLogs, addMoodLog, currentUser, partnerStatus, moodConfigs, updateMoodConfig } = usePlanet();
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [note, setNote] = useState('');
  const [viewMode, setViewMode] = useState<'log' | 'trends' | 'history'>('log');
  const [isCustomizing, setIsCustomizing] = useState(false);

  const moodsWithConfig = MOODS_BASE.map(m => {
    const config = moodConfigs.find(c => c.mood === m.id);
    const color = config?.color || 'bg-gray-500';
    return { ...m, color, text: color.replace('bg-', 'text-') };
  });

  const handleLog = () => {
    if (!selectedMood) return;
    addMoodLog(selectedMood, note);
    setSelectedMood(null);
    setNote('');
  };

  const chartDataWeekly = useMemo(() => {
    const last7Days = new Date();
    last7Days.setHours(0, 0, 0, 0);
    last7Days.setDate(last7Days.getDate() - 7);
    
    // Create an array of the last 7 days
    const days = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(last7Days);
      d.setDate(d.getDate() + i);
      return d;
    });

    return days.map(day => {
      const dStr = day.toLocaleDateString('ar-EG', { weekday: 'short' });
      const fullDate = day.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit' });
      
      const fEntries = moodLogs.filter(e => e.userId === 'F' && new Date(e.timestamp).toDateString() === day.toDateString());
      const bEntries = moodLogs.filter(e => e.userId === 'B' && new Date(e.timestamp).toDateString() === day.toDateString());
      
      const fValue = fEntries.length > 0 ? fEntries.reduce((acc, e) => acc + (MOOD_VALUES[e.mood] || 3), 0) / fEntries.length : null;
      const bValue = bEntries.length > 0 ? bEntries.reduce((acc, e) => acc + (MOOD_VALUES[e.mood] || 3), 0) / bEntries.length : null;

      return {
        time: dStr,
        fullDate,
        F_value: fValue,
        B_value: bValue,
        // Keep these for tooltip backward compatibility if needed, though CustomTooltip might need update
        day: day.getTime()
      };
    });
  }, [moodLogs]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border-[var(--color-primary)]/30 shadow-2xl space-y-2 backdrop-blur-xl">
          <div className="text-[10px] font-black opacity-40 mb-2">{payload[0].payload.fullDate}</div>
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: p.color }} />
              <div className="text-xs font-black">{p.name}: {p.value.toFixed(1)}</div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const partnerMood = useMemo(() => {
    const lastEntry = moodLogs.find(m => m.userId !== currentUser);
    return lastEntry;
  }, [moodLogs, currentUser]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">غلاف المشاعر</h2>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">كيف حال قلبك اليوم في الكوكب؟</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black hover:bg-white/10 transition-all"
          >
            {isCustomizing ? 'إغلاق الإعدادات' : 'تخصيص الألوان'}
          </button>
          <div className="glass rounded-xl p-1 flex gap-1">
            <button 
              onClick={() => setViewMode('log')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${viewMode === 'log' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40'}`}
            >
              تسجيل
            </button>
            <button 
              onClick={() => setViewMode('trends')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${viewMode === 'trends' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40'}`}
            >
              التوجهات
            </button>
            <button 
              onClick={() => setViewMode('history')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${viewMode === 'history' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40'}`}
            >
              السجل
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isCustomizing && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-card p-6 overflow-hidden space-y-4"
          >
            <h3 className="text-sm font-black">تخصيص ألوان المشاعر</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {moodsWithConfig.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={m.text}>{m.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {COLORS.slice(0, 5).map(c => (
                      <button 
                        key={c}
                        onClick={() => updateMoodConfig(m.id, c)}
                        className={`w-4 h-4 rounded-full ${c} ${m.color === c ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {viewMode === 'log' ? (
          <motion.div 
            key="log"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Log Section */}
            <div className="glass-card p-8 space-y-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-black">سجل حالتك الحالية</h3>
                <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">تساعدنا هذه البيانات في فهم إيقاع الكوكب</p>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-7 gap-4 relative z-10">
                {moodsWithConfig.map((mood) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id as any)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all duration-300 group/item ${selectedMood === mood.id ? `${mood.color} text-white shadow-xl ${mood.color}/40 scale-110` : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}
                  >
                    <div className={`transition-transform duration-300 ${selectedMood === mood.id ? 'scale-110' : 'group-hover/item:scale-110'}`}>
                      {mood.icon}
                    </div>
                    <span className="text-[10px] font-black">{mood.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="space-y-4 relative z-10">
                <input 
                  type="text" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="ملاحظة بسيطة (اختياري)..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-1 focus:ring-[var(--color-primary)] placeholder:opacity-30"
                />
                <button 
                  onClick={handleLog}
                  disabled={!selectedMood}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white font-black text-sm shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
                >
                  حفظ في سجل الكوكب
                </button>
              </div>
            </div>

            {/* Partner Status Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black">الصحة النفسية للكوكب</h4>
                    <p className="text-[10px] opacity-60">توازن مشاعركما اليوم ممتاز جداً</p>
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-500">92%</div>
              </div>

              <div className="glass-card p-6 flex items-center justify-between border-rose-500/20 bg-rose-500/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    {partnerMood ? moodsWithConfig.find(m => m.id === partnerMood.mood)?.icon : <Smile size={24} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black">حالة الشريك</h4>
                    <p className="text-[10px] opacity-60">
                      {partnerMood ? `شريكك يشعر بـ "${moodsWithConfig.find(m => m.id === partnerMood.mood)?.label}"` : 'لا توجد بيانات حديثة'}
                    </p>
                  </div>
                </div>
                {partnerMood && <div className="text-[10px] font-black opacity-30">{new Date(partnerMood.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>}
              </div>
            </div>
          </motion.div>
        ) : viewMode === 'trends' ? (
          <motion.div 
            key="trends"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Chart Area */}
            <div className="glass-card p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest opacity-50">تحليل المشاعر (آخر 14 يوماً)</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[8px] font-black opacity-50">فهد</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[8px] font-black opacity-50">بشرى</span></div>
                </div>
              </div>
              
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataWeekly}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={10} stroke="rgba(255,255,255,0.2)" />
                    <YAxis hide domain={[0, 5]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                    <Area 
                      type="monotone" 
                      dataKey="F_value" 
                      name="فهد"
                      stroke="#f43f5e" 
                      fillOpacity={0.1} 
                      fill="#f43f5e" 
                      strokeWidth={3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="B_value" 
                      name="بشرى"
                      stroke="#3b82f6" 
                      fillOpacity={0.1} 
                      fill="#3b82f6" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent History List (Small Preview) */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-40 px-1">آخر المشاركات</h3>
              {moodLogs.slice(0, 3).map(entry => {
                const moodInfo = moodsWithConfig.find(m => m.id === entry.mood);
                return (
                  <div key={entry.id} className="glass-card p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${moodInfo?.color}/10 ${moodInfo?.text} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        {moodInfo?.icon && React.cloneElement(moodInfo.icon as React.ReactElement, { size: 18 })}
                      </div>
                      <div>
                        <div className="text-sm font-black">{moodInfo?.label}</div>
                        <p className="text-[10px] opacity-40 font-medium truncate max-w-[150px]">{entry.note || 'لا توجد ملاحظات'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black">{entry.userId === 'F' ? 'فهد' : 'بشرى'}</div>
                    </div>
                  </div>
                );
              })}
              <button 
                onClick={() => setViewMode('history')}
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
              >
                عرض السجل الكامل
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-50">السجل التاريخي للمشاعر</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold opacity-40">
                <Calendar size={12} /> {moodLogs.length} مدخلات
              </div>
            </div>

            <div className="space-y-4">
              {moodLogs.length === 0 && (
                <div className="glass-card p-12 text-center opacity-40 italic text-xs">
                  لا يوجد تاريخ مسجل بعد... ابدأ بتسجيل مشاعرك اليوم!
                </div>
              )}
              {moodLogs.map(entry => {
                const moodInfo = moodsWithConfig.find(m => m.id === entry.mood);
                return (
                  <motion.div 
                    layout
                    key={entry.id} 
                    className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[var(--color-primary)]/30 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl ${moodInfo?.color}/10 ${moodInfo?.text} flex items-center justify-center shadow-inner`}>
                        {moodInfo?.icon && React.cloneElement(moodInfo.icon as React.ReactElement, { size: 28 })}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black">{moodInfo?.label}</span>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${entry.userId === 'F' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {entry.userId === 'F' ? 'فهد' : 'بشرى'}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed italic">
                          {entry.note ? `"${entry.note}"` : <span className="opacity-20 italic">بدون ملاحظات</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      <div className="text-[10px] font-black opacity-60">
                        {new Date(entry.timestamp).toLocaleDateString('ar-EG', { weekday: 'long' })}
                      </div>
                      <div className="text-[12px] font-black text-[var(--color-primary)]">
                        {new Date(entry.timestamp).toLocaleDateString('ar-EG', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-tighter">
                        {new Date(entry.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
