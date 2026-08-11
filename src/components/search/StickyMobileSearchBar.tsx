import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterState, DeliveryFilter } from '../../types';

interface StickyMobileSearchBarProps {
  filters: FilterState;
  onOpenMobileSheet: () => void;
  onFocusSearch: () => void;
}

export const StickyMobileSearchBar: React.FC<StickyMobileSearchBarProps> = ({
  filters,
  onOpenMobileSheet,
  onFocusSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky mobile bar after scrolling 140px down on mobile
      if (window.scrollY > 140) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchSummary = filters.searchKeyword
    ? `"${filters.searchKeyword}"`
    : filters.category !== 'All Categories'
    ? filters.category
    : 'Search activities, hobbies...';

  const modeIcon =
    filters.deliveryMode === 'Live Online' ? '💻 Online' : filters.deliveryMode === 'In Person' ? '📍 Near Me' : '✨ Both';

  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-16 left-0 right-0 z-40 px-3 py-2 sm:hidden pointer-events-none"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white rounded-full shadow-2xl p-1.5 flex items-center justify-between space-x-2 pointer-events-auto max-w-md mx-auto">
            {/* Search Input Trigger Button */}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onFocusSearch();
              }}
              className="flex-1 flex items-center space-x-2.5 px-3 py-2 bg-slate-800/90 rounded-full text-xs font-medium text-left truncate transition-colors cursor-pointer hover:bg-slate-800"
            >
              <Search className="w-4 h-4 text-[#A2FF00] shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white truncate block">{searchSummary}</span>
                <span className="text-[10px] text-slate-400 truncate block">{modeIcon}</span>
              </div>
            </button>

            {/* Filter Drawer Trigger Button */}
            <button
              type="button"
              onClick={onOpenMobileSheet}
              className="p-2.5 bg-[#A2FF00] hover:bg-[#8ee600] text-slate-950 rounded-full shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md"
              title="Filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
