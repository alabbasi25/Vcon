import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Shield, Rocket, ArrowLeft, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "مرحباً بكم في كوكب",
      description: "المكان الذي يجمع بينكما في عالم رقمي فريد، مصمم خصيصاً لتعزيز علاقتكما وإدارة حياتكما معاً.",
      icon: <Rocket size={64} className="text-blue-500" />,
      color: "from-blue-500/20 to-indigo-500/20"
    },
    {
      title: "جسور المودة",
      description: "سجلوا ذكرياتكم، عبروا عن امتنانكم، وتواصلوا بعمق من خلال أدوات مصممة للحب والتقدير.",
      icon: <Heart size={64} className="text-rose-500" />,
      color: "from-rose-500/20 to-pink-500/20"
    },
    {
      title: "المنظومة المشتركة",
      description: "أديروا ميزانيتكم، مهامكم اليومية، وخططكم المستقبلية بكل سهولة وشفافية.",
      icon: <Shield size={64} className="text-amber-500" />,
      color: "from-amber-500/20 to-orange-500/20"
    },
    {
      title: "ذكاء الكوكب",
      description: "مستشار الكوكب القائم على الذكاء الاصطناعي (Gemini) جاهز دائماً لتقديم النصائح والاقتراحات الصائبة.",
      icon: <Sparkles size={64} className="text-purple-500" />,
      color: "from-purple-500/20 to-fuchsia-500/20"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--color-bg-deep)] flex items-center justify-center p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-md w-full glass-card p-10 border-[var(--color-border)] relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${steps[step].color} opacity-30`} />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/10"
            >
              {steps[step].icon}
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tighter">{steps[step].title}</h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {steps[step].description}
              </p>
            </div>

            <div className="flex gap-4 w-full pt-8">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="w-16 h-16 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <ArrowRight size={24} />
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 h-16 rounded-2xl bg-[var(--color-primary)] text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {step === steps.length - 1 ? "لنبدأ الرحلة" : "التالي"}
                <ArrowLeft size={24} />
              </button>
            </div>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-[var(--color-primary)]' : 'w-2 bg-white/10'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
