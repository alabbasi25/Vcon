import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, PenLine, Image as ImageIcon, Plus, X, Calendar, Search, Trash2, Heart, Lock } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { JournalEntry } from '../../types';

export const SharedJournal: React.FC = () => {
  const { journal, addJournalEntry, deleteJournalEntry, currentUser } = usePlanet();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    addJournalEntry(title, content, images);
    setTitle('');
    setContent('');
    setImages([]);
    setIsAdding(false);
  };

  const filteredJournal = journal.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">يوميات الكوكب</h2>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">مساحة خاصة لتوثيق رحلتكما المشتركة</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div 
            key="add"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-2">
                <PenLine size={24} className="text-[var(--color-primary)]" />
                تدوين ذكرى جديدة
              </h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input 
                type="text"
                placeholder="عنوان الذكرى..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-none text-2xl font-black placeholder:opacity-20 focus:ring-0 outline-none"
              />
              <textarea 
                placeholder="ماذا حدث اليوم؟ اكتب الكلمات التي تريد تذكرها للأبد..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent border-none h-48 resize-none text-[var(--color-text-secondary)] leading-relaxed focus:ring-0 outline-none no-scrollbar"
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const url = prompt('أدخل رابط الصورة:');
                    if (url) setImages([...images, url]);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase flex items-center gap-2 hover:bg-white/10 transition-all opacity-60"
                >
                  <ImageIcon size={14} /> إرفاق صور
                </button>
              </div>
              <button 
                onClick={handleSave}
                className="px-8 py-3 rounded-2xl bg-[var(--color-primary)] text-white font-black shadow-xl shadow-[var(--color-primary)]/20 hover:scale-105 active:scale-95 transition-all"
              >
                حفظ الذكرى
              </button>
            </div>

            {images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, i) => (
                  <div key={i} className="relative group flex-shrink-0">
                    <img src={img} alt="attached" className="w-24 h-24 rounded-2xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-30" size={18} />
              <input 
                type="text"
                placeholder="ابحث في ذكريات الكوكب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredJournal.map(entry => (
                <div key={entry.id} className="glass-card p-0 overflow-hidden flex flex-col md:flex-row border-white/5 hover:border-white/20 transition-all group">
                  {entry.images.length > 0 && (
                    <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 relative overflow-hidden">
                      <img src={entry.images[0]} alt="Journal" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      {entry.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[8px] font-black text-white">
                          +{entry.images.length - 1} صور إضافية
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-[10px] font-bold uppercase tracking-widest">
                          <Calendar size={12} />
                          {new Date(entry.timestamp).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <h3 className="text-xl font-black">{entry.title}</h3>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black opacity-40">
                        {entry.authorId}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">
                      {entry.content}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[10px] text-rose-500/60 font-black">
                        <Heart size={12} /> مساحة خاصة (مشفرة)
                      </div>
                      <button 
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="text-[10px] font-black opacity-30 hover:opacity-100 hover:text-rose-500 transition-all flex items-center gap-1"
                      >
                        <Trash2 size={12} /> حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredJournal.length === 0 && (
                <div className="p-20 text-center glass-card opacity-30 flex flex-col items-center gap-4">
                  <Lock size={48} />
                  <p className="text-sm font-bold">لا توجد ذكريات تتطابق مع بحثك. الكوكب ينتظر تدويناتكما.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
