import React, { useRef } from 'react';
import {
  Flame,
  Clock,
  MapPin,
  Calendar,
  Tag,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Activity } from '../types';
import { ActivityCard } from './ActivityCard';

interface DiscoverySectionsProps {
  activities: Activity[];
  savedIds: string[];
  onToggleSave: (activityId: string) => void;
  onSelectActivity: (activity: Activity) => void;
  onQuickBook: (activity: Activity) => void;
  userMetroName?: string;
}

interface CarouselRowProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  items: Activity[];
  savedIds: string[];
  onToggleSave: (activityId: string) => void;
  onSelectActivity: (activity: Activity) => void;
  onQuickBook: (activity: Activity) => void;
  badgeColor?: string;
}

const CarouselRow: React.FC<CarouselRowProps> = ({
  title,
  subtitle,
  icon: Icon,
  items,
  savedIds,
  onToggleSave,
  onSelectActivity,
  onQuickBook,
  badgeColor = 'bg-[#074213] text-white',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Header with Title & Scroll Arrows */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${badgeColor} shadow-2xs`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>

        {/* Scroll Nav Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel List */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((activity) => (
          <div
            key={activity.id}
            className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start"
          >
            <ActivityCard
              activity={activity}
              isSaved={savedIds.includes(activity.id)}
              onToggleSave={onToggleSave}
              onSelectActivity={onSelectActivity}
              onQuickBook={onQuickBook}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export const DiscoverySections: React.FC<DiscoverySectionsProps> = ({
  activities,
  savedIds,
  onToggleSave,
  onSelectActivity,
  onQuickBook,
  userMetroName = 'Arbat',
}) => {
  // 1. Popular Tonight (Evening schedule + high rating/popularity)
  const popularTonight = activities.filter(
    (a) =>
      a.schedule?.timeOfDay === 'Evening' ||
      a.rating >= 4.7 ||
      a.popularityScore > 80
  );

  // 2. Near Your Metro
  const nearYourMetro = activities.filter(
    (a) =>
      a.metroStationName.toLowerCase().includes(userMetroName.toLowerCase()) ||
      a.walkTimeMinutes <= 7 ||
      a.metroLineId === 'l1'
  );

  // 3. Starting This Week
  const startingThisWeek = activities.filter(
    (a) =>
      a.isNewThisWeek ||
      a.startDate?.toLowerCase().includes('ongoing') ||
      a.startDate?.toLowerCase().includes('this week') ||
      a.schedule?.days?.includes('Monday') ||
      a.schedule?.days?.includes('Wednesday')
  );

  // 4. Free Trial
  const freeTrial = activities.filter((a) => a.isFreeTrial || a.price === 0 || a.price < 500);

  // 5. Online Activities
  const onlineActivities = activities.filter(
    (a) =>
      a.format === 'Online' ||
      a.shortDescription.toLowerCase().includes('online') ||
      a.title.toLowerCase().includes('online') ||
      a.metroStationName.toLowerCase().includes('online')
  );

  // 6. New This Week
  const newThisWeek = activities.filter(
    (a) => a.isNewThisWeek || a.newActivity || a.reviewCount < 10
  );

  // Fallbacks if filtered array is empty
  const getSectionItems = (filtered: Activity[]) =>
    filtered.length >= 3 ? filtered : activities.slice(0, 6);

  return (
    <div className="space-y-12">
      {/* 1. Popular Tonight */}
      <CarouselRow
        title="Popular Tonight"
        subtitle="High energy evening workshops & masterclasses happening tonight"
        icon={Clock}
        items={getSectionItems(popularTonight)}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
        onSelectActivity={onSelectActivity}
        onQuickBook={onQuickBook}
        badgeColor="bg-amber-500 text-white"
      />

      {/* 2. Near Your Metro */}
      <CarouselRow
        title={`Near ${userMetroName} Metro`}
        subtitle="Activities within 5-10 minutes walking distance from station"
        icon={MapPin}
        items={getSectionItems(nearYourMetro)}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
        onSelectActivity={onSelectActivity}
        onQuickBook={onQuickBook}
        badgeColor="bg-[#074213] text-white"
      />

      {/* 3. Starting This Week */}
      <CarouselRow
        title="Starting This Week"
        subtitle="Fresh cohorts and weekly sessions starting in the coming days"
        icon={Calendar}
        items={getSectionItems(startingThisWeek)}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
        onSelectActivity={onSelectActivity}
        onQuickBook={onQuickBook}
        badgeColor="bg-emerald-600 text-white"
      />

      {/* 4. Free Trial */}
      <CarouselRow
        title="Free Trial Activities"
        subtitle="Try a lesson for free with zero upfront commitment"
        icon={Tag}
        items={getSectionItems(freeTrial)}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
        onSelectActivity={onSelectActivity}
        onQuickBook={onQuickBook}
        badgeColor="bg-purple-600 text-white"
      />

      {/* 5. Online Activities */}
      <CarouselRow
        title="Online Activities"
        subtitle="Learn or practice remotely from the comfort of home"
        icon={Globe}
        items={getSectionItems(onlineActivities)}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
        onSelectActivity={onSelectActivity}
        onQuickBook={onQuickBook}
        badgeColor="bg-blue-600 text-white"
      />

      {/* 6. New This Week */}
      <CarouselRow
        title="New This Week"
        subtitle="Newly added local studios and upcoming experiences"
        icon={Sparkles}
        items={getSectionItems(newThisWeek)}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
        onSelectActivity={onSelectActivity}
        onQuickBook={onQuickBook}
        badgeColor="bg-pink-600 text-white"
      />
    </div>
  );
};
