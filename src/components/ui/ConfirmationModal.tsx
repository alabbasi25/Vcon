import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  variant = 'danger'
}) => {
  const colors = {
    danger: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    info: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  };

  const btnColors = {
    danger: 'bg-rose-500 shadow-rose-500/20',
    warning: 'bg-amber-500 shadow-amber-500/20',
    info: 'bg-blue-500 shadow-blue-500/20'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="modal-content max-w-sm p-8"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 ${colors[variant]}`}>
                <AlertTriangle size={40} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex gap-3 w-full pt-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl glass text-sm font-bold hover:bg-white/5 transition-all"
                >
                  {cancelLabel}
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-4 rounded-2xl text-white text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95 ${btnColors[variant]}`}
                >
                  {confirmLabel}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
