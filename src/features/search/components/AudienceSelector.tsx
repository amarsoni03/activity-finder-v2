import React from 'react';
import { motion } from 'motion/react';
import { AudienceType } from '../../../types';

interface AudienceSelectorProps {
  selectedAudience: AudienceType;
  onSelectAudience: (audience: AudienceType) => void;
  label?: string;
  layoutId?: string;
}

const AUDIENCE_OPTIONS: { id: AudienceType; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Adults', label: 'Adults' },
  { id: 'Children', label: 'Kids' },
  { id: 'Corporate', label: 'Corporate' },
];

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  selectedAudience,
  onSelectAudience,
  layoutId = 'audience-pill',
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 p-1 bg-slate-100 border border-slate-200/80 rounded-xl shadow-2xs w-full h-[52px] sm:h-[44px] items-center">
        {AUDIENCE_OPTIONS.map((item) => {
          const isSelected = selectedAudience === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectAudience(item.id)}
              className={`relative isolate overflow-hidden px-1 h-[44px] sm:h-[36px] rounded-lg text-xs sm:text-[11px] font-semibold transition-all duration-150 cursor-pointer outline-none flex items-center justify-center active:scale-95 group ${
                isSelected
                  ? 'bg-[#A2FF00] text-[#0A0A0A] font-bold shadow-xs border border-[#8ee600]/40'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-[#A2FF00] rounded-lg z-0 shadow-xs border border-[#8ee600]/40"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-10 truncate transition-colors duration-150 ${
                isSelected ? 'text-[#0A0A0A] font-bold' : 'text-[#475569] group-hover:text-slate-950'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
