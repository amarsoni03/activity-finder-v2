import React, { useState } from 'react';
import {
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  MapPin,
  Clock,
  Tag,
  Users,
  Award,
  ShieldCheck,
  Star,
  Globe,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Category,
  RegularityType,
  TimeOfDay,
  SkillLevel,
  FilterState,
  DayOfWeek,
  AudienceType,
  DeliveryFilter,
  LanguageFilter,
  GoalType,
} from '../types';
import { CATEGORIES, SUB_SKILLS_MAP } from '../data/activitiesData';
import { METRO_LINES, METRO_STATIONS } from '../data/metroData';
import { formatPrice } from '../utils/formatters';

interface SidebarFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  resultsCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  resultsCount,
  isOpen,
  onClose = () => {},
}) => {
  const [showAdvanced, setShowAdvanced] = useState(true);

  const currentSubSkills = SUB_SKILLS_MAP[filters.category] || [];

  // Check if any non-default filters are active
  const isFiltered =
    (filters.category !== 'All Categories' && filters.category !== 'All') ||
    (filters.subSkill && filters.subSkill !== 'All') ||
    (filters.language && filters.language !== 'All') ||
    filters.metroLineId !== 'all' ||
    filters.metroStationIds.length > 0 ||
    filters.timeOfDaySlots.length > 0 ||
    filters.daysOfWeek.length > 0 ||
    filters.audience !== 'All' ||
    (filters.deliveryMode && filters.deliveryMode !== 'All') ||
    (filters.regularity && filters.regularity !== 'All') ||
    (filters.goal && filters.goal !== 'All Goals') ||
    filters.level !== 'All Levels' ||
    filters.minRating > 0 ||
    filters.maxPrice < 15000 ||
    filters.requireDegree ||
    filters.requireVerified ||
    filters.requireBackgroundChecked ||
    filters.requireTopRated;

  // Active filter count logic
  const activeCount = [
    filters.category !== 'All Categories' && filters.category !== 'All',
    filters.subSkill && filters.subSkill !== 'All',
    filters.language && filters.language !== 'All',
    filters.metroLineId !== 'all',
    filters.metroStationIds.length > 0,
    filters.timeOfDaySlots.length > 0,
    filters.daysOfWeek.length > 0,
    filters.audience !== 'All',
    filters.deliveryMode && filters.deliveryMode !== 'All',
    filters.regularity && filters.regularity !== 'All',
    filters.goal && filters.goal !== 'All Goals',
    filters.level !== 'All Levels',
    filters.minRating > 0,
    filters.maxPrice < 15000,
    filters.requireDegree,
    filters.requireVerified,
    filters.requireBackgroundChecked,
    filters.requireTopRated,
  ].filter(Boolean).length;

  // Metro station helpers
  const handleStationToggle = (stationId: string) => {
    if (filters.metroStationIds.includes(stationId)) {
      onFilterChange({
        metroStationIds: filters.metroStationIds.filter((id) => id !== stationId),
      });
    } else {
      onFilterChange({
        metroStationIds: [...filters.metroStationIds, stationId],
      });
    }
  };

  const currentLineStations =
    filters.metroLineId === 'all'
      ? METRO_STATIONS
      : METRO_STATIONS.filter((s) => s.lineId === filters.metroLineId);

  const handleSelectAllStationsOnLine = () => {
    const currentIds = currentLineStations.map((s) => s.id);
    const combined = Array.from(new Set([...filters.metroStationIds, ...currentIds]));
    onFilterChange({ metroStationIds: combined });
  };

  const handleClearLineStations = () => {
    if (filters.metroLineId === 'all') {
      onFilterChange({ metroStationIds: [] });
    } else {
      const currentIds = new Set(currentLineStations.map((s) => s.id));
      onFilterChange({
        metroStationIds: filters.metroStationIds.filter((id) => !currentIds.has(id)),
      });
    }
  };

  // Time & Day helpers
  const handleTimeSlotToggle = (slot: TimeOfDay) => {
    if (filters.timeOfDaySlots.includes(slot)) {
      onFilterChange({
        timeOfDaySlots: filters.timeOfDaySlots.filter((s) => s !== slot),
      });
    } else {
      onFilterChange({
        timeOfDaySlots: [...filters.timeOfDaySlots, slot],
      });
    }
  };

  const handleDayToggle = (day: DayOfWeek) => {
    if (filters.daysOfWeek.includes(day)) {
      onFilterChange({
        daysOfWeek: filters.daysOfWeek.filter((d) => d !== day),
      });
    } else {
      onFilterChange({
        daysOfWeek: [...filters.daysOfWeek, day],
      });
    }
  };

  const ALL_DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const WEEKEND_DAYS: DayOfWeek[] = ['Saturday', 'Sunday'];

  const isWeekendSelected = WEEKEND_DAYS.every((d) => filters.daysOfWeek.includes(d));
  const isAllDaysSelected = ALL_DAYS.every((d) => filters.daysOfWeek.includes(d));

  const toggleWeekend = () => {
    if (isWeekendSelected) {
      onFilterChange({ daysOfWeek: filters.daysOfWeek.filter((d) => !WEEKEND_DAYS.includes(d)) });
    } else {
      const combined = Array.from(new Set([...filters.daysOfWeek, ...WEEKEND_DAYS]));
      onFilterChange({ daysOfWeek: combined });
    }
  };

  const toggleThisWeek = () => {
    if (isAllDaysSelected) {
      onFilterChange({ daysOfWeek: [] });
    } else {
      onFilterChange({ daysOfWeek: ALL_DAYS });
    }
  };

  const todayIndex = (new Date().getDay() + 6) % 7;
  const isTodaySelected = filters.daysOfWeek.includes(ALL_DAYS[todayIndex]);

  const toggleToday = () => {
    const todayName = ALL_DAYS[todayIndex];
    handleDayToggle(todayName);
  };

  const PRICE_TIERS = [
    { label: 'Free', val: 0 },
    { label: 'Budget', val: 3000 },
    { label: 'Mid', val: 7000 },
    { label: 'Any', val: 15000 },
  ];

  // Render unified filter content form
  const renderFilterForm = () => (
    <div className="space-y-6 text-slate-900 text-xs">
      
      {/* 1. Category Section */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Category & Sub-skills
        </label>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) =>
              onFilterChange({
                category: e.target.value as Category,
                subSkill: 'All',
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer appearance-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>

        {currentSubSkills.length > 0 && (
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase block">
              Sub-skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onFilterChange({ subSkill: 'All' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filters.subSkill === 'All'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Sub-skills
              </button>
              {currentSubSkills.map((sub) => {
                const isSelected = filters.subSkill === sub;
                return (
                  <button
                    type="button"
                    key={sub}
                    onClick={() => onFilterChange({ subSkill: sub })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Metro Station Filter */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Metro Station
          </label>
          {filters.metroStationIds.length > 0 && (
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              {filters.metroStationIds.length} selected
            </span>
          )}
        </div>

        <div className="relative">
          <select
            value={filters.metroLineId}
            onChange={(e) =>
              onFilterChange({
                metroLineId: e.target.value,
                metroStationIds: [],
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer appearance-none"
          >
            <option value="all">All Metro Lines ↓</option>
            {METRO_LINES.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>

        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <button
            type="button"
            onClick={handleSelectAllStationsOnLine}
            className="text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
          >
            Select line stations
          </button>
          {filters.metroStationIds.length > 0 && (
            <button
              type="button"
              onClick={handleClearLineStations}
              className="text-slate-400 hover:text-rose-600 font-medium transition-colors cursor-pointer"
            >
              Clear selection
            </button>
          )}
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1 p-2 rounded-2xl bg-slate-50 border border-slate-200/60 scrollbar-thin">
          {currentLineStations.map((st) => {
            const isChecked = filters.metroStationIds.includes(st.id);
            return (
              <label
                key={st.id}
                className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded-xl hover:bg-white transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleStationToggle(st.id)}
                  className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
                />
                <span className={`truncate font-medium ${isChecked ? 'text-slate-900 font-bold' : ''}`}>
                  {st.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Schedule & Time */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Schedule & Time
        </label>

        {/* Quick Presets */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={toggleToday}
            className={`py-2 px-2 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer ${
              isTodaySelected
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={toggleWeekend}
            className={`py-2 px-2 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer ${
              isWeekendSelected
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Weekend
          </button>
          <button
            type="button"
            onClick={toggleThisWeek}
            className={`py-2 px-2 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer ${
              isAllDaysSelected
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            This Week
          </button>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {[
            { id: 'Morning' as TimeOfDay, label: 'Morning' },
            { id: 'Afternoon' as TimeOfDay, label: 'Afternoon' },
            { id: 'Evening' as TimeOfDay, label: 'Evening' },
          ].map((slot) => {
            const isSelected = filters.timeOfDaySlots.includes(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleTimeSlotToggle(slot.id)}
                className={`py-2 px-2 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>

        {/* Day Chips Grid */}
        <div className="pt-1">
          <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase block mb-1">
            Specific Days:
          </span>
          <div className="grid grid-cols-7 gap-1">
            {ALL_DAYS.map((day) => {
              const isSelected = filters.daysOfWeek.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={day}
                >
                  {day.substring(0, 2)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Target Audience */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Target Audience
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['All', 'Adults', 'Children', 'Corporate'] as AudienceType[]).map((aud) => {
            const isSelected = filters.audience === aud;
            return (
              <button
                key={aud}
                type="button"
                onClick={() => onFilterChange({ audience: aud })}
                className={`py-2 px-3 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {aud === 'All' ? 'All Audiences' : aud}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Delivery Format / Mode */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Delivery Format
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['All', 'In Person', 'Live Online', 'Self-Paced', 'Hybrid'] as DeliveryFilter[]).map((mode) => {
            const isSelected = (filters.deliveryMode || 'All') === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onFilterChange({ deliveryMode: mode })}
                className={`py-2 px-2.5 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {mode === 'All' ? 'Any Format' : mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Skill Level */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Skill Level
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['All Levels', 'Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => {
            const isSelected = filters.level === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onFilterChange({ level: lvl })}
                className={`py-2 px-3 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Max Price & Tiers */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Max Price
          </label>
          <span className="text-xs font-bold text-slate-900">
            {filters.maxPrice >= 15000 ? 'Any price' : `${formatPrice(filters.maxPrice)} ₽`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={15000}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-slate-900 cursor-pointer"
        />
        <div className="grid grid-cols-4 gap-1 pt-0.5">
          {PRICE_TIERS.map((tier) => {
            const isActive = filters.maxPrice === tier.val;
            return (
              <button
                key={tier.label}
                type="button"
                onClick={() => onFilterChange({ maxPrice: tier.val })}
                className={`py-1.5 px-1 text-[11px] font-semibold rounded-xl text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Minimum Rating */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Min Rating
          </label>
          <span className="text-xs font-bold text-slate-900">
            {filters.minRating > 0 ? `${filters.minRating}★ & up` : 'Any rating'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 4.0, 4.5, 4.8].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => onFilterChange({ minRating: stars })}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                filters.minRating === stars
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {stars === 0 ? 'Any' : `${stars}★`}
            </button>
          ))}
        </div>
      </div>

      {/* 9. Instruction Language Filter */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Instruction Language
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'All' as LanguageFilter, label: '🌐 All Languages' },
            { id: 'English' as LanguageFilter, label: '🇬🇧 English' },
            { id: 'Russian' as LanguageFilter, label: '🇷🇺 Russian' },
            { id: 'English & Russian' as LanguageFilter, label: '🇬🇧🇷🇺 Eng & Rus' },
          ].map((langOption) => {
            const isActive = (filters.language || 'All') === langOption.id;
            return (
              <button
                key={langOption.id}
                type="button"
                onClick={() => onFilterChange({ language: langOption.id })}
                className={`py-2 px-2 text-[11px] font-semibold rounded-xl text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {langOption.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 10. Advanced Filters Collapsible Section */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-slate-900 py-2 border-t border-slate-100 cursor-pointer"
        >
          <div className="flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Discovery Goal & Provider Trust</span>
          </div>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden space-y-4 pt-3"
            >
              {/* Discovery Goal */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Discovery Goal
                </label>
                <div className="relative">
                  <select
                    value={filters.goal || 'All Goals'}
                    onChange={(e) => onFilterChange({ goal: e.target.value as GoalType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="All Goals">All Goals</option>
                    <option value="Learn">Learn (Languages, Tech, Business)</option>
                    <option value="Exercise">Exercise (Fitness, Sports, Dance)</option>
                    <option value="Create">Create (Arts, Crafts, Music)</option>
                    <option value="Relax">Relax (Yoga, Mindful, Music)</option>
                    <option value="Meet People">Meet People (Social & Group)</option>
                    <option value="Career">Career (Professional Skills)</option>
                    <option value="Kids">Kids (Family & Youth)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Provider Trust & Qualifications Checks */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Teacher Qualifications & Trust
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={filters.requireDegree}
                    onChange={(e) => onFilterChange({ requireDegree: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
                  />
                  <span>Certified Degree / Credential</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={!!filters.requireVerified}
                    onChange={(e) => onFilterChange({ requireVerified: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 accent-emerald-600 cursor-pointer"
                  />
                  <span>Verified Providers Only</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={!!filters.requireBackgroundChecked}
                    onChange={(e) => onFilterChange({ requireBackgroundChecked: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 accent-teal-600 cursor-pointer"
                  />
                  <span>Background Checked Instructors</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={!!filters.requireTopRated}
                    onChange={(e) => onFilterChange({ requireTopRated: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 accent-purple-600 cursor-pointer"
                  />
                  <span>Top Rated (4.8+ Rating)</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );

  // Modal drawer mode: when isOpen is explicitly provided (boolean)
  if (isOpen !== undefined) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Dimmed Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-fade-in"
          onClick={onClose}
        />

        <div className="fixed inset-0 pointer-events-none flex flex-col justify-end lg:flex-row lg:justify-end">
          {/* Panel Container */}
          <div className="pointer-events-auto w-full lg:max-w-md bg-white rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none shadow-2xl h-[88vh] lg:h-full flex flex-col transition-transform animate-slide-up lg:animate-slide-left">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <SlidersHorizontal className="w-4.5 h-4.5 text-slate-900" />
                <h2 className="text-base font-bold text-slate-900">Filter Activities</h2>
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 bg-slate-900 text-[#A2FF00] text-[10px] font-extrabold rounded-full">
                    {activeCount}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {isFiltered && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1 cursor-pointer px-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {renderFilterForm()}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center gap-3 shrink-0">
              {isFiltered && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-900 text-white rounded-2xl py-3 text-xs font-bold shadow-sm hover:bg-black transition-all cursor-pointer text-center"
              >
                Show {resultsCount} {resultsCount === 1 ? 'Activity' : 'Activities'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline Sidebar Card mode (Desktop default)
  return (
    <aside className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <SlidersHorizontal className="w-4 h-4 text-slate-900" />
          <h2 className="text-base font-bold text-slate-900">Filters</h2>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-slate-900 text-[#A2FF00] text-[10px] font-extrabold rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center space-x-1 cursor-pointer px-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Form Controls */}
      {renderFilterForm()}
    </aside>
  );
};
