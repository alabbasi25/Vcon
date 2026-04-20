import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Moon, 
  Footprints, 
  Scale, 
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useKokab } from '../../context/KokabContext';

export const VitalSignsLog: React.FC = () => {
  const { vitals, currentUser, syncFitness, connectFitness } = useKokab();
  
  const myVitals = vitals[currentUser];
  const partner = currentUser === 'F' ? 'B' : 'F';
  const partnerVitals = vitals[partner];

  const lastSyncText = myVitals.lastSync 
    ? `آخر مزامنة: منذ ${Math.floor((Date.now() - myVitals.lastSync) / 60000)} دقيقة`
    : 'لم يتم المزامنة بعد';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-black">سجل الحالة الصحية</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">مزامنة المؤشرات الحيوية والنشاط البدني من أجهزتك</p>
      </div>

      {/* Sync Status */}
      <div className="glass-card p-4 flex items-center justify-between bg-[var(--color-bg-surface)]/30">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${myVitals.googleFitConnected ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
            <RefreshCw size={16} className={myVitals.googleFitConnected ? 'animate-spin-slow' : ''} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest block">
              {myVitals.googleFitConnected ? 'متصل بـ Google Fit' : 'غير متصل'}
            </span>
            <span className="text-[8px] opacity-50">{lastSyncText}</span>
          </div>
        </div>
        
        {myVitals.googleFitConnected ? (
          <button 
            onClick={syncFitness}
            className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider hover:bg-green-500/20 transition-all flex items-center gap-2"
          >
            <RefreshCw size={12} /> تحديث الآن
          </button>
        ) : (
          <button 
            onClick={connectFitness}
            className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[var(--color-primary)]/20"
          >
            ربط الحساب
          </button>
        )}
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <HealthMetricCard 
          icon={<Moon size={20} />} 
          label="جودة النوم" 
          value={`${myVitals.sleepQuality}%`} 
          subValue="٧ ساعات ٢٠ دقيقة"
          color="#8b5cf6"
        />
        <HealthMetricCard 
          icon={<Footprints size={20} />} 
          label="الخطوات" 
          value={myVitals.steps.toLocaleString()} 
          subValue="الهدف: ١٠,٠٠٠"
          color="#10b981"
        />
        <HealthMetricCard 
          icon={<Scale size={20} />} 
          label="الوزن" 
          value={`${myVitals.weight} كجم`} 
          subValue="-٠.٥ كجم هذا الأسبوع"
          color="#3b82f6"
        />
        <HealthMetricCard 
          icon={<Activity size={20} />} 
          label="السعرات (نشاط)" 
          value={myVitals.calories.toLocaleString()} 
          subValue="سعرة حرارية"
          color="#f43f5e"
        />
      </div>

      {/* Partner Health Alert Logic */}
      {partnerVitals.sleepQuality < 50 && (
        <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-4">
          <div className="flex items-center gap-3 text-amber-500">
            <AlertCircle size={24} />
            <h3 className="font-bold">تنبيه: إجهاد الشريك</h3>
          </div>
          <p className="text-xs leading-relaxed text-amber-600/80">
            سجل النظام جودة نوم منخفضة لـ {partner === 'F' ? 'فهد' : 'بشرى'} ({partnerVitals.sleepQuality}%). 
            تم تفعيل "منطق التخفيف" تلقائياً في محرك المهام.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => syncFitness()}
              className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              استلام المهام البدنية <ArrowRight size={14} />
            </button>
          </div>
        </section>
      )}

      {/* Historical Trends */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest px-1">التوجهات الأسبوعية</h3>
        <div className="glass-card p-6 h-40 flex items-end justify-between gap-2">
          {[40, 65, 45, 90, 85, 40, 75].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className={`w-full rounded-t-md ${h < 50 ? 'bg-red-500/40' : 'bg-[var(--color-primary)]/40'}`}
              />
              <span className="text-[8px] font-bold opacity-40">{['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'][i]}</span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

const HealthMetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; subValue: string; color: string }> = ({ icon, label, value, subValue, color }) => (
  <div className="glass-card p-5 space-y-4 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity" style={{ color }}>
      {icon}
    </div>
    <div className="space-y-1">
      <div className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-black" style={{ color }}>{value}</div>
      <div className="text-[10px] opacity-50 font-bold">{subValue}</div>
    </div>
  </div>
);
