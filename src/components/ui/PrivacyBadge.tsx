import React from 'react';
import { Lock, Eye, Users } from 'lucide-react';
import { PrivacyState } from '../../types';

interface PrivacyBadgeProps {
  state: PrivacyState;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ state }) => {
  const config = {
    private: { icon: <Lock size={12} />, text: 'خاص', class: 'bg-red-500/10 text-red-500 border-red-500/20' },
    visible: { icon: <Eye size={12} />, text: 'مرئي', class: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    shared: { icon: <Users size={12} />, text: 'مشترك', class: 'bg-green-500/10 text-green-500 border-green-500/20' },
  };

  const { icon, text, class: className } = config[state];

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${className}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};
