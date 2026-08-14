import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  Plus,
  SlidersHorizontal,
  Compass,
  ChevronDown,
  Tag,
} from 'lucide-react';
import {
  Activity,
  UserPreferences,
  DayOfWeek,
  TimeOfDay,
  UserFreeTime,
  Category,
} from '../../../types';
import { ActivityCard } from '../../activities/components/ActivityCard';
import { MyWeekActivityCard } from './MyWeekActivityCard';
import { enrichActivity } from '../../personalization/utils/personalization';
import { METRO_LINES, METRO_STATIONS } from '../../metro/data/metroData';
import { CATEGORIES } from '../../activities/data/activitiesData';

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c !== 'All Categories');

interface MyWeekViewProps {
  activities: Activity[];
  userPreferences: UserPreferences;
  onSavePreferences: (newPrefs: UserPreferences) => void;
  onSelectActivity: (activity: Activity) => void;
  onReserveSpot: (activity: Activity) => void;
  onToggleSave: (activityId: string) => void;
  savedIds: string[];
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

const TIME_SLOTS: { id: TimeOfDay; label: string; short: string; time: string }[] = [
  { id: 'Morning', label: 'Morning', short: 'AM', time: '08:00 – 12:00' },
  { id: 'Afternoon', label: 'Afternoon', short: 'PM', time: '12:00 – 17:00' },
  { id: 'Evening', label: 'Evening', short: 'Eve', time: '17:00 – 21:30' },
];

function SlotToggleButton({
  isActive,
  label,
  onClick,
  compact = false,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
  compact?: boolean;
  key?: React.Key;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`w-full rounded-xl font-semibold border transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
        compact ? 'py-2 px-1 min-h-[44px] text-[10px] sm:text-[11px]' : 'py-2.5 px-2 min-h-[40px] text-xs'
      } ${
        isActive
          ? 'bg-[#A2FF00] text-[#074213] border-[#91E600] shadow-2xs font-bold'
          : 'bg-white text-slate-500 border-slate-200 active:bg-slate-50'
      }`}
    >
      {isActive && <Check className="w-3 h-3 shrink-0" />}
      <span className="truncate">{label}</span>
    </button>
  );
}

export const MyWeekView: React.FC<MyWeekViewProps> = ({
  activities,
  userPreferences,
  onSavePreferences,
  onSelectActivity,
  onReserveSpot,
  onToggleSave,
  savedIds,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<DayOfWeek | 'All'>('All');
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [expandedEditDay, setExpandedEditDay] = useState<DayOfWeek | null>('Monday');
  const [draftPreferences, setDraftPreferences] = useState<UserPreferences>(userPreferences);

  const preferredStation = METRO_STATIONS.find(
    (s) => s.id === draftPreferences.preferredMetroStationId
  );
  const [selectedMetroLine, setSelectedMetroLine] = useState<string>(
    preferredStation?.lineId ?? 'all'
  );

  useEffect(() => {
    setDraftPreferences(userPreferences);
    const station = METRO_STATIONS.find((s) => s.id === userPreferences.preferredMetroStationId);
    if (station) setSelectedMetroLine(station.lineId);
    else if (userPreferences.preferredMetroStationId === 'all') setSelectedMetroLine('all');
  }, [userPreferences]);

  const savePreferences = (next: UserPreferences) => {
    setDraftPreferences(next);
    onSavePreferences(next);
  };

  const handleMetroLineChange = (lineId: string) => {
    setSelectedMetroLine(lineId);
    if (lineId === 'all') {
      savePreferences({ ...draftPreferences, preferredMetroStationId: 'all' });
      return;
    }
    const stationsOnLine = METRO_STATIONS.filter((s) => s.lineId === lineId);
    const currentOnLine = stationsOnLine.find(
      (s) => s.id === draftPreferences.preferredMetroStationId
    );
    const stationId = currentOnLine?.id ?? stationsOnLine[0]?.id ?? 'all';
    savePreferences({ ...draftPreferences, preferredMetroStationId: stationId });
  };

  const handleMetroStationChange = (stationId: string) => {
    savePreferences({
      ...draftPreferences,
      preferredMetroStationId: stationId || 'all',
    });
  };

  const toggleCategory = (category: Category) => {
    const current = draftPreferences.preferredCategories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    savePreferences({ ...draftPreferences, preferredCategories: updated });
  };

  const clearCategories = () => {
    savePreferences({ ...draftPreferences, preferredCategories: [] });
  };

  const enrichedActivities = useMemo(
    () => activities.map((act) => enrichActivity(act, userPreferences)),
    [activities, userPreferences]
  );

  const toggleSlot = (day: DayOfWeek, slot: TimeOfDay) => {
    const currentSlots = draftPreferences.freeTime[day] || [];
    const updatedSlots = currentSlots.includes(slot)
      ? currentSlots.filter((s) => s !== slot)
      : [...currentSlots, slot];

    const newPrefs = {
      ...draftPreferences,
      freeTime: {
        ...draftPreferences.freeTime,
        [day]: updatedSlots,
      },
    };
    savePreferences(newPrefs);
  };

  const applyPreset = (preset: 'evenings' | 'weekends' | 'all') => {
    const newFreeTime: UserFreeTime = { ...draftPreferences.freeTime };
    DAYS_OF_WEEK.forEach((d) => {
      if (preset === 'evenings') {
        newFreeTime[d] = ['Evening'];
      } else if (preset === 'weekends') {
        newFreeTime[d] =
          d === 'Saturday' || d === 'Sunday' ? ['Morning', 'Afternoon', 'Evening'] : [];
      } else {
        newFreeTime[d] = ['Morning', 'Afternoon', 'Evening'];
      }
    });
    savePreferences({ ...draftPreferences, freeTime: newFreeTime });
  };

  const totalFreeBlocks = DAYS_OF_WEEK.reduce(
    (acc, d) => acc + (userPreferences.freeTime[d]?.length || 0),
    0
  );

  const passesLocationAndCategoryFilters = (act: Activity) => {
    const selectedCategories = userPreferences.preferredCategories || [];
    if (selectedCategories.length > 0 && !selectedCategories.includes(act.category)) {
      return false;
    }

    const prefStationId = userPreferences.preferredMetroStationId;
    if (!prefStationId || prefStationId === 'all') {
      if (selectedMetroLine !== 'all' && act.metroLineId !== selectedMetroLine) {
        return false;
      }
      return true;
    }

    if (act.metroStationId === prefStationId) return true;

    const commuteMins = act.commuteInfo?.totalTravelMinutes ?? 999;
    if (commuteMins <= 25) return true;

    const prefStation = METRO_STATIONS.find((s) => s.id === prefStationId);
    if (prefStation && act.metroLineId === prefStation.lineId) return true;

    return false;
  };

  const getMatchingActivitiesForSlot = (day: DayOfWeek, slot: TimeOfDay) => {
    return enrichedActivities
      .filter(
        (act) =>
          act.schedule.days.includes(day) &&
          act.schedule.timeOfDay === slot &&
          passesLocationAndCategoryFilters(act)
      )
      .sort((a, b) => (b.scheduleMatchPercentage || 0) - (a.scheduleMatchPercentage || 0));
  };

  const daysWithFreeTime = DAYS_OF_WEEK.filter(
    (day) => (userPreferences.freeTime[day]?.length || 0) > 0
  );

  const daysToRender =
    selectedDayTab === 'All'
      ? daysWithFreeTime.length > 0
        ? daysWithFreeTime
        : []
      : [selectedDayTab];

  const activeStation = METRO_STATIONS.find(
    (s) => s.id === userPreferences.preferredMetroStationId
  );
  const activeLine = activeStation
    ? METRO_LINES.find((l) => l.id === activeStation.lineId)
    : selectedMetroLine !== 'all'
    ? METRO_LINES.find((l) => l.id === selectedMetroLine)
    : null;

  const stationsForLine =
    selectedMetroLine === 'all'
      ? METRO_STATIONS
      : METRO_STATIONS.filter((s) => s.lineId === selectedMetroLine);

  const selectedCategoryCount = (userPreferences.preferredCategories || []).length;

  return (
    <main className="w-full min-w-0 max-w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6 animate-fade-in">
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-2xs p-4 sm:p-8 space-y-4 sm:space-y-5 max-w-full">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2 min-w-0 max-w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A2FF00]/15 text-[#074213] text-xs font-semibold rounded-full border border-[#A2FF00]/40">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>My Week</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 break-words">
                What fits your free time?
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Activities matched to when you&apos;re free — near your metro, ready to book.
              </p>
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1 pt-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {totalFreeBlocks} free slot{totalFreeBlocks === 1 ? '' : 's'}
                </span>
                {activeStation ? (
                  <span className="inline-flex items-center gap-1.5 font-medium min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[#074213] shrink-0" />
                    <span className="truncate">
                      {activeStation.name}
                      {activeLine ? ` · ${activeLine.name.split(':')[0]}` : ''}
                    </span>
                  </span>
                ) : activeLine ? (
                  <span className="inline-flex items-center gap-1.5 font-medium min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[#074213] shrink-0" />
                    <span className="truncate">{activeLine.name.split(':')[0]}</span>
                  </span>
                ) : null}
                {selectedCategoryCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-[#074213] shrink-0" />
                    {selectedCategoryCount} categor{selectedCategoryCount === 1 ? 'y' : 'ies'}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingSchedule(!isEditingSchedule)}
              className="w-full md:w-auto shrink-0 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#A2FF00] shrink-0" />
              <span>{isEditingSchedule ? 'Done editing' : 'Edit availability'}</span>
            </button>
          </div>

          {isEditingSchedule && (
            <div className="pt-4 sm:pt-5 border-t border-slate-100 space-y-4 animate-fade-in max-w-full">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Weekly free time</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tap a block to mark when you&apos;re free. Changes save instantly.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-full">
                  {(
                    [
                      ['evenings', 'Evenings'],
                      ['weekends', 'Weekends'],
                      ['all', 'All time'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyPreset(key)}
                      className="px-2 py-2 bg-slate-100 active:bg-slate-200 text-slate-700 rounded-full text-[11px] sm:text-xs font-semibold transition-colors min-h-[40px] truncate"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: accordion per day */}
              <div className="md:hidden space-y-2 max-w-full">
                {DAYS_OF_WEEK.map((day) => {
                  const activeSlots = draftPreferences.freeTime[day] || [];
                  const isOpen = expandedEditDay === day;
                  return (
                    <div
                      key={day}
                      className="rounded-xl border border-slate-200/60 bg-slate-50/50 overflow-hidden max-w-full"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedEditDay(isOpen ? null : day)}
                        className="w-full flex items-center justify-between gap-2 p-3 min-h-[44px] text-left"
                      >
                        <span className="text-sm font-bold text-slate-800">{day}</span>
                        <span className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-semibold text-slate-500">
                            {activeSlots.length > 0 ? `${activeSlots.length} on` : 'None'}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="grid grid-cols-3 gap-2 px-3 pb-3 max-w-full">
                          {TIME_SLOTS.map((slot) => (
                            <SlotToggleButton
                              key={slot.id}
                              isActive={activeSlots.includes(slot.id)}
                              label={slot.short}
                              compact
                              onClick={() => toggleSlot(day, slot.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/60 bg-slate-50/80">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/60">
                      <th className="p-3 text-left font-bold text-slate-400 uppercase tracking-wider w-24">
                        Day
                      </th>
                      {TIME_SLOTS.map((slot) => (
                        <th key={slot.id} className="p-3 text-center font-bold text-slate-600">
                          <span className="block">{slot.label}</span>
                          <span className="font-normal text-slate-400 text-[10px]">{slot.time}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS_OF_WEEK.map((day) => {
                      const activeSlots = draftPreferences.freeTime[day] || [];
                      return (
                        <tr key={day} className="border-b border-slate-100 last:border-0">
                          <td className="p-3 font-bold text-slate-800">{day.slice(0, 3)}</td>
                          {TIME_SLOTS.map((slot) => (
                            <td key={slot.id} className="p-2 text-center">
                              <SlotToggleButton
                                isActive={activeSlots.includes(slot.id)}
                                label={slot.label}
                                onClick={() => toggleSlot(day, slot.id)}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Metro line, station & category — matches Explore search flow */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-2xs p-4 sm:p-6 space-y-4 max-w-full">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Where &amp; what</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter activities by metro line, station, and category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Metro line
              </label>
              <select
                value={selectedMetroLine}
                onChange={(e) => handleMetroLineChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#A2FF00]/30 min-h-[44px]"
              >
                <option value="all">All lines</option>
                {METRO_LINES.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Metro station
              </label>
              <select
                value={
                  draftPreferences.preferredMetroStationId === 'all'
                    ? ''
                    : draftPreferences.preferredMetroStationId
                }
                onChange={(e) => handleMetroStationChange(e.target.value)}
                disabled={selectedMetroLine === 'all'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#A2FF00]/30 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedMetroLine === 'all' ? 'Select a line first' : 'All stations on line'}
                </option>
                {stationsForLine.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Categories
              </label>
              {selectedCategoryCount > 0 && (
                <button
                  type="button"
                  onClick={clearCategories}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <button
                type="button"
                onClick={clearCategories}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold min-h-[32px] ${
                  selectedCategoryCount === 0
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                All
              </button>
              {CATEGORY_OPTIONS.map((category) => {
                const isActive = (draftPreferences.preferredCategories || []).includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold min-h-[32px] ${
                      isActive
                        ? 'bg-[#A2FF00]/20 text-[#074213] border border-[#A2FF00]/50 font-bold'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Day filter */}
        <div className="w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-0">
            <button
              type="button"
              onClick={() => setSelectedDayTab('All')}
              className={`px-3 py-2 rounded-full text-xs font-semibold transition-all shrink-0 min-h-[36px] ${
                selectedDayTab === 'All'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              All days
            </button>
            {DAYS_OF_WEEK.map((day) => {
              const freeSlots = userPreferences.freeTime[day] || [];
              const isFreeDay = freeSlots.length > 0;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayTab(day)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 min-h-[36px] ${
                    selectedDayTab === day
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : isFreeDay
                      ? 'bg-[#A2FF00]/10 text-[#074213] border border-[#A2FF00]/30'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  <span>{day.slice(0, 3)}</span>
                  {isFreeDay && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedDayTab === day ? 'bg-[#A2FF00]' : 'bg-[#074213]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {totalFreeBlocks === 0 && selectedDayTab === 'All' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-2xs p-6 sm:p-14 text-center space-y-4 max-w-full">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-slate-900">Set when you&apos;re free</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Add your weekly free time and we&apos;ll show activities that fit those slots near you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingSchedule(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#A2FF00] active:bg-[#91E600] text-[#074213] text-sm font-bold rounded-xl min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              Add free time
            </button>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6 max-w-full">
          {daysToRender.map((day) => {
            const dayFreeSlots = userPreferences.freeTime[day] || [];
            const slotsToShow =
              selectedDayTab === 'All'
                ? TIME_SLOTS.filter((s) => dayFreeSlots.includes(s.id))
                : dayFreeSlots.length > 0
                ? TIME_SLOTS.filter((s) => dayFreeSlots.includes(s.id))
                : TIME_SLOTS;

            return (
              <section
                key={day}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-2xs p-4 sm:p-7 space-y-4 sm:space-y-6 min-w-0 max-w-full overflow-hidden"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 text-[#A2FF00] flex items-center justify-center font-bold text-sm">
                      {day.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">{day}</h2>
                      <p className="text-xs text-slate-500 font-medium break-words">
                        {dayFreeSlots.length > 0
                          ? `Free: ${dayFreeSlots.join(', ')}`
                          : 'No free time marked'}
                      </p>
                    </div>
                  </div>

                  {dayFreeSlots.length === 0 && (
                    <button
                      type="button"
                      onClick={() => toggleSlot(day, 'Evening')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#074213] bg-[#A2FF00]/10 active:bg-[#A2FF00]/20 border border-[#A2FF00]/30 rounded-full min-h-[40px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add evening
                    </button>
                  )}
                </div>

                {dayFreeSlots.length === 0 && selectedDayTab !== 'All' ? (
                  <div className="py-6 text-center space-y-2">
                    <Compass className="w-5 h-5 text-slate-300 mx-auto" />
                    <p className="text-sm text-slate-500 px-2">
                      Mark {day} as free to see matching activities.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5 sm:space-y-8">
                    {slotsToShow.map((slot) => {
                      const matches = getMatchingActivitiesForSlot(day, slot.id);

                      return (
                        <div key={slot.id} className="space-y-3 min-w-0 max-w-full">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                            <h3 className="text-sm font-bold text-slate-900">{slot.label}</h3>
                            <span className="text-xs text-slate-400">{slot.time}</span>
                            {matches.length > 0 && (
                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                {matches.length}
                              </span>
                            )}
                            <span className="text-[11px] font-semibold text-[#074213] bg-[#A2FF00]/15 px-2 py-0.5 rounded-full border border-[#A2FF00]/30 inline-flex items-center gap-1 ml-auto">
                              <Check className="w-3 h-3" />
                              Free
                            </span>
                          </div>

                          {matches.length > 0 ? (
                            <>
                              {/* Mobile: compact horizontal cards */}
                              <div className="flex flex-col gap-2.5 md:hidden min-w-0 max-w-full">
                                {matches.map((act) => (
                                  <MyWeekActivityCard
                                    key={act.id}
                                    activity={act}
                                    isSaved={savedIds.includes(act.id)}
                                    onToggleSave={onToggleSave}
                                    onSelectActivity={onSelectActivity}
                                    onQuickBook={onReserveSpot}
                                  />
                                ))}
                              </div>
                              {/* Desktop: full cards */}
                              <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-5 min-w-0">
                                {matches.map((act) => (
                                  <ActivityCard
                                    key={act.id}
                                    activity={act}
                                    isSaved={savedIds.includes(act.id)}
                                    onToggleSave={onToggleSave}
                                    onSelectActivity={onSelectActivity}
                                    onQuickBook={onReserveSpot}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center">
                              <p className="text-sm text-slate-500">
                                No activities match this slot with your current metro and category filters.
                                Try another free block or adjust filters above.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};
