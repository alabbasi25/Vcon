import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Users, Plus, X } from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ModernInput } from '../ui/ModernInput';

export const GlobalSchedule: React.FC = () => {
  const { calendar, addCalendarEvent, deleteCalendarEvent } = usePlanet();
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', startTime: '', location: '', category: 'other' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addCalendarEvent({
      ...newEvent,
      startTime: new Date(newEvent.startTime).getTime(),
      endTime: new Date(newEvent.startTime).getTime() + 3600000
    });
    setShowAdd(false);
    setNewEvent({ title: '', startTime: '', location: '', category: 'other' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">التقويم الكوني</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">دمج مواعيدنا في جدول واحد</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {calendar.length === 0 && (
          <div className="p-20 text-center glass-card opacity-30 flex flex-col items-center gap-4">
            <Calendar size={48} />
            <p className="text-sm font-bold">لا توجد مواعيد مجدولة حالياً. الكوكب في انتظار خططكما.</p>
          </div>
        )}
        {calendar.map(event => (
          <div key={event.id} className="glass-card p-6 flex gap-6 items-start group relative">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] min-w-[60px]">
              <span className="text-xs font-bold uppercase">{new Date(event.startTime).toLocaleDateString('ar-EG', { month: 'short' })}</span>
              <span className="text-2xl font-black">{new Date(event.startTime).getDate()}</span>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <div className="flex gap-2">
                  <div className="px-2 py-1 rounded-md bg-[var(--color-bg-surface)] text-[10px] font-bold uppercase opacity-60">
                    {event.category}
                  </div>
                  <button 
                    onClick={() => deleteCalendarEvent(event.id)}
                    className="p-1 rounded-lg text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {new Date(event.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </div>
                {event.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {event.location}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users size={14} />
                  {event.participants.join(' & ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="modal-content max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">إضافة موعد</h3>
                <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full glass flex items-center justify-center"><X size={16} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <ModernInput label="عنوان الموعد" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase opacity-40">التوقيت</label>
                  <input type="datetime-local" required className="input-field text-xs py-3" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} />
                </div>
                <ModernInput label="المكان" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} icon={<MapPin size={16} />} />
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase opacity-40">الفئة</label>
                  <select className="input-field text-xs h-12" value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}>
                    <option value="other">أخرى</option>
                    <option value="work">عمل</option>
                    <option value="social">اجتماعي</option>
                    <option value="health">صحة</option>
                    <option value="trip">رحلة</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full py-4 uppercase font-black tracking-widest text-xs">حفظ الموعد</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
