import React from 'react';
import { DeliveryFilter } from '../../../types';
import { normalizeDeliveryMode } from '../utils/search';

interface AttendanceModeSelectorProps {
  selectedMode: DeliveryFilter;
  onSelectMode: (mode: DeliveryFilter) => void;
  label?: string;
}

const ATTENDANCE_OPTIONS: {
  id: DeliveryFilter;
  label: string;
}[] = [
  { id: 'In Person', label: '📍 In Person' },
  { id: 'Live Online', label: '💻 Online' },
  { id: 'All', label: 'All' },
];

export const AttendanceModeSelector: React.FC<AttendanceModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  label = 'Mode:',
}) => {
  const activeMode = normalizeDeliveryMode(selectedMode);

  return (
    <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl shadow-2xs">
      {label && <span className="text-xs font-bold text-slate-400 pl-2 pr-1.5 select-none">{label}</span>}
      {ATTENDANCE_OPTIONS.map((option) => {
        const isSelected = activeMode === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectMode(option.id)}
            aria-pressed={isSelected}
            className={`relative px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer outline-none flex items-center justify-center active:scale-95 ${
              isSelected
                ? 'bg-[#A2FF00] text-[#0A0A0A] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="relative z-10 truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
