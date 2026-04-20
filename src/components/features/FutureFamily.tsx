import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Baby, Wallet, Heart, Sparkles, Plus, X, GraduationCap, ClipboardList, TrendingUp, Image as ImageIcon, MessageCircle, Share2 } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';

export const FutureFamily: React.FC = () => {
  const { family, updateFamily, currentUser, addChildReport, addChildMilestone } = usePlanet();
  const [showAddName, setShowAddName] = useState(false);
  const [showEditVision, setShowEditVision] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newName, setNewName] = useState('');
  const [newVision, setNewVision] = useState(family.notes || '');
  const [newReport, setNewReport] = useState({ childName: '', subject: '', status: 'good' as any, notes: '' });
  const [newMilestone, setNewMilestone] = useState({ childId: 'E' as any, title: '', content: '', imageUrl: '' });

  const isBushra = currentUser === 'B'; // Bushra is the primary education manager

  const handleAddName = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      updateFamily({ names: [...family.names, newName.trim()] });
      setNewName('');
      setShowAddName(false);
    }
  };

  const handleUpdateVision = (e: React.FormEvent) => {
    e.preventDefault();
    updateFamily({ notes: newVision });
    setShowEditVision(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    addChildMilestone(newMilestone);
    setShowAddMilestone(false);
    setNewMilestone({ childId: 'E', title: '', content: '', imageUrl: '' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black">مشروع العائلة</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">تخطيط هادئ لمستقبل يملؤه الحب</p>
      </div>

      {/* Kids Milestone Timeline - Instagram Style */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">سجل اللحظات السعيدة</h3>
          <button 
            onClick={() => setShowAddMilestone(true)}
            className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
          {family.milestones?.map(milestone => (
            <motion.div 
              key={milestone.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-shrink-0 w-72 glass-card overflow-hidden flex flex-col"
            >
              <div className="relative h-72 bg-black/20">
                {milestone.imageUrl ? (
                  <img src={milestone.imageUrl} alt={milestone.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[8px] font-black text-white uppercase tracking-widest">
                  {milestone.childId === 'E' ? 'إياد' : milestone.childId === 'W' ? 'وسام' : 'آسر'}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-black">{milestone.title}</h4>
                  <span className="text-[8px] opacity-40">{new Date(milestone.timestamp).toLocaleDateString('ar-EG')}</span>
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed line-clamp-2">{milestone.content}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {['F', 'B'].map(uid => (
                      <div key={uid} className="w-6 h-6 rounded-full border-2 border-[var(--color-bg-card)] overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${uid === 'F' ? 'Fahad' : 'Bushra'}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 text-[var(--color-text-secondary)]">
                    <Heart size={16} className="hover:text-rose-500 cursor-pointer transition-colors" />
                    <MessageCircle size={16} className="hover:text-blue-500 cursor-pointer transition-colors" />
                    <Share2 size={16} className="hover:text-emerald-500 cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {(!family.milestones || family.milestones.length === 0) && (
            <div className="w-full py-12 text-center glass-card opacity-40 text-xs italic">لا توجد لحظات مسجلة بعد. ابدأ بتوثيق ذكرياتكم.</div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Baby size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">الأسماء المفضلة</h3>
              <p className="text-xs opacity-60">قائمة الأسماء التي اتفقنا عليها</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {family.names.length === 0 && (
              <p className="text-xs opacity-40 italic">لا توجد أسماء مضافة بعد...</p>
            )}
            {family.names.map((name, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-[var(--color-bg-surface)] text-sm font-bold border border-[var(--color-border)]">
                {name}
              </span>
            ))}
            <button 
              onClick={() => setShowAddName(true)}
              className="px-4 py-2 rounded-xl border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-bold"
            >
              + إضافة اسم
            </button>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">صندوق التعليم</h3>
                <p className="text-xs opacity-60">المدخرات المخصصة للمستقبل</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black">${family.educationSavings.toLocaleString()}</div>
              <div className="text-[10px] opacity-50 uppercase">رصيد تراكمي</div>
            </div>
          </div>
          <div className="h-2 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: family.educationSavings > 0 ? '45%' : '0%' }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">رؤيتنا التربوية</h3>
              <p className="text-xs opacity-60">مبادئ نود غرسها في أطفالنا</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-bg-surface)]/50 text-sm italic opacity-80 leading-relaxed">
            "{family.notes || 'لم يتم تدوين ملاحظات بعد. ابدأ بكتابة رؤيتكم المشتركة هنا.'}"
          </div>
          <button 
            onClick={() => setShowEditVision(true)}
            className="w-full py-3 rounded-xl border border-[var(--color-border)] text-xs font-bold opacity-60"
          >
            تعديل الرؤية
          </button>
        </div>

        {/* Education Follow-up Board */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">لوحة متابعة الأبناء</h3>
                <p className="text-xs opacity-60">إدارة التعليم (صلاحية أساسية لبشرى)</p>
              </div>
            </div>
            {isBushra && (
              <button 
                onClick={() => setShowAddReport(true)}
                className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20"
              >
                <Plus size={18} />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {family.childrenReports?.map(report => (
              <div key={report.id} className="p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black">{report.childName}</span>
                    <span className="text-[10px] opacity-40">• {report.subject}</span>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                    report.status === 'excellent' ? 'bg-green-500/10 text-green-500' : 
                    report.status === 'good' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {report.status === 'excellent' ? 'ممتاز' : report.status === 'good' ? 'جيد' : 'يحتاج تحسين'}
                  </span>
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">{report.notes}</p>
                <div className="text-[8px] opacity-40 text-left">آخر تحديث: {new Date(report.lastUpdated).toLocaleDateString('ar-EG')}</div>
              </div>
            ))}
            {(!family.childrenReports || family.childrenReports.length === 0) && (
              <div className="text-center py-6 opacity-40 text-xs italic">لا توجد تقارير تعليمية بعد...</div>
            )}
          </div>

          {!isBushra && (
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3 items-center">
              <ClipboardList size={18} className="text-blue-500" />
              <p className="text-[10px] text-blue-600/70">
                أنت تشاهد "تقارير موجزة". بشرى (مهندسة الأجيال) هي المسؤولة عن تحديث هذه اللوحة.
              </p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddReport(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-sm p-8 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">إضافة تقرير تعليمي</h3>
                <button onClick={() => setShowAddReport(false)}><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <ModernInput 
                  label="اسم الطفل" 
                  value={newReport.childName}
                  onChange={e => setNewReport(prev => ({ ...prev, childName: e.target.value }))}
                />
                <ModernInput 
                  label="المادة / النشاط" 
                  value={newReport.subject}
                  onChange={e => setNewReport(prev => ({ ...prev, subject: e.target.value }))}
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">المستوى</label>
                  <select 
                    value={newReport.status}
                    onChange={e => setNewReport(prev => ({ ...prev, status: e.target.value as any }))}
                    className="input-field text-xs py-3"
                  >
                    <option value="excellent">ممتاز</option>
                    <option value="good">جيد</option>
                    <option value="needs_improvement">يحتاج تحسين</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">ملاحظات</label>
                  <textarea 
                    value={newReport.notes}
                    onChange={e => setNewReport(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field text-xs h-20 py-3 resize-none"
                  />
                </div>
                <button 
                  onClick={() => { addChildReport(newReport); setShowAddReport(false); }}
                  className="btn-primary w-full py-4"
                >
                  حفظ التقرير
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {showAddName && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddName(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-sm p-8 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">إضافة اسم</h3>
                <button onClick={() => setShowAddName(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddName} className="space-y-4">
                <ModernInput 
                  label="الاسم المقترح" required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
                <button type="submit" className="btn-primary w-full py-4">حفظ الاسم</button>
              </form>
            </motion.div>
          </div>
        )}

        {showEditVision && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEditVision(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-sm p-8 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">تعديل الرؤية التربوية</h3>
                <button onClick={() => setShowEditVision(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateVision} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">رؤيتنا المشتركة</label>
                  <textarea 
                    required
                    value={newVision}
                    onChange={e => setNewVision(e.target.value)}
                    className="input-field min-h-[150px] py-3"
                    placeholder="اكتبوا هنا المبادئ والقيم التي تودون غرسها..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-4">حفظ الرؤية</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
