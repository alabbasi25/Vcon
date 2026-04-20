import React from 'react';

interface KokabBadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  icon?: React.ReactNode;
  className?: string;
}

export const KokabBadge: React.FC<KokabBadgeProps> = ({ 
  label, 
  variant = 'secondary', 
  icon,
  className = ''
}) => {
  const variants = {
    primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20',
    secondary: 'bg-[var(--color-bg-surface)]/30 text-[var(--color-text-secondary)] border-[var(--color-border)]/50',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    danger: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider
      ${variants[variant]}
      ${className}
    `}>
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
    </div>
  );
};
