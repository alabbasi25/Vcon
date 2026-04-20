import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';

export const FitConnect: React.FC = () => {
  const { googleFitConnected, setGoogleFitConnected } = usePlanet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setGoogleFitConnected(true);
        setIsConnecting(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setGoogleFitConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) throw new Error('فشل الحصول على رابط المصادقة');
      const { url } = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const authWindow = window.open(
        url,
        'google_fit_oauth',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (!authWindow) {
        throw new Error('تم حظر النافذة المنبثقة. يرجى السماح بالمنبثقات.');
      }
    } catch (err: any) {
      setError(err.message);
      setIsConnecting(false);
    }
  };

  if (googleFitConnected) {
    return (
      <div className="glass-card p-6 border-emerald-500/30 bg-emerald-500/5 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black">Google Fit متصل</h4>
            <p className="text-[10px] opacity-60">يتم مزامنة خطواتك وبياناتك الصحية تلقائياً</p>
          </div>
          <div className="text-emerald-500">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 border-[var(--color-primary)]/20 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <Zap size={160} />
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black">ربط Google Fit</h4>
            <p className="text-[10px] opacity-60">قم بمزامنة نشاطك البدني مع الكوكب لتحسين توازنك</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-[10px] flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleConnect}
          disabled={isConnecting}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isConnecting ? 'bg-white/5 opacity-50' : 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02]'}`}
        >
          {isConnecting ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Activity size={18} />
            </motion.div>
          ) : (
            <>
              <Activity size={18} /> ربط الآن
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
