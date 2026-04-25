import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlanet } from '../../context/KokabContext';
import { 
  Sparkles, Camera, Mic, Edit3, Heart, Target, Calendar, 
  MapPin, Settings, Lock, Eye, Users, RefreshCw, Plus, 
  Trash2, X, ChevronRight, Clock, Box, Wallet
} from 'lucide-react';
import { ModernInput } from '../ui/ModernInput';

import { planFutureOrbit } from '../../services/aiService';

type ActiveTab = 'pulse' | 'orbit' | 'capsule';

export const MemoryEther: React.FC = () => {
  const { 
    currentUser, 
    memoryEther, 
    addMemoryPulse, updateMemoryPulse, deleteMemoryPulse,
    addFutureOrbit, updateFutureOrbit, deleteFutureOrbit,
    addCapsule, updateCapsule, deleteCapsule,
    updateAISettings, updateMemoryEtherCategories
  } = usePlanet();

  const [activeTab, setActiveTab] = useState<ActiveTab>('pulse');
  const [showSettings, setShowSettings] = useState(false);

  // Filter out deleted items
  const activePulses = memoryEther.pulses.filter(p => !p.isDeleted);
  const activeOrbits = memoryEther.orbits.filter(o => !o.isDeleted);
  const activeCapsules = memoryEther.capsules.filter(c => !c.isDeleted);

  // New Pulse State
  const [newPulse, setNewPulse] = useState({
    content: '',
    category: memoryEther.pulseCategories?.[0] || 'صباحية',
    privacy: 'private' as const,
    notification: 'silent' as const
  });

  // Orbit Form State
  const [showOrbitForm, setShowOrbitForm] = useState(false);
  const [newOrbit, setNewOrbit] = useState({
    title: '',
    category: memoryEther.orbitCategories?.[0] || 'مواعد غراميه',
    budgetLimit: 500,
    date: '',
    activities: ''
  });

  // Capsule Form State
  const [showCapsuleForm, setShowCapsuleForm] = useState(false);
  const [newCapsule, setNewCapsule] = useState({
    title: '',
    category: memoryEther.capsuleCategories?.[0] || 'رسالة للمستقبل',
    content: '',
    savingsObjective: 0,
    openDate: ''
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, type: 'pulse' | 'orbit' | 'capsule' } | null>(null);

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    if (deleteConfirmation.type === 'pulse') deleteMemoryPulse(deleteConfirmation.id);
    else if (deleteConfirmation.type === 'orbit') deleteFutureOrbit(deleteConfirmation.id);
    else if (deleteConfirmation.type === 'capsule') deleteCapsule(deleteConfirmation.id);
    setDeleteConfirmation(null);
  };

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreatePulse = () => {
    if (!newPulse.content) return;
    addMemoryPulse(newPulse);
    setNewPulse({ ...newPulse, content: '', privacy: 'private', notification: 'silent' });
  };

  const handleCreateOrbit = () => {
    if (!newOrbit.title || !newOrbit.date) return;
    addFutureOrbit({
      title: newOrbit.title,
      category: newOrbit.category,
      budgetLimit: Number(newOrbit.budgetLimit),
      date: new Date(newOrbit.date).getTime(),
      activities: newOrbit.activities ? [newOrbit.activities] : [],
      aiControlled: false
    });
    setNewOrbit({ title: '', category: memoryEther.orbitCategories?.[0] || 'مواعد غراميه', budgetLimit: 500, date: '', activities: '' });
    setShowOrbitForm(false);
  };

  const handleCreateCapsule = () => {
    if (!newCapsule.title || !newCapsule.openDate) return;
    addCapsule({
      title: newCapsule.title,
      content: newCapsule.content,
      category: newCapsule.category,
      savingsObjective: Number(newCapsule.savingsObjective),
      openDate: new Date(newCapsule.openDate).getTime(),
      savedAmount: 0
    });
    setNewCapsule({ title: '', category: memoryEther.capsuleCategories?.[0] || 'رسالة للمستقبل', content: '', savingsObjective: 0, openDate: '' });
    setShowCapsuleForm(false);
  };

  const [isGeneratingOrbit, setIsGeneratingOrbit] = useState(false);

  const handleGenerateOrbit = async () => {
    setIsGeneratingOrbit(true);
    const category = 'موعد رومانسي خاص';
    const budget = memoryEther.aiSettings.financialBoldness === 'luxury' ? 2500 : 300;
    const plan = await planFutureOrbit(memoryEther.aiSettings, category, budget);
    
    addFutureOrbit({
      title: 'أفق جديد مقترح',
      category: 'special',
      budgetLimit: budget,
      date: Date.now() + 86400000 * Math.floor(Math.random() * 14 + 1),
      aiControlled: true,
      activities: [plan]
    });
    setIsGeneratingOrbit(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const key = `${activeTab}Categories` as 'pulse' | 'orbit' | 'capsule';
    updateMemoryEtherCategories(activeTab, [...(memoryEther[key as keyof typeof memoryEther] as string[]), newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat: string) => {
    const key = `${activeTab}Categories` as 'pulse' | 'orbit' | 'capsule';
    updateMemoryEtherCategories(activeTab, (memoryEther[key as keyof typeof memoryEther] as string[]).filter(c => c !== cat));
  };


  const renderPrivacyIcon = (privacy: string) => {
    switch(privacy) {
      case 'private': return <Lock size={12} />;
      case 'view_only': return <Eye size={12} />;
      case 'collaborative': return <Users size={12} />;
      default: return <Lock size={12} />;
    }
  };

  const renderContextualSettings = () => {
    const categories = memoryEther[`${activeTab}Categories` as keyof typeof memoryEther] as string[] || [];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Settings size={20} className={activeTab === 'pulse' ? 'text-purple-400' : activeTab === 'orbit' ? 'text-blue-400' : 'text-amber-400'} />
            إعدادات {activeTab === 'pulse' ? 'النبض اليومي' : activeTab === 'orbit' ? 'آفاق الغد' : 'الكبسولة'}
          </h3>
          <button onClick={() => setShowSettings(false)} className="opacity-50 hover:opacity-100"><X size={20} /></button>
        </div>

        {activeTab === 'orbit' && (
          <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
            <h4 className="text-sm font-bold text-blue-400">إعدادات العقل المدبر (AI Planner)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold opacity-60 uppercase mb-2 block">أسلوب الرد</label>
                <select 
                  value={memoryEther.aiSettings.responseStyle}
                  onChange={(e) => updateAISettings({ responseStyle: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                >
                  <option value="romantic" className="text-black">شاعري ورومانسي</option>
                  <option value="practical" className="text-black">عملي وتقني</option>
                  <option value="funny" className="text-black">مرح وفكاهي</option>
                  <option value="calm" className="text-black">هادئ وداعم</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-60 uppercase mb-2 block">الجرأة المالية للاقتراحات</label>
                <select 
                  value={memoryEther.aiSettings.financialBoldness}
                  onChange={(e) => updateAISettings({ financialBoldness: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                >
                  <option value="economic" className="text-black">اقتصادية ومدروسة</option>
                  <option value="luxury" className="text-black">فاخرة وجريئة</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-60 uppercase mb-2 block">سلوك الـ AI</label>
                <select 
                  value={memoryEther.aiSettings.proactiveness}
                  onChange={(e) => updateAISettings({ proactiveness: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none"
                >
                  <option value="proactive" className="text-black">يبادر باقتراح مواعيد</option>
                  <option value="reactive" className="text-black">ينتظر الطلب (هادئ)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-60 uppercase mb-2 block">الموقع المفضل</label>
                <ModernInput 
                  value={memoryEther.aiSettings.location}
                  onChange={(e) => updateAISettings({ location: e.target.value })}
                  placeholder="مثال: الواجهة البحرية"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold opacity-60 uppercase mb-2 block">تفضيلات إضافية مخصصة</label>
                <textarea 
                  value={memoryEther.aiSettings.userPreferences}
                  onChange={(e) => updateAISettings({ userPreferences: e.target.value })}
                  placeholder="مثال: نفضل الأماكن الهادئة، نحب القهوة المختصة..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none resize-none h-20"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h4 className={`text-sm font-bold ${activeTab === 'pulse' ? 'text-purple-400' : activeTab === 'orbit' ? 'text-blue-400' : 'text-amber-400'}`}>إدارة التصنيفات المخصصة</h4>
          <div className="flex gap-2">
            <ModernInput 
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="كتابة تصنيف جديد..."
            />
            <button onClick={handleAddCategory} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors border border-white/5">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map(cat => (
              <div key={cat} className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 shadow-sm">
                <span>{cat}</span>
                <button onClick={() => handleDeleteCategory(cat)} className="text-rose-400 hover:text-white hover:bg-rose-500/80 rounded-full p-0.5 ml-1 transition-colors">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Sparkles className="text-purple-400" />
            أثير الذكريات
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)]">سجل اللحظات، خطط للمستقبل، واخبئ الهدايا</p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showSettings ? (activeTab === 'pulse' ? 'bg-purple-500' : activeTab === 'orbit' ? 'bg-blue-500' : 'bg-amber-500') + ' text-white' : 'bg-white/5 border border-white/10 text-white/50'}`}>
          <Settings size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={`glass-card p-6 border-2 ${activeTab === 'pulse' ? 'border-purple-500/30 bg-purple-500/5' : activeTab === 'orbit' ? 'border-blue-500/30 bg-blue-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
              {renderContextualSettings()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex p-1 bg-white/5 rounded-2xl w-full border border-white/10">
        <button 
          onClick={() => { setActiveTab('pulse'); setShowSettings(false); }} 
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${activeTab === 'pulse' ? 'bg-purple-500 text-white shadow-lg' : 'opacity-50'}`}
        >
          <Heart size={16} className="mb-1" />
          <span className="text-[10px] font-black uppercase">النبض اليومي</span>
        </button>
        <button 
          onClick={() => { setActiveTab('orbit'); setShowSettings(false); }} 
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${activeTab === 'orbit' ? 'bg-blue-500 text-white shadow-lg' : 'opacity-50'}`}
        >
          <Target size={16} className="mb-1" />
          <span className="text-[10px] font-black uppercase">آفاق الغد</span>
        </button>
        <button 
          onClick={() => { setActiveTab('capsule'); setShowSettings(false); }} 
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${activeTab === 'capsule' ? 'bg-amber-500 text-white shadow-lg' : 'opacity-50'}`}
        >
          <Box size={16} className="mb-1" />
          <span className="text-[10px] font-black uppercase">الكبسولة</span>
        </button>
      </div>

      {/* Tab Content: Daily Pulse */}
      {activeTab === 'pulse' && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {/* Create Pulse Card */}
          <div className="glass-card p-6 border-purple-500/20 space-y-4 relative overflow-hidden backdrop-blur-xl">
            <textarea 
              value={newPulse.content}
              onChange={e => setNewPulse({ ...newPulse, content: e.target.value })}
              placeholder="اكتب لحظتك أو خاطرتك الآن..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium outline-none resize-none h-24 placeholder:text-white/20 focus:border-purple-500/50 transition-colors"
            />
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/20 transition-all"><Camera size={14} /></button>
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/20 transition-all"><Mic size={14} /></button>
                <select 
                  value={newPulse.category} 
                  onChange={e => setNewPulse(p => ({ ...p, category: e.target.value }))}
                  className="h-8 bg-white/10 border border-transparent rounded-full px-3 text-[10px] font-bold outline-none appearance-none hover:bg-white/20 transition-all"
                >
                  {memoryEther.pulseCategories.map(cat => (
                    <option key={cat} value={cat} className="text-black">{cat}</option>
                  ))}
                </select>
                <select 
                  value={newPulse.privacy} 
                  onChange={e => setNewPulse(p => ({ ...p, privacy: e.target.value as any }))}
                  className="w-24 h-8 bg-white/10 border border-transparent rounded-full px-2 text-[10px] font-bold outline-none appearance-none hover:bg-white/20 transition-all"
                >
                  <option value="private" className="text-black">🔒 خاص</option>
                  <option value="view_only" className="text-black">👁️ للعرض فقط</option>
                  <option value="collaborative" className="text-black">🤝 مشاركة تامة</option>
                </select>
                <select 
                  value={newPulse.notification} 
                  onChange={e => setNewPulse(p => ({ ...p, notification: e.target.value as any }))}
                  className="h-8 bg-white/10 border border-transparent rounded-full px-3 text-[10px] font-bold outline-none appearance-none hover:bg-white/20 transition-all"
                >
                  <option value="silent" className="text-black">صامت 🔕</option>
                  <option value="active" className="text-black">تنبيه 🔔</option>
                </select>
              </div>
              <button 
                onClick={handleCreatePulse}
                disabled={!newPulse.content.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold rounded-full text-xs shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                حفظ النبض
              </button>
            </div>
          </div>

          {/* Pulse Timeline */}
          <div className="relative border-r-2 border-white/10 pr-4 space-y-6 pb-6 mt-8">
            {activePulses.sort((a,b) => b.createdAt - a.createdAt).map((p, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={p.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -right-[23px] top-4 w-4 h-4 rounded-full bg-[var(--color-bg-default)] border-2 border-purple-500 z-10 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                <div className="glass-card p-5 space-y-3 border-r-2 border-r-purple-500 rounded-r-none hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-[10px] border border-purple-500/30">
                        {p.creatorId}
                      </div>
                      <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full">{p.category}</span>
                      <span className="text-[10px] opacity-40 ml-2 font-mono"><Clock size={10} className="inline mr-1" />{new Date(p.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="text-[10px] bg-white/5 px-2 py-1 rounded-md flex items-center gap-1 opacity-70 border border-white/5">
                         {renderPrivacyIcon(p.privacy)} 
                       </div>
                       {p.creatorId === currentUser && (
                         <button onClick={() => setDeleteConfirmation({ id: p.id, type: 'pulse' })} className="text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/10 p-1 rounded transition-colors"><Trash2 size={14} /></button>
                       )}
                    </div>
                  </div>
                  <p className="text-sm border-white/5 pt-1 whitespace-pre-wrap leading-relaxed opacity-90">{p.content}</p>
                </div>
              </motion.div>
            ))}
            {activePulses.length === 0 && (
              <div className="text-center opacity-50 py-10">
                <Heart size={48} className="mx-auto mb-4 opacity-20" />
                <p>لا توجد نبضات يومية مسجلة بعد.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tab Content: Future Orbit */}
      {activeTab === 'orbit' && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowOrbitForm(!showOrbitForm)}
              className="flex-1 py-3 bg-blue-500/10 text-blue-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-all text-sm border border-blue-500/20 shadow-inner inline-flex"
            >
              <Plus size={16} /> مخطط يدوي
            </button>
            <button 
              onClick={handleGenerateOrbit}
              disabled={isGeneratingOrbit}
              className={`flex-1 flex-[1.5] py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl flex items-center justify-center gap-2 transition-all font-bold text-sm shadow-lg shadow-blue-500/20 ${isGeneratingOrbit ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-500/40 hover:-translate-y-0.5'}`}
            >
              {isGeneratingOrbit ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> أُفكر...</>
              ) : (
                <><Sparkles size={16} /> اقتراح AI ذكي</>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showOrbitForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="glass-card p-5 border-blue-500/30 space-y-4">
                  <ModernInput 
                    value={newOrbit.title} 
                    onChange={e => setNewOrbit({...newOrbit, title: e.target.value})}
                    placeholder="عنوان الأفق المقترح (مثال: عشاء العيد)" 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select 
                      value={newOrbit.category} 
                      onChange={e => setNewOrbit({...newOrbit, category: e.target.value})}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-xs font-bold outline-none hover:bg-white/10 transition-colors"
                    >
                      {memoryEther.orbitCategories.map(cat => (
                        <option key={cat} value={cat} className="text-black">{cat}</option>
                      ))}
                    </select>
                    <ModernInput 
                      type="date"
                      value={newOrbit.date}
                      onChange={e => setNewOrbit({...newOrbit, date: e.target.value})}
                    />
                    <div className="col-span-2">
                       <ModernInput 
                         type="number"
                         placeholder="الميزانية المقترحة"
                         value={newOrbit.budgetLimit.toString()}
                         onChange={e => setNewOrbit({...newOrbit, budgetLimit: Number(e.target.value)})}
                       />
                    </div>
                  </div>
                  <textarea 
                    value={newOrbit.activities}
                    onChange={e => setNewOrbit({...newOrbit, activities: e.target.value})}
                    placeholder="تفاصيل الأنشطة..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-medium outline-none resize-none h-20 placeholder:text-white/20"
                  />
                  <button onClick={handleCreateOrbit} className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm hover:bg-blue-400 transition-colors">
                    تثبيت الأفق
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 gap-4">
            {activeOrbits.sort((a,b) => a.date - b.date).map((o, i) => {
               const percentageSpent = Math.min(100, Math.round((o.actualSpent / (o.budgetLimit || 1)) * 100));
               return (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={o.id} className="glass-card p-5 border-blue-500/20 space-y-4 group hover:border-blue-500/40 transition-all hover:shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 shadow-sm">{o.category}</span>
                         {o.aiControlled && <div className="flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20"><Sparkles size={10} className="text-indigo-400" /> AI</div>}
                       </div>
                       <h3 className="font-black text-xl text-white">{o.title || o.category}</h3>
                       <p className="text-xs opacity-60 flex items-center gap-1 mt-1 font-mono"><Calendar size={12} /> {new Date(o.date).toLocaleDateString('ar-SA')}</p>
                    </div>
                    {o.creatorId === currentUser && (
                       <button onClick={() => setDeleteConfirmation({ id: o.id, type: 'orbit' })} className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/20"><Trash2 size={14} /></button>
                    )}
                  </div>

                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Wallet size={16} />
                        <span className="text-sm font-bold">الميزانية المرصودة</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-white">{o.actualSpent}</span>
                        <span className="text-xs opacity-60 mx-1">/</span>
                        <span className="text-sm opacity-80">{o.budgetLimit} ريال</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${percentageSpent > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${percentageSpent}%` }} />
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button 
                        onClick={() => updateFutureOrbit(o.id, { actualSpent: o.actualSpent + 50 })}
                        className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md font-bold transition-colors border border-white/5 w-full text-center hover:text-blue-300"
                      >
                        + 50 ريال (سجل صرف)
                      </button>
                    </div>
                  </div>

                  {o.activities && o.activities.length > 0 && (
                    <div className="text-xs opacity-90 whitespace-pre-wrap leading-relaxed mt-2 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 text-blue-50">
                      {o.activities[0]}
                    </div>
                  )}
                </motion.div>
               );
            })}
            {activeOrbits.length === 0 && (
              <div className="text-center opacity-50 py-10">
                <Target size={48} className="mx-auto mb-4 opacity-20" />
                <p>لا توجد آفاق مستقبلية مخططة بعد.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tab Content: Capsule */}
      {activeTab === 'capsule' && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <button 
            onClick={() => setShowCapsuleForm(!showCapsuleForm)}
            className="w-full py-4 bg-amber-500/10 border-2 border-dashed border-amber-500/40 rounded-2xl text-amber-500 flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all font-black text-sm shadow-inner"
          >
            <Plus size={18} /> دفن كبسولة زمنية جديدة
          </button>

          <AnimatePresence>
            {showCapsuleForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="glass-card p-5 border-amber-500/40 space-y-4">
                  <ModernInput 
                    value={newCapsule.title} 
                    onChange={e => setNewCapsule({...newCapsule, title: e.target.value})}
                    placeholder="موضوع الكبسولة (مثال: رسالة للذكرى العاشرة)" 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select 
                      value={newCapsule.category} 
                      onChange={e => setNewCapsule({...newCapsule, category: e.target.value})}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-xs font-bold outline-none hover:bg-white/10 transition-colors"
                    >
                      {memoryEther.capsuleCategories.map(cat => (
                        <option key={cat} value={cat} className="text-black">{cat}</option>
                      ))}
                    </select>
                    <ModernInput 
                      type="date"
                      value={newCapsule.openDate}
                      onChange={e => setNewCapsule({...newCapsule, openDate: e.target.value})}
                    />
                    <div className="col-span-2">
                       <ModernInput 
                         type="number"
                         placeholder="هدف التوفير للصندوق المخبأ (اختياري)"
                         value={newCapsule.savingsObjective.toString()}
                         onChange={e => setNewCapsule({...newCapsule, savingsObjective: Number(e.target.value)})}
                       />
                    </div>
                  </div>
                  <textarea 
                    value={newCapsule.content}
                    onChange={e => setNewCapsule({...newCapsule, content: e.target.value})}
                    placeholder="المحتوى السري (لن يظهر الشريك حتى موعد الفتح)..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-medium outline-none resize-none h-32 placeholder:text-white/20"
                  />
                  <button onClick={handleCreateCapsule} className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black rounded-xl shadow-lg shadow-amber-500/20 text-sm flex justify-center items-center gap-2 group hover:scale-[1.01] hover:shadow-amber-500/40 transition-all">
                    <Lock size={16} className="group-hover:animate-pulse" /> إغلاق وتشفير الكبسولة
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCapsules.sort((a,b) => a.openDate - b.openDate).map((c, i) => {
               const isUnlocked = Date.now() >= c.openDate;
               const daysLeft = Math.max(0, Math.ceil((c.openDate - Date.now()) / (1000 * 60 * 60 * 24)));
               
               return (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={c.id} className={`glass-card border-x-4 space-y-4 relative overflow-hidden flex flex-col hover:shadow-xl transition-shadow ${isUnlocked ? 'border-amber-400 p-6' : 'border-white/10 p-6 opacity-85'}`}>
                  
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px] flex flex-col items-center justify-center z-10 error-scan-lines">
                       <Lock size={48} className="text-amber-500/80 mb-3 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                       <p className="text-[10px] font-black text-amber-500/80 tracking-widest uppercase mb-1">تشفير زمني قفل</p>
                       <p className="text-3xl font-black text-white">{daysLeft} <span className="text-lg">يوم</span></p>
                       <p className="text-xs text-white/60 mt-3 bg-black/50 px-3 py-1 rounded-full"><Calendar size={12} className="inline mr-1 opacity-50"/>{new Date(c.openDate).toLocaleDateString('ar-SA')}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start relative z-0">
                    <div>
                      <div className="flex gap-2 items-center mb-3">
                        <span className="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full">{c.category}</span>
                        {isUnlocked && <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles size={10} /> مفتوحة</span>}
                      </div>
                      <h3 className="font-black text-xl text-white">{c.title}</h3>
                      {isUnlocked && <p className="text-sm mt-3 opacity-90 leading-relaxed whitespace-pre-wrap p-4 bg-white/5 rounded-xl border border-white/5">{c.content}</p>}
                    </div>
                  </div>
                  
                  {c.savingsObjective > 0 && (
                    <div className="relative z-20 mt-auto border-t border-white/10 pt-4 bg-black/30 -mx-6 -mb-6 px-6 pb-6 shadow-inner">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-amber-500/80">
                          <Wallet size={14} />
                          <span className="text-[10px] uppercase font-bold tracking-widest">صندوق الكبسولة</span>
                        </div>
                        <span className="text-xs font-bold font-mono">{c.savedAmount} <span className="opacity-50">/ {c.savingsObjective}</span></span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500" style={{ width: `${Math.min(100, (c.savedAmount / c.savingsObjective) * 100)}%` }} />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateCapsule(c.id, { savedAmount: c.savedAmount + 100 }) }}
                        className="w-full text-xs bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 py-2.5 rounded-xl font-bold border border-amber-500/20 transition-all hover:scale-[1.01]"
                      >
                        إيداع 100 ريال للصندوق
                      </button>
                    </div>
                  )}
                  
                  {c.creatorId === currentUser && isUnlocked && (
                     <button onClick={() => setDeleteConfirmation({ id: c.id, type: 'capsule' })} className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500/20 self-end mt-4 transition-colors"><Trash2 size={14} /></button>
                  )}
                  {c.creatorId === currentUser && !isUnlocked && (
                     <button onClick={() => setDeleteConfirmation({ id: c.id, type: 'capsule' })} className="absolute top-4 left-4 z-20 text-[10px] text-rose-500/60 hover:text-rose-500 bg-black/60 px-2.5 py-1 rounded-md border border-rose-500/20 backdrop-blur-md transition-colors">حذف التشفير</button>
                  )}
                </motion.div>
               );
            })}
            {activeCapsules.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center opacity-50 py-10">
                <Box size={48} className="mx-auto mb-4 opacity-20" />
                <p>لا توجد كبسولات زمنية مخبأة بعد.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirmation(null)} className="absolute inset-0" />
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-bg-card)] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl relative z-10 text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2">
                <Trash2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">تأكيد الحذف</h3>
                <p className="text-xs opacity-60 leading-relaxed font-medium">هل أنت متأكد من رغبتك في الحذف؟ لا يمكن استرجاع هذا العنصر بمجرد مسحه من أثير الذكريات.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors"
                >
                  إلغاء التدمير
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white font-black text-xs transition-colors"
                >
                  نعم، احذف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
