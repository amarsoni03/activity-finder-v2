import React, { useState } from 'react';
import { Search, MapPin, Clock, Sparkles, Calendar, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { FilterState, Category, TimeOfDay } from '../types';
import { CATEGORIES } from '../data/activitiesData';
import { METRO_LINES } from '../data/metroData';

interface SearchHeroProps {
  filters: FilterState;
  onApplySearch: (newFilters: Partial<FilterState>) => void;
  onOpenAiMatchmaker?: () => void;
  onOpenFreeTimePlanner?: () => void;
  onOpenFilters?: () => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  filters,
  onApplySearch,
  onOpenAiMatchmaker,
  onOpenFreeTimePlanner,
  onOpenFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || 'All Categories');
  const [selectedMetroLine, setSelectedMetroLine] = useState<string>(filters.metroLineId || 'all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    filters.timeOfDaySlots && filters.timeOfDaySlots.length > 0 ? filters.timeOfDaySlots[0] : 'All'
  );

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplySearch({
      searchQuery: searchQuery.trim(),
      category: selectedCategory as Category,
      metroLineId: selectedMetroLine,
      timeOfDaySlots: selectedTimeSlot === 'All' ? [] : [selectedTimeSlot as TimeOfDay],
    });
  };

  return (
    <div className="relative py-4 sm:py-6 space-y-4">
      {/* Universal Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl p-2 sm:p-3 shadow-md border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col md:flex-row items-stretch md:items-center gap-2"
      >
        {/* Search Query Input */}
        <div className="flex-1 flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus-within:bg-white focus-within:border-slate-300 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search activities, skills, tutors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex-1 flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus-within:bg-white focus-within:border-slate-300 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Category</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Metro Line Dropdown */}
        <div className="flex-1 flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus-within:bg-white focus-within:border-slate-300 transition-all">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedMetroLine}
            onChange={(e) => setSelectedMetroLine(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="all">All Metro Lines</option>
            {METRO_LINES.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slot Select */}
        <div className="flex-1 flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus-within:bg-white focus-within:border-slate-300 transition-all">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="All">Any Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </div>

        {/* Actions Group */}
        <div className="flex items-center space-x-2 shrink-0">
          {onOpenFilters && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="p-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              title="Open filter panel"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="flex-1 md:flex-initial px-6 py-3 bg-slate-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Quick Trigger Chips (AI Concierge & Free Time Planner) */}
      <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center space-x-2">
          {onOpenAiMatchmaker && (
            <button
              type="button"
              onClick={onOpenAiMatchmaker}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#074213]" />
              <span>AI Matchmaker</span>
            </button>
          )}

          {onOpenFreeTimePlanner && (
            <button
              type="button"
              onClick={onOpenFreeTimePlanner}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#074213]" />
              <span>Free Time Planner</span>
            </button>
          )}
        </div>

        {onOpenFilters && (
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex items-center space-x-1 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
