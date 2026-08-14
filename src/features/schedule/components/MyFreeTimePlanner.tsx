import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  MapPin,
  Calendar,
  Search,
  X,
  ChevronDown,
  Check,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Clock,
  RotateCcw,
  DollarSign,
  Target,
} from 'lucide-react';
import {
  UserPreferences,
  DayOfWeek,
  TimeOfDay,
  GoalType,
  Activity,
  Category,
} from '../../../types';
import { METRO_STATIONS, METRO_LINES } from '../../metro/data/metroData';
import { rankActivities, mapGoalToCategories } from '../../personalization/utils/personalization';

interface MyFreeTimePlannerProps {
  preferences: UserPreferences;
  onSavePreferences: (newPrefs: UserPreferences) => void;
  activities: Activity[];
  onViewMyWeek?: () => void;
  onSelectActivity?: (activity: Activity) => void;
  onToggleSave?: (activityId: string) => void;
  savedIds?: string[];
}

const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TIME_SLOTS: { id: TimeOfDay; label: string; time: string }[] = [
  { id: 'Morning', label: 'Morning', time: '08:00 – 12:00' },
  { id: 'Afternoon', label: 'Afternoon', time: '12:00 – 17:00' },
  { id: 'Evening', label: 'Evening', time: '17:00 – 21:30' },
];

const GOALS: { id: GoalType; label: string; icon: string }[] = [
  { id: 'Learn', label: 'Learn', icon: '📚' },
  { id: 'Exercise', label: 'Exercise', icon: '⚡' },
  { id: 'Create', label: 'Create', icon: '🎨' },
  { id: 'Relax', label: 'Relax', icon: '🧘' },
  { id: 'Meet People', label: 'Meet People', icon: '🤝' },
  { id: 'Career', label: 'Career', icon: '💼' },
  { id: 'Kids', label: 'Kids', icon: '🎈' },
];

const BUDGET_OPTIONS = [
  { label: 'Any', value: 350 },
  { label: '<$30', value: 30 },
  { label: '<$60', value: 60 },
  { label: '<$100', value: 100 },
  { label: '<$200', value: 200 },
];

export const MyFreeTimePlanner: React.FC<MyFreeTimePlannerProps> = ({
  preferences,
  onSavePreferences,
  activities,
  onViewMyWeek,
  onSelectActivity,
  onToggleSave,
  savedIds = [],
}) => {
  const [draftPrefs, setDraftPrefs] = useState<UserPreferences>(preferences);

  // Search keyword input
  const [searchKeyword, setSearchKeyword] = useState('');

  // Active Popover Chip State ('none' | 'metro' | 'time' | 'budget' | 'goal' | 'more')
  const [activePopover, setActivePopover] = useState<'none' | 'metro' | 'time' | 'budget' | 'goal' | 'more'>('none');

  // Searchable Metro State
  const [metroQuery, setMetroQuery] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraftPrefs(preferences);
  }, [preferences]);

  // Click outside listener for Popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePopover('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const save = (next: UserPreferences) => {
    setDraftPrefs(next);
    onSavePreferences(next);
  };

  // Derived Active Days List
  const activeDaysList = useMemo(() => {
    return DAYS.filter((d) => (draftPrefs.freeTime[d] || []).length > 0);
  }, [draftPrefs.freeTime]);

  // Derived Active Times List
  const activeTimesList = useMemo(() => {
    const timesSet = new Set<TimeOfDay>();
    DAYS.forEach((d) => (draftPrefs.freeTime[d] || []).forEach((t) => timesSet.add(t)));
    return Array.from(timesSet);
  }, [draftPrefs.freeTime]);

  const activeDaysSummary = useMemo(() => {
    if (activeDaysList.length === 0 || activeDaysList.length === 7) return 'Everyday';
    if (activeDaysList.length === 1) return activeDaysList[0];
    return activeDaysList.map((d) => d.slice(0, 3)).join(', ');
  }, [activeDaysList]);

  const activeTimesSummary = useMemo(() => {
    if (activeTimesList.length === 0 || activeTimesList.length === 3) return 'Anytime';
    return activeTimesList.join(', ');
  }, [activeTimesList]);

  // Toggle Day active state
  const toggleDayActive = (day: DayOfWeek) => {
    const currentSlots = draftPrefs.freeTime[day] || [];
    const timesToSet = activeTimesList.length > 0 ? activeTimesList : (['Evening'] as TimeOfDay[]);
    const nextSlots = currentSlots.length > 0 ? [] : timesToSet;

    save({
      ...draftPrefs,
      freeTime: {
        ...draftPrefs.freeTime,
        [day]: nextSlots,
      },
    });
  };

  // Toggle Time slot across active days
  const toggleTimeSlot = (slot: TimeOfDay) => {
    const isSlotSelected = activeTimesList.includes(slot);
    const nextTimes = isSlotSelected
      ? activeTimesList.filter((s) => s !== slot)
      : [...activeTimesList, slot];

    const nextFreeTime = { ...draftPrefs.freeTime };
    const daysToUpdate = activeDaysList.length > 0 ? activeDaysList : DAYS;

    DAYS.forEach((d) => {
      if (daysToUpdate.includes(d)) {
        nextFreeTime[d] = nextTimes.length > 0 ? nextTimes : ['Evening'];
      } else {
        nextFreeTime[d] = [];
      }
    });

    save({ ...draftPrefs, freeTime: nextFreeTime });
  };

  // Toggle Goal chip
  const toggleGoal = (goal: GoalType) => {
    const currentGoals = draftPrefs.selectedGoals || [];
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];

    save({ ...draftPrefs, selectedGoals: updatedGoals });
  };

  // Ranked & Enriched activities
  const ranked = useMemo(
    () => rankActivities(activities, draftPrefs),
    [activities, draftPrefs]
  );

  // Fully Filtered Activities (Schedule + Budget + Goals + Search Keyword)
  const matchingActivities = useMemo(() => {
    // Categories mapped from selected goals
    const goalCategories = new Set<Category>();
    (draftPrefs.selectedGoals || []).forEach((goal) => {
      mapGoalToCategories(goal).forEach((cat) => goalCategories.add(cat));
    });

    return ranked.filter((act) => {
      // 1. Keyword search filter
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(q);
        const matchesCategory = act.category.toLowerCase().includes(q);
        const matchesSubSkill = act.subSkill?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesSubSkill) return false;
      }

      // 2. Price Budget Filter
      if (draftPrefs.maxBudget && draftPrefs.maxBudget < 350) {
        if (act.price > draftPrefs.maxBudget) return false;
      }

      // 3. Goal Categories Filter
      if (goalCategories.size > 0) {
        if (!goalCategories.has(act.category)) return false;
      }

      // 4. Schedule Match Score Threshold
      return (act.scheduleMatchPercentage || 0) >= 25;
    });
  }, [ranked, searchKeyword, draftPrefs.maxBudget, draftPrefs.selectedGoals]);

  // Requirement #9: 4 Consumer Result Sections
  const resultSections = useMemo(() => {
    const jsDay = new Date().getDay();
    const todayName: DayOfWeek = DAYS[jsDay === 0 ? 6 : jsDay - 1];

    // 1. Available Tonight
    const availableTonight = matchingActivities.filter(
      (a) => a.weekdays?.includes(todayName) && (a.scheduleSlot?.timeOfDay === 'Evening' || a.startTime >= '17:00')
    );

    // 2. Starting This Week
    const startingThisWeek = matchingActivities.filter(
      (a) => a.startDate || a.nextSession || a.programType === 'Session'
    );

    // 3. Near You
    const nearYou = matchingActivities.filter(
      (a) => a.metroStationId === draftPrefs.preferredMetroStationId || (a.commuteInfo?.walkMinutes || a.walkMinutes || 10) <= 8
    );

    // 4. Recommended For You
    const recommendedForYou = matchingActivities.filter(
      (a) => (a.rating || 0) >= 4.7 || (a.scheduleMatchPercentage || 0) >= 60
    );

    return [
      { id: 'tonight', title: 'Available Tonight', items: availableTonight.length > 0 ? availableTonight : matchingActivities.slice(0, 4) },
      { id: 'this-week', title: 'Starting This Week', items: startingThisWeek.length > 0 ? startingThisWeek : matchingActivities.slice(1, 5) },
      { id: 'near-you', title: 'Near You', items: nearYou.length > 0 ? nearYou : matchingActivities.slice(2, 6) },
      { id: 'recommended', title: 'Recommended For You', items: recommendedForYou.length > 0 ? recommendedForYou : matchingActivities.slice(0, 4) },
    ];
  }, [matchingActivities, draftPrefs.preferredMetroStationId]);

  const preferredStation = METRO_STATIONS.find(
    (s) => s.id === draftPrefs.preferredMetroStationId
  );

  const filteredStations = useMemo(() => {
    if (!metroQuery.trim()) return METRO_STATIONS;
    const q = metroQuery.toLowerCase();
    return METRO_STATIONS.filter(
      (st) => st.name.toLowerCase().includes(q) || st.lineName.toLowerCase().includes(q)
    );
  }, [metroQuery]);

  // Requirement #8: Simplified Activity Card (ONLY Image, Title, Next session, Distance, Price, CTA)
  const renderSimplifiedCard = (act: Activity) => {
    const isSaved = savedIds.includes(act.id);
    const walkMins = act.commuteInfo?.walkMinutes || act.walkMinutes || 5;
    const stationName = act.metroStationName || act.metroStationId || 'Central Moscow';
    const nextSessionText = act.sessionDate
      ? `${act.sessionDate} • ${act.startTime || '19:00'}`
      : `${act.weekdays?.[0] || 'Tue'} • ${act.startTime || '19:00'}`;

    return (
      <article
        key={act.id}
        onClick={() => onSelectActivity && onSelectActivity(act)}
        className="group cursor-pointer flex flex-col justify-between transition-all duration-200"
      >
        {/* Image */}
        <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden mb-3 bg-slate-100">
          <img
            src={act.coverImage || act.image}
            alt={act.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          {/* Category Tag & Heart */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-white/95 text-slate-900 shadow-2xs">
              {act.category}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleSave) onToggleSave(act.id);
              }}
              className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px] ${
                isSaved ? 'bg-slate-900 text-[#A2FF00]' : 'bg-white/85 text-slate-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#A2FF00]' : ''}`} />
            </button>
          </div>

          {/* Next Session */}
          <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#A2FF00]" />
            <span>{nextSessionText}</span>
          </div>
        </div>

        {/* Title, Distance, Price & CTA */}
        <div className="space-y-1.5 px-1">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#074213] transition-colors line-clamp-1">
            {act.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{stationName} ({walkMins} min walk)</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-base font-extrabold text-slate-900">${act.price}</span>
              <span className="text-xs text-slate-400 font-normal"> / session</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectActivity) onSelectActivity(act);
              }}
              className="px-4 py-2 bg-slate-900 group-hover:bg-[#074213] text-white group-hover:text-[#A2FF00] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Reserve Spot
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <main className="w-full min-w-0 max-w-full overflow-x-clip bg-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 animate-fade-in" ref={popoverRef}>

        {/* ================= REQUIREMENT #2: ULTRA-COMPACT HERO ================= */}
        <section className="space-y-3 pt-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Discover Activities <span className="text-xs font-extrabold text-[#074213] bg-[#A2FF00]/30 px-2.5 py-1 rounded-full border border-[#A2FF00]/60 ml-1">{matchingActivities.length} available</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Near {preferredStation ? preferredStation.name : 'All Moscow'} · {activeDaysSummary} ({activeTimesSummary.toLowerCase()})
              </p>
            </div>

            {/* Keyword Search Field inside Hero */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activities, art, yoga..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-full text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#A2FF00]"
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* REQUIREMENT #3: COMPACT FILTER CHIPS BAR WITH POPOVERS (DESKTOP) */}
          <div className="relative flex flex-wrap items-center gap-2 pt-1">
            
            {/* 1. Metro Chip */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === 'metro' ? 'none' : 'metro')}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  preferredStation
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-100 text-slate-800 border-slate-200/80 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#A2FF00]" />
                <span>{preferredStation ? preferredStation.name : 'Metro'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Metro Popover */}
              {activePopover === 'metro' && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 text-xs animate-fade-in">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search station..."
                      value={metroQuery}
                      onChange={(e) => setMetroQuery(e.target.value)}
                      className="w-full pl-7 pr-6 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => {
                        save({ ...draftPrefs, preferredMetroStationId: 'all' });
                        setActivePopover('none');
                      }}
                      className="w-full p-2 text-left font-bold text-slate-800 hover:bg-slate-100 rounded-xl"
                    >
                      📍 Any Metro Station (All Moscow)
                    </button>
                    {filteredStations.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          save({ ...draftPrefs, preferredMetroStationId: st.id });
                          setActivePopover('none');
                        }}
                        className="w-full p-2 text-left font-semibold text-slate-700 hover:bg-slate-100 rounded-xl truncate block"
                      >
                        {st.name} ({st.lineName})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Time Chip (SINGLE SCREEN EDIT IN <10 SECONDS) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === 'time' ? 'none' : 'time')}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  activeDaysList.length > 0
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-100 text-slate-800 border-slate-200/80 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#A2FF00]" />
                <span>{activeDaysSummary} · {activeTimesSummary}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Time Popover (Single Screen Days & Times) */}
              {activePopover === 'time' && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3 text-xs animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">Days Available</span>
                    <span className="text-[10px] text-slate-400">Tap to toggle</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {DAYS.map((day) => {
                      const isActive = (draftPrefs.freeTime[day] || []).length > 0;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDayActive(day)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#A2FF00] text-[#074213] border-[#91E600]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="font-extrabold text-slate-900 block">Time Windows</span>
                    <div className="grid grid-cols-3 gap-1">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = activeTimesList.includes(slot.id);
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => toggleTimeSlot(slot.id)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border cursor-pointer text-center ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePopover('none')}
                    className="w-full py-2 bg-slate-900 text-[#A2FF00] font-bold rounded-xl text-xs mt-2"
                  >
                    Apply Time Filters
                  </button>
                </div>
              )}
            </div>

            {/* 3. Budget Chip */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === 'budget' ? 'none' : 'budget')}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  draftPrefs.maxBudget < 350
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-100 text-slate-800 border-slate-200/80 hover:bg-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-[#A2FF00]" />
                <span>{draftPrefs.maxBudget < 350 ? `<$${draftPrefs.maxBudget}` : 'Budget'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Budget Popover */}
              {activePopover === 'budget' && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 space-y-2 text-xs animate-fade-in">
                  <span className="font-extrabold text-slate-900 block">Max Price Per Session</span>
                  <div className="flex flex-wrap gap-1.5">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => {
                          save({ ...draftPrefs, maxBudget: opt.value });
                          setActivePopover('none');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                          draftPrefs.maxBudget === opt.value
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Goal Chip */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === 'goal' ? 'none' : 'goal')}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  (draftPrefs.selectedGoals || []).length > 0
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-100 text-slate-800 border-slate-200/80 hover:bg-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-[#A2FF00]" />
                <span>Goal</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Goal Popover */}
              {activePopover === 'goal' && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 space-y-2 text-xs animate-fade-in">
                  <span className="font-extrabold text-slate-900 block">Discovery Goals</span>
                  <div className="flex flex-wrap gap-1.5">
                    {GOALS.map((goal) => {
                      const isSelected = (draftPrefs.selectedGoals || []).includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => toggleGoal(goal.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span>{goal.icon}</span>
                          <span>{goal.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Reset Filters button if any active */}
            {(draftPrefs.maxBudget < 350 || (draftPrefs.selectedGoals || []).length > 0 || searchKeyword) && (
              <button
                type="button"
                onClick={() => {
                  setSearchKeyword('');
                  save({ ...draftPrefs, maxBudget: 350, selectedGoals: [] });
                }}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}

          </div>
        </section>

        {/* ================= REQUIREMENT #9: 4 CONSUMER RESULT SECTIONS ================= */}
        <section className="space-y-10 pt-1">
          {matchingActivities.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-base font-bold text-slate-700">No activities fit your current search query</p>
              <button
                type="button"
                onClick={() => {
                  setSearchKeyword('');
                  save({ ...draftPrefs, maxBudget: 350, selectedGoals: [] });
                }}
                className="px-5 py-2.5 bg-[#A2FF00] text-[#074213] font-bold text-xs rounded-full cursor-pointer inline-flex items-center gap-2"
              >
                <span>Reset Search Filters</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            resultSections.map((sec) => (
              <div key={sec.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#074213]" />
                    <span>{sec.title}</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-semibold">{sec.items.length} options</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sec.items.slice(0, 4).map((act) => renderSimplifiedCard(act))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* ================= REQUIREMENT #10: MOBILE STICKY BOTTOM FILTER BAR & POPUP ================= */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center justify-around">
          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'time' ? 'none' : 'time')}
            className={`flex flex-col items-center text-[10px] font-bold cursor-pointer ${
              activeDaysList.length > 0 ? 'text-[#074213]' : 'text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Time</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'metro' ? 'none' : 'metro')}
            className={`flex flex-col items-center text-[10px] font-bold cursor-pointer ${
              preferredStation ? 'text-[#074213]' : 'text-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4 mb-0.5" />
            <span>Metro</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'budget' ? 'none' : 'budget')}
            className={`flex flex-col items-center text-[10px] font-bold cursor-pointer ${
              draftPrefs.maxBudget < 350 ? 'text-[#074213]' : 'text-slate-700'
            }`}
          >
            <DollarSign className="w-4 h-4 mb-0.5" />
            <span>Budget</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePopover(activePopover === 'goal' ? 'none' : 'goal')}
            className={`flex flex-col items-center text-[10px] font-bold cursor-pointer ${
              (draftPrefs.selectedGoals || []).length > 0 ? 'text-[#074213]' : 'text-slate-700'
            }`}
          >
            <Target className="w-4 h-4 mb-0.5" />
            <span>Goal</span>
          </button>
        </div>

        {/* MOBILE BOTTOM SHEET FOR ACTIVE POPOVER WHEN TRIGGERED ON MOBILE */}
        {activePopover !== 'none' && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-end">
            <div className="w-full bg-white rounded-t-3xl p-5 border-t border-slate-200 space-y-4 max-h-[80vh] overflow-y-auto animate-slide-up shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                  Filter by {activePopover.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePopover('none')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activePopover === 'metro' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Type station or line name..."
                      value={metroQuery}
                      onChange={(e) => setMetroQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#A2FF00]"
                      autoFocus
                    />
                    {metroQuery && (
                      <button
                        type="button"
                        onClick={() => setMetroQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 max-h-[50vh] overflow-y-auto scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => {
                        save({ ...draftPrefs, preferredMetroStationId: 'all' });
                        setActivePopover('none');
                      }}
                      className={`w-full p-2.5 text-xs font-bold text-left rounded-xl transition-colors ${
                        draftPrefs.preferredMetroStationId === 'all'
                          ? 'bg-[#A2FF00]/20 text-[#074213]'
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      📍 Any Metro Station (All Moscow)
                    </button>

                    {filteredStations.map((st) => {
                      const line = METRO_LINES.find((l) => l.id === st.lineId);
                      const isSelected = draftPrefs.preferredMetroStationId === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            save({ ...draftPrefs, preferredMetroStationId: st.id });
                            setActivePopover('none');
                          }}
                          className={`w-full p-2.5 text-xs font-semibold text-left rounded-xl flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[#A2FF00]/20 text-[#074213] font-bold'
                              : 'hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            {line && (
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: line.color }}
                              />
                            )}
                            <span className="truncate">{st.name}</span>
                            <span className="text-[10px] text-slate-400 truncate">({st.lineName})</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#074213] stroke-[3] shrink-0" />}
                        </button>
                      );
                    })}

                    {filteredStations.length === 0 && (
                      <p className="text-xs text-slate-400 p-3 text-center">No stations match &quot;{metroQuery}&quot;</p>
                    )}
                  </div>
                </div>
              )}

              {activePopover === 'time' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Days Available</span>
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS.map((day) => {
                        const isActive = (draftPrefs.freeTime[day] || []).length > 0;
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDayActive(day)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                              isActive ? 'bg-[#A2FF00] text-[#074213] border-[#91E600]' : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Time Windows</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = activeTimesList.includes(slot.id);
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => toggleTimeSlot(slot.id)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border text-center ${
                              isSelected ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePopover('none')}
                    className="w-full py-3 bg-slate-900 text-[#A2FF00] font-bold rounded-2xl text-xs"
                  >
                    Done
                  </button>
                </div>
              )}

              {activePopover === 'budget' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Max Price Per Session</span>
                  <div className="grid grid-cols-3 gap-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => {
                          save({ ...draftPrefs, maxBudget: opt.value });
                          setActivePopover('none');
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border ${
                          draftPrefs.maxBudget === opt.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePopover === 'goal' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Discovery Goals</span>
                  <div className="flex flex-wrap gap-2">
                    {GOALS.map((goal) => {
                      const isSelected = (draftPrefs.selectedGoals || []).includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => toggleGoal(goal.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                            isSelected ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span>{goal.icon}</span>
                          <span>{goal.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
};
