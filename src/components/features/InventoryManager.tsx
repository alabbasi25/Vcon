import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  RefreshCw, 
  Plus, 
  Barcode, 
  AlertTriangle,
  ChevronDown,
  Search,
  X,
  MapPin,
  BellRing,
  ShoppingCart,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';

export const InventoryManager: React.FC = () => {
  const { 
    inventory, 
    addInventoryItem, 
    updateInventoryStock, 
    updateKanbanStatus, 
    syncInventoryConsumption,
    addNotification,
    currentUser 
  } = usePlanet();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'ok'>('all');
  const [filterFrequency, setFilterFrequency] = useState<'all' | 'high' | 'low'>('all');
  
  const [showAdd, setShowAdd] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [newItem, setNewItem] = useState({ name: '', minStock: 1, currentStock: 1, consumptionFrequencyDays: 30, category: 'General' });

  const isFahad = currentUser === 'F';
  const partnerName = isFahad ? 'بشرى' : 'فهد';

  // Nearby Stores Mock Data
  const nearbyStores = [
    { name: 'بنده (الروضة)', distance: '0.5 كم', items: ['حليب', 'خبز', 'بيض'], location: 'قريب جداً' },
    { name: 'التميمي (السليمانية)', distance: '1.2 كم', items: ['منظفات', 'قهوة'], location: 'على طريقك' },
    { name: 'أسواق المزرعة', distance: '2.5 كم', items: ['لحوم', 'خضروات'], location: 'بعيد قليلاً' },
  ];

  const categories = useMemo(() => ['all', ...new Set(inventory.map(i => i.category))], [inventory]);

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesStock = filterStockStatus === 'all' || item.status === filterStockStatus;
      
      let matchesFrequency = true;
      if (filterFrequency === 'high') matchesFrequency = (item.consumptionFrequencyDays || 30) <= 7;
      if (filterFrequency === 'low') matchesFrequency = (item.consumptionFrequencyDays || 30) > 7;

      return matchesSearch && matchesCategory && matchesStock && matchesFrequency;
    });
  }, [inventory, searchQuery, filterCategory, filterStockStatus, filterFrequency]);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem(newItem);
    setShowAdd(false);
    setNewItem({ name: '', minStock: 1, currentStock: 1, consumptionFrequencyDays: 30, category: 'General' });
  };

  const kanbanColumns = [
    { id: 'needed', label: 'نحتاجها', icon: <AlertTriangle size={16} className="text-rose-500" />, color: 'rose' },
    { id: 'in-cart', label: 'في السلة', icon: <ShoppingCart size={16} className="text-amber-500" />, color: 'amber' },
    { id: 'purchased', label: 'تم الشراء', icon: <CheckCircle2 size={16} className="text-emerald-500" />, color: 'emerald' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">سلسلة التوريد</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">تتبع احتياجات المنزل الاستهلاكية آلياً</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              syncInventoryConsumption();
              // Replace alert with more subtle feedback or context action
            }}
            className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center ${inventory.some(i => i.status === 'low') ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-emerald-500/10 text-emerald-500'} hover:scale-105 active:scale-95`}
            title="تحديث الاستهلاك"
          >
            <RefreshCw size={24} />
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}
            className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-[var(--color-primary)]"
          >
            {viewMode === 'list' ? <ListFilter size={24} /> : <Package size={24} />}
          </button>
          <button 
            onClick={() => setShowAdd(true)}
            className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text"
              placeholder="ابحث عن سلعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 border border-white/5 transition-all font-bold text-xs uppercase tracking-widest ${showFilters ? 'bg-[var(--color-primary)] text-white shadow-xl' : 'glass hover:bg-white/10 opacity-70'}`}
          >
            <ListFilter size={18} />
            {showFilters ? 'إخفاء الفلاتر' : 'تخصيص العرض / الفلاتر'}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-white/5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">الفئة</label>
                  <div className="relative">
                    <select 
                      value={filterCategory} 
                      onChange={e => setFilterCategory(e.target.value)}
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs outline-none text-[var(--color-text-primary)] appearance-none"
                    >
                      {categories.map(c => <option key={c} value={c} className="text-black">{c === 'all' ? 'كل الفئات' : c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">حالة المخزون</label>
                  <div className="relative">
                    <select 
                      value={filterStockStatus} 
                      onChange={e => setFilterStockStatus(e.target.value as any)}
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs outline-none text-[var(--color-text-primary)] appearance-none"
                    >
                      <option value="all" className="text-black">الكل</option>
                      <option value="low" className="text-black">منخفض (يحتاج شراء)</option>
                      <option value="ok" className="text-black">كافٍ (متوفر)</option>
                    </select>
                    <ChevronDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">تكرار الاستهلاك</label>
                  <div className="relative">
                    <select 
                      value={filterFrequency} 
                      onChange={e => setFilterFrequency(e.target.value as any)}
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs outline-none text-[var(--color-text-primary)] appearance-none"
                    >
                      <option value="all" className="text-black">الكل</option>
                      <option value="high" className="text-black">استهلاك سريع (≤ 7 أيام)</option>
                      <option value="low" className="text-black">استهلاك بطيء ( {'>'} 7 أيام)</option>
                    </select>
                    <ChevronDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Smart Purchase Radar */}
      <section className="space-y-4">
        <div className="glass-card p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                <MapPin size={20} className={isFahad ? 'animate-bounce' : ''} />
              </div>
              <div>
                <h3 className="text-xs font-bold">رادار المشتريات الذكي</h3>
                <p className="text-[10px] opacity-60">
                  {isFahad ? 'أنت بالقرب من السوبر ماركت' : 'فهد بالقرب من السوبر ماركت'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowRadar(!showRadar)}
              className="text-[10px] font-bold text-blue-500 underline"
            >
              {showRadar ? 'إغلاق' : 'عرض التفاصيل'}
            </button>
          </div>

          <AnimatePresence>
            {showRadar && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4 space-y-3"
              >
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-[var(--color-bg-surface)]/40 text-xs font-bold space-y-2">
                    <p className="opacity-60">متاجر قريبة مقترحة بناءً على رادار الكوكب:</p>
                    {nearbyStores.map(store => (
                      <div key={store.name} className="flex justify-between items-center p-2 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                        <div>
                          <p className="text-[10px]">{store.name}</p>
                          <p className="text-[8px] opacity-40">{store.location} • {store.distance}</p>
                        </div>
                        <div className="flex gap-1">
                          {store.items.map(i => <span key={i} className="text-[6px] px-1 bg-blue-500/20 rounded">{i}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-[var(--color-bg-card)] border border-blue-500/20 space-y-2 text-[var(--color-text-primary)]">
                    <p className="text-[10px] font-bold">
                      {isFahad 
                        ? `هل تود إرسال تنبيه لـ ${partnerName} لسؤالها عن أي نواقص؟` 
                        : `تم رصد فهد في منطقة التسوق. هل تودين إرسال قائمة النواقص له؟`}
                    </p>
                    <button 
                      onClick={() => {
                        addNotification({
                          title: 'تنبيه رادار التسوق! 🛒',
                          content: `${isFahad ? 'فهد' : 'بشرى'} يطلب منك التحقق من قائمة النواقص لأنك في منطقة التسوق.`,
                          type: 'routine'
                        });
                      }}
                      className="w-full py-2 rounded-lg bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center gap-2"
                    >
                      <BellRing size={14} /> إرسال تنبيه ذكي
                    </button>
                  </div>
                </div>
                {lowStockItems.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold opacity-50 uppercase">نواقص مقترحة:</p>
                    <div className="flex flex-wrap gap-1">
                      {lowStockItems.map(item => (
                        <span key={item.id} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[8px] font-bold">
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 gap-6">
          {kanbanColumns.map(col => (
            <div key={col.id} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="text-sm font-black">{col.label}</h3>
                </div>
                <span className="text-[10px] font-bold opacity-40">
                  {filteredItems.filter(i => i.kanbanStatus === col.id).length} عناصر
                </span>
              </div>
              
              <div className="space-y-3 min-h-[100px] p-2 rounded-2xl bg-[var(--color-bg-surface)]/30 border border-[var(--color-border)]/20">
                {filteredItems.filter(i => i.kanbanStatus === col.id).map(item => (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    className="glass-card p-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${col.color}-500/10 text-${col.color}-500`}>
                        <Package size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{item.name}</div>
                        <div className="text-[8px] opacity-50">المخزون: {item.currentStock}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {col.id !== 'needed' && (
                        <button 
                          onClick={() => updateKanbanStatus(item.id, col.id === 'purchased' ? 'in-cart' : 'needed')}
                          className="p-1.5 rounded-md hover:bg-white/10"
                        >
                          <ChevronDown size={14} className="rotate-90" />
                        </button>
                      )}
                      {col.id !== 'purchased' && (
                        <button 
                          onClick={() => updateKanbanStatus(item.id, col.id === 'needed' ? 'in-cart' : 'purchased')}
                          className="p-1.5 rounded-md hover:bg-white/10"
                        >
                          <ChevronDown size={14} className="-rotate-90" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                {filteredItems.filter(i => i.kanbanStatus === col.id).length === 0 && (
                  <div className="py-8 text-center opacity-20 text-[10px] font-bold">لا توجد عناصر</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* List View (Original) */}
          {filteredItems.map(item => (
            <div key={item.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.currentStock <= item.minStock ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  <Package size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold">{item.name}</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)]">
                    الاستهلاك: كل {item.consumptionFrequencyDays} يوم
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black">{item.currentStock}</div>
                  <div className="text-[10px] opacity-50">الحد الأدنى: {item.minStock}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateInventoryStock(item.id, Math.max(0, item.currentStock - 1))}
                    className="p-2 rounded-lg bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:text-rose-500 transition-colors"
                  >
                    <RefreshCw size={16} className="rotate-180" />
                  </button>
                  <button 
                    onClick={() => updateInventoryStock(item.id, item.currentStock + 1)}
                    className="p-2 rounded-lg bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <div className="modal-backdrop">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black">إضافة سلعة</h3>
                  <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">تحديث قاعدة بيانات المخزون</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-8">
                <ModernInput 
                  label="اسم السلعة" required
                  value={newItem.name}
                  onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <ModernInput 
                    label="المخزون الحالي" type="number" required
                    value={newItem.currentStock}
                    onChange={e => setNewItem(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
                  />
                  <ModernInput 
                    label="الحد الأدنى" type="number" required
                    value={newItem.minStock}
                    onChange={e => setNewItem(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <ModernInput 
                    label="دورة الاستهلاك (أيام)" type="number" required
                    value={newItem.consumptionFrequencyDays}
                    onChange={e => setNewItem(prev => ({ ...prev, consumptionFrequencyDays: Number(e.target.value) }))}
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase opacity-40">الفئة</label>
                    <select 
                      value={newItem.category} 
                      onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full h-12 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-4 text-xs outline-none text-[var(--color-text-primary)]"
                    >
                      <option value="التموينات" className="text-black">التموينات</option>
                      <option value="المنظفات" className="text-black">المنظفات</option>
                      <option value="الأدوية" className="text-black">الأدوية</option>
                      <option value="أخرى" className="text-black">أخرى</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-5 text-base shadow-2xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] transition-transform">
                  حفظ في المخزون
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
