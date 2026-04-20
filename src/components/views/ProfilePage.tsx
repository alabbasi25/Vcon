import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  LogOut, 
  Camera, 
  Edit3, 
  CheckCircle2, 
  Target, 
  Flame,
  Calendar,
  Award
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { ConfirmationModal } from '../ui/ConfirmationModal';

export const ProfilePage: React.FC<{ onSwitchUser: () => void }> = ({ onSwitchUser }) => {
  const { currentUser, profiles, streaks, updateProfile, tasks, assets, populateTestData, resetApp, theme, setTheme } = usePlanet();
  const profile = profiles[currentUser];
  const streak = streaks[currentUser];
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const completedTasks = tasks.filter(t => t.assignedTo === currentUser && t.status === 'completed').length;
  const achievedGoals = assets.filter(a => a.current >= a.target).length;

  const handleSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-12"
    >
      {/* Header / Cover */}
      <div className="relative h-48 rounded-3xl overflow-hidden glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 backdrop-blur-xl" />
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <User size={200} />
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="relative -mt-24 px-4">
        <div className="glass-card p-8 text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-3xl glass p-1 border-4 border-[var(--color-primary)] shadow-2xl shadow-[var(--color-primary)]/20">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg border-4 border-[var(--color-bg-card)]">
              <Camera size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-4 max-w-xs mx-auto">
                <ModernInput 
                  label="الاسم"
                  value={editedProfile.name}
                  onChange={e => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                />
                <ModernInput 
                  label="نبذة تعريفية"
                  value={editedProfile.bio || ''}
                  onChange={e => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="btn-primary flex-1 py-2 text-xs">حفظ</button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1 py-2 text-xs">إلغاء</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-3xl font-black">{profile.name}</h2>
                  <button onClick={() => setIsEditing(true)} className="text-[var(--color-primary)] opacity-60 hover:opacity-100 transition-opacity">
                    <Edit3 size={18} />
                  </button>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mx-auto leading-relaxed">
                  {profile.bio || 'لا توجد نبذة تعريفية بعد.'}
                </p>
              </>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--color-border)]">
            <div className="space-y-1">
              <div className="text-xl font-black text-[var(--color-primary)]">{streak.count}</div>
              <div className="text-[10px] font-bold opacity-50 uppercase flex items-center justify-center gap-1">
                <Flame size={10} className="text-orange-500" /> تتابع
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-black text-emerald-500">{achievedGoals}</div>
              <div className="text-[10px] font-bold opacity-50 uppercase flex items-center justify-center gap-1">
                <Target size={10} className="text-emerald-500" /> أهداف
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-black text-blue-500">{completedTasks}</div>
              <div className="text-[10px] font-bold opacity-50 uppercase flex items-center justify-center gap-1">
                <CheckCircle2 size={10} className="text-blue-500" /> مهام
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 px-4">أدوات المطور والتجربة</h3>
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold">وضع التجربة (Testing Mode)</h4>
              <p className="text-[10px] opacity-50">ملء التطبيق ببيانات تجريبية لمعاينة الميزات</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={populateTestData}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-500 text-xs font-bold hover:bg-amber-500/30 transition-colors"
            >
              تفعيل
            </motion.button>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div>
              <h4 className="text-sm font-bold">تبديل المستخدم</h4>
              <p className="text-[10px] opacity-50">التبديل بين فهد وبشرى لمحاكاة التفاعل</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={onSwitchUser}
              className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-500 text-xs font-bold hover:bg-blue-500/30 transition-colors"
            >
              تبديل إلى {currentUser === 'F' ? 'بشرى' : 'فهد'}
            </motion.button>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div>
              <h4 className="text-sm font-bold text-rose-500">تصفير النظام</h4>
              <p className="text-[10px] opacity-50">مسح كافة البيانات والبدء من جديد</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500/30 transition-colors"
            >
              تصفير
            </motion.button>
          </div>
        </div>

        <ConfirmationModal 
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={resetApp}
          title="تصفير النظام"
          message="هل أنت متأكد من رغبتك في تصفير النظام؟ سيتم مسح كافة البيانات والمهام والسجلات المالية نهائياً."
          confirmLabel="تصفير الآن"
          cancelLabel="تراجع"
        />

        <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 px-4">المظهر والثيمات</h3>
        <div className="px-4">
          <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
        </div>

        <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 px-4">الإعدادات والتفضيلات</h3>
        
        <div className="glass-card divide-y divide-[var(--color-border)]">
          <SettingsItem icon={<Shield size={20} />} label="الأمان والخصوصية" description="إدارة كلمات المرور والمصادقة" />
          <SettingsItem icon={<Bell size={20} />} label="الإشعارات" description="تخصيص تنبيهات النظام والشركاء" />
          <SettingsItem icon={<Calendar size={20} />} label="المزامنة" description="إدارة التقويمات الخارجية" />
          <SettingsItem icon={<Award size={20} />} label="الإنجازات" description="عرض الأوسمة والجوائز المحققة" />
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full glass-card p-4 flex items-center justify-center gap-3 text-rose-500 font-bold hover:bg-rose-500/5 transition-colors"
        >
          <LogOut size={20} /> تسجيل الخروج من الكوكب
        </motion.button>
      </div>

      <div className="text-center opacity-30 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest">عضو منذ {new Date(profile.joinedAt).toLocaleDateString('ar-EG')}</p>
        <p className="text-[8px] mt-1">نسخة النظام: 2.4.0-stable</p>
      </div>
    </motion.div>
  );
};

const SettingsItem: React.FC<{ icon: React.ReactNode; label: string; description: string }> = ({ icon, label, description }) => (
  <button className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-bg-surface)] transition-colors text-right">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-surface)] text-[var(--color-primary)] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold">{label}</div>
        <div className="text-[10px] opacity-50">{description}</div>
      </div>
    </div>
    <Edit3 size={14} className="opacity-20" />
  </button>
);
