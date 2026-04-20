import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, MessageCircle, Sparkles, Star, Cloud, LayoutGrid, Filter, Calendar, User, Search, X } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import * as d3 from 'd3';

export const GratitudeFeed: React.FC = () => {
  const { gratitudeFeed, addGratitude, likeGratitudePost, commentGratitudePost, shareGratitude, currentUser, barakahPoints } = usePlanet();
  const [content, setContent] = useState('');
  const [showCloud, setShowCloud] = useState(false);
  const [filterAuthor, setFilterAuthor] = useState<'all' | 'F' | 'B'>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week'>('all');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const wordCloudRef = useRef<SVGSVGElement>(null);

  const handlePost = () => {
    if (!content.trim()) return;
    addGratitude(content);
    setContent('');
  };

  const filteredFeed = useMemo(() => {
    return gratitudeFeed.filter(post => {
      const authorMatch = filterAuthor === 'all' || post.authorId === filterAuthor;
      
      const postDate = new Date(post.timestamp);
      const isToday = postDate.toDateString() === new Date().toDateString();
      const isThisWeek = Date.now() - post.timestamp < 7 * 24 * 60 * 60 * 1000;
      
      const dateMatch = filterDate === 'all' || (filterDate === 'today' && isToday) || (filterDate === 'week' && isThisWeek);
      
      return authorMatch && dateMatch;
    });
  }, [gratitudeFeed, filterAuthor, filterDate]);

  // Generate word cloud data using D3
  useEffect(() => {
    if (showCloud && wordCloudRef.current && gratitudeFeed.length > 0) {
      const allText = gratitudeFeed.map(p => p.content).join(' ');
      const words = allText.split(/\s+/)
        .filter(w => w.length > 2)
        .reduce((acc, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const dataset = Object.entries(words)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 30)
        .map(([text, value]) => ({ text, size: 15 + (value as number) * 10 }));

      const svg = d3.select(wordCloudRef.current);
      svg.selectAll('*').remove();

      const width = 400;
      const height = 200;

      svg.attr('viewBox', `0 0 ${width} ${height}`);

      const color = d3.scaleOrdinal(d3.schemePaired);

      const simulation = d3.forceSimulation(dataset as any)
        .force('x', d3.forceX(width / 2).strength(0.05))
        .force('y', d3.forceY(height / 2).strength(0.05))
        .force('collide', d3.forceCollide((d: any) => d.size / 2 + 5))
        .stop();

      for (let i = 0; i < 120; i++) simulation.tick();

      const g = svg.append('g');

      const texts = g.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(d => d.text)
        .attr('font-size', d => `${d.size}px`)
        .attr('font-weight', '900')
        .attr('fill', (d, i) => color(i.toString()))
        .attr('text-anchor', 'middle')
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y)
        .style('cursor', 'default')
        .style('opacity', 0);

      texts.transition()
        .duration(800)
        .delay((d, i) => i * 30)
        .style('opacity', 1);
    }
  }, [showCloud, gratitudeFeed]);

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;
    commentGratitudePost(postId, commentText);
    setCommentText('');
    setCommentingOn(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight">سجل المودة</h2>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">كلمات بسيطة تعني الكثير في قلب الكوكب</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowCloud(!showCloud)}
              className={`p-3 rounded-2xl transition-all ${showCloud ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}
            >
              <Cloud size={20} />
            </button>
            <div className="glass-card px-4 py-2 flex items-center gap-2 border-amber-500/30 bg-amber-500/10 shadow-inner">
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
              <div className="text-right">
                <div className="text-[8px] font-bold opacity-50 uppercase tracking-tighter">نقاط البركة</div>
                <div className="text-lg font-black text-amber-500">{barakahPoints}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <FilterBadge 
            active={filterAuthor === 'all'} 
            onClick={() => setFilterAuthor('all')} 
            icon={<Filter size={12} />} 
            label="الكل" 
          />
          <FilterBadge 
            active={filterAuthor === 'F'} 
            onClick={() => setFilterAuthor('F')} 
            icon={<User size={12} />} 
            label="فهد" 
          />
          <FilterBadge 
            active={filterAuthor === 'B'} 
            onClick={() => setFilterAuthor('B')} 
            icon={<User size={12} />} 
            label="بشرى" 
          />
          <div className="w-px h-6 bg-[var(--color-border)] self-center mx-1" />
          <FilterBadge 
            active={filterDate === 'all'} 
            onClick={() => setFilterDate('all')} 
            icon={<Calendar size={12} />} 
            label="كل الوقت" 
          />
          <FilterBadge 
            active={filterDate === 'today'} 
            onClick={() => setFilterDate('today')} 
            label="اليوم" 
          />
          <FilterBadge 
            active={filterDate === 'week'} 
            onClick={() => setFilterDate('week')} 
            label="الأسبوع" 
          />
        </div>
      </div>

      <AnimatePresence>
        {showCloud && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 border-rose-500/20 bg-rose-500/10 space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 text-rose-500">
                <LayoutGrid size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">سحابة مشاعر الكوكب</h3>
              </div>
              
              <div className="relative w-full h-[200px] flex items-center justify-center">
                <svg ref={wordCloudRef} className="w-full h-full" />
              </div>
              
              <p className="text-[10px] opacity-40 italic">هذه الكلمات هي الأكثر تكراراً في سجل المودة الخاص بكما.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card p-6 space-y-4 border-rose-500/20 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-focus-within:opacity-20 transition-opacity">
          <Heart size={80} className="text-rose-500" />
        </div>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="بماذا تشعر بالامتنان تجاه شريكك اليوم؟"
          className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium resize-none h-24 no-scrollbar placeholder:text-[var(--color-text-secondary)] placeholder:opacity-40 relative z-10 text-[var(--color-text-primary)]"
        />
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2 text-[10px] text-amber-500 font-black uppercase tracking-tighter bg-amber-500/10 px-3 py-1.5 rounded-full">
            <Star size={12} className="animate-spin-slow" /> ستحصل على +25 نقطة بركة
          </div>
          <button 
            onClick={handlePost}
            disabled={!content.trim()}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-rose-500/30 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50"
          >
            <Send size={18} /> نشر في الكوكب
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredFeed.map(post => (
            <motion.div 
              key={post.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.01 }}
              className="glass-card p-6 space-y-4 border-[var(--color-border)]/50 hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${post.authorId === 'F' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'} flex items-center justify-center font-black text-sm border border-current/10`}>
                    {post.authorId}
                  </div>
                  <div>
                    <div className="text-xs font-black">{post.authorId === 'F' ? 'فهد' : 'بشرى'}</div>
                    <div className="text-[8px] opacity-40 font-bold">{new Date(post.timestamp).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {post.reactions.map((r, idx) => (
                    <span key={idx} className="text-xs">{r}</span>
                  ))}
                </div>
              </div>
              
              <p className="text-base leading-relaxed font-medium">{post.content}</p>
              
              <div className="flex items-center gap-6 pt-4 border-t border-[var(--color-border)]/40">
                <button 
                  onClick={() => likeGratitudePost(post.id)}
                  className={`flex items-center gap-2 ${post.likes.includes(currentUser) ? 'text-rose-500' : 'text-[var(--color-text-secondary)]'} text-xs font-black transition-colors`}
                >
                  <Heart size={16} fill={post.likes.includes(currentUser) ? 'currentColor' : 'none'} />
                  {post.likes.length > 0 && <span>{post.likes.length}</span>}
                  <span>حب</span>
                </button>
                <button 
                  onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs font-black hover:text-[var(--color-primary)] transition-colors"
                >
                  <MessageCircle size={16} />
                  {post.comments.length > 0 && <span>{post.comments.length}</span>}
                  <span>تعليق</span>
                </button>
                <button 
                  onClick={() => shareGratitude(post.id)}
                  className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs font-black hover:text-amber-500 transition-all hover:scale-110 active:scale-95"
                  title="مشاركة مع الشريك"
                >
                  <Send size={16} className="-rotate-45" />
                  <span>مشاركة</span>
                </button>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {(commentingOn === post.id || post.comments.length > 0) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-3 pt-4"
                  >
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-[8px] font-black w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                          {comment.userId}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-medium">{comment.text}</p>
                          <div className="text-[8px] opacity-30">{new Date(comment.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    ))}
                    
                    {commentingOn === post.id && (
                      <div className="flex gap-2 pt-2">
                        <input 
                          autoFocus
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                          placeholder="اكتب تعليقاً..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-rose-500 outline-none"
                        />
                        <button 
                          onClick={() => handleComment(post.id)}
                          className="p-2 rounded-xl bg-rose-500 text-white"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const FilterBadge: React.FC<{ active: boolean; onClick: () => void; icon?: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${active ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'bg-white/5 text-[var(--color-text-secondary)] border border-white/10 hover:bg-white/10'}`}
  >
    {icon}
    {label}
  </button>
);
