import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const ModernInput: React.FC<ModernInputProps> = ({ label, icon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex flex-col gap-1 w-full group">
      <label 
        className={`absolute right-4 transition-all duration-300 pointer-events-none z-10 ${
          isFocused || props.value 
            ? '-top-2.5 text-[10px] bg-[var(--color-bg-card)] px-2 text-[var(--color-primary)] font-black uppercase tracking-wider' 
            : 'top-4 text-sm text-[var(--color-text-secondary)]/60 font-bold'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
            {icon}
          </div>
        )}
        <input
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`input-field font-bold text-sm ${icon ? 'pl-12' : ''} ${isFocused ? 'ring-4 ring-[var(--color-primary)]/10' : ''}`}
        />
      </div>
    </div>
  );
};
