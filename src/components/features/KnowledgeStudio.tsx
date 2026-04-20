import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  Library, 
  Plus, 
  Search, 
  Book as BookIcon, 
  ChevronRight, 
  TrendingUp, 
  X, 
  Mic, 
  Play, 
  MessageSquareQuote, 
  Palette, 
  Clock, 
  CheckCircle2, 
  History,
  ChevronLeft,
  Camera
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';

export const KnowledgeStudio: React.FC = () => {
  const { 
    library, 
    updateBookProgress, 
    addBook, 
    currentUser, 
    addAudioNote, 
    hobbyProjects, 
    updateHobbyProgress, 
    addHobbyProject,
    addHobbyPhoto 
  } = usePlanet();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showAddHobby, setShowAddHobby] = useState(false);
  const [showAudioNote, setShowAudioNote] = useState<string | null>(null);
  const [newBook, setNewBook] = useState({ title: '', author: '', totalPages: 100, category: 'General' });
  const [audioNoteContent, setAudioNoteContent] = useState({ page: 1, note: '' });
  const [newHobby, setNewHobby] = useState({ title: '', description: '', totalSteps: 10 });

  const handleAddAudioNote = (bookId: string) => {
    addAudioNote(bookId, audioNoteContent.page, audioNoteContent.note);
    setShowAudioNote(null);
    setAudioNoteContent({ page: 1, note: '' });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addBook(newBook);
    setShowAdd(false);
    setNewBook({ title: '', author: '', totalPages: 100, category: 'General' });
  };

  const handleAddHobby = (e: React.FormEvent) => {
    e.preventDefault();
    addHobbyProject(newHobby);
    setShowAddHobby(false);
    setNewHobby({ title: '', description: '', totalSteps: 10 });
  };

  const filteredLibrary = library.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black">استوديو المعرفة والهوايات</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">رحلة التعلم والنمو العقلي المشترك</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddHobby(true)}
            className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20"
          >
            <Palette size={20} />
          </button>
          <button 
            onClick={() => setShowAdd(true)}
            className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Time-lapse Builder (Hobby Projects) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">مشاريع الهوايات (Time-lapse)</h3>
          <div className="flex items-center gap-1 text-[8px] font-black text-purple-500 uppercase tracking-widest">
            <History size={10} /> جاري التوثيق
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
          {hobbyProjects.map(project => (
            <motion.div 
              key={project.id}
              className="flex-shrink-0 w-64 glass-card p-5 space-y-4 border-purple-500/10"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Palette size={20} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-purple-500">{Math.round((project.currentStep / project.totalSteps) * 100)}%</div>
                  <div className="text-[8px] opacity-40 uppercase">مكتمل</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-sm">{project.title}</h4>
                <p className="text-[10px] opacity-50 line-clamp-1">{project.description}</p>
              </div>

              {/* Progressive Reveal Timeline */}
              <div className="flex gap-1">
                {Array.from({ length: project.totalSteps }).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      i < project.currentStep ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-white/5'
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-[8px] opacity-40">الخطوة {project.currentStep} من {project.totalSteps}</div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      const randomImg = `https://picsum.photos/seed/${project.id}-${project.dailyPhotos.length}/400/300`;
                      addHobbyPhoto(project.id, randomImg);
                    }}
                    className="p-1.5 rounded-lg glass text-emerald-500 hover:bg-emerald-500/10 transition-all"
                    title="إضافة صورة توثيقية"
                  >
                    <Camera size={14} />
                  </button>
                  <button 
                    onClick={() => updateHobbyProgress(project.id, Math.min(project.totalSteps, project.currentStep + 1))}
                    className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {project.dailyPhotos && project.dailyPhotos.length > 0 && (
                <div className="pt-2">
                  <div className="text-[8px] font-bold opacity-30 uppercase mb-2 tracking-widest">معرض التوثيق</div>
                  <PhotoCarousel photos={project.dailyPhotos} />
                </div>
              )}
            </motion.div>
          ))}
          {hobbyProjects.length === 0 && (
            <div className="w-full py-8 text-center glass-card opacity-40 text-xs italic">لا توجد مشاريع هوايات نشطة...</div>
          )}
        </div>
      </section>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
        <input 
          type="text" 
          placeholder="ابحث في المكتبة..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] px-1">الكتب الحالية</h3>
        <div className="grid grid-cols-1 gap-4">
          {filteredLibrary.length === 0 && (
            <div className="p-12 text-center glass-card opacity-50">
              <Library size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">المكتبة فارغة. ابدأ بإضافة كتبكم المشتركة.</p>
            </div>
          )}
          
          {filteredLibrary.map(book => (
            <div key={book.id} className="glass-card p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-16 h-20 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <BookIcon size={32} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg">{book.title}</h4>
                  <p className="text-xs opacity-60">{book.author}</p>
                  <div className="mt-2 inline-block px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase">
                    {book.category}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="opacity-50">تقدم فهد</span>
                    <span className="text-blue-500">{Math.round((book.progress.F / book.totalPages) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(book.progress.F / book.totalPages) * 100}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="opacity-50">تقدم بشرى</span>
                    <span className="text-purple-500">{Math.round((book.progress.B / book.totalPages) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--color-bg-surface)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(book.progress.B / book.totalPages) * 100}%` }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[var(--color-bg-surface)]">
                <div className="text-[10px] font-bold opacity-50">
                  وصلت للصفحة {book.progress[currentUser]} من {book.totalPages}
                </div>
                <button 
                  onClick={() => updateBookProgress(book.id, Math.min(book.totalPages, book.progress[currentUser] + 10))}
                  className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1"
                >
                  تحديث التقدم <ChevronRight size={12} />
                </button>
              </div>

              {/* Audio Notes Section */}
              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-[10px] font-bold opacity-50 uppercase flex items-center gap-2">
                    <Mic size={12} /> هوامش صوتية مشتركة
                  </h5>
                  <button 
                    onClick={() => setShowAudioNote(book.id)}
                    className="p-1 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  {book.audioNotes?.map(note => (
                    <div key={note.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)]">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          <Play size={10} fill="currentColor" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold">صفحة {note.page} • {note.authorId === 'F' ? 'فهد' : 'بشرى'}</div>
                          <div className="text-[9px] opacity-60 truncate max-w-[150px]">{note.note}</div>
                        </div>
                      </div>
                      <MessageSquareQuote size={14} className="opacity-20" />
                    </div>
                  ))}
                  {(!book.audioNotes || book.audioNotes.length === 0) && (
                    <div className="text-[9px] opacity-30 italic text-center py-2">لا توجد هوامش صوتية بعد...</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {showAudioNote && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAudioNote(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-sm p-8 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">إضافة هامش صوتي</h3>
                <button onClick={() => setShowAudioNote(null)}><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <ModernInput 
                  label="رقم الصفحة" type="number"
                  value={audioNoteContent.page}
                  onChange={e => setAudioNoteContent(prev => ({ ...prev, page: Number(e.target.value) }))}
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">ملخص الهامش (أو النص المقروء)</label>
                  <textarea 
                    value={audioNoteContent.note}
                    onChange={e => setAudioNoteContent(prev => ({ ...prev, note: e.target.value }))}
                    className="input-field text-xs h-24 py-3 resize-none"
                    placeholder="سجل انطباعك عن هذه الصفحة..."
                  />
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
                  <Mic size={20} className="text-blue-500 animate-pulse" />
                  <p className="text-[10px] text-blue-600/70 italic">جاري محاكاة التسجيل الصوتي وتحويله لنص...</p>
                </div>
                <button 
                  onClick={() => handleAddAudioNote(showAudioNote)}
                  className="btn-primary w-full py-4"
                >
                  حفظ الهامش
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-sm p-8 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">إضافة كتاب جديد</h3>
                <button onClick={() => setShowAdd(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <ModernInput 
                  label="عنوان الكتاب" required
                  value={newBook.title}
                  onChange={e => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                />
                <ModernInput 
                  label="المؤلف" required
                  value={newBook.author}
                  onChange={e => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <ModernInput 
                    label="عدد الصفحات" type="number" required
                    value={newBook.totalPages}
                    onChange={e => setNewBook(prev => ({ ...prev, totalPages: Number(e.target.value) }))}
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold opacity-50 uppercase">الفئة</label>
                    <select 
                      value={newBook.category}
                      onChange={e => setNewBook(prev => ({ ...prev, category: e.target.value }))}
                      className="input-field text-xs py-3"
                    >
                      <option value="General">عام</option>
                      <option value="Self-Help">تطوير الذات</option>
                      <option value="Fiction">رواية</option>
                      <option value="Science">علوم</option>
                      <option value="History">تاريخ</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-4">إضافة للمكتبة</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PhotoCarousel: React.FC<{ photos: { url: string; timestamp: number }[] }> = ({ photos }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % photos.length);
  const prev = () => setIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="relative group overflow-hidden rounded-xl bg-black/20 aspect-video">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={photos[index].url}
          referrerPolicy="no-referrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      
      {photos.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={prev} className="w-6 h-6 rounded-full glass flex items-center justify-center text-white">
              <ChevronLeft size={14} />
            </button>
            <button onClick={next} className="w-6 h-6 rounded-full glass flex items-center justify-center text-white">
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </>
      )}
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full glass text-[8px] text-white font-bold">
        {new Date(photos[index].timestamp).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
};
