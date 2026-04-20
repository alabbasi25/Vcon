import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface KokabCardProps extends HTMLMotionProps<"div"> {
  variant?: 'glass' | 'solid' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const KokabCard: React.FC<KokabCardProps> = ({ 
  children, 
  variant = 'glass', 
  padding = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    glass: 'glass-card backdrop-blur-2xl',
    solid: 'bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[2rem]',
    outline: 'bg-transparent border-2 border-[var(--color-border)] rounded-[2rem]'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
