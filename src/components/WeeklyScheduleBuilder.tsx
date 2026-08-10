import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  DollarSign,
  ArrowRight,
  Search,
  X,
  Star,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Footprints,
  Compass,
} from 'lucide-react';
import { Activity, DayOfWeek, TimeOfDay, UserPreferences } from '../types';
import { METRO_STATIONS } from '../data/metroData';

export interface ScheduledActivitySlot {
  id: string; // Unique instance ID
  activityId: string;
  activity: Activity;
  day: DayOfWeek;
  customTime?: string;
}

export interface WeeklyScheduleBuilderProps {
  allActivities: Activity[];
  userPreferences: UserPreferences;
  onSelectActivity: (activity: Activity) => void;
  onReserveSpot?: (activity: Activity) => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Helper to convert "HH:MM" string to minutes from midnight
const timeToMinutes = (timeStr?: string): number => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
};

// Helper to estimate transit time in minutes between two metro stations
const getEstimatedTransitMinutes = (stationA?: string, stationB?: string): number => {
  if (!stationA || !stationB || stationA === stationB) return 10;
  // Standard metro transfer & travel estimate in Moscow (~25 minutes)
  return 25;
};

export const WeeklyScheduleBuilder: React.FC<WeeklyScheduleBuilderProps> = ({
  allActivities,
  userPreferences,
  onSelectActivity,
  onReserveSpot,
}) => {
  // Load or initialize user's weekly schedule
  const [scheduledItems, setScheduledItems] = useState<ScheduledActivitySlot[]>(() => {
    const local = localStorage.getItem('af_user_weekly_schedule');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // fallback
      }
    }
    // Default initial routine matching example: Mon (Gym), Tue (Spanish), Thu (Yoga), Sat (Ceramics)
    const findByKeyword = (kw: string) =>
      allActivities.find(
        (a) =>
          a.title.toLowerCase().includes(kw) ||
          a.category.toLowerCase().includes(kw) ||
          a.subSkill?.toLowerCase().includes(kw)
      ) || allActivities[0];

    const gym = findByKeyword('fitness') || findByKeyword('sports') || allActivities[0];
    const spanish = findByKeyword('spanish') || findByKeyword('language') || allActivities[1] || allActivities[0];
    const yoga = findByKeyword('yoga') || findByKeyword('wellness') || allActivities[2] || allActivities[0];
    const photo = findByKeyword('photo') || findByKeyword('art') || allActivities[3] || allActivities[0];

    return [
      { id: 'sched-1', activityId: gym.id, activity: gym, day: 'Monday' },
      { id: 'sched-2', activityId: spanish.id, activity: spanish, day: 'Tuesday' },
      { id: 'sched-3', activityId: yoga.id, activity: yoga, day: 'Thursday' },
      { id: 'sched-4', activityId: photo.id, activity: photo, day: 'Saturday' },
    ];
  });

  const [activeAddDay, setActiveAddDay] = useState<DayOfWeek | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [weeklyBudgetCap, setWeeklyBudgetCap] = useState<number>(userPreferences.maxBudget || 8000);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('af_user_weekly_schedule', JSON.stringify(scheduledItems));
  }, [scheduledItems]);

  // Remove activity from schedule
  const handleRemoveScheduled = (slotId: string) => {
    setScheduledItems((prev) => prev.filter((item) => item.id !== slotId));
  };

  // Add activity to schedule
  const handleAddScheduled = (activity: Activity, day: DayOfWeek) => {
    const newItem: ScheduledActivitySlot = {
      id: `sched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      activityId: activity.id,
      activity: activity,
      day: day,
    };
    setScheduledItems((prev) => [...prev, newItem]);
    setActiveAddDay(null);
  };

  // --- AUTOMATED CONFLICT & BUDGET DETECTION ENGINE ---
  const analysis = useMemo(() => {
    const timeConflicts: { day: DayOfWeek; itemA: ScheduledActivitySlot; itemB: ScheduledActivitySlot; overlapMins: number }[] = [];
    const travelConflicts: { day: DayOfWeek; itemA: ScheduledActivitySlot; itemB: ScheduledActivitySlot; gapMins: number; requiredMins: number }[] = [];
    let totalPrice = 0;

    // Group items by day
    const dayMap: Record<DayOfWeek, ScheduledActivitySlot[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    scheduledItems.forEach((item) => {
      dayMap[item.day].push(item);
      const price = item.activity.price || item.activity.regularPrice || 0;
      totalPrice += price;
    });

    // Check conflicts for each day
    DAYS_OF_WEEK.forEach((day) => {
      const itemsOnDay = dayMap[day];
      if (itemsOnDay.length < 2) return;

      // Sort by start time
      const sorted = [...itemsOnDay].sort((a, b) => {
        const startA = timeToMinutes(a.activity.startTime || '18:00');
        const startB = timeToMinutes(b.activity.startTime || '18:00');
        return startA - startB;
      });

      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];

        const startA = timeToMinutes(current.activity.startTime || '18:00');
        const endA = timeToMinutes(current.activity.endTime || '19:30');
        const startB = timeToMinutes(next.activity.startTime || '19:00');
        const endB = timeToMinutes(next.activity.endTime || '20:30');

        // 1. Time Overlap Check
        if (startB < endA) {
          const overlap = endA - startB;
          timeConflicts.push({
            day,
            itemA: current,
            itemB: next,
            overlapMins: overlap,
          });
        } else {
          // 2. Travel Time Check (if back-to-back with a gap)
          const availableGap = startB - endA;
          const requiredTravel = getEstimatedTransitMinutes(
            current.activity.metroStationName || current.activity.metroStation,
            next.activity.metroStationName || next.activity.metroStation
          );

          if (availableGap < requiredTravel) {
            travelConflicts.push({
              day,
              itemA: current,
              itemB: next,
              gapMins: availableGap,
              requiredMins: requiredTravel,
            });
          }
        }
      }
    });

    // Detect free days & open time slots
    const freeDays = DAYS_OF_WEEK.filter((d) => dayMap[d].length === 0);
    const busiestDay = DAYS_OF_WEEK.reduce((prev, curr) => (dayMap[curr].length > dayMap[prev].length ? curr : prev), 'Monday');

    return {
      timeConflicts,
      travelConflicts,
      totalPrice,
      freeDays,
      busiestDay,
      dayMap,
      isOverBudget: totalPrice > weeklyBudgetCap,
      budgetOverflow: Math.max(0, totalPrice - weeklyBudgetCap),
    };
  }, [scheduledItems, weeklyBudgetCap]);

  // Activities available to add for selected day modal
  const availableForDay = useMemo(() => {
    if (!activeAddDay) return [];
    const scheduledIdsOnDay = new Set(
      scheduledItems.filter((i) => i.day === activeAddDay).map((i) => i.activityId)
    );

    return allActivities.filter(
      (a) =>
        !scheduledIdsOnDay.has(a.id) &&
        (searchQuery.trim() === '' ||
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.metroStationName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allActivities, activeAddDay, scheduledItems, searchQuery]);

  // Recommended activities specifically for open gaps (e.g. Wednesday free)
  const gapRecommendations = useMemo(() => {
    if (analysis.freeDays.length === 0) return [];
    const targetDay = analysis.freeDays[0]; // First free day (e.g. Wednesday)

    return allActivities
      .filter((a) => a.rating >= 4.7)
      .slice(0, 3)
      .map((a) => ({
        activity: a,
        suggestedDay: targetDay,
      }));
  }, [allActivities, analysis.freeDays]);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* --- 1. TOP HEADER & INSIGHTS SUMMARY BANNER --- */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Weekly Schedule Builder</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Build Your <span className="text-emerald-400">Perfect Weekly Routine</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                Plan your activities day-by-day. Automatically detect time overlaps, metro travel conflicts, and monitor weekly budget.
              </p>
            </div>

            {/* Budget Meter Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:w-72 shrink-0 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Weekly Budget</span>
                </span>
                <span className={`font-black ${analysis.isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ₽{analysis.totalPrice.toLocaleString()} / ₽{weeklyBudgetCap.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    analysis.isOverBudget ? 'bg-rose-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (analysis.totalPrice / weeklyBudgetCap) * 100)}%` }}
                />
              </div>

              <p className="text-[10px] text-slate-300">
                {analysis.isOverBudget
                  ? `⚠️ Over budget by ₽${analysis.budgetOverflow.toLocaleString()}`
                  : `Remaining budget: ₽${(weeklyBudgetCap - analysis.totalPrice).toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* --- SMART GAP & HIGHLIGHT SUGGESTION BANNER --- */}
          {analysis.freeDays.length > 0 && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-white">
                    Schedule Insight: You still have {analysis.freeDays.join(', ')} free!
                  </span>
                  <span className="text-emerald-200 block sm:inline sm:ml-2">
                    Check out recommended activities below to fill your gaps.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- 2. AUTOMATED CONFLICT & ALERT NOTIFICATIONS --- */}
      {(analysis.timeConflicts.length > 0 || analysis.travelConflicts.length > 0 || analysis.isOverBudget) && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Detected Schedule Alerts & Conflicts ({analysis.timeConflicts.length + analysis.travelConflicts.length + (analysis.isOverBudget ? 1 : 0)})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Time Overlap Conflicts */}
            {analysis.timeConflicts.map((c, idx) => (
              <div key={idx} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-rose-900 block">
                    ⚠️ Time Conflict on {c.day} ({c.overlapMins} min overlap)
                  </span>
                  <p className="text-rose-700">
                    "<span className="font-semibold">{c.itemA.activity.title}</span>" and "
                    <span className="font-semibold">{c.itemB.activity.title}</span>" overlap in schedule.
                  </p>
                </div>
              </div>
            ))}

            {/* Travel Time Conflicts */}
            {analysis.travelConflicts.map((c, idx) => (
              <div key={idx} className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs">
                <Footprints className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-amber-900 block">
                    🚗 Metro Travel Conflict on {c.day}
                  </span>
                  <p className="text-amber-800">
                    Only {c.gapMins} mins between classes from {c.itemA.activity.metroStationName || c.itemA.activity.metroStation} to {c.itemB.activity.metroStationName || c.itemB.activity.metroStation} (requires ~{c.requiredMins} mins travel time).
                  </p>
                </div>
              </div>
            ))}

            {/* Budget Overflow */}
            {analysis.isOverBudget && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs">
                <DollarSign className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-rose-900 block">
                    💰 Budget Cap Exceeded
                  </span>
                  <p className="text-rose-700">
                    Total scheduled cost is ₽{analysis.totalPrice.toLocaleString()} (Exceeds your ₽{weeklyBudgetCap.toLocaleString()} limit by ₽{analysis.budgetOverflow.toLocaleString()}).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- 3. WEEKLY SCHEDULE GRID (DAYS MON - SUN) --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Weekly Routine ({scheduledItems.length} Scheduled Activities)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Click "+ Add Activity" on any day to build your plan
          </span>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {DAYS_OF_WEEK.map((day) => {
            const items = analysis.dayMap[day];
            const isFree = items.length === 0;

            return (
              <div
                key={day}
                className={`bg-white rounded-2xl border ${
                  isFree ? 'border-dashed border-slate-200 bg-slate-50/50' : 'border-slate-200 shadow-xs'
                } p-3 flex flex-col justify-between min-h-[220px] transition-all hover:border-emerald-300`}
              >
                <div className="space-y-2">
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      {day}
                    </span>
                    {isFree ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-md">
                        Free Day
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-md">
                        {items.length} Booked
                      </span>
                    )}
                  </div>

                  {/* Scheduled Items List for this Day */}
                  {isFree ? (
                    <div className="text-center py-6 text-slate-400 space-y-1">
                      <p className="text-xs font-semibold text-slate-600">Free</p>
                      <p className="text-[10px]">No activities scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((slot) => {
                        const act = slot.activity;
                        const price = act.price || act.regularPrice || 0;
                        const station = act.metroStationName || act.metroStation || 'Metro';
                        const time = act.schedule?.specificDaysText || act.startTime || '18:00';

                        return (
                          <div
                            key={slot.id}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5 relative group hover:bg-white hover:shadow-xs transition-all"
                          >
                            <button
                              onClick={() => handleRemoveScheduled(slot.id)}
                              className="absolute top-2 right-2 p-1 text-slate-300 hover:text-rose-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove activity"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Category Tag */}
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded-md inline-block">
                              {act.category}
                            </span>

                            {/* Title (Activity First) */}
                            <h4
                              onClick={() => onSelectActivity(act)}
                              className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-emerald-700 cursor-pointer pr-4"
                            >
                              {act.title}
                            </h4>

                            {/* Time & Metro */}
                            <div className="text-[10px] text-slate-500 space-y-0.5">
                              <div className="flex items-center space-x-1 text-slate-700 font-medium">
                                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">{station} ({act.walkMinutes || 5} min)</span>
                              </div>
                            </div>

                            {/* Price Badge */}
                            <div className="pt-1 flex items-center justify-between text-[11px] border-t border-slate-100">
                              <span className="font-extrabold text-slate-900">
                                {price > 0 ? `₽${price.toLocaleString()}` : 'Free'}
                              </span>
                              <button
                                onClick={() => onSelectActivity(act)}
                                className="text-[10px] text-emerald-700 hover:underline font-bold"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Add Activity Button per Day */}
                <button
                  onClick={() => setActiveAddDay(day)}
                  className="mt-3 w-full py-1.5 border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to {day}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- 4. RECOMMENDATIONS TO FILL GAPS (ACTIVITY FIRST PHILOSOPHY) --- */}
      {gapRecommendations.length > 0 && (
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Open Gaps</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                "You still have {analysis.freeDays.join(', ')} free."
              </h3>
              <p className="text-xs text-slate-500">
                Here are top activities tailored to your schedule gaps and metro location:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gapRecommendations.map(({ activity: act, suggestedDay }) => (
              <div
                key={act.id}
                className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={act.image || act.coverImage}
                      alt={act.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-slate-900/80 text-white rounded-md">
                      {act.category}
                    </span>
                  </div>

                  <h4
                    onClick={() => onSelectActivity(act)}
                    className="text-xs font-bold text-slate-900 hover:text-emerald-700 cursor-pointer line-clamp-2"
                  >
                    {act.title}
                  </h4>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center space-x-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{act.metroStationName || act.metroStation} • {act.walkMinutes || 5} min walk</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{act.schedule?.specificDaysText || 'Flexible Slots'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">
                    ₽{(act.price || act.regularPrice || 0).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleAddScheduled(act, suggestedDay)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule for {suggestedDay}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 5. ADD ACTIVITY TO SPECIFIC DAY MODAL --- */}
      {activeAddDay && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add Activity for {activeAddDay}</h3>
                <p className="text-xs text-slate-300">
                  Select an activity to add to your {activeAddDay} schedule
                </p>
              </div>
              <button
                onClick={() => setActiveAddDay(null)}
                className="p-1.5 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities by title, category, or metro..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {availableForDay.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No matching activities found for {activeAddDay}.
                </div>
              ) : (
                availableForDay.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl flex items-center justify-between gap-3 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <img
                        src={act.image || act.coverImage}
                        alt={act.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {act.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{act.title}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span>{act.metroStationName || act.metroStation}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-800">
                            ₽{(act.price || act.regularPrice || 0).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddScheduled(act, activeAddDay)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
