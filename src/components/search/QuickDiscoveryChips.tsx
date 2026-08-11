import React, { useState, useMemo } from 'react';
import { Flame, Calendar, Tag, Star, Users, Building, Monitor, MapPin, Sparkles, Clock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { FilterState } from '../../types';

interface QuickDiscoveryChipsProps {
  filters: FilterState;
  onApplyFilters: (newFilters: Partial<FilterState>) => void;
}

const CHIPS: {
  id: string;
  label: string;
  icon: React.ElementType;
  apply: (filters: FilterState) => Partial<FilterState>;
  isActive: (filters: FilterState) => boolean;
}[] = [
  {
    id: 'trending-today',
    label: 'Trending Today',
    icon: Flame,
    apply: () => ({ sortBy: 'popular', searchKeyword: '' }),
    isActive: (f) => f.sortBy === 'popular',
  },
  {
    id: 'this-weekend',
    label: 'This Weekend',
    icon: Calendar,
    apply: () => ({ daysOfWeek: ['Saturday', 'Sunday'] }),
    isActive: (f) => f.daysOfWeek.includes('Saturday') && f.daysOfWeek.includes('Sunday'),
  },
  {
    id: 'free-trial',
    label: 'Free Trial',
    icon: Tag,
    apply: () => ({ searchKeyword: 'Free Trial' }),
    isActive: (f) => f.searchKeyword?.toLowerCase() === 'free trial',
  },
  {
    id: 'popular',
    label: 'Popular',
    icon: Star,
    apply: () => ({ minRating: 4.8 }),
    isActive: (f) => f.minRating >= 4.8,
  },
  {
    id: 'kids',
    label: 'Kids',
    icon: Users,
    apply: () => ({ audience: 'Children' }),
    isActive: (f) => f.audience === 'Children',
  },
  {
    id: 'adults',
    label: 'Adults',
    icon: Users,
    apply: () => ({ audience: 'Adults' }),
    isActive: (f) => f.audience === 'Adults',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    icon: Building,
    apply: () => ({ audience: 'Corporate' }),
    isActive: (f) => f.audience === 'Corporate',
  },
  {
    id: 'online',
    label: 'Online',
    icon: Monitor,
    apply: () => ({ deliveryMode: 'Live Online' }),
    isActive: (f) => f.deliveryMode === 'Live Online',
  },
  {
    id: 'near-me',
    label: 'Near Me',
    icon: MapPin,
    apply: () => ({ deliveryMode: 'In Person', sortBy: 'nearest' }),
    isActive: (f) => f.deliveryMode === 'In Person' && f.sortBy === 'nearest',
  },
  {
    id: 'new-this-week',
    label: 'New This Week',
    icon: Sparkles,
    apply: () => ({ sortBy: 'newest' }),
    isActive: (f) => f.sortBy === 'newest',
  },
  {
    id: 'starts-tomorrow',
    label: 'Starts Tomorrow',
    icon: Clock,
    apply: () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const tomorrow = days[(new Date().getDay() + 1) % 7] as any;
      return { daysOfWeek: [tomorrow], sortBy: 'starts-soon' };
    },
    isActive: (f) => f.sortBy === 'starts-soon',
  },
  {
    id: 'open-now',
    label: 'Open Now',
    icon: Zap,
    apply: () => ({ timeOfDaySlots: ['Morning', 'Afternoon'] }),
    isActive: (f) => f.timeOfDaySlots.length > 0,
  },
];

const PRIMARY_CHIP_IDS = ['trending-today', 'this-weekend', 'free-trial', 'popular'];

export const QuickDiscoveryChips: React.FC<QuickDiscoveryChipsProps> = ({
  filters,
  onApplyFilters,
}) => {
  const [showAll, setShowAll] = useState(false);

  const visibleChips = useMemo(() => {
    if (showAll) return CHIPS;
    return CHIPS.filter((c) => PRIMARY_CHIP_IDS.includes(c.id));
  }, [showAll]);

  return (
    <div className="w-full pt-0.5">
      <div className="flex flex-wrap items-center gap-1.5 text-xs w-full">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center space-x-1 mr-0.5 select-none">
          <Sparkles className="w-3 h-3 text-[#A2FF00] inline shrink-0" />
          <span>Quick Discovery:</span>
        </span>
        {visibleChips.map((chip) => {
          const active = chip.isActive(filters);
          const Icon = chip.icon;

          return (
            <motion.button
              key={chip.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                if (active) {
                  onApplyFilters({
                    searchKeyword: '',
                    daysOfWeek: [],
                    audience: 'All',
                    deliveryMode: 'All',
                    minRating: 0,
                    sortBy: 'recommended',
                    timeOfDaySlots: [],
                  });
                } else {
                  onApplyFilters(chip.apply(filters));
                }
              }}
              className={`group flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer border min-h-[26px] ${
                active
                  ? 'bg-[#A2FF00] text-[#0A0A0A] border-[#A2FF00] font-bold shadow-xs hover:bg-[#8ee600] hover:border-[#8ee600]'
                  : 'bg-slate-950/70 text-slate-300 border-slate-800/80 hover:bg-slate-800 hover:border-slate-500 hover:text-white'
              }`}
            >
              <Icon className={`w-3 h-3 shrink-0 transition-transform duration-150 group-hover:scale-110 ${active ? 'text-[#0A0A0A]' : 'text-[#A2FF00]'}`} />
              <span className="whitespace-nowrap transition-colors duration-150">{chip.label}</span>
            </motion.button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-[11px] font-semibold text-slate-400 hover:text-[#A2FF00] px-1.5 py-0.5 transition-colors cursor-pointer select-none shrink-0 whitespace-nowrap"
        >
          {showAll ? 'Less' : 'More...'}
        </button>
      </div>
    </div>
  );
};


