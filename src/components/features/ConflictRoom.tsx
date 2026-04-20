import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Send, 
  Eye, 
  Lock, 
  Bot, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

// Custom Icon wrapper for consistent styling
const StyledIcon: React.FC<{ icon: React.ElementType; size?: number; className?: string }> = ({ icon: Icon, size = 20, className = "" }) => (
  <Icon size={size} strokeWidth={1.5} className={`drop-shadow-sm ${className}`} />
);
import { usePlanet } from '../../context/KokabContext';
import { GoogleGenAI } from "@google/genai";

export const ConflictRoom: React.FC = () => {
  const { 
    conflictRoom, 
    sendConflictMessage, 
    revealConflictMessages, 
    currentUser,
    arbitrationRequests,
    requestArbitration,
    submitArbitrationArgument,
    resolveArbitration
  } = usePlanet();
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [isArbitrationOpen, setIsArbitrationOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const myMessages = conflictRoom.filter(m => m.authorId === currentUser);
  const partnerMessages = conflictRoom.filter(m => m.authorId !== currentUser);
  
  const canReveal = myMessages.length > 0 && partnerMessages.length > 0;
  const isRevealed = conflictRoom.some(m => m.revealed);

  const handleAIArbitration = async (reqId: string, p1: string, p2: string) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `
          أنت محكم ذكي وخبير في العلاقات الزوجية. لديك اختلاف في الرأي بين زوجين (فهد وبشرى).
          وجهة نظر فهد: ${p1}
          وجهة نظر بشرى: ${p2}
          المطلوب: تحليل وجهتي النظر واقتراح حل وسط يحفظ المودة ويحقق الهدف المنطقي.
          اجعل الرد باللغة العربية، بأسلوب حكيم وودود ومختصر.
        `,
      });
      
      if (response.text) {
        resolveArbitration(reqId, response.text);
      }
    } catch (error) {
      console.error("AI Arbitration failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black">غرفة التفاهم</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">مساحة آمنة للنقاش دون مقاطعة</p>
      </div>

      {/* AI Arbitration Section */}
      <section className="space-y-4">
        <button 
          onClick={() => setIsArbitrationOpen(!isArbitrationOpen)}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between shadow-xl shadow-indigo-500/20 hover:scale-[1.01] transition-transform active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <StyledIcon icon={Bot} size={24} />
            <div className="text-right">
              <h3 className="text-sm font-bold">التحكيم الذكي (AI Arbitration)</h3>
              <p className="text-[10px] opacity-80">حل الخلافات المعقدة عبر Gemini 1.5 Pro</p>
            </div>
          </div>
          {isArbitrationOpen ? <StyledIcon icon={ChevronUp} /> : <StyledIcon icon={ChevronDown} />}
        </button>

        <AnimatePresence>
          {isArbitrationOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4"
            >
              <div className="glass-card p-6 space-y-4 border-indigo-500/30">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-50 uppercase">موضوع الخلاف</label>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="مثلاً: ميزانية السفر، اختيار المدرسة..."
                    className="input-field text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-50 uppercase">وجهة نظرك</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="اكتب مبرراتك المنطقية..."
                    className="input-field text-sm h-24 resize-none no-scrollbar"
                  />
                </div>
                <button 
                  onClick={() => { 
                    if (!topic || !content) return;
                    requestArbitration(topic, content); 
                    setContent(''); 
                    setTopic(''); 
                  }}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 hover:shadow-indigo-500/40 transition-shadow"
                >
                  <StyledIcon icon={Send} size={16} /> إرسال للتحكيم
                </button>
              </div>

              {/* Arbitration Requests List */}
              <div className="space-y-3">
                {arbitrationRequests.map(req => (
                  <div key={req.id} className="glass-card p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm">{req.topic}</h4>
                        <p className="text-[10px] opacity-50">{new Date(req.timestamp).toLocaleString('ar-EG')}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-[8px] font-bold ${req.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {req.status === 'resolved' ? 'تم الحل' : 'في انتظار الطرف الآخر'}
                      </div>
                    </div>

                    {req.status === 'pending_partner' && req.proposerId !== currentUser && (
                      <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
                        <p className="text-xs font-bold">الشريك يطلب التحكيم. ما هي وجهة نظرك؟</p>
                        <textarea 
                          placeholder="اكتب مبرراتك هنا..."
                          className="input-field text-xs h-20 resize-none no-scrollbar"
                          onBlur={(e) => submitArbitrationArgument(req.id, e.target.value)}
                        />
                        <button 
                          onClick={() => handleAIArbitration(req.id, req.proposerArgument, req.partnerArgument || '')}
                          className="w-full py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <Sparkles size={14} /> تفعيل المعالج الذكي
                        </button>
                      </div>
                    )}

                    {req.status === 'processing_ai' && (
                      <div className="flex flex-col items-center py-4 gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-bold text-indigo-500">جاري تحليل تاريخ التوافق واقتراح الحل الوسط...</p>
                      </div>
                    )}

                    {req.status === 'resolved' && (
                      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-indigo-500">
                          <Bot size={16} />
                          <span className="text-[10px] font-bold uppercase">اقتراح Gemini</span>
                        </div>
                        <p className="text-xs leading-relaxed italic text-indigo-900/80">
                          "{req.aiSuggestion}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
        <div className="p-3 rounded-xl bg-amber-500/20 text-amber-500">
          <StyledIcon icon={ShieldAlert} size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-500">منطق الكتابة الدورية</h4>
          <p className="text-[10px] leading-relaxed text-amber-600/70">
            لن يظهر رد الطرف الأول إلا بعد أن ينهي الطرف الثاني كتابة رأيه. هذا يضمن أن يستمع كل منكما للآخر بالكامل قبل الرد.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div 
          className="glass-card p-6 space-y-4"
          whileFocus={{ scale: 1.01 }}
        >
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="عبر عن وجهة نظرك بهدوء..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none h-24 no-scrollbar"
            disabled={myMessages.length > 0 && !isRevealed}
          />
          <div className="flex justify-end">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { 
                if (!content.trim()) return;
                sendConflictMessage(content); 
                setContent(''); 
              }}
              disabled={myMessages.length > 0 && !isRevealed}
              className="px-6 py-2 rounded-xl bg-amber-500 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              <StyledIcon icon={Send} size={16} /> إرسال وجهة نظري
            </motion.button>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-center">حالة النقاش</h3>
          
          <div className="flex justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <motion.div 
                animate={myMessages.length > 0 ? { scale: [1, 1.1, 1] } : {}}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${myMessages.length > 0 ? 'bg-green-500/20 text-green-500 shadow-lg shadow-green-500/10' : 'bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]'}`}
              >
                {myMessages.length > 0 ? <StyledIcon icon={Eye} size={24} /> : <StyledIcon icon={Lock} size={24} />}
              </motion.div>
              <span className="text-[10px] font-bold">أنت</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <motion.div 
                animate={partnerMessages.length > 0 ? { scale: [1, 1.1, 1] } : {}}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${partnerMessages.length > 0 ? 'bg-green-500/20 text-green-500 shadow-lg shadow-green-500/10' : 'bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]'}`}
              >
                {partnerMessages.length > 0 ? <StyledIcon icon={Eye} size={24} /> : <StyledIcon icon={Lock} size={24} />}
              </motion.div>
              <span className="text-[10px] font-bold">الشريك</span>
            </div>
          </div>

          {canReveal && !isRevealed && (
            <button 
              onClick={revealConflictMessages}
              className="w-full py-4 rounded-2xl bg-green-500 text-white font-black text-sm shadow-xl shadow-green-500/20 animate-pulse"
            >
              كشف وجهات النظر الآن
            </button>
          )}

          <AnimatePresence>
            {isRevealed && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {conflictRoom.map((msg, idx) => (
                  <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, x: msg.authorId === currentUser ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-2xl shadow-sm border border-white/5 ${msg.authorId === currentUser ? 'bg-blue-500/10 mr-10 rounded-tr-none' : 'bg-amber-500/10 ml-10 rounded-tl-none'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${msg.authorId === currentUser ? 'bg-blue-500' : 'bg-amber-500'}`} />
                      <div className="text-[10px] font-bold opacity-50">{msg.authorId === currentUser ? 'أنت' : 'الشريك'}</div>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
