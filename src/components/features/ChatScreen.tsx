import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Smile, 
  Keyboard, 
  MoreVertical, 
  Reply, 
  Trash2, 
  Edit3, 
  Copy, 
  Share2, 
  Check, 
  CheckCheck,
  X,
  ChevronLeft,
  Search,
  Star,
  AudioLines,
  Square,
  Layers,
  FileText,
  User,
  Play,
  Pause,
  MessageCircle,
  Clock
} from 'lucide-react';
import { usePlanet } from '../../context/KokabContext';
import { ChatMessage, UserID } from '../../types';
import { KokabButton } from '../ui/KokabButton';

export const ChatScreen: React.FC = () => {
  const { 
    messages, currentUser, sendMessage, editMessage, deleteMessage, addChatReaction, partnerStatus,
    isPartnerTyping, setTypingStatus, markMessagesRead
  } = usePlanet();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<{ duration: number; url: string } | null>(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [forwardingMsg, setForwardingMsg] = useState<ChatMessage | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recordingInterval = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isFahad = currentUser === 'F';
  const partnerName = isFahad ? 'بشرى' : 'فهد';

  const emojiList = ['❤️', '😂', '🔥', '👍', '🙏', '😍', '🙌', '🎉', '😢', '😡', '🤔', '✨', '☕', '🌹', '🌙', '⭐', '🎈', '🎁', '📸', '📍'];

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    markMessagesRead();
  }, [messages.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 400);
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    
    // Typing indicator logic
    setTypingStatus(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(false);
    }, 3000);
  };

  const handleSend = () => {
    if (editingMessage) {
      editMessage(editingMessage.id, inputText);
      setEditingMessage(null);
    } else if (forwardingMsg) {
      sendMessage({
        text: forwardingMsg.text,
        type: forwardingMsg.type,
        audioUrl: forwardingMsg.audioUrl,
        fileData: forwardingMsg.fileData,
        isForwarded: true
      });
      setForwardingMsg(null);
    } else if (audioPreview) {
      sendMessage({
        text: `بصمة صوتية (${Math.floor(audioPreview.duration / 60)}:${(audioPreview.duration % 60).toString().padStart(2, '0')})`,
        type: 'audio',
        audioUrl: audioPreview.url
      });
      setAudioPreview(null);
    } else if (inputText.trim()) {
      sendMessage({
        text: inputText,
        replyToId: replyingTo?.id,
        type: 'text'
      });
    }
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setTypingStatus(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (recordingTime > 0) {
          setAudioPreview({ duration: recordingTime, url: audioUrl });
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioPreview(null);
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("يرجى السماح بالوصول للميكروفون لتتمكن من تسجيل الصوت.");
    }
  };

  const stopRecording = (cancel = false) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(recordingInterval.current);
    if (cancel) {
      setAudioPreview(null);
    }
    setRecordingTime(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        sendMessage({
          text: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          fileData: {
            name: file.name,
            size: file.size,
            url: dataUrl
          }
        });
      };
      reader.readAsDataURL(file);
    }
    setShowAttachments(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
    // Keep picker open for multiple emojis
  };

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;
    return messages.filter(m => m.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, searchTerm]);

  const groupMessagesByDate = useMemo(() => {
    const groups: { date: string, msgs: ChatMessage[] }[] = [];
    filteredMessages.forEach(msg => {
      const dateStr = new Date(msg.timestamp).toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === dateStr) {
        lastGroup.msgs.push(msg);
      } else {
        groups.push({ date: dateStr, msgs: [msg] });
      }
    });
    return groups;
  }, [filteredMessages]);

  const toggleMultiSelect = (id: string) => {
    setIsMultiSelect(true);
    setSelectedMessages(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleReaction = (msgId: string, emoji: string) => {
    addChatReaction(msgId, emoji);
    setActiveMenuId(null);
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] flex flex-col z-[100] text-white overflow-hidden font-sans rtl" style={{ direction: 'rtl' }}>
      {/* Header */}
      <header className="h-16 px-4 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="p-2 -mr-2"
          >
            <ChevronLeft size={24} />
          </motion.button>
          
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div 
                key="search"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex items-center bg-white/5 rounded-full px-3 py-1 mr-2"
              >
                <Search size={14} className="opacity-40" />
                <input 
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث عن رسالة..."
                  className="bg-transparent border-none text-xs w-full focus:ring-0 outline-none px-2"
                />
                <button onClick={() => { setShowSearch(false); setSearchTerm(''); }} className="p-1 opacity-40"><X size={14} /></button>
              </motion.div>
            ) : (
              <motion.div 
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerName}`} 
                      alt="Partner" 
                    />
                  </div>
                  {partnerStatus?.status === 'online' && (
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black">{partnerName}</span>
                  <span className={`text-[10px] transition-colors ${isPartnerTyping ? 'text-emerald-400 font-bold' : 'opacity-40'}`}>
                    {isPartnerTyping ? 'يكتب الآن...' : partnerStatus?.status === 'online' ? 'متصل الآن' : 'غير متصل'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {isMultiSelect ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full">{selectedMessages.length} محدد</span>
              <button 
                onClick={() => {
                  selectedMessages.forEach(id => deleteMessage(id));
                  setIsMultiSelect(false);
                  setSelectedMessages([]);
                }}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                title="حذف المحدد"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={() => { setIsMultiSelect(false); setSelectedMessages([]); }}
                className="p-2 opacity-60 hover:bg-white/5 rounded-full transition-colors"
                title="إلغاء"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <>
              {!showSearch && <button onClick={() => setShowSearch(true)} className="p-2 opacity-60"><Search size={20} /></button>}
              <button className="p-2 opacity-60"><MoreVertical size={20} /></button>
            </>
          )}
        </div>
      </header>

      {/* Chat Background / Messages */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6 pt-6 no-scrollbar bg-[url('https://picsum.photos/seed/chat-bg/1000/2000?blur=10')] bg-fixed bg-cover relative"
      >
        <div className="absolute inset-0 bg-[#0f172a]/90" /> {/* Backdrop Overlay */}
        
        {messages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 space-y-4">
             <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <MessageCircle size={40} />
             </div>
             <div className="space-y-1">
               <h3 className="font-black text-lg">بدء المحادثة</h3>
               <p className="text-xs opacity-50 max-w-[200px]">لا توجد رسائل بعد. ابدأ بمشاركة مشاعرك أو أفكارك مع {partnerName}.</p>
             </div>
          </div>
        )}
        
        <AnimatePresence>
          {showScrollBottom && (
            <motion.button 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={scrollToBottom}
              className="fixed bottom-24 left-6 z-30 w-10 h-10 rounded-full bg-emerald-500 text-white shadow-2xl flex items-center justify-center border border-white/20"
            >
              <ChevronLeft size={20} className="-rotate-90" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {groupMessagesByDate.map(group => (
          <div key={group.date} className="space-y-4 relative z-10">
            <div className="flex justify-center sticky top-2 z-20">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold backdrop-blur-md opacity-60">
                {group.date}
              </span>
            </div>

            {group.msgs.map(msg => (
              <MessageBubble 
                key={msg.id}
                msg={msg}
                currentUser={currentUser}
                onSelect={() => toggleMultiSelect(msg.id)}
                isSelected={selectedMessages.includes(msg.id)}
                isSelectMode={isMultiSelect}
                onReply={() => setReplyingTo(msg)}
                onEdit={() => { setEditingMessage(msg); setInputText(msg.text); }}
                onDelete={() => deleteMessage(msg.id)}
                onReaction={(emoji) => handleReaction(msg.id, emoji)}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                replyToMsg={messages.find(m => m.id === msg.replyToId)}
                partnerName={partnerName}
                onReplyClick={(id) => {
                  const el = document.getElementById(`msg-${id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                playingAudioId={playingAudioId}
                onToggleAudio={(id) => setPlayingAudioId(playingAudioId === id ? null : id)}
                onForward={() => setForwardingMsg(msg)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <footer className="p-2 bg-[#0f172a] border-t border-white/5 z-20 relative">
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 250, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-6 gap-2 p-4 overflow-y-auto no-scrollbar border-b border-white/5 bg-[#1e293b]/50 backdrop-blur-xl rounded-t-3xl mb-2"
            >
              {emojiList.map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-2xl p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}

          {showAttachments && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="absolute bottom-full left-4 mb-4 bg-[#1e293b] border border-white/10 p-4 rounded-3xl shadow-2xl flex flex-col gap-4 z-50 min-w-[200px]"
            >
               <h4 className="text-[10px] uppercase font-black opacity-40 px-2">إرفاق ملف</h4>
               <AttachmentOption icon={<Layers size={18} />} label="معرض الصور" onClick={() => fileInputRef.current?.click()} color="text-emerald-500" />
               <AttachmentOption icon={<FileText size={18} />} label="ملف" onClick={() => fileInputRef.current?.click()} color="text-blue-500" />
               <AttachmentOption icon={<User size={18} />} label="جهة اتصال" onClick={() => setShowAttachments(false)} color="text-amber-500" />
               <AttachmentOption icon={<Star size={18} />} label="موقع" onClick={() => setShowAttachments(false)} color="text-rose-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
        />

        <AnimatePresence>
          {replyingTo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-2 flex items-center gap-3 border-r-2 border-emerald-500 bg-emerald-500/5 mb-2 rounded-l-lg"
            >
              <div className="flex-1 py-2 text-right">
                <div className="text-[10px] font-black text-emerald-500">رد على {replyingTo.senderId === currentUser ? 'نفسك' : partnerName}</div>
                <div className="text-xs opacity-60 truncate">{replyingTo.text}</div>
              </div>
              <button 
                onClick={() => setReplyingTo(null)}
                className="p-1 opacity-40"
              ><X size={14} /></button>
            </motion.div>
          )}

          {forwardingMsg && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-2 flex items-center gap-3 border-r-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5 mb-2 rounded-l-lg"
            >
              <div className="flex-1 py-2 text-right">
                <div className="text-[10px] font-black text-[var(--color-primary)] flex items-center gap-1">
                  <Share2 size={10} /> رسالة محولة
                </div>
                <div className="text-xs opacity-60 truncate">{forwardingMsg.text}</div>
              </div>
              <button 
                onClick={() => setForwardingMsg(null)}
                className="p-1 opacity-40"
              ><X size={14} /></button>
            </motion.div>
          )}

          {editingMessage && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-2 flex items-center gap-3 border-r-2 border-blue-500 bg-blue-500/5 mb-2 rounded-l-lg"
            >
              <div className="flex-1 py-2 text-right">
                <div className="text-[10px] font-black text-blue-500">تعديل الرسالة</div>
                <div className="text-xs opacity-60 truncate">{editingMessage.text}</div>
              </div>
              <button 
                onClick={() => { setEditingMessage(null); setInputText(''); }}
                className="p-1 opacity-40"
              ><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 px-1">
          {/* Reaction / Picker Toggle */}
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-3 rounded-2xl transition-colors shrink-0 ${showEmojiPicker ? 'text-emerald-500 bg-emerald-500/10' : 'opacity-60 hover:bg-white/5'}`}
          >
            {showEmojiPicker ? <Keyboard size={24} /> : <Smile size={24} />}
          </button>

          {/* Main Input Field */}
          <div className="flex-1 relative bg-white/5 border border-white/10 rounded-3xl min-h-[48px] flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div 
                  key="recording"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex items-center justify-between px-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-sm font-mono">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <motion.div 
                    animate={{ x: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-[10px] font-bold opacity-40 flex items-center gap-1"
                  >
                    اسحب لليسار للإلغاء <X size={10} />
                  </motion.div>
                </motion.div>
              ) : audioPreview ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex-1 flex items-center justify-between px-4 py-2"
                >
                  <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                    <AudioLines size={16} />
                    <span className="text-[10px] font-black">جاهز للإرسال...</span>
                  </div>
                  <button 
                    onClick={() => setAudioPreview(null)}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.textarea 
                  key="input"
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  rows={1}
                  className="w-full bg-transparent border-none px-4 py-3 text-sm focus:ring-0 outline-none resize-none no-scrollbar font-sans text-right"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setShowAttachments(!showAttachments)}
              className={`p-3 transition-colors shrink-0 ${showAttachments ? 'text-emerald-500' : 'opacity-40 hover:opacity-100'}`}
            >
              <Paperclip size={20} />
            </button>
          </div>

          {/* Action Button: Mic or Send */}
          <motion.button 
            as={motion.button}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (inputText.trim() || editingMessage || audioPreview) handleSend();
              else if (isRecording) stopRecording();
            }}
            onPointerDown={(e) => { 
                if (!inputText.trim() && !editingMessage && !audioPreview) {
                   startRecording(); 
                }
            }}
            onPointerUp={(e) => { if (isRecording) stopRecording(); }}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors shrink-0 ${
              (inputText.trim() || editingMessage || audioPreview) ? 'bg-emerald-500 text-white' : isRecording ? 'bg-rose-500 text-white' : 'glass opacity-60'
            }`}
          >
            {(inputText.trim() || editingMessage || audioPreview) ? <Send size={22} className="rotate-180" /> : <Mic size={22} />}
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

interface MessageBubbleProps {
  msg: ChatMessage;
  currentUser: UserID;
  onSelect: () => void;
  isSelected: boolean;
  isSelectMode: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReaction: (emoji: string) => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  replyToMsg?: ChatMessage;
  partnerName: string;
  onReplyClick: (id: string) => void;
  playingAudioId: string | null;
  onToggleAudio: (id: string) => void;
  onForward: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  msg, currentUser, onSelect, isSelected, isSelectMode, onReply, onEdit, onDelete, onReaction, activeMenuId, setActiveMenuId, replyToMsg, partnerName,
  onReplyClick, playingAudioId, onToggleAudio, onForward
}) => {
  const isOwn = msg.senderId === currentUser;
  const showMenu = activeMenuId === msg.id;
  
  const x = useMotionValue(0);
  const swipeOpacity = useTransform(x, [0, 80], [0, 1]);
  const swipeRotate = useTransform(x, [0, 80], [0, 10]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 80) {
      onReply();
    }
  };

  const formatTime = (time: number) => {
    return new Date(time).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const reactionEmojis = ['❤️', '😂', '🔥', '👍', '🙏'];

  return (
    <div 
      id={`msg-${msg.id}`}
      className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'} relative px-2`}
      onClick={() => isSelectMode && onSelect()}
    >
      {/* Swipe Reply indicator */}
      <motion.div 
        style={{ opacity: swipeOpacity, x: -40, rotate: swipeRotate }}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/20 text-emerald-500 rounded-full"
      >
        <Reply size={16} />
      </motion.div>

      <motion.div 
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{ x: isSelected ? (isOwn ? -20 : 20) : 0 }}
        style={{ x }}
        className={`group relative max-w-[85%] sm:max-w-[70%] rounded-2xl p-0.5 transition-all ${
          isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#0f172a]' : ''
        }`}
      >
        <div 
          onClick={(e) => {
            if (!isSelectMode) {
              e.stopPropagation();
              setActiveMenuId(showMenu ? null : msg.id);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setActiveMenuId(msg.id);
          }}
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            isOwn 
              ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tl-none' 
              : 'bg-[#1e293b] text-white rounded-tr-none border border-white/5'
          }`}
        >
          {/* Reply Section */}
          {replyToMsg && (
            <div 
              onClick={(e) => { e.stopPropagation(); onReplyClick(replyToMsg.id); }}
              className={`mb-2 p-2 rounded-lg border-r-2 border-white/30 bg-black/10 text-right cursor-pointer hover:bg-black/20 transition-colors`}
            >
              <div className="text-[9px] font-black opacity-60">رداً على {replyToMsg.senderId === currentUser ? 'نفسك' : partnerName}</div>
              <div className="text-[11px] opacity-80 truncate">{replyToMsg.text}</div>
            </div>
          )}

          {/* Message Content */}
          {msg.type === 'audio' ? (
            <div className="flex items-center gap-3 min-w-[200px]">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleAudio(msg.id); }}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 hover:bg-white/30 transition-all active:scale-95"
              >
                {playingAudioId === msg.id ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="translate-x-0.5" fill="currentColor" />}
              </button>
              <div className="flex-1 space-y-1 py-1">
                <div className="h-4 w-full flex items-center gap-1">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={playingAudioId === msg.id ? { height: [ '20%', '100%', '40%', '80%', '20%' ] } : { height: '30%' }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                      className={`flex-1 rounded-full bg-white/40`} 
                      style={{ height: '30%' }} 
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[8px] font-bold opacity-60">
                   <span>{playingAudioId === msg.id ? '00:04' : '00:15'}</span>
                   <span>128kbps</span>
                </div>
              </div>
              {msg.audioUrl && playingAudioId === msg.id && (
                <audio 
                  src={msg.audioUrl} 
                  autoPlay 
                  onEnded={() => onToggleAudio(msg.id)}
                  className="hidden"
                />
              )}
            </div>
          ) : msg.type === 'image' && msg.fileData ? (
             <div className="space-y-2">
                <img 
                  src={msg.fileData.url} 
                  alt={msg.fileData.name} 
                  className="max-w-full rounded-lg shadow-inner cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); window.open(msg.fileData!.url); }}
                />
                <div className="text-[10px] opacity-60 truncate max-w-[200px]">{msg.fileData.name}</div>
             </div>
          ) : msg.type === 'file' && msg.fileData ? (
             <div 
               className="flex items-center gap-3 p-2 bg-black/10 rounded-xl cursor-pointer hover:bg-black/20 transition-all"
               onClick={(e) => { e.stopPropagation(); window.open(msg.fileData!.url); }}
             >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                   <FileText size={20} />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-bold truncate max-w-[150px]">{msg.fileData.name}</span>
                   <span className="text-[9px] opacity-60">{(msg.fileData.size / 1024).toFixed(1)} KB</span>
                </div>
             </div>
          ) : (
             <div className="text-[14px] leading-relaxed break-words text-right whitespace-pre-wrap">{msg.text}</div>
          )}
        </div>

        <div className="flex items-center justify-start gap-1 mt-1 opacity-40 text-[9px] font-bold">
          {msg.isForwarded && <span className="flex items-center gap-0.5"><Share2 size={8} /> محولة</span>}
          {msg.editedAt && <span>معدلة</span>}
          <span>{formatTime(msg.timestamp)}</span>
          {isOwn && (
            <span className="flex items-center">
              {msg.status === 'read' ? (
                <CheckCheck size={11} className="text-emerald-400" />
              ) : msg.status === 'sent' ? (
                <Check size={11} />
              ) : (
                <Clock size={11} />
              )}
            </span>
          )}
        </div>

        {/* Reactions Display */}
        {Object.entries(msg.reactions).length > 0 && (
          <div className={`absolute -bottom-3 ${isOwn ? 'left-0' : 'right-0'} flex -space-x-1 rtl:space-x-reverse`}>
            {Object.entries(msg.reactions).map(([emoji, users]) => {
              const uArray = users as UserID[];
              return (
                <div key={emoji} className="flex items-center gap-0.5 bg-[#1e293b] border border-white/10 rounded-full px-1.5 py-0.5 shadow-lg">
                  <span className="text-[10px]">{emoji}</span>
                  {uArray.length > 1 && <span className="text-[8px] font-bold">{uArray.length}</span>}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Swipe Left Time Details */}
      <motion.div 
        style={{ opacity: useTransform(x, [0, -60], [0, 1]), x: 70 }}
        className="absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-bold opacity-40"
      >
        {new Date(msg.timestamp).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
      </motion.div>

      {/* Interaction Menu / Reactions */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }}
              className="fixed inset-0 z-40"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              className={`absolute z-50 bottom-full mb-4 ${isOwn ? 'left-0' : 'right-0'} min-w-[200px] bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-2 font-sans`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Reactions Bar */}
              <div className="flex justify-between items-center px-2 py-2 border-b border-white/5 mb-2 overflow-x-auto no-scrollbar gap-2">
                {reactionEmojis.map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => onReaction(emoji)}
                    className="text-xl p-1 hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Actions List */}
              <div className="space-y-1">
                  <MenuAction icon={<Reply size={16} />} label="رد" onClick={() => { onReply(); setActiveMenuId(null); }} />
                  <MenuAction icon={<Copy size={16} />} label="نسخ" onClick={() => { navigator.clipboard.writeText(msg.text); setActiveMenuId(null); }} />
                  {isOwn && <MenuAction icon={<Edit3 size={16} />} label="تعديل" onClick={() => { onEdit(); setActiveMenuId(null); }} color="text-blue-500" />}
                  <MenuAction icon={<Share2 size={16} />} label="إعادة توجيه" onClick={() => { onForward(); setActiveMenuId(null); }} />
                  <MenuAction icon={<Star size={16} />} label="تمييز" onClick={() => setActiveMenuId(null)} />
                {isOwn && (
                  <MenuAction 
                    icon={<Trash2 size={16} />} 
                    label="حذف" 
                    onClick={() => { onDelete(); setActiveMenuId(null); }} 
                    color="text-rose-500" 
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuAction: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; color?: string }> = ({ icon, label, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all ${color || 'text-white'}`}
  >
    <span className="text-xs font-bold">{label}</span>
    {icon}
  </button>
);

const AttachmentOption: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; color: string }> = ({ icon, label, onClick, color }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 px-3 py-2 rounded-xl hover:bg-white/5 transition-all text-white"
  >
    <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <span className="text-xs font-bold">{label}</span>
  </button>
);
