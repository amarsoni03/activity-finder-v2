import React from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  SearchX,
  Compass,
  ArrowRight,
  RotateCcw,
  Star,
} from 'lucide-react';
import { Activity, FilterState } from '../types';
import { ActivityCard } from './ActivityCard';

interface EmptyStateFallbackProps {
  filters: FilterState;
  allActivities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onResetFilters: () => void;
  onOpenAiMatchmaker?: () => void;
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
}

export const EmptyStateFallback: React.FC<EmptyStateFallbackProps> = ({
  filters,
  allActivities,
  onSelectActivity,
  onResetFilters,
  onOpenAiMatchmaker,
  savedIds = [],
  onToggleSave = () => {},
}) => {
  // 1. Similar Activities (matching audience or price or top rated)
  const similarActivities = allActivities
    .filter((a) => {
      if (filters.category !== 'All Categories' && a.category === filters.category) return true;
      if (filters.audience !== 'All' && a.audience === filters.audience) return true;
      return a.rating >= 4.8;
    })
    .slice(0, 3);

  // 2. Nearby Metro Stations activities
  const nearbyMetroActivities = allActivities
    .filter((a) => a.metroLineId === filters.metroLineId || filters.metroLineId === 'all')
    .slice(0, 3);

  // 3. Alternative Times activities
  const alternativeTimeActivities = allActivities
    .filter((a) => {
      if (filters.category !== 'All Categories') return a.category === filters.category;
      return true;
    })
    .slice(0, 3);

  return (
    <div className="space-y-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm animate-fade-in">
      
      {/* Zero Empty State Notice Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-green-950 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-green-400 border border-white/10 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Empty State Guarantee</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">
            No exact matches for your specific filter combination
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            We never show empty screens! Below are personalized alternative recommendations matching your free time, nearby metro stops, and similar courses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onResetFilters}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>

          {onOpenAiMatchmaker && (
            <button
              onClick={onOpenAiMatchmaker}
              className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5 min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Matchmaker</span>
            </button>
          )}
        </div>
      </div>

      {/* Alternative Recommendation Section 1: Similar Courses */}
      {similarActivities.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Compass className="w-4 h-4 text-green-600" />
                <span>Similar Recommended Courses</span>
              </h4>
              <p className="text-xs text-slate-500">
                Top rated activities matching your general audience and field
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                isSaved={savedIds.includes(act.id)}
                onToggleSave={onToggleSave}
                onSelectActivity={onSelectActivity}
                onQuickBook={onSelectActivity}
              />
            ))}
          </div>
        </div>
      )}

      {/* Alternative Recommendation Section 2: Classes at Nearby Stations */}
      {nearbyMetroActivities.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Classes at Nearby Metro Stations</span>
              </h4>
              <p className="text-xs text-slate-500">
                Just a few metro stops or minutes away on your line
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyMetroActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                isSaved={savedIds.includes(act.id)}
                onToggleSave={onToggleSave}
                onSelectActivity={onSelectActivity}
                onQuickBook={onSelectActivity}
              />
            ))}
          </div>
        </div>
      )}

      {/* Alternative Recommendation Section 3: Alternative Times */}
      {alternativeTimeActivities.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Alternative Class Times</span>
              </h4>
              <p className="text-xs text-slate-500">
                Same interest area, running on adjacent days or time slots
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternativeTimeActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                isSaved={savedIds.includes(act.id)}
                onToggleSave={onToggleSave}
                onSelectActivity={onSelectActivity}
                onQuickBook={onSelectActivity}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
