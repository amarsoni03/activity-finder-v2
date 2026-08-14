import React from 'react';
import { motion } from 'motion/react';
import { DeliveryFilter } from '../../../types';

interface AttendanceModeSelectorProps {
  selectedMode: DeliveryFilter;
  onSelectMode: (mode: DeliveryFilter) => void;
  layoutId?: string;
}

const ATTENDANCE_OPTIONS: {
  id: DeliveryFilter;
  title: string;
}[] = [
  {
    id: 'In Person',
    title: 'Near Me',
  },
  {
    id: 'Live Online',
    title: 'Online',
  },
  {
    id: 'All',
    title: 'Both',
  },
];

export const AttendanceModeSelector: React.FC<AttendanceModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  layoutId = 'attendance-pill',
}) => {
  const activeId: DeliveryFilter =
    selectedMode === 'Self-Paced' || selectedMode === 'Hybrid' || selectedMode === 'Live Online'
      ? 'Live Online'
      : selectedMode === 'In Person'
      ? 'In Person'
      : 'All';

  return (
    <div className="inline-flex p-1 bg-slate-100 border border-slate-200/80 rounded-xl shadow-2xs w-full max-w-[310px] sm:w-[280px] h-[46px] sm:h-[36px] items-center">
      {ATTENDANCE_OPTIONS.map((option) => {
        const isSelected = activeId === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectMode(option.id)}
            className={`relative isolate overflow-hidden flex-1 px-2 h-[38px] sm:h-[28px] rounded-lg text-xs sm:text-[11px] font-semibold transition-all duration-150 cursor-pointer outline-none flex items-center justify-center active:scale-95 group ${
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
              {option.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};
