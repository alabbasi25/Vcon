import React from 'react';
import { motion } from 'motion/react';
import { Shield, User, Users, Check, X } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';

export const PermissionsManager: React.FC = () => {
  const { permissions, updatePermission, currentUser, profiles, updateNotificationSettings } = usePlanet();

  const togglePermission = (id: string, userId: 'F' | 'B', current: string[]) => {
    const next = current.includes(userId) 
      ? current.filter(u => u !== userId)
      : [...current, userId];
    updatePermission(id, next as any);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black">إدارة الصلاحيات والسيادة</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">توزيع الأدوار والتحكم في الوصول للبيانات</p>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold">إعدادات الإشعارات</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">اختر أنواع التنبيهات التي ترغب في تلقيها</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NotificationToggle 
              label="المهام والمواعيد" 
              active={profiles[currentUser].notificationSettings.tasks}
              onClick={() => updateNotificationSettings({ tasks: !profiles[currentUser].notificationSettings.tasks })}
            />
            <NotificationToggle 
              label="تحديثات الكوكب العامة" 
              active={profiles[currentUser].notificationSettings.updates}
              onClick={() => updateNotificationSettings({ updates: !profiles[currentUser].notificationSettings.updates })}
            />
            <NotificationToggle 
              label="الأذكار والتذكيرات الروحية" 
              active={profiles[currentUser].notificationSettings.athkar}
              onClick={() => updateNotificationSettings({ athkar: !profiles[currentUser].notificationSettings.athkar })}
            />
            <NotificationToggle 
              label="التنبيهات المالية" 
              active={profiles[currentUser].notificationSettings.financial}
              onClick={() => updateNotificationSettings({ financial: !profiles[currentUser].notificationSettings.financial })}
            />
            <NotificationToggle 
              label="التفاعلات الاجتماعية" 
              active={profiles[currentUser].notificationSettings.social}
              onClick={() => updateNotificationSettings({ social: !profiles[currentUser].notificationSettings.social })}
            />
          </div>
        </div>

        {permissions.map(p => (
          <div key={p.id} className="glass-card p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">{p.description}</p>
                </div>
              </div>
              <div className="px-2 py-1 rounded-md bg-[var(--color-bg-surface)] text-[10px] font-bold uppercase opacity-60">
                {p.category}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PermissionToggle 
                label="فهد" 
                active={p.grantedTo.includes('F')} 
                onClick={() => togglePermission(p.id, 'F', p.grantedTo)}
              />
              <PermissionToggle 
                label="بشرى" 
                active={p.grantedTo.includes('B')} 
                onClick={() => togglePermission(p.id, 'B', p.grantedTo)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
          <Shield size={18} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-blue-500">منطق السيادة</h4>
          <p className="text-[10px] leading-relaxed text-blue-600/70">
            يمكن لأي طرف سحب صلاحية معينة من الطرف الآخر في أي وقت. هذا يضمن التوازن الرقمي والاحترام المتبادل للخصوصية والمسؤوليات.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const PermissionToggle: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${active ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30 text-[var(--color-primary)]' : 'bg-[var(--color-bg-surface)] border-[var(--color-border)] opacity-50'}`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-[var(--color-primary)]/20' : 'bg-[var(--color-border)]'}`}>
        <User size={16} />
      </div>
      <span className="text-sm font-bold">{label}</span>
    </div>
    {active ? <Check size={16} /> : <X size={16} />}
  </button>
);

const NotificationToggle: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-[var(--color-bg-surface)] border-[var(--color-border)] opacity-50'}`}
  >
    <span className="text-xs font-bold">{label}</span>
    <div className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-emerald-500' : 'bg-gray-500'}`}>
      <motion.div 
        animate={{ x: active ? 22 : 2 }}
        className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm"
      />
    </div>
  </button>
);
