import React from 'react';
import { Sparkles, MapPin, Compass } from 'lucide-react';
import { Activity, FilterState, Category } from '../types';
import { SearchBar } from './SearchBar';

interface HeroSectionProps {
  activities: Activity[];
  filters: FilterState;
  onApplyFilters: (newFilters: Partial<FilterState>) => void;
  onSelectActivity?: (activity: Activity) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activities,
  filters,
  onApplyFilters,
  onSelectActivity,
}) => {
  const quickTags: { label: string; action: () => void }[] = [
    { label: '🔥 Starting This Week', action: () => onApplyFilters({ isFreeTrial: false, searchQuery: '' }) },
    { label: '💃 Dance', action: () => onApplyFilters({ category: 'Dance', searchQuery: '' }) },
    { label: '⚽ Sports', action: () => onApplyFilters({ category: 'Sports', searchQuery: '' }) },
    { label: '🆓 Free Trial', action: () => onApplyFilters({ isFreeTrial: true }) },
    { label: '🎨 Arts & Music', action: () => onApplyFilters({ category: 'Arts', searchQuery: '' }) },
  ];

  return (
    <div className="relative bg-slate-950 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl sm:rounded-b-[2.5rem] shadow-2xl">
      {/* Background ambient glow gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#074213]/40 to-slate-900 pointer-events-none" />
      <div className="absolute top-[-20%] left-[20%] w-96 h-96 bg-[#A2FF00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-80 h-80 bg-[#074213]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-5">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-[#A2FF00] border border-white/15">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Activity Discovery Marketplace</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            What would you like to do today?
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Find unique local activities, workshops, and sports near your metro.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="pt-2 flex justify-center">
          <SearchBar
            activities={activities}
            filters={filters}
            onApplyFilters={onApplyFilters}
            onSelectActivity={onSelectActivity}
            placeholder="Search activities, categories (e.g. Salsa, Languages) or metro stations..."
          />
        </div>

        {/* Compact Quick Discovery Tags */}
        <div className="pt-1 flex items-center justify-center flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">
            Trending:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              onClick={tag.action}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 font-semibold transition-all cursor-pointer backdrop-blur-xs"
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
