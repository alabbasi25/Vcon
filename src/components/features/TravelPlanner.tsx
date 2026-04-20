import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Wallet, 
  CheckSquare, 
  Square,
  Plus,
  Ticket,
  X
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';

export const TravelPlanner: React.FC = () => {
  const { travel, addTravelPlan, updateTravelPackingList, addPackingItem } = usePlanet();
  const [showAdd, setShowAdd] = useState(false);
  const [newPlan, setNewPlan] = useState({ destination: '', budget: 0, startDate: '', endDate: '' });
  const [newItem, setNewItem] = useState<{ [key: string]: string }>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addTravelPlan({
      destination: newPlan.destination,
      budget: newPlan.budget,
      startDate: new Date(newPlan.startDate).getTime(),
      endDate: new Date(newPlan.endDate).getTime(),
      tickets: [],
      packingList: []
    });
    setShowAdd(false);
    setNewPlan({ destination: '', budget: 0, startDate: '', endDate: '' });
  };

  const handleAddItem = (planId: string) => {
    if (!newItem[planId]) return;
    addPackingItem(planId, newItem[planId]);
    setNewItem(prev => ({ ...prev, [planId]: '' }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">مخطط الرحلات</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">إدارة لوجستيات السفر والخرائط في مكان واحد</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      {travel.length > 0 ? (
        travel.map(plan => (
          <div key={plan.id} className="space-y-6">
            {/* Trip Header */}
            <div className="glass-card p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Plane size={120} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold opacity-80 uppercase tracking-widest">
                  <MapPin size={14} /> {plan.destination}
                </div>
                <div className="text-4xl font-black">رحلة الأحلام</div>
                <div className="flex items-center gap-4 text-xs font-bold opacity-70">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(plan.startDate).toLocaleDateString('ar-EG')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Wallet size={14} /> ميزانية: ${plan.budget}
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5 space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] flex items-center gap-2">
                  <Ticket size={14} /> التذاكر والحجوزات
                </h3>
                <div className="space-y-2">
                  {plan.tickets.length === 0 && <p className="text-[10px] opacity-40 italic">لا توجد تذاكر مضافة...</p>}
                  {plan.tickets.map((t, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[var(--color-bg-surface)] text-[10px] font-bold flex items-center justify-between">
                      <span>{t}</span>
                      <Plus size={12} className="opacity-50" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-card p-5 space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] flex items-center gap-2">
                  <CheckSquare size={14} /> قائمة التعبئة
                </h3>
                <div className="space-y-3">
                  {plan.packingList.length === 0 && <p className="text-[10px] opacity-40 italic text-center py-4">لا توجد أغراض مضافة...</p>}
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {plan.packingList.map((item, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => updateTravelPackingList(plan.id, item.item, !item.packed)}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${item.packed ? 'bg-green-500/10 text-green-500' : 'bg-white/5 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center gap-3">
                          {item.packed ? <CheckSquare size={16} /> : <Square size={16} className="opacity-30" />}
                          <span className={`text-[10px] font-bold ${item.packed ? 'line-through opacity-70' : ''}`}>{item.item}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t border-white/5 flex gap-2">
                    <input 
                      type="text"
                      placeholder="إضافة غرض..."
                      value={newItem[plan.id] || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, [plan.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem(plan.id)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] outline-none"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddItem(plan.id)}
                      className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg"
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="glass-card p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center mx-auto text-[var(--color-text-secondary)]">
            <Plane size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">لا توجد رحلات مجدولة</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              ابدأوا بالتخطيط لرحلتكما القادمة. سنساعدكما في تنظيم التذاكر، الميزانية، وقائمة الاحتياجات.
            </p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary w-full">خطط لرحلتك الأولى</button>
        </div>
      )}

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
                <h3 className="text-xl font-black">تخطيط رحلة جديدة</h3>
                <button onClick={() => setShowAdd(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <ModernInput 
                  label="الوجهة" required
                  value={newPlan.destination}
                  onChange={e => setNewPlan(prev => ({ ...prev, destination: e.target.value }))}
                  icon={<MapPin size={18} />}
                />
                <ModernInput 
                  label="الميزانية التقديرية" type="number" required
                  value={newPlan.budget}
                  onChange={e => setNewPlan(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  icon={<Wallet size={18} />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold opacity-50 uppercase">تاريخ البدء</label>
                    <input 
                      type="date" required
                      value={newPlan.startDate}
                      onChange={e => setNewPlan(prev => ({ ...prev, startDate: e.target.value }))}
                      className="input-field text-xs py-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold opacity-50 uppercase">تاريخ العودة</label>
                    <input 
                      type="date" required
                      value={newPlan.endDate}
                      onChange={e => setNewPlan(prev => ({ ...prev, endDate: e.target.value }))}
                      className="input-field text-xs py-3"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-4">بدء التخطيط</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
