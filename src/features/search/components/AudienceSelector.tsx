import React from 'react';
import { AudienceType } from '../../../types';

interface AudienceSelectorProps {
  selectedAudience: AudienceType;
  onSelectAudience: (audience: AudienceType) => void;
  label?: string;
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
  label = 'Audience:',
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl shadow-2xs">
      {label && <span className="text-xs font-bold text-slate-400 pl-2 pr-1.5 select-none">{label}</span>}
      {AUDIENCE_OPTIONS.map((item) => {
        const isSelected = selectedAudience === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectAudience(item.id)}
            aria-pressed={isSelected}
            className={`relative px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer outline-none flex items-center justify-center active:scale-95 ${
              isSelected
                ? 'bg-[#A2FF00] text-[#0A0A0A] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="relative z-10 truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
