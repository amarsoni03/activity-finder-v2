import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimeOfDay, DayOfWeek } from '../../../types';

interface TimeSelectorPopoverProps {
  selectedTimes: TimeOfDay[];
  selectedDays: DayOfWeek[];
  onToggleTime: (time: TimeOfDay) => void;
  onSelectDays: (days: DayOfWeek[]) => void;
  label?: string;
  isMobileModal?: boolean;
}

export const TimeSelectorPopover: React.FC<TimeSelectorPopoverProps> = ({
  selectedTimes,
  selectedDays,
  onToggleTime,
  onSelectDays,
  label = 'Time',
  isMobileModal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeSummary = React.useMemo(() => {
    const parts: string[] = [];
    if (selectedTimes.length > 0) {
      parts.push(selectedTimes.join(', '));
    }
    if (selectedDays.includes('Saturday') && selectedDays.includes('Sunday') && selectedDays.length === 2) {
      parts.push('Weekend');
    } else if (selectedDays.length > 0 && selectedDays.length < 7) {
      parts.push(`${selectedDays.length} Days`);
    }

    if (parts.length === 0) return 'Any Time';
    return parts.join(' • ');
  }, [selectedTimes, selectedDays]);

  const isWeekendActive =
    selectedDays.includes('Saturday') && selectedDays.includes('Sunday') && selectedDays.length === 2;

  const isWeekdayActive =
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].every((d) =>
      selectedDays.includes(d as DayOfWeek)
    ) && selectedDays.length === 5;

  const renderContent = (inMobileModal: boolean) => (
    <div className="space-y-4">
      {/* Time of Day */}
      <div>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Time of Day
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['Morning', 'Afternoon', 'Evening'] as TimeOfDay[]).map((slot) => {
            const isActive = selectedTimes.includes(slot);
            const icon = slot === 'Morning' ? '🌅' : slot === 'Afternoon' ? '☀️' : '🌙';
            const subtext = slot === 'Morning' ? '< 12:00' : slot === 'Afternoon' ? '12–17:00' : '17:00+';
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onToggleTime(slot)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer border min-h-[58px] ${
                  isActive
                    ? 'bg-[#A2FF00] text-[#0A0A0A] border-[#8ee600]/40 font-bold shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200/80 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span className="font-bold">{slot}</span>
                <span className={`text-[10px] ${isActive ? 'text-slate-950 font-semibold' : 'text-slate-500'}`}>{subtext}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Day Presets */}
      <div>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Day Presets
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onSelectDays([])}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border min-h-[44px] ${
              selectedDays.length === 0
                ? 'bg-[#A2FF00] text-[#0A0A0A] border-[#8ee600]/40 font-bold shadow-xs'
                : 'bg-white text-slate-800 border-slate-200/80 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300'
            }`}
          >
            Any Day
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectDays(
                isWeekdayActive
                  ? []
                  : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
              )
            }
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border min-h-[44px] ${
              isWeekdayActive
                ? 'bg-[#A2FF00] text-[#0A0A0A] border-[#8ee600]/40 font-bold shadow-xs'
                : 'bg-white text-slate-800 border-slate-200/80 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300'
            }`}
          >
            Weekdays
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectDays(isWeekendActive ? [] : ['Saturday', 'Sunday'])
            }
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border min-h-[44px] ${
              isWeekendActive
                ? 'bg-[#A2FF00] text-[#0A0A0A] border-[#8ee600]/40 font-bold shadow-xs'
                : 'bg-white text-slate-800 border-slate-200/80 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300'
            }`}
          >
            Weekend
          </button>
        </div>
      </div>

      {/* Done button — only shown in desktop popover, not mobile modal (sheet has its own CTA) */}
      {!inMobileModal && (
        <div className="pt-2 flex justify-end border-t border-slate-200">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-1.5 bg-[#A2FF00] text-[#0A0A0A] rounded-xl text-xs font-extrabold hover:bg-[#8ee600] transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );

  // When rendered inside a mobile bottom sheet, render inline directly (no trigger button)
  if (isMobileModal) {
    return renderContent(true);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-[11px] font-bold tracking-wider uppercase text-slate-700 block mb-1">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-left flex items-center justify-between transition-all cursor-pointer shadow-xs group min-h-[44px]"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <Clock className="w-4 h-4 text-[#074213] shrink-0" />
          <span className="text-sm font-bold text-slate-900 truncate">
            {timeSummary}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-900' : 'group-hover:text-slate-700'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -2 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full mt-1.5 w-full sm:w-80 rounded-2xl shadow-2xl z-50 p-4 bg-white border border-slate-200 text-slate-900"
          >
            {renderContent(false)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};