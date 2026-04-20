import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageSquare, Gift, Clock, Sparkles, ChevronRight, RefreshCw, Trophy, Star } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { LoveLanguage } from '../../types';

interface Question {
  id: number;
  text: string;
  category: LoveLanguage;
}

const QUESTIONS: Question[] = [
  { id: 1, text: 'أشعر بالحب أكثر عندما يخبرني شريكي بمدى فخره بي.', category: 'words' },
  { id: 2, text: 'أقدر كثيراً عندما يساعدني شريكي في إنجاز المهام المنزلية الصعبة.', category: 'acts' },
  { id: 3, text: 'الهدايا البسيطة المفاجئة تسعد قلبي بشكل لا يصدق.', category: 'gifts' },
  { id: 4, text: 'أفضل قضاء وقت هادئ مع شريكي بعيداً عن الهواتف والمشتتات.', category: 'time' },
  { id: 5, text: 'اللمسات العفوية والعناق العشوائي تعني لي الكثير.', category: 'touch' },
  { id: 6, text: 'كلمات التشجيع هي ما يحفزني للاستمرار.', category: 'words' },
  { id: 7, text: 'أشعر بالامتنان عندما يجهز شريكي لي كوباً من القهوة دون أن أطلب.', category: 'acts' },
  { id: 8, text: 'أجمل هدية بالنسبة لي هي الذكرى التي تبقى معي للأبد.', category: 'gifts' },
  { id: 9, text: 'المحادثات العميقة التي تستمر لساعات هي لغتي المفضلة.', category: 'time' },
  { id: 10, text: 'الإمساك بيدي أثناء المشي يمنحني شعوراً بالأمان.', category: 'touch' },
];

export const LoveLanguageQuiz: React.FC = () => {
  const { loveLanguages, submitLoveLanguageResult, currentUser } = usePlanet();
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [scores, setScores] = useState<Record<LoveLanguage, number>>({
    words: 0,
    acts: 0,
    gifts: 0,
    time: 0,
    touch: 0
  });

  const myResult = loveLanguages.find(l => l.userId === currentUser);
  const partnerResult = loveLanguages.find(l => l.userId !== currentUser);

  const handleAnswer = (points: number) => {
    const q = QUESTIONS[currentQuestionIdx];
    setScores(prev => ({ ...prev, [q.category]: prev[q.category] + points }));

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      submitLoveLanguageResult(scores);
      setCurrentStep('result');
    }
  };

  const getLanguageLabel = (lang: LoveLanguage) => {
    const map: Record<LoveLanguage, string> = {
      words: 'كلمات التقدير',
      acts: 'الأفعال الخدمية',
      gifts: 'تبادل الهدايا',
      time: 'الوقت المشترك',
      touch: 'الاتصال البدني'
    };
    return map[lang];
  };

  const getLanguageIcon = (lang: LoveLanguage) => {
    switch (lang) {
      case 'words': return <MessageSquare size={16} />;
      case 'acts': return <Clock size={16} />;
      case 'gifts': return <Gift size={16} />;
      case 'time': return <Clock size={16} />;
      case 'touch': return <Heart size={16} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-black">لغات الحب في الكوكب</h2>
        <p className="text-sm text-[var(--color-text-secondary)] font-medium">اكتشف كيف يفهم قلبك وقلب شريكك المودة</p>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 'intro' ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-12 text-center space-y-8"
          >
            <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <Heart size={48} fill="currentColor" className="animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black italic">هل تتحدث نفس لغة شريكك؟</h3>
              <p className="max-w-md mx-auto text-sm text-[var(--color-text-secondary)] leading-relaxed">
                كل منا يستقبل الحب بطريقة مختلفة. هذا الاختبار القصير سيساعدكما في الكشف عن لغات الحب الخمس وكيفية تعميق تواصلكما.
              </p>
            </div>
            <button 
              onClick={() => setCurrentStep('quiz')}
              className="px-12 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-black shadow-2xl shadow-[var(--color-primary)]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
            >
              ابدأ الاختبار الآن <ChevronRight size={20} />
            </button>
            {myResult && <p className="text-[10px] font-bold opacity-30">لقد أجريت الاختبار مسبقاً، يمكنك إعادته في أي وقت.</p>}
          </motion.div>
        ) : currentStep === 'quiz' ? (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-8 space-y-8"
          >
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
              <span>السؤال {currentQuestionIdx + 1} من {QUESTIONS.length}</span>
              <div className="flex gap-1">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`w-4 h-1 rounded-full transition-all ${i === currentQuestionIdx ? 'bg-rose-500 w-8' : (i < currentQuestionIdx ? 'bg-rose-500/40' : 'bg-white/10')}`} />
                ))}
              </div>
            </div>

            <div className="py-8 min-h-[120px] flex items-center justify-center">
              <h3 className="text-2xl font-black text-center leading-relaxed">
                {QUESTIONS[currentQuestionIdx].text}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'أوافق بشدة', points: 3, color: 'bg-emerald-500' },
                { label: 'أوافق', points: 2, color: 'bg-blue-500' },
                { label: 'محايد', points: 1, color: 'bg-gray-500' },
                { label: 'لا أوافق', points: 0, color: 'bg-rose-500' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleAnswer(btn.points)}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 text-sm font-black hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group"
                >
                  {btn.label}
                  <div className={`w-2 h-2 rounded-full ${btn.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="glass-card p-12 text-center space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Trophy size={140} className="text-amber-500" />
               </div>
               <div className="space-y-2 relative z-10">
                  <h3 className="text-sm font-black uppercase tracking-widest opacity-40">لغتك الأساسية هي</h3>
                  <div className="text-4xl font-black text-[var(--color-primary)] flex items-center justify-center gap-3">
                    <Sparkles size={32} />
                    {getLanguageLabel(myResult?.primary || 'words')}
                  </div>
               </div>
               <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
                 هذه اللغة هي الأكثر تأثيراً في قلبك. عندما يتحدث شريكك بهذه اللغة، فإنه يملأ "خزان الحب" لديك بسرعة فائقة.
               </p>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6">
                 {Object.entries(myResult?.scores || {}).map(([lang, score]) => (
                   <div key={lang} className="glass-card p-4 space-y-2 border-white/5 bg-white/[0.02]">
                     <div className="text-[10px] font-black opacity-30 truncate">{getLanguageLabel(lang as LoveLanguage)}</div>
                     <div className="text-lg font-black">{score as number}</div>
                   </div>
                 ))}
               </div>
            </div>

            {partnerResult && (
              <div className="glass-card p-8 border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black">لغة شريكك (بشرى)</h4>
                    <p className="text-xl font-black text-rose-500">{getLanguageLabel(partnerResult.primary)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h5 className="text-[10px] font-black uppercase opacity-40">توافق اللغات</h5>
                  <div className="text-sm font-black text-amber-500">انسجام كوكبي عالٍ</div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button 
               onClick={() => {
                 setCurrentStep('intro');
                 setCurrentQuestionIdx(0);
                 setScores({ words: 0, acts: 0, gifts: 0, time: 0, touch: 0 });
               }}
               className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> إعادة الاختبار
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
