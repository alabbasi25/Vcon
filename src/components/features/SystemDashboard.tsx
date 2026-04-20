import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  ShieldCheck, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap,
  Moon,
  Flame,
  Power,
  Radar
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { RelationshipRadar } from '../ui/RelationshipRadar';
import { KokabCard } from '../ui/KokabCard';

const THEMES = [
  { id: 'default', name: 'منتصف الليل', class: 'bg-[#0f172a]', mode: 'غامق' },
  { id: 'emerald', name: 'الزمرد العميق', class: 'bg-[#022c22]', mode: 'غامق' },
  { id: 'gold', name: 'ذهب الصحراء', class: 'bg-[#fffbeb]', mode: 'فاتح' },
  { id: 'rose', name: 'زهور الربيع', class: 'bg-[#fff1f2]', mode: 'فاتح' },
];

export const SystemDashboard: React.FC = () => {
  const { planetHealth, tasks, transactions, vitals, currentUser, inventory, calendar, emergencyMode, toggleEmergencyMode, theme, setTheme } = usePlanet();

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
  
  const partner = currentUser === 'F' ? 'B' : 'F';
  const partnerVitals = vitals[partner];

  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const budget = 15000;
  const budgetPercent = Math.max(0, Math.min(100, ((budget - totalSpent) / budget) * 100));

  const inventoryPercent = inventory.length > 0 
    ? Math.round((inventory.filter(i => i.currentStock > i.minStock).length / inventory.length) * 100)
    : 100;

  const nextEvent = calendar
    .filter(e => e.startTime > Date.now())
    .sort((a, b) => a.startTime - b.startTime)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Theme Selection */}
      <section className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-black">غلاف الكوكب (الثيمات)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 items-center ${theme === t.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 scale-105 shadow-xl' : 'border-white/5 hover:bg-white/5'}`}
            >
              <div className={`w-8 h-8 rounded-full ${t.class} border border-white/20`} />
              <div className="text-center">
                <div className="text-[10px] font-black">{t.name}</div>
                <div className="text-[8px] opacity-40 uppercase tracking-tighter">{t.mode}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Crisis & Rest Toggle (Emergency Mode) */}
      <section className={`glass-card p-6 border-2 transition-all duration-500 ${emergencyMode ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_30px_rgba(244,63,94,0.2)]' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${emergencyMode ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-500'}`}>
              {emergencyMode ? <Flame size={24} /> : <Moon size={24} />}
            </div>
            <div>
              <h3 className="text-sm font-black">{emergencyMode ? 'وضع الأزمة نشط' : 'وضع الراحة والهدوء'}</h3>
              <p className="text-[10px] opacity-60">{emergencyMode ? 'تم تجميد كافة المهام غير الضرورية' : 'النظام يعمل بكفاءة طبيعية'}</p>
            </div>
          </div>
          <button 
            onClick={toggleEmergencyMode}
            className={`w-14 h-8 rounded-full relative transition-colors ${emergencyMode ? 'bg-rose-500' : 'bg-slate-700'}`}
          >
            <motion.div 
              animate={{ x: emergencyMode ? 24 : 4 }}
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
            >
              <Power size={12} className={emergencyMode ? 'text-rose-500' : 'text-slate-400'} />
            </motion.div>
          </button>
        </div>
      </section>

      {/* Radar Analysis */}
      <section className="glass-card p-6 flex flex-col items-center gap-4">
        <div className="w-full flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Radar size={18} className="text-[var(--color-primary)]" />
            <h3 className="text-sm font-black">بصمة التوازن الكوكبي</h3>
          </div>
          <span className="text-[10px] font-mono opacity-40">D3_ENGINE_ACTIVE</span>
        </div>
        <RelationshipRadar />
        <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-[10px] opacity-60 leading-relaxed italic">
            "المسافة الحقيقية تقاس بالتوازن، لا بالكيلومترات."
          </p>
        </div>
      </section>

      {/* System Health Overview */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6 border-l-4 border-l-[var(--color-primary)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">كفاءة النظام</span>
            <ShieldCheck size={14} className="text-[var(--color-primary)]" />
          </div>
          <div className="text-3xl font-black">{planetHealth.score}%</div>
          <div className="mt-2 h-1 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-primary)]" style={{ width: `${planetHealth.score}%` }} />
          </div>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-l-[var(--color-accent)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">المهام المعلقة</span>
            <Clock size={14} className="text-[var(--color-accent)]" />
          </div>
          <div className="text-3xl font-black">{pendingTasks.length}</div>
          <div className="text-[10px] font-bold text-[var(--color-text-secondary)] mt-1">
            {urgentTasks.length} مهام عالية الأولوية
          </div>
        </div>
      </section>

      {/* Real-time Logistics Metrics */}
      <section className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]/30 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Activity size={14} /> مؤشرات الحالة التشغيلية
          </h3>
          <span className="text-[10px] font-mono opacity-50">SYNC_OK: 200</span>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6">
          <MetricRow 
            label="ميزانية الشهر المتبقية" 
            value={`$${(budget - totalSpent).toLocaleString()}`} 
            percent={budgetPercent}
            color="var(--color-primary)"
          />
          <MetricRow 
            label={`صحة ${partner === 'F' ? 'فهد' : 'بشرى'}`} 
            value={`${partnerVitals.sleepQuality}%`} 
            percent={partnerVitals.sleepQuality}
            color={partnerVitals.sleepQuality < 50 ? '#ef4444' : '#10b981'}
          />
          <MetricRow 
            label="اكتمال مخزون المنزل" 
            value={`${inventoryPercent}%`} 
            percent={inventoryPercent}
            color="#3b82f6"
          />
        </div>
      </section>

      {/* Critical Alerts */}
      {urgentTasks.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-1">تنبيهات حرجة</h3>
          {urgentTasks.map(task => (
            <div key={task.id} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-red-500" />
                <div>
                  <div className="text-sm font-bold">{task.title}</div>
                  <div className="text-[10px] opacity-60">مهمة عاجلة • {task.estimatedMinutes} دقيقة متوقعة</div>
                </div>
              </div>
              <button className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
                <CheckCircle2 size={18} />
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Next Joint Event */}
      {nextEvent && (
        <section className="glass-card p-6 flex items-center justify-between bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
              <Calendar size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">الحدث المشترك القادم</div>
              <div className="text-lg font-black">{nextEvent.title}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                {new Date(nextEvent.startTime).toLocaleDateString('ar-EG')} • {new Date(nextEvent.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          <TrendingUp size={24} className="text-[var(--color-primary)] opacity-30" />
        </section>
      )}
    </motion.div>
  );
};

const MetricRow: React.FC<{ label: string; value: string; percent: number; color: string }> = ({ label, value, percent, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-xs font-bold opacity-80">{label}</span>
      <span className="text-sm font-mono font-bold" style={{ color }}>{value}</span>
    </div>
    <div className="h-1.5 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);
