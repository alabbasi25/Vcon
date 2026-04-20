import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  ListTodo, 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  X, 
  Filter, 
  BarChart3, 
  RotateCw, 
  Trophy,
  AlertCircle,
  Calendar,
  Trash2,
  ChevronDown,
  Home,
  Briefcase,
  User,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { UserID } from '../../types';
import { ModernInput } from '../ui/ModernInput';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const TaskOrchestrator: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    completeTask, 
    deleteTask,
    delegateTask, 
    currentUser, 
    profiles, 
    streaks, 
    rouletteTasks, 
    toggleRouletteTask, 
    spinRoulette,
    barakahPoints,
    priorityConfigs,
    updatePriorityConfig,
    autoAssignTask,
    getAITaskSuggestion,
    updateTaskSettings
  } = usePlanet();
  
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'home' | 'work' | 'personal'>('all');
  const [filterAssignee, setFilterAssignee] = useState<'all' | 'F' | 'B'>('all');
  const [filterDaily, setFilterDaily] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<'newest' | 'dueDate'>('newest');

  const [newTask, setNewTask] = useState({ 
    title: '', 
    assignedTo: currentUser as 'F' | 'B', 
    autoAssign: false,
    priority: 'medium' as any,
    category: 'home' as any,
    dueDate: '' 
  });
  
  const [isSpinning, setIsSpinning] = useState(false);
  const partner = currentUser === 'F' ? 'B' : 'F';

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter(t => {
      const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesAssignee = filterAssignee === 'all' || t.assignedTo === filterAssignee;
      
      let matchesDate = true;
      if (filterDaily) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (!t.dueDate) {
          matchesDate = false; 
        } else {
          // Due today or earlier (overdue)
          matchesDate = t.dueDate < tomorrow.getTime() && t.status !== 'completed';
        }
      } else if (dateRange.start || dateRange.end) {
        if (!t.dueDate) {
          matchesDate = false;
        } else {
          const start = dateRange.start ? new Date(dateRange.start).getTime() : 0;
          const end = dateRange.end ? new Date(dateRange.end).getTime() : Infinity;
          matchesDate = t.dueDate >= start && t.dueDate <= end;
        }
      }
      
      return matchesPriority && matchesCategory && matchesAssignee && matchesDate;
    });

    if (sortBy === 'dueDate') {
      result.sort((a, b) => (a.dueDate || Infinity) - (b.dueDate || Infinity));
    } else {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [tasks, filterPriority, filterCategory, dateRange, sortBy]);

  const myTasks = filteredAndSortedTasks.filter(t => t.assignedTo === currentUser && t.status !== 'completed');
  const partnerTasks = filteredAndSortedTasks.filter(t => t.assignedTo === partner && t.status !== 'completed');

  // Analytics Data
  const priorityData = [
    { name: 'عاجل', value: tasks.filter(t => t.priority === 'urgent').length, color: '#f43f5e' },
    { name: 'مهم', value: tasks.filter(t => t.priority === 'high').length, color: '#f59e0b' },
    { name: 'عادي', value: tasks.filter(t => t.priority === 'medium').length, color: '#3b82f6' },
    { name: 'منخفض', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ].filter(d => d.value > 0);

  const completionData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTasks = tasks.filter(t => 
        t.status === 'completed' && 
        new Date(t.createdAt).toISOString().split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('ar-EG', { weekday: 'short' }),
        فهد: dayTasks.filter(t => t.assignedTo === 'F').length,
        بشرى: dayTasks.filter(t => t.assignedTo === 'B').length,
      };
    });
  }, [tasks]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title: newTask.title,
      priority: newTask.priority,
      category: newTask.category,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate).getTime() : undefined,
      status: 'pending' as any
    };

    if (newTask.autoAssign) {
      autoAssignTask(taskData);
    } else {
      addTask({
        ...taskData,
        assignedTo: newTask.assignedTo,
      });
    }
    
    setShowAdd(false);
    setNewTask({ title: '', assignedTo: currentUser as 'F' | 'B', autoAssign: false, priority: 'medium', category: 'home', dueDate: '' });
  };

  const handleSpin = () => {
    if (rouletteTasks.length === 0) return;
    setIsSpinning(true);
    spinRoulette();
    setTimeout(() => setIsSpinning(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black">محرك المهام</h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <Trophy size={10} /> {barakahPoints} نقطة بركة
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showAnalytics ? 'bg-[var(--color-primary)] text-white' : 'glass text-[var(--color-text-secondary)]'}`}
          >
            <BarChart3 size={20} />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showSettings ? 'bg-[var(--color-primary)] text-white' : 'glass text-[var(--color-text-secondary)]'}`}
          >
            <MoreHorizontal size={20} />
          </button>
          <button 
            onClick={() => setShowRoulette(true)}
            className="w-10 h-10 rounded-xl glass text-amber-500 flex items-center justify-center"
          >
            <RotateCw size={20} />
          </button>
          <button 
            onClick={() => setShowAdd(true)}
            className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-48">
                  <h4 className="text-[10px] font-bold uppercase opacity-50 mb-4 text-center">توزيع الأولويات</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={priorityData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-48">
                  <h4 className="text-[10px] font-bold uppercase opacity-50 mb-4 text-center">الإنجاز الأسبوعي</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={completionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                      <Bar dataKey="فهد" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="بشرى" fill="#9333ea" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings (Priority Colors) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 space-y-4">
              <h4 className="text-[10px] font-black uppercase opacity-50 tracking-widest">تخصيص ألوان الأولويات</h4>
              <div className="grid grid-cols-2 gap-4">
                {priorityConfigs.map(config => (
                  <div key={config.priority} className="space-y-2">
                    <label className="text-[10px] font-bold opacity-60">
                      {config.priority === 'urgent' ? 'عاجل' : config.priority === 'high' ? 'مهم' : config.priority === 'medium' ? 'عادي' : 'منخفض'}
                    </label>
                    <div className="flex gap-2">
                      {['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-indigo-500'].map(color => (
                        <button
                          key={color}
                          onClick={() => updatePriorityConfig(config.priority, color)}
                          className={`w-6 h-6 rounded-full ${color} border-2 ${config.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      <div className="space-y-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full glass-card p-4 border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all ${showFilters ? 'bg-white/5' : ''}`}
        >
          <div className="flex items-center gap-2">
            <Filter size={16} className={showFilters ? 'text-[var(--color-primary)]' : 'opacity-40'} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">تصفية وترتيب متقدم</span>
          </div>
          <motion.div
            animate={{ rotate: showFilters ? 180 : 0 }}
            className="opacity-40"
          >
            <ChevronDown size={16} />
          </motion.div>
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-4 space-y-4 border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-2">
                    المعايير الحالية
                  </h4>
                  <div className="relative">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-[10px] font-bold text-[var(--color-primary)] outline-none cursor-pointer appearance-none pl-6"
                    >
                      <option value="newest" className="text-black">الأحدث أولاً</option>
                      <option value="dueDate" className="text-black">حسب الموعد</option>
                    </select>
                    <ChevronDown size={12} className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {profiles[currentUser].taskSettings.showDailyFilter && (
                    <>
                      <button
                        onClick={() => setFilterDaily(!filterDaily)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                          filterDaily 
                            ? 'bg-amber-500 text-white border-amber-500 shadow-lg' 
                            : 'glass text-[var(--color-text-secondary)] border-white/10'
                        }`}
                      >
                        مهام اليوم والمتأخرة
                      </button>
                      <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    </>
                  )}
                  {(['all', 'urgent', 'high', 'medium', 'low'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                        filterPriority === p 
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                          : 'glass text-[var(--color-text-secondary)] border-white/10'
                      }`}
                    >
                      {p === 'all' ? 'كل الأولويات' : p === 'urgent' ? 'عاجل' : p === 'high' ? 'مهم' : p === 'medium' ? 'عادي' : 'منخفض'}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {(['all', 'F', 'B'] as const).map(u => (
                    <button
                      key={u}
                      onClick={() => setFilterAssignee(u)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                        filterAssignee === u 
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                          : 'glass text-[var(--color-text-secondary)] border-white/10'
                      }`}
                    >
                      {u === 'all' ? 'الجميع' : u === 'F' ? 'فهد' : 'بشرى'}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {(['all', 'home', 'work', 'personal'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setFilterCategory(c)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                        filterCategory === c 
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                          : 'glass text-[var(--color-text-secondary)] border-white/10'
                      }`}
                    >
                      {c === 'all' ? 'كل التصنيفات' : c === 'home' ? 'المنزل' : c === 'work' ? 'العمل' : 'شخصي'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
                  <div className="col-span-2 flex items-center justify-between p-3 glass rounded-xl">
                    <span className="text-[10px] font-bold">تفعيل فلتر "مهام اليوم والمتأخرة"</span>
                    <button 
                      onClick={() => updateTaskSettings({ showDailyFilter: !profiles[currentUser].taskSettings.showDailyFilter })}
                      className={`w-10 h-5 rounded-full relative transition-all ${profiles[currentUser].taskSettings.showDailyFilter ? 'bg-amber-500' : 'bg-gray-500'}`}
                    >
                      <motion.div 
                        animate={{ x: profiles[currentUser].taskSettings.showDailyFilter ? 22 : 2 }}
                        className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold opacity-40 uppercase">من تاريخ</label>
                    <input 
                      type="date" 
                      value={dateRange.start} 
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-[10px] outline-none text-[var(--color-text-primary)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold opacity-40 uppercase">إلى تاريخ</label>
                    <input 
                      type="date" 
                      value={dateRange.end} 
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-[10px] outline-none text-[var(--color-text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* My Tasks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">مهامي</h3>
            <span className="text-[10px] opacity-40">{myTasks.length} مهام</span>
          </div>
          <div className="space-y-4">
            {myTasks.length === 0 && <p className="text-xs opacity-40 italic p-8 text-center glass-card">لا توجد مهام مطابقة...</p>}
            {myTasks.map(task => (
              <EnhancedTaskCard 
                key={task.id} 
                task={task} 
                onComplete={() => completeTask(task.id)}
                onDelete={() => setConfirmDelete(task.id)}
                onDelegate={() => delegateTask(task.id, partner, 'توزيع')}
                onRoulette={() => toggleRouletteTask(task.id)}
                isInRoulette={rouletteTasks.includes(task.id)}
              />
            ))}
          </div>
        </div>

        {/* Partner Tasks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">مهام {partner === 'F' ? 'فهد' : 'بشرى'}</h3>
            <span className="text-[10px] opacity-40">{partnerTasks.length} مهام</span>
          </div>
          <div className="space-y-4">
            {partnerTasks.length === 0 && <p className="text-xs opacity-40 italic p-8 text-center glass-card">لا توجد مهام مطابقة...</p>}
            {partnerTasks.map(task => (
              <EnhancedTaskCard 
                key={task.id} 
                task={task} 
                isPartner
                onRoulette={() => toggleRouletteTask(task.id)}
                isInRoulette={rouletteTasks.includes(task.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAdd && (
          <AddTaskModal 
            onClose={() => setShowAdd(false)} 
            onSubmit={handleAdd} 
            newTask={newTask} 
            setNewTask={setNewTask} 
          />
        )}
        {showRoulette && (
          <RouletteModal 
            onClose={() => setShowRoulette(false)}
            tasks={tasks.filter(t => rouletteTasks.includes(t.id))}
            isSpinning={isSpinning}
            onSpin={handleSpin}
          />
        )}
        {confirmDelete && (
          <ConfirmationModal 
            isOpen={!!confirmDelete}
            onClose={() => setConfirmDelete(null)}
            onConfirm={() => {
              if (confirmDelete) deleteTask(confirmDelete);
            }}
            title="حذف المهمة"
            message="هل أنت متأكد من رغبتك في حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء وسيتم فقدان البيانات المتعلقة بها."
            confirmLabel="حذف المهمة"
            cancelLabel="تراجع"
            variant="danger"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EnhancedTaskCard: React.FC<{ 
  task: any; 
  onComplete?: () => void; 
  onDelete?: () => void;
  onDelegate?: () => void;
  onRoulette: () => void;
  isInRoulette: boolean;
  isPartner?: boolean;
}> = ({ task, onComplete, onDelete, onDelegate, onRoulette, isInRoulette, isPartner }) => {
  const { priorityConfigs, getAITaskSuggestion } = usePlanet();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const x = useMotionValue(0);
  const background = useTransform(x, [0, 100], ['rgba(255,255,255,0)', 'rgba(16,185,129,0.2)']);
  const opacity = useTransform(x, [0, 100], [1, 0.5]);

  const isOverdue = task.dueDate && task.dueDate < Date.now() && task.status !== 'completed';
  const priorityColor = priorityConfigs.find(c => c.priority === task.priority)?.color || 'bg-blue-500';

  const handleAiSuggestion = async () => {
    if (aiSuggestion) {
      setAiSuggestion(null);
      return;
    }
    setIsAiLoading(true);
    try {
      const suggestion = await getAITaskSuggestion(task.id);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    if (!isPartner && onComplete && info.offset.x > 100) {
      onComplete();
    }
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
      case 'home': return <Home size={14} />;
      case 'work': return <Briefcase size={14} />;
      case 'personal': return <User size={14} />;
      default: return <MoreHorizontal size={14} />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem]">
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${priorityColor} z-20 opacity-80`} />
      {isOverdue && (
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-rose-500 rounded-[2rem] z-0"
        />
      )}
      {!isPartner && (
        <motion.div 
          style={{ background }}
          className="absolute inset-0 flex items-center px-6 text-green-500"
        >
          <CheckCircle2 size={24} />
        </motion.div>
      )}
      <motion.div 
        drag={isPartner ? false : "x"}
        dragConstraints={{ left: 0, right: 150 }}
        style={{ x, opacity }}
        onDragEnd={handleDragEnd}
        className={`glass-card p-6 space-y-4 relative z-10 border-white/5 ${isPartner ? 'opacity-80' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors bg-opacity-20 ${priorityColor.replace('bg-', 'text-')} ${priorityColor.replace('bg-', 'bg-')}/20`}>
              <CategoryIcon category={task.category} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-base">{task.title}</h4>
                <button 
                  onClick={handleAiSuggestion}
                  disabled={isAiLoading}
                  className="p-1.5 rounded-lg glass text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors disabled:opacity-50"
                  title="اقتراح تنفيذ المهمة"
                >
                  <Sparkles size={12} className={isAiLoading ? 'animate-pulse' : ''} />
                </button>
                {isOverdue && (
                  <motion.span 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[8px] font-black uppercase tracking-tighter"
                  >
                    <AlertCircle size={8} /> متأخرة
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <span className="text-[10px] font-bold opacity-40 flex items-center gap-1">
                  <CategoryIcon category={task.category} />
                  {task.category === 'home' ? 'منزلي' : task.category === 'work' ? 'عمل' : task.category === 'personal' ? 'شخصي' : 'أخرى'}
                </span>
              </div>
            </div>
          </div>
          {!isPartner && (
            <button 
              onClick={onDelete}
              className="p-2 rounded-xl hover:bg-rose-500/10 text-rose-500/40 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        
        <AnimatePresence>
          {aiSuggestion && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 leading-relaxed font-medium">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} />
                  <span className="font-black uppercase tracking-widest text-[8px]">اقتراح AI Oracle</span>
                </div>
                {aiSuggestion}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-4">
            {task.dueDate && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                task.dueDate < Date.now() ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-white/5 border-white/10 text-white/60'
              }`}>
                <Calendar size={12} />
                <span className="text-[10px] font-bold">
                  {new Date(task.dueDate).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[10px] font-bold opacity-40">
              <Clock size={12} />
              {task.estimatedMinutes} دقيقة
            </div>
          </div>

          <div className="flex gap-1">
            <button 
              onClick={onRoulette}
              className={`p-2 rounded-xl transition-colors ${isInRoulette ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'glass text-amber-500 hover:bg-amber-500/10'}`}
            >
              <RotateCw size={16} />
            </button>
            {!isPartner && (
              <button 
                onClick={onDelegate}
                className="p-2 rounded-xl glass text-blue-500 hover:bg-blue-500/10 transition-colors"
              >
                <ArrowLeftRight size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const { priorityConfigs } = usePlanet();
  const config = {
    urgent: { label: 'عاجل جداً' },
    high: { label: 'أولوية عالية' },
    medium: { label: 'أولوية عادية' },
    low: { label: 'أولوية منخفضة' },
  };
  const color = priorityConfigs.find(c => c.priority === priority)?.color || 'bg-blue-500';
  const label = config[priority as keyof typeof config]?.label || config.medium.label;
  
  return (
    <span className={`text-[10px] font-black ${color.replace('bg-', 'text-')}`}>
      {label}
    </span>
  );
};

const AddTaskModal: React.FC<{ onClose: any, onSubmit: any, newTask: any, setNewTask: any }> = ({ onClose, onSubmit, newTask, setNewTask }) => (
  <div className="modal-backdrop">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" />
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }} 
      animate={{ scale: 1, opacity: 1, y: 0 }} 
      exit={{ scale: 0.9, opacity: 0, y: 20 }} 
      className="modal-content max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h3 className="text-2xl font-black">مهمة جديدة</h3>
          <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">إضافة مسؤولية جديدة للكوكب</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all">
          <X size={20} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-8">
        <ModernInput label="ما هي المهمة؟" required value={newTask.title} onChange={e => setNewTask((prev: any) => ({ ...prev, title: e.target.value }))} />
        
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase opacity-50 tracking-widest px-1">التصنيف</label>
          <div className="grid grid-cols-2 gap-3">
            {(['home', 'work', 'personal', 'other'] as const).map(c => (
              <button
                key={c} type="button"
                onClick={() => setNewTask((prev: any) => ({ ...prev, category: c }))}
                className={`py-4 rounded-2xl border-2 text-[10px] font-black transition-all flex items-center justify-center gap-3 ${
                  newTask.category === c 
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-shadow)]' 
                    : 'glass opacity-60 border-white/5 hover:border-white/20'
                }`}
              >
                {c === 'home' ? <Home size={14} /> : c === 'work' ? <Briefcase size={14} /> : c === 'personal' ? <User size={14} /> : <MoreHorizontal size={14} />}
                {c === 'home' ? 'منزل' : c === 'work' ? 'عمل' : c === 'personal' ? 'شخصي' : 'أخرى'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase opacity-50 tracking-widest px-1">الأولوية</label>
          <div className="grid grid-cols-4 gap-2">
            {(['urgent', 'high', 'medium', 'low'] as const).map(p => (
              <button
                key={p} type="button"
                onClick={() => setNewTask((prev: any) => ({ ...prev, priority: p }))}
                className={`py-3 rounded-xl border-2 text-[10px] font-black transition-all ${
                  newTask.priority === p 
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md shadow-[var(--color-shadow)]' 
                    : 'glass opacity-60 border-white/5 hover:border-white/20'
                }`}
              >
                {p === 'urgent' ? 'عاجل' : p === 'high' ? 'مهم' : p === 'medium' ? 'عادي' : 'بسيط'}
              </button>
            ))}
          </div>
        </div>

        <ModernInput label="الموعد النهائي" type="datetime-local" value={newTask.dueDate} onChange={e => setNewTask((prev: any) => ({ ...prev, dueDate: e.target.value }))} />

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase opacity-50 tracking-widest px-1">تعيين المهمة</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setNewTask((prev: any) => ({ ...prev, autoAssign: !prev.autoAssign }))}
              className={`flex-1 py-4 rounded-2xl border-2 text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
                newTask.autoAssign 
                  ? 'bg-amber-500 text-white border-amber-500 shadow-lg' 
                  : 'glass opacity-60 border-white/5'
              }`}
            >
              <RotateCw size={14} className={newTask.autoAssign ? 'animate-spin' : ''} />
              تعيين تلقائي (ذكاء الكوكب)
            </button>
          </div>
          
          <AnimatePresence>
            {!newTask.autoAssign && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 mt-2">
                  {(['F', 'B'] as const).map(u => (
                    <button
                      key={u} type="button"
                      onClick={() => setNewTask((prev: any) => ({ ...prev, assignedTo: u }))}
                      className={`flex-1 py-4 rounded-2xl border-2 text-xs font-black transition-all ${
                        newTask.assignedTo === u 
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg' 
                          : 'glass opacity-60 border-white/5'
                      }`}
                    >
                      {u === 'F' ? 'فهد' : 'بشرى'}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button type="submit" className="btn-primary w-full py-6 text-lg shadow-2xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          إضافة المهمة للكوكب
        </button>
      </form>
    </motion.div>
  </div>
);


const RouletteModal: React.FC<{ onClose: any, tasks: any[], isSpinning: boolean, onSpin: any }> = ({ onClose, tasks, isSpinning, onSpin }) => {
  const [winner, setWinner] = useState<UserID | null>(null);
  const rotation = isSpinning ? 1800 + (winner === 'F' ? 0 : 180) : 0;
  
  const handleSpinClick = () => {
    setWinner(null);
    onSpin();
    setTimeout(() => {
      setWinner(Math.random() > 0.5 ? 'F' : 'B');
    }, 3000);
  };

  return (
    <div className="modal-backdrop">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 40 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.8, opacity: 0, y: 40 }} 
        className="w-full max-w-md relative z-10 space-y-8 text-center px-4"
      >
        <div className="space-y-3">
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Task Roulette
          </div>
          <h3 className="text-5xl font-black text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">عجلة الحظ</h3>
          <p className="text-sm font-bold text-[var(--color-text-secondary)]">المهام العالقة التي لا يريدها أحد.. دع القدر يقرر!</p>
        </div>

        {/* The Wheel Container */}
        <div className="relative w-80 h-80 mx-auto">
          <div className="absolute inset-0 rounded-full border-[20px] border-amber-500/5 shadow-[inset_0_0_40px_rgba(245,158,11,0.1)]" />
          <motion.div 
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full rounded-full border-[12px] border-amber-500/20 relative overflow-hidden bg-gradient-to-br from-amber-500/20 to-transparent backdrop-blur-2xl shadow-2xl"
          >
            {/* Wheel Segments */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <div key={deg} className="w-full h-px absolute bg-amber-500/10" style={{ transform: `rotate(${deg}deg)` }} />
              ))}
              
              {/* Names on Wheel */}
              <div className="absolute top-12 font-black text-amber-500/60 text-lg tracking-widest">فهد</div>
              <div className="absolute bottom-12 font-black text-amber-500/60 text-lg tracking-widest rotate-180">بشرى</div>
            </div>
            {/* Center Hub */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center justify-center text-white z-30 ring-[12px] ring-amber-500/10">
                <RotateCw size={36} className={isSpinning ? 'animate-spin' : ''} />
              </div>
            </div>
          </motion.div>
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[45px] border-t-amber-500 z-40 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" />
        </div>

        <AnimatePresence>
          {winner && (
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="glass-card p-6 border-amber-500/40 bg-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              <div className="relative z-10">
                <div className="text-amber-500 font-black text-2xl mb-2">
                  مبروك! المهمة ذهبت لـ {winner === 'F' ? 'فهد' : 'بشرى'} 🎉
                </div>
                <div className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em]">تمت إضافة 50 نقطة بركة مضاعفة للسجل</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-card p-6 space-y-4 border-white/5">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black uppercase opacity-50 tracking-widest">المهام في العجلة</h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black">{tasks.length}</span>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-2 no-scrollbar">
            {tasks.map(t => (
              <div key={t.id} className="text-sm font-bold p-4 rounded-2xl bg-white/5 border border-white/5 text-right flex items-center justify-between group hover:bg-white/10 transition-all">
                <div className="w-2 h-2 rounded-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors" />
                {t.title}
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="py-8 opacity-40 italic text-xs font-bold">
                لا توجد مهام في العجلة حالياً.. اسحب المهام من القائمة
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            disabled={tasks.length === 0 || isSpinning}
            onClick={handleSpinClick}
            className="btn-primary flex-[2] py-5 bg-amber-500 shadow-amber-500/40 disabled:opacity-50 text-lg font-black tracking-wide"
          >
            {isSpinning ? 'جاري السحب...' : 'تدوير العجلة الآن'}
          </button>
          <button onClick={onClose} className="flex-1 glass px-6 rounded-[2rem] text-white font-black text-sm hover:bg-white/10 transition-all">إغلاق</button>
        </div>
      </motion.div>
    </div>
  );
};
