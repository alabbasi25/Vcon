import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Sun, CloudLightning, Wind, Sparkles } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';

export const PlanetWeather: React.FC = () => {
  const { weather } = usePlanet();

  const getWeatherIcon = () => {
    switch (weather.status) {
      case 'sunny': return <Sun className="text-amber-400" size={64} />;
      case 'cloudy': return <Cloud className="text-gray-400" size={64} />;
      case 'stormy': return <CloudLightning className="text-indigo-400" size={64} />;
      default: return <Sun className="text-amber-400" size={64} />;
    }
  };

  const getWeatherGradient = () => {
    switch (weather.status) {
      case 'sunny': return 'from-amber-500/20 via-transparent to-orange-500/20';
      case 'cloudy': return 'from-gray-500/20 via-transparent to-slate-500/20';
      case 'stormy': return 'from-indigo-500/20 via-transparent to-purple-500/20';
      default: return 'from-amber-500/20 via-transparent to-orange-500/20';
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-card p-8 text-center relative overflow-hidden group min-h-[280px] flex flex-col justify-center items-center border-white/10"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getWeatherGradient()} opacity-50`} />
      
      {/* 3D-like background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [360, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <div className="space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">
          <Wind size={12} className="animate-pulse" /> طقس الكوكب اليوم
        </div>

        <div className="relative">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 flex justify-center"
          >
            {getWeatherIcon()}
          </motion.div>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-white/10 rounded-full"
          />
          
          {weather.status === 'sunny' && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 right-0 text-amber-400/40"
            >
              <Sparkles size={24} />
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={weather.status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-black tracking-tight">
                {weather.status === 'sunny' ? 'مشمس وصافٍ' : weather.status === 'cloudy' ? 'غائم جزئياً' : 'عاصفة قادمة'}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-[280px] mx-auto leading-relaxed font-medium">
                {weather.reason}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pt-4">
          <div className="inline-block px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xs font-bold text-[var(--color-primary)]">
              💡 نصيحة الكوكب: {weather.suggestion}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
