import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PieChart as PieChartIcon, 
  Filter,
  Calendar,
  DollarSign,
  Plus,
  X,
  TrendingUp,
  Target,
  AlertCircle,
  ChevronRight,
  Wallet,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Scan,
  Camera,
  Loader2,
  Settings,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';
import { KokabButton } from '../ui/KokabButton';
import { Transaction, Liability, AssetGoal, Budget } from '../../types';

export const UnifiedLedger: React.FC = () => {
  const { 
    transactions, 
    liabilities, 
    assets, 
    budget,
    updateBudget,
    addTransaction, 
    addLiability, 
    deleteLiability,
    updateLiabilityPayment,
    addAssetGoal,
    deleteAssetGoal,
    updateAssetGoalProgress,
    currentUser,
    profiles,
    requestConsensus
  } = usePlanet();

  const userProfile = profiles[currentUser];
  const ceiling = userProfile?.delegatedSpendingCeiling || 0;

  // State for filters
  const [filterType, setFilterType] = useState<'all' | 'fixed' | 'variable'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showBudgetEditor, setShowBudgetEditor] = useState(false);

  // State for modals
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [activeTab, setActiveTab] = useState<'summary' | 'transactions' | 'liabilities' | 'goals'>('summary');

  // Form states
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({ amount: 0, type: 'variable', category: '', description: '' });
  const [newLiabilityForm, setNewLiabilityForm] = useState<Partial<Liability>>({ name: '', totalAmount: 0, monthlyInstallment: 0 });
  const [newGoalForm, setNewGoalForm] = useState<Partial<AssetGoal>>({ name: '', target: 0, current: 0, requiresDualAuth: false });
  const [editBudget, setEditBudget] = useState<Partial<Budget>>(budget);

  const categories = useMemo(() => ['all', ...new Set(transactions.map(t => t.category))], [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesDate = (!dateRange.start || t.timestamp >= new Date(dateRange.start).getTime()) &&
                          (!dateRange.end || t.timestamp <= new Date(dateRange.end).getTime());
      return matchesType && matchesCategory && matchesDate;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions, filterType, filterCategory, dateRange]);

  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const budgetUtilization = (totalSpent / budget.monthlyLimit) * 100;

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const budgetBarData = useMemo(() => {
    return (budget.categories || []).map(cat => ({
      name: cat.name,
      allocated: cat.allocated,
      spent: cat.spent
    }));
  }, [budget]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(newTransaction.amount);
    
    if (amount > ceiling) {
      requestConsensus('transaction', {
        ...newTransaction,
        timestamp: Date.now(),
        requestedBy: currentUser
      });
      alert(`المبلغ (${amount} ريال) يتجاوز سقف التفويض الخاص بك (${ceiling} ريال). تم إرسال طلب "توقيع رقمي" للشريك.`);
    } else {
      addTransaction(newTransaction);
      // Update budget spent field for the category
      const updatedCategories = budget.categories.map(cat => 
        cat.name === newTransaction.category ? { ...cat, spent: cat.spent + amount } : cat
      );
      updateBudget({ categories: updatedCategories });
    }
    
    setShowAddTransaction(false);
    setNewTransaction({ amount: 0, type: 'variable', category: '', description: '' });
  };

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateBudget(editBudget);
    setShowBudgetEditor(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black">الميزانية والمالية</h2>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">إدارة حكيمة لمستقبل الكوكب</p>
        </div>
        
        <div className="flex items-center gap-2">
          <KokabButton 
            variant="ghost" 
            size="sm" 
            onClick={() => alert('جاري تجهيز تقرير مالي شامل بصيغة PDF...')}
            className="px-3 py-2 border border-white/10"
          >
            <FileText size={16} className="ml-2" />
            تحميل التقرير
          </KokabButton>
          
          {/* Tab Switcher */}
          <div className="flex p-1 bg-white/5 rounded-2xl md:w-auto overflow-x-auto no-scrollbar">
            {(['summary', 'transactions', 'liabilities', 'goals'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[80px] py-2.5 px-4 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'opacity-40 hover:opacity-100'
                }`}
              >
                {tab === 'summary' ? 'الملخص' : tab === 'transactions' ? 'المصاريف' : tab === 'liabilities' ? 'الالتزامات' : 'الأهداف'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {/* Budget Progress Card */}
            <div className="glass-card p-6 space-y-6 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Wallet size={120} />
              </div>
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">الميزانية الشهرية</div>
                  <div className="text-3xl md:text-4xl font-black">
                    <span className="text-[var(--color-primary)]">${totalSpent.toLocaleString()}</span>
                    <span className="text-xl opacity-30 font-medium"> / ${budget.monthlyLimit.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black ${budgetUtilization > 100 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
                    {Math.round(budgetUtilization)}%
                  </div>
                  <div className="text-[8px] font-bold opacity-40 uppercase">استهلاك</div>
                </div>
              </div>
              
              {budgetUtilization > 100 && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center gap-2 text-[10px] text-rose-500 font-bold"
                >
                  <AlertCircle size={14} />
                  <span>انتباه: لقد تم تجاوز الميزانية الشهرية المحددة!</span>
                </motion.div>
              )}
              <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  className={`h-full bg-gradient-to-r ${budgetUtilization > 90 ? 'from-rose-500 to-rose-600' : 'from-[var(--color-primary)] to-emerald-500'} rounded-full`}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black tracking-tighter opacity-50 relative z-10">
                <div className="flex items-center gap-1"><ArrowDownLeft size={10} className="text-emerald-500" /> متبقي: ${(budget.monthlyLimit - totalSpent).toLocaleString()}</div>
                <div className="flex items-center gap-1"><ArrowUpRight size={10} className="text-rose-500" /> مصروف يومي: ${(totalSpent / 30).toFixed(0)}</div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                  <PieChartIcon size={14} /> فئات المصاريف
                </h3>
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                        itemStyle={{ color: 'white' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                  <BarChart3 size={14} /> الخطة مقابل الواقع
                </h3>
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetBarData} layout="vertical" margin={{ left: -10, right: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={60} fontSize={8} axisLine={false} tickLine={false} />
                      <Bar dataKey="spent" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={8} />
                      <Bar dataKey="allocated" fill="rgba(255,255,255,0.05)" radius={[0, 4, 4, 0]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowAddTransaction(true)}
                className="flex-1 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-black text-xs shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} /> تسجيل مصروف جديد
              </button>
              <button 
                onClick={() => setShowBudgetEditor(true)}
                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Settings size={18} /> ضبط الميزانية
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-40">سجل المصروفات</h3>
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-xl transition-all ${showFilters ? 'bg-[var(--color-primary)] text-white' : 'bg-white/5 border border-white/10'}`}><Filter size={14} /></button>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="glass-card p-4 grid grid-cols-2 gap-4 mb-4">
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] outline-none">
                      <option value="all">كل الأنواع</option>
                      <option value="fixed">ثابت</option>
                      <option value="variable">متغير</option>
                    </select>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] outline-none">
                      {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'كل الفئات' : c}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="grid gap-2">
              {filteredTransactions.map(t => (
                <div key={t.id} className="glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${t.type === 'fixed' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {t.type === 'fixed' ? <Calendar size={18} /> : <CreditCard size={18} />}
                    </div>
                    <div>
                      <div className="text-sm font-black">{t.description}</div>
                      <div className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">{t.category} • {new Date(t.timestamp).toLocaleDateString('ar-EG')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-rose-500">-${t.amount}</div>
                    <div className="text-[8px] font-black opacity-30 uppercase">{t.type === 'fixed' ? 'ثابت' : 'متغير'}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'liabilities' && (
          <motion.div
            key="liabilities"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-40">الالتزامات والديون</h3>
              <button onClick={() => setShowAddLiability(true)} className="p-2 rounded-xl bg-[var(--color-primary)] text-white hover:scale-110 transition-all"><Plus size={14} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liabilities.map(l => (
                <div key={l.id} className="glass-card p-5 space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-black">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{l.name}</h4>
                        <p className="text-[10px] opacity-40 italic">متبقي: ${l.remainingAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-rose-500">${l.monthlyInstallment}</div>
                      <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest">شهرياً</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black opacity-40">
                      <span>التقدم في السداد</span>
                      <span>{Math.round((1 - l.remainingAmount / l.totalAmount) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(1 - l.remainingAmount / l.totalAmount) * 100}%` }} className="h-full bg-rose-500" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const amount = Number(prompt('أدخل مبلغ السداد:', l.monthlyInstallment.toString()));
                        if (amount) updateLiabilityPayment(l.id, amount);
                      }}
                      className="flex-1 py-2 rounded-xl bg-rose-500/10 text-rose-500 text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                    >
                      سدد الآن
                    </button>
                    <button onClick={() => deleteLiability(l.id)} className="p-2 rounded-xl text-rose-500/20 hover:text-rose-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'goals' && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-40">الأهداف المالية</h3>
              <button onClick={() => setShowAddGoal(true)} className="p-2 rounded-xl bg-emerald-500 text-white hover:scale-110 transition-all"><Plus size={14} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map(goal => (
                <div key={goal.id} className="glass-card p-5 space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Target size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{goal.name}</h4>
                        <p className="text-[10px] opacity-40 italic">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                      </div>
                    </div>
                    {goal.requiresDualAuth && <div className="p-1 px-2 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-black border border-amber-500/20 uppercase tracking-widest flex items-center gap-1"><Shield size={8} /> توقيع مزدوج</div>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black opacity-40">
                      <span>نسبة الإنجاز</span>
                      <span>{Math.round((goal.current / (goal.target || 1)) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(goal.current / (goal.target || 1)) * 100}%` }} className="h-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const amount = Number(prompt('أدخل مبلغ الإيداع:', '100'));
                        if (amount) updateAssetGoalProgress(goal.id, amount);
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                    >
                      إيداع جديد
                    </button>
                    <button onClick={() => deleteAssetGoal(goal.id)} className="p-2 rounded-xl text-rose-500/20 hover:text-rose-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {/* Simplified Budget Editor */}
        {showBudgetEditor && (
          <div className="modal-backdrop">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">تعديل الميزانية</h3>
                <button onClick={() => setShowBudgetEditor(false)} className="w-8 h-8 rounded-full glass flex items-center justify-center"><X size={16} /></button>
              </div>
              <form onSubmit={handleUpdateBudget} className="space-y-6">
                <ModernInput label="الحد الشهري العام" type="number" value={editBudget.monthlyLimit} onChange={e => setEditBudget({...editBudget, monthlyLimit: Number(e.target.value)})} />
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase opacity-40">توزيع الفئات</h4>
                  {editBudget.categories?.map((cat, idx) => (
                    <div key={idx} className="flex gap-2">
                       <input className="input-field py-2 text-xs flex-1" value={cat.name} disabled />
                       <input className="input-field py-2 text-xs w-24" type="number" value={cat.allocated} onChange={e => {
                         const newCats = [...(editBudget.categories || [])];
                         newCats[idx] = { ...cat, allocated: Number(e.target.value) };
                         setEditBudget({ ...editBudget, categories: newCats });
                       }} />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-xs">حفظ التغييرات</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="modal-backdrop">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="modal-content">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">إضافة عملية</h3>
                <button onClick={() => setShowAddTransaction(false)} className="w-8 h-8 rounded-full glass flex items-center justify-center"><X size={16} /></button>
              </div>
              <form onSubmit={handleAddTransaction} className="space-y-6">
                <ModernInput label="المبلغ" type="number" required value={newTransaction.amount || ''} onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: Number(e.target.value) }))} icon={<DollarSign size={18} />} />
                <ModernInput label="الوصف" required value={newTransaction.description || ''} onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))} icon={<FileText size={18} />} />
                <div className="grid grid-cols-2 gap-4">
                  <select value={newTransaction.type} onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value as any }))} className="input-field text-xs h-12">
                    <option value="variable">متغير</option>
                    <option value="fixed">ثابت</option>
                  </select>
                  <select value={newTransaction.category} onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))} className="input-field text-xs h-12">
                    <option value="">اختر الفئة</option>
                    {budget.categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest">تسجيل المصروف</button>
              </form>
            </motion.div>
          </div>
        )}
        {/* Add Liability Modal */}
        {showAddLiability && (
          <div className="modal-backdrop">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">إضافة التزام مالي</h3>
                <button onClick={() => setShowAddLiability(false)} className="w-8 h-8 rounded-full glass flex items-center justify-center"><X size={16} /></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                addLiability(newLiabilityForm);
                setShowAddLiability(false);
                setNewLiabilityForm({ name: '', totalAmount: 0, monthlyInstallment: 0 });
              }} className="space-y-4">
                <ModernInput label="اسم الالتزام" required value={newLiabilityForm.name} onChange={e => setNewLiabilityForm({...newLiabilityForm, name: e.target.value})} icon={<FileText size={16} />} />
                <div className="grid grid-cols-2 gap-4">
                  <ModernInput label="المبلغ الإجمالي" type="number" required value={newLiabilityForm.totalAmount} onChange={e => setNewLiabilityForm({...newLiabilityForm, totalAmount: Number(e.target.value)})} icon={<DollarSign size={16} />} />
                  <ModernInput label="القسط الشهري" type="number" required value={newLiabilityForm.monthlyInstallment} onChange={e => setNewLiabilityForm({...newLiabilityForm, monthlyInstallment: Number(e.target.value)})} icon={<Clock size={16} />} />
                </div>
                <button type="submit" className="btn-primary w-full py-4 uppercase font-black tracking-widest text-xs">حفظ الالتزام</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="modal-backdrop">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">إضافة هدف مالي</h3>
                <button onClick={() => setShowAddGoal(false)} className="w-8 h-8 rounded-full glass flex items-center justify-center"><X size={16} /></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                addAssetGoal(newGoalForm);
                setShowAddGoal(false);
                setNewGoalForm({ name: '', target: 0, current: 0, requiresDualAuth: false });
              }} className="space-y-4">
                <ModernInput label="اسم الهدف" required value={newGoalForm.name} onChange={e => setNewGoalForm({...newGoalForm, name: e.target.value})} icon={<Target size={16} />} />
                <div className="grid grid-cols-2 gap-4">
                  <ModernInput label="المبلغ المستهدف" type="number" required value={newGoalForm.target} onChange={e => setNewGoalForm({...newGoalForm, target: Number(e.target.value)})} icon={<TrendingUp size={16} />} />
                  <ModernInput label="المبلغ الحالي" type="number" value={newGoalForm.current} onChange={e => setNewGoalForm({...newGoalForm, current: Number(e.target.value)})} icon={<Wallet size={16} />} />
                </div>
                <button type="submit" className="btn-primary w-full py-4 uppercase font-black tracking-widest text-xs">حفظ الهدف</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
