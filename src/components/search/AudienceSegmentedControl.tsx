import React from 'react';
import { motion } from 'motion/react';
import { AudienceType } from '../../types';

interface AudienceSegmentedControlProps {
  selectedAudience: AudienceType;
  onSelectAudience: (audience: AudienceType) => void;
}

const AUDIENCE_OPTIONS: { id: AudienceType; label: string; icon: string }[] = [
  { id: 'All', label: 'All', icon: '✨' },
  { id: 'Adults', label: 'Adults', icon: '👨' },
  { id: 'Children', label: 'Kids', icon: '🧒' },
  { id: 'Corporate', label: 'Corporate', icon: '🏢' },
];

export const AudienceSegmentedControl: React.FC<AudienceSegmentedControlProps> = ({
  selectedAudience,
  onSelectAudience,
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 w-full">
      {AUDIENCE_OPTIONS.map((item) => {
        const isSelected = selectedAudience === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectAudience(item.id)}
            className={`relative flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isSelected ? 'text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="audienceActiveSegment"
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 text-sm">{item.icon}</span>
            <span className="relative z-10 truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
