import React from 'react';
import {
  Flame,
  Clock,
  MapPin,
  Tag,
  Globe,
  ChevronRight,
  Star,
  Heart,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Activity, FilterState, Category } from '../types';

interface HomeSectionsProps {
  activities: Activity[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectActivity: (activity: Activity) => void;
  onQuickBook: (activity: Activity) => void;
  onApplyFilters: (filters: Partial<FilterState>) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  activities,
  savedIds,
  onToggleSave,
  onSelectActivity,
  onQuickBook,
  onApplyFilters,
}) => {
  // 1. Trending Tonight (Evening activities)
  const trendingTonight = activities
    .filter((a) => a.schedule.timeOfDay === 'Evening')
    .slice(0, 6);

  // 2. Near Your Metro (Walk time <= 10 min or central metro lines)
  const nearMetro = activities
    .filter((a) => (a.walkTimeMinutes || 15) <= 10)
    .slice(0, 6);

  // 3. Starting This Week
  const startingThisWeek = activities
    .filter((a) => a.isNewThisWeek || a.startDate?.toLowerCase().includes('sep') || true)
    .slice(0, 6);

  // 4. Free Trial
  const freeTrialActivities = activities
    .filter((a) => a.isFreeTrial || a.price <= 100)
    .slice(0, 6);

  // 5. Online Activities
  const onlineActivities = activities
    .filter((a) => a.deliveryMode === 'Live Online' || a.deliveryMode === 'Self-Paced' || a.isOnlineAvailable)
    .slice(0, 6);

  const renderHorizontalCarousel = (
    title: string,
    subtitle: string,
    icon: React.ElementType,
    badgeColor: string,
    items: Activity[],
    onViewAll: () => void
  ) => {
    if (!items || items.length === 0) return null;
    const SectionIcon = icon;

    return (
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${badgeColor}`}>
              <SectionIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 text-xs font-extrabold text-[#074213] hover:text-[#05320e] transition-colors cursor-pointer group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x">
          {items.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="snap-start shrink-0 w-[240px] sm:w-[270px] group bg-white rounded-2xl p-3 border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(act.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white hover:bg-slate-900 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        savedIds.includes(act.id) ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-950/80 text-white text-[10px] font-bold rounded-md backdrop-blur-xs">
                    {act.category}
                  </span>
                </div>

                {/* Title & Metro */}
                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#074213] transition-colors line-clamp-1 mb-1">
                  {act.title}
                </h4>

                <div className="flex items-center space-x-1 text-[11px] text-slate-500 mb-2">
                  <MapPin className="w-3 h-3 text-[#074213] shrink-0" />
                  <span className="truncate">{act.metroStationName} ({act.walkTimeMinutes} min walk)</span>
                </div>
              </div>

              {/* Footer row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-[#074213]">
                    {act.price === 0 ? 'Free' : `${act.price} ₽`}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{act.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-10">
      {/* 1. Trending Tonight */}
      {renderHorizontalCarousel(
        'Trending Tonight',
        'Evening sessions starting after 18:00',
        Clock,
        'bg-[#E9FCD4] text-[#074213]',
        trendingTonight,
        () => onApplyFilters({ timeOfDaySlots: ['Evening'] })
      )}

      {/* 2. Near Your Metro */}
      {renderHorizontalCarousel(
        'Near Your Metro',
        'Under 10 minutes walking distance from station',
        MapPin,
        'bg-[#E9FCD4] text-[#074213]',
        nearMetro,
        () => onApplyFilters({})
      )}

      {/* 3. Starting This Week */}
      {renderHorizontalCarousel(
        'Starting This Week',
        'New upcoming classes with open seats',
        Flame,
        'bg-slate-100 text-slate-800',
        startingThisWeek,
        () => onApplyFilters({ regularity: 'Course' })
      )}

      {/* 4. Free Trial */}
      {renderHorizontalCarousel(
        'Free Trial & Intro Sessions',
        'Try out a session with zero commitment',
        Tag,
        'bg-[#E9FCD4] text-[#074213]',
        freeTrialActivities,
        () => onApplyFilters({ searchKeyword: 'Free Trial' })
      )}

      {/* 5. Online Activities */}
      {renderHorizontalCarousel(
        'Live Online Activities',
        'Join interactive classes from home',
        Globe,
        'bg-slate-100 text-slate-800',
        onlineActivities,
        () => onApplyFilters({ deliveryMode: 'Live Online' })
      )}
    </div>
  );
};
