import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellOff, X, Check, Trash2, Info, AlertCircle, Heart, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlanet } from '../../context/KokabContext';

export const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = usePlanet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="text-rose-500" size={18} />;
      case 'spiritual': return <Heart className="text-pink-500" size={18} />;
      case 'financial': return <Zap className="text-amber-500" size={18} />;
      case 'security': return <Shield className="text-blue-500" size={18} />;
      default: return <Info className="text-[var(--color-primary)]" size={18} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl glass hover:bg-white/10 transition-all group"
      >
        {unreadCount > 0 ? (
          <Bell className="text-[var(--color-primary)] animate-swing" size={20} />
        ) : (
          <Bell className="opacity-40" size={20} />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-[var(--color-bg-deep)]">
            {unreadCount > 9 ? '+9' : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-4 w-80 max-h-[480px] glass-card shadow-2xl z-[150] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">الإشعارات</h3>
              <div className="flex gap-2">
                {notifications.length > 0 && (
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={clearNotifications}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-all opacity-40 hover:opacity-100"
                    title="مسح الكل"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                )}
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-all"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                  <BellOff size={40} className="mb-4" />
                  <p className="text-xs font-bold font-cairo">لا توجد إشعارات حالياً</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    className={`p-4 rounded-2xl transition-all border border-transparent hover:border-white/5 relative group ${n.read ? 'opacity-50' : 'bg-white/[0.03] border-white/10 shadow-sm'}`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black">{n.title}</h4>
                          <span className="text-[8px] font-bold opacity-30 mt-0.5">
                            {new Date(n.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-60 mt-1 leading-relaxed font-medium">
                          {n.content}
                        </p>
                        {!n.read && (
                          <div className="mt-3 flex justify-end">
                            <motion.button 
                              whileTap={{ scale: 0.95 }}
                              onClick={() => markNotificationAsRead(n.id)}
                              className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:underline flex items-center gap-1"
                            >
                              <Check size={10} /> تم الاطلاع
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notifications.length > 5 && (
              <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="text-[10px] font-black opacity-40 hover:opacity-100 transition-all uppercase tracking-tighter"
                >
                  عرض جميع الإشعارات السابقة
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
