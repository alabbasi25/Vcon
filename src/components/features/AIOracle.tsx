import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Sparkles, BrainCircuit, BarChart3, Scale, UserX, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const AIOracle: React.FC = () => {
  const { planetHealth, tasks, transactions, currentUser } = usePlanet();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'أهلاً بكما. أنا مستشار الكوكب. لقد حللت بياناتكما الحالية: صحة الكوكب عند ' + planetHealth.score + '%. كيف يمكنني مساعدتكما في تحسين التوازن اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showJury, setShowJury] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock Disputed Case for Blind Jury
  const [disputedCase, setDisputedCase] = useState({
    id: '1',
    title: 'من المسؤول عن غسيل الأطباق ليلة أمس؟',
    description: 'فهد يقول أنه كان متعباً، وبشرى تقول أنها طبخت الوجبة بالكامل.',
    votes: { F: null, B: null } as Record<string, 'A' | 'B' | null>,
    options: {
      A: 'فهد يغسلها الآن',
      B: 'بشرى تغسلها الآن',
      C: 'يتم تأجيلها لليوم'
    }
  });

  const handleVote = (option: 'A' | 'B') => {
    setDisputedCase(prev => ({
      ...prev,
      votes: { ...prev.votes, [currentUser]: option }
    }));
  };

  const isRevealed = disputedCase.votes.F !== null && disputedCase.votes.B !== null;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const prompt = `
        أنت مساعد ذكي لتطبيق "كوكب" المخصص للأزواج.
        بيانات الكوكب الحالية:
        - الصحة العامة: ${planetHealth.score}%
        - المهام المعلقة: ${tasks.filter(t => t.status === 'pending').length}
        - المصاريف الأخيرة: ${transactions.length}
        
        المستخدم يسأل: ${userMsg}
        
        أجب بأسلوب دافئ، حكيم، وباللغة العربية. قدم نصائح عملية بناءً على البيانات إذا لزم الأمر.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'عذراً، لم أستطع توليد رد.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، واجهت مشكلة في تحليل البيانات. حاول مرة أخرى لاحقاً.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[70vh]">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black">مستشار الكوكب</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">ذكاء اصطناعي يحلل نبض حياتكما</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowJury(!showJury)}
          className={`p-3 rounded-xl transition-all group ${showJury ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-rose-500/10 text-rose-500'}`}
        >
          <Scale size={20} className="group-hover:animate-pulse" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showJury && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-card p-6 border-rose-500/20 bg-rose-500/5 space-y-4">
              <div className="flex items-center gap-2 text-rose-500">
                <UserX size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">محكمة الكوكب العمياء (Blind Jury)</h3>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-sm">{disputedCase.title}</h4>
                <p className="text-[10px] opacity-60">{disputedCase.description}</p>
              </div>

              {!isRevealed ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold">صوتك مخفي تماماً</span>
                    <AlertCircle size={14} className="opacity-40" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleVote('A')}
                      className={`py-3 rounded-xl text-[10px] font-bold transition-all ${disputedCase.votes[currentUser] === 'A' ? 'bg-rose-500 text-white' : 'bg-white/5 border border-white/10'}`}
                    >
                      الخيار أ
                    </button>
                    <button 
                      onClick={() => handleVote('B')}
                      className={`py-3 rounded-xl text-[10px] font-bold transition-all ${disputedCase.votes[currentUser] === 'B' ? 'bg-rose-500 text-white' : 'bg-white/5 border border-white/10'}`}
                    >
                      الخيار ب
                    </button>
                  </div>
                  <p className="text-[8px] text-center opacity-40 italic">لن تظهر النتائج إلا بعد تصويت الطرفين</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                    <CheckCircle2 size={16} /> تم حسم النزاع!
                  </div>
                  <div className="text-[10px] space-y-1">
                    <div className="flex justify-between">
                      <span className="opacity-60">تصويت فهد:</span>
                      <span className="font-bold">الخيار {disputedCase.votes.F}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">تصويت بشرى:</span>
                      <span className="font-bold">الخيار {disputedCase.votes.B}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar p-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[var(--color-primary)] text-white' : 'glass-card border-[var(--color-primary)]/20'}`}>
              {msg.role === 'assistant' && <Bot size={14} className="mb-2 opacity-50" />}
              <p className="leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass-card p-4 rounded-2xl animate-pulse">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="pt-4 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اسأل المستشار عن حالة الكوكب..."
          className="input-field flex-1"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="p-3 rounded-xl bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
};
