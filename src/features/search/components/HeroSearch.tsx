import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, RotateCcw, ChevronRight, ChevronDown, MapPin, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Category, AudienceType, TimeOfDay, DayOfWeek, FilterState, DeliveryFilter, LanguageFilter, Activity } from '../../../types';
import { INITIAL_ACTIVITIES } from '../../activities/data/activitiesData';
import { METRO_LINES, METRO_STATIONS } from '../../metro/data/metroData';

import { SearchAutocomplete } from './SearchAutocomplete';
import { CategoryPopover } from './CategoryPopover';
import { MetroPopover } from './MetroPopover';
import { LanguagePopover } from './LanguagePopover';
import { TimeSelectorPopover } from './TimeSelectorPopover';
import { MobileSearchSheet } from './MobileSearchSheet';

interface HeroSearchProps {
  filters: FilterState;
  onApplySearch: (newFilters: Partial<FilterState>) => void;
  activities?: Activity[];
  onOpenAiMatchmaker?: () => void;
  onOpenFreeTimePlanner?: () => void;
  onSelectActivity?: (activity: Activity) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onApplySearch,
  activities = INITIAL_ACTIVITIES,
}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>(filters.searchKeyword || '');
  const [attendanceMode, setAttendanceMode] = useState<DeliveryFilter>(filters.deliveryMode || 'All');
  const [selectedCategory, setSelectedCategory] = useState<Category>(filters.category || 'All Categories');
  const [selectedMetroLine, setSelectedMetroLine] = useState<string>(filters.metroLineId || 'all');
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>(filters.metroStationIds || []);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageFilter>(filters.language || 'All');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TimeOfDay[]>(filters.timeOfDaySlots || []);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(filters.daysOfWeek || []);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>(filters.audience || 'All');

  // Mobile Bottom Sheets
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileMetroSheetOpen, setMobileMetroSheetOpen] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setSearchKeyword(filters.searchKeyword || '');
    setAttendanceMode(filters.deliveryMode || 'All');
    setSelectedCategory(filters.category || 'All Categories');
    setSelectedMetroLine(filters.metroLineId || 'all');
    setSelectedStationIds(filters.metroStationIds || []);
    setSelectedLanguage(filters.language || 'All');
    setSelectedTimeOfDay(filters.timeOfDaySlots || []);
    setSelectedDays(filters.daysOfWeek || []);
    setSelectedAudience(filters.audience || 'All');
  }, [filters]);

  const toggleTimeOfDay = (slot: TimeOfDay) => {
    if (selectedTimeOfDay.includes(slot)) {
      setSelectedTimeOfDay(selectedTimeOfDay.filter((s) => s !== slot));
    } else {
      setSelectedTimeOfDay([...selectedTimeOfDay, slot]);
    }
  };

  const isOnlineMode =
    attendanceMode === 'Live Online' ||
    attendanceMode === 'Online' ||
    attendanceMode === 'Self-Paced' ||
    filters.deliveryMode === 'Live Online';

  const executeSearch = (overrideProps?: Partial<FilterState>, shouldScroll = false) => {
    const activeMode = overrideProps?.deliveryMode || attendanceMode;
    const activeIsOnline =
      activeMode === 'Live Online' || activeMode === 'Online' || activeMode === 'Self-Paced';

    const payload: Partial<FilterState> = {
      searchKeyword,
      deliveryMode: activeMode,
      category: selectedCategory,
      metroLineId: activeIsOnline ? 'all' : selectedMetroLine,
      metroStationIds: activeIsOnline ? [] : selectedStationIds,
      language: activeIsOnline ? selectedLanguage : filters.language,
      timeOfDaySlots: selectedTimeOfDay,
      daysOfWeek: selectedDays,
      audience: selectedAudience,
      ...overrideProps,
    };
    onApplySearch(payload);

    if (shouldScroll) {
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleAttendanceChange = (mode: DeliveryFilter) => {
    setAttendanceMode(mode);
    executeSearch({ deliveryMode: mode });
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setAttendanceMode('All');
    setSelectedCategory('All Categories');
    setSelectedMetroLine('all');
    setSelectedStationIds([]);
    setSelectedLanguage('All');
    setSelectedTimeOfDay([]);
    setSelectedDays([]);
    setSelectedAudience('All');

    onApplySearch({
      searchKeyword: '',
      deliveryMode: 'All',
      category: 'All Categories',
      metroLineId: 'all',
      metroStationIds: [],
      language: 'All',
      timeOfDaySlots: [],
      daysOfWeek: [],
      audience: 'All',
    });
  };

  return (
    <section className="relative z-40 bg-[#07090f] border-b border-slate-800/60 text-white pt-2.5 sm:pt-6 pb-3 sm:pb-6 px-3 sm:px-6 lg:px-8 shadow-2xl overflow-visible">
      {/* Decorative City Atmosphere Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 70% 55% at 18% 0%, rgba(37,58,110,0.22) 0%, transparent 70%)',
              'radial-gradient(ellipse 55% 50% at 88% 15%, rgba(15,60,50,0.18) 0%, transparent 65%)',
              'radial-gradient(ellipse 40% 30% at 52% 40%, rgba(22,28,40,0.30) 0%, transparent 100%)',
            ].join(', '),
          }}
        />

        {/* Abstract Urban Geometry (Desktop SVG) */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none hidden sm:block"
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="streak-a" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8bb4d4" stopOpacity="0" />
              <stop offset="40%" stopColor="#8bb4d4" stopOpacity="0.07" />
              <stop offset="70%" stopColor="#a8c8e0" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#8bb4d4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="streak-b" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7ec8b0" stopOpacity="0" />
              <stop offset="35%" stopColor="#7ec8b0" stopOpacity="0.055" />
              <stop offset="65%" stopColor="#7ec8b0" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#7ec8b0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="streak-c" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6090c0" stopOpacity="0" />
              <stop offset="50%" stopColor="#6090c0" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#6090c0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="arch-fade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a0bcd8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#a0bcd8" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="city-light-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c8e0f0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#c8e0f0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="city-light-warm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d4e8b0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#d4e8b0" stopOpacity="0" />
            </radialGradient>
          </defs>

          <line x1="-60" y1="68" x2="780" y2="58" stroke="url(#streak-a)" strokeWidth="1" />
          <line x1="200" y1="108" x2="1100" y2="95" stroke="url(#streak-b)" strokeWidth="0.8" />
          <line x1="480" y1="148" x2="1480" y2="132" stroke="url(#streak-a)" strokeWidth="0.7" />
          <line x1="820" y1="42" x2="1440" y2="28" stroke="url(#streak-c)" strokeWidth="0.6" />
          <line x1="900" y1="185" x2="1440" y2="175" stroke="url(#streak-b)" strokeWidth="0.5" />

          <rect x="62"  y="0" width="1" height="88"  fill="url(#arch-fade)" />
          <rect x="78"  y="0" width="1" height="110" fill="url(#arch-fade)" opacity="0.7" />
          <rect x="91"  y="0" width="1" height="72"  fill="url(#arch-fade)" opacity="0.55" />
          <rect x="105" y="0" width="1" height="130" fill="url(#arch-fade)" opacity="0.8" />
          <rect x="118" y="0" width="1" height="95"  fill="url(#arch-fade)" opacity="0.6" />
          <rect x="132" y="0" width="1" height="60"  fill="url(#arch-fade)" opacity="0.45" />

          <rect x="1280" y="0" width="1" height="100" fill="url(#arch-fade)" opacity="0.5" />
          <rect x="1295" y="0" width="1" height="140" fill="url(#arch-fade)" opacity="0.65" />
          <rect x="1308" y="0" width="1" height="80"  fill="url(#arch-fade)" opacity="0.45" />
          <rect x="1322" y="0" width="1" height="115" fill="url(#arch-fade)" opacity="0.55" />
          <rect x="1337" y="0" width="1" height="70"  fill="url(#arch-fade)" opacity="0.4" />
          <rect x="1352" y="0" width="1" height="90"  fill="url(#arch-fade)" opacity="0.5" />

          <line x1="0"    y1="260" x2="720" y2="160" stroke="#3a5070" strokeWidth="0.5" strokeOpacity="0.12" />
          <line x1="240"  y1="260" x2="720" y2="160" stroke="#3a5070" strokeWidth="0.5" strokeOpacity="0.10" />
          <line x1="1440" y1="260" x2="720" y2="160" stroke="#3a5070" strokeWidth="0.5" strokeOpacity="0.12" />
          <line x1="1200" y1="260" x2="720" y2="160" stroke="#3a5070" strokeWidth="0.5" strokeOpacity="0.10" />
          <line x1="0" y1="220" x2="1440" y2="220" stroke="#2a3d54" strokeWidth="0.4" strokeOpacity="0.08" />
          <line x1="0" y1="195" x2="1440" y2="195" stroke="#2a3d54" strokeWidth="0.4" strokeOpacity="0.06" />
          <line x1="0" y1="178" x2="1440" y2="178" stroke="#2a3d54" strokeWidth="0.3" strokeOpacity="0.05" />

          <circle cx="44"  cy="34"  r="1"   fill="#c0d8ec" fillOpacity="0.25" />
          <circle cx="158" cy="18"  r="0.8" fill="#c0d8ec" fillOpacity="0.18" />
          <circle cx="38"  cy="58"  r="0.7" fill="#b0cce0" fillOpacity="0.15" />
          <circle cx="175" cy="42"  r="1"   fill="#bcd8e8" fillOpacity="0.20" />
          <circle cx="22"  cy="80"  r="0.8" fill="#a8cce0" fillOpacity="0.12" />
          <circle cx="195" cy="78"  r="0.7" fill="#c0d8ec" fillOpacity="0.14" />

          <circle cx="340" cy="28"  r="0.8" fill="#c0d8ec" fillOpacity="0.14" />
          <circle cx="390" cy="54"  r="0.7" fill="#b8d4e8" fillOpacity="0.12" />
          <circle cx="310" cy="72"  r="1"   fill="#c4daf0" fillOpacity="0.16" />

          <circle cx="1240" cy="22"  r="0.8" fill="#c0d8ec" fillOpacity="0.18" />
          <circle cx="1380" cy="38"  r="1"   fill="#c0d8ec" fillOpacity="0.22" />
          <circle cx="1260" cy="54"  r="0.7" fill="#b0cce0" fillOpacity="0.14" />
          <circle cx="1400" cy="60"  r="0.8" fill="#bcd8e8" fillOpacity="0.16" />
          <circle cx="1220" cy="78"  r="1"   fill="#c0d8ec" fillOpacity="0.20" />
          <circle cx="1420" cy="85"  r="0.7" fill="#a8cce0" fillOpacity="0.12" />
          <circle cx="1360" cy="18"  r="0.8" fill="#c4daf0" fillOpacity="0.15" />

          <circle cx="1060" cy="32"  r="0.8" fill="#c0d8ec" fillOpacity="0.12" />
          <circle cx="1100" cy="60"  r="0.7" fill="#b8d4e8" fillOpacity="0.10" />

          <circle cx="88"  cy="26"  r="1.2" fill="#d4e8b0" fillOpacity="0.18" />
          <circle cx="1312" cy="30" r="1.2" fill="#d4e8b0" fillOpacity="0.16" />
          <circle cx="420" cy="38"  r="1"   fill="#cce4a8" fillOpacity="0.12" />
          <circle cx="1140" cy="45" r="1"   fill="#cce4a8" fillOpacity="0.12" />

          <circle cx="88"  cy="26"  r="6" fill="url(#city-light-warm)" />
          <circle cx="1312" cy="30" r="6" fill="url(#city-light-warm)" />
          <circle cx="175" cy="42"  r="5" fill="url(#city-light-glow)" />
          <circle cx="1380" cy="38" r="5" fill="url(#city-light-glow)" />
        </svg>

        {/* Focal Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 52% 38% at 50% 12%, rgba(10,44,38,0.28) 0%, transparent 100%)',
              'radial-gradient(ellipse 38% 28% at 38% 18%, rgba(14,32,68,0.22) 0%, transparent 100%)',
            ].join(', '),
          }}
        />

        {/* Bottom Edge Transition */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 z-[3] h-8 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(7,9,15,0.55) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-2.5 sm:space-y-4">
        {/* Headline & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-1 max-w-3xl mx-auto px-2"
        >
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] font-bold border border-slate-800 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#A2FF00]" />
            <span>Activity Discovery • Moscow Metro</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug px-3">
            Find something worth doing in Moscow.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] sm:text-xs md:text-sm text-slate-400 font-normal max-w-lg mx-auto leading-relaxed px-2"
          >
            Find classes, sports, workshops and experiences across Moscow's metro network.
          </motion.p>
        </motion.div>

        {/* ONE COHESIVE LIGHT SEARCH SURFACE PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 bg-slate-50 rounded-2xl p-3 sm:p-5 border border-slate-200/90 shadow-2xl shadow-black/40 space-y-2.5 sm:space-y-3"
        >
          {/* ROW 1: ACTIVITY SEARCH (WHAT) */}
          <div className="relative z-30">
            <SearchAutocomplete
              value={searchKeyword}
              onChange={(val) => setSearchKeyword(val)}
              onSearch={(kw) => executeSearch({ searchKeyword: kw }, true)}
              activities={activities}
            />
          </div>

          {/* ROW 2: WHO (Audience) & HOW (Attendance Mode) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            {/* Audience Group */}
            <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 p-1 rounded-xl shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 pl-2 pr-2 mr-2 select-none">Audience:</span>
              {[
                { id: 'All' as AudienceType, label: 'All' },
                { id: 'Adults' as AudienceType, label: 'Adults' },
                { id: 'Children' as AudienceType, label: 'Kids' },
                { id: 'Corporate' as AudienceType, label: 'Corporate' },
              ].map((item) => {
                const isSelected = selectedAudience === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedAudience(item.id);
                      executeSearch({ audience: item.id });
                    }}
                    className={`relative isolate overflow-hidden px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer outline-none flex items-center justify-center active:scale-95 group ${
                      isSelected
                        ? 'bg-[#A2FF00] text-[#111827] font-bold shadow-xs border border-[#8ee600]/40'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="hero-audience-pill"
                        className="absolute inset-0 bg-[#A2FF00] rounded-lg z-0 shadow-xs border border-[#8ee600]/40"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className={`relative z-10 truncate transition-colors duration-150 ${
                      isSelected ? 'text-[#111827] font-bold' : 'text-slate-600 group-hover:text-slate-950'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mode Group */}
            <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 p-1 rounded-xl shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 pl-2 pr-2 mr-2 select-none">Mode:</span>
              {[
                { id: 'In Person' as DeliveryFilter, label: 'Near Me' },
                { id: 'Live Online' as DeliveryFilter, label: 'Online' },
                { id: 'All' as DeliveryFilter, label: 'Both' },
              ].map((item) => {
                const activeModeVal =
                  attendanceMode === 'Self-Paced' || attendanceMode === 'Hybrid' || attendanceMode === 'Live Online'
                    ? 'Live Online'
                    : attendanceMode === 'In Person'
                    ? 'In Person'
                    : 'All';
                const isSelected = activeModeVal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAttendanceChange(item.id)}
                    className={`relative isolate overflow-hidden px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer outline-none flex items-center justify-center active:scale-95 group ${
                      isSelected
                        ? 'bg-[#A2FF00] text-[#111827] font-bold shadow-xs border border-[#8ee600]/40'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="hero-mode-pill"
                        className="absolute inset-0 bg-[#A2FF00] rounded-lg z-0 shadow-xs border border-[#8ee600]/40"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className={`relative z-10 truncate transition-colors duration-150 ${
                      isSelected ? 'text-[#111827] font-bold' : 'text-slate-600 group-hover:text-slate-950'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESKTOP CONTROLS (ROW 3): Metro | Time | Search | Filters */}
          <div className="hidden sm:grid grid-cols-12 gap-3 items-end pt-3 border-t border-slate-200/80 relative z-20">
            {/* Metro Line → Station Selector (WHERE) */}
            <div className="col-span-5 relative z-30">
              {isOnlineMode ? (
                <LanguagePopover
                  selectedLanguage={selectedLanguage}
                  onSelectLanguage={(lang) => {
                    setSelectedLanguage(lang);
                    executeSearch({ language: lang });
                  }}
                  label="Language"
                />
              ) : (
                <MetroPopover
                  type="combined"
                  selectedLineId={selectedMetroLine}
                  selectedStationIds={selectedStationIds}
                  onSelectLine={(lineId) => setSelectedMetroLine(lineId)}
                  onSelectStation={(stId) => {
                    const ids = Array.isArray(stId) ? stId : [stId];
                    setSelectedStationIds(ids);
                  }}
                  onCommit={(lineId, stationIds) => {
                    setSelectedMetroLine(lineId);
                    setSelectedStationIds(stationIds);
                    executeSearch({ metroLineId: lineId, metroStationIds: stationIds });
                  }}
                  onClearStations={() => {
                    setSelectedStationIds([]);
                    executeSearch({ metroStationIds: [] });
                  }}
                  label="Metro Line → Station"
                />
              )}
            </div>

            {/* Time Selector (WHEN) */}
            <div className="col-span-4 relative z-20">
              <TimeSelectorPopover
                selectedTimes={selectedTimeOfDay}
                selectedDays={selectedDays}
                onToggleTime={(t) => {
                  toggleTimeOfDay(t);
                  const newTimes = selectedTimeOfDay.includes(t)
                    ? selectedTimeOfDay.filter((item) => item !== t)
                    : [...selectedTimeOfDay, t];
                  executeSearch({ timeOfDaySlots: newTimes });
                }}
                onSelectDays={(d) => {
                  setSelectedDays(d);
                  executeSearch({ daysOfWeek: d });
                }}
                label="Available Time"
              />
            </div>

            {/* Desktop Action Buttons */}
            <div className="col-span-3 relative z-10 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => executeSearch({}, true)}
                className="flex-1 flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#A2FF00] hover:bg-[#8ee600] text-[#111827] rounded-xl font-extrabold text-xs transition-all shadow-md cursor-pointer active:scale-98 min-h-[44px]"
              >
                <Search className="w-4 h-4 text-[#111827] shrink-0" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileSheetOpen(true)}
                className="p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-200/70 bg-white rounded-xl border border-slate-300 transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
                title="More Filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#074213]" />
              </button>

              {/* Accessible Reset Button with Hover Tooltip */}
              <div className="relative group/reset shrink-0">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  aria-label="Reset all filters"
                  className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 bg-white rounded-xl border border-slate-300 transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/reset:flex items-center px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap shadow-lg z-50 transition-opacity">
                  Reset all filters
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE RECOMPOSED CONTROLS */}
          <div className="sm:hidden space-y-3 pt-3 border-t border-slate-200/80">
            {!isOnlineMode && (
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-slate-600 block mb-1">
                  Metro Location
                </label>
                <button
                  type="button"
                  onClick={() => setMobileMetroSheetOpen(true)}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3.5 h-[52px] text-left flex items-center justify-between transition-colors shadow-xs cursor-pointer active:bg-slate-100"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-900/20 shadow-xs"
                      style={{
                        backgroundColor:
                          selectedMetroLine !== 'all'
                            ? METRO_LINES.find((l) => l.id === selectedMetroLine)?.color || '#EF4444'
                            : '#A2FF00',
                      }}
                    />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {selectedStationIds.length > 0
                        ? `${METRO_LINES.find((l) => l.id === selectedMetroLine)?.name.split(':')[1]?.trim() || ''} · ${
                            selectedStationIds.length === 1
                              ? METRO_STATIONS.find((s) => s.id === selectedStationIds[0])?.name || '1 Station'
                              : `${selectedStationIds.length} Stations`
                          }`
                        : selectedMetroLine !== 'all'
                        ? `${METRO_LINES.find((l) => l.id === selectedMetroLine)?.name.split(':')[1]?.trim() || ''} → Choose Station`
                        : 'Metro Line → Station'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => executeSearch({}, true)}
                className="flex-1 flex items-center justify-center space-x-2 h-[50px] bg-[#A2FF00] hover:bg-[#8ee600] text-[#111827] rounded-xl font-extrabold text-sm transition-all shadow-md cursor-pointer active:scale-98"
              >
                <Search className="w-4 h-4 text-[#111827] shrink-0" />
                <span>Search Activities</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                aria-label="Reset all filters"
                className="h-[50px] w-[50px] bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 shadow-xs transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileSheetOpen(true)}
              className="w-full h-[44px] bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 rounded-xl font-semibold text-xs border border-slate-300 shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#074213]" />
              <span>More Filters</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* MOBILE METRO BOTTOM SHEET */}
      <MobileSearchSheet
        isOpen={mobileMetroSheetOpen}
        onClose={() => setMobileMetroSheetOpen(false)}
        title="Metro Line & Station"
        subtitle="Select lines and stations on Moscow Metro"
      >
        <MetroPopover
          type="combined"
          selectedLineId={selectedMetroLine}
          selectedStationIds={selectedStationIds}
          onSelectLine={(lineId) => setSelectedMetroLine(lineId)}
          onSelectStation={(stId) => {
            const ids = Array.isArray(stId) ? stId : [stId];
            setSelectedStationIds(ids);
          }}
          onCommit={(lineId, stationIds) => {
            setSelectedMetroLine(lineId);
            setSelectedStationIds(stationIds);
            setMobileMetroSheetOpen(false);
            executeSearch({ metroLineId: lineId, metroStationIds: stationIds });
          }}
          onClearStations={() => setSelectedStationIds([])}
          isMobileModal
          onCloseMobileModal={() => setMobileMetroSheetOpen(false)}
        />
      </MobileSearchSheet>

      {/* MORE FILTERS MODAL (Desktop & Mobile) */}
      <MobileSearchSheet
        isOpen={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        title="More Filters"
        subtitle="Filter activities by Category, Available Time & Moscow Metro"
        activeCount={
          [
            selectedCategory !== 'All Categories' && selectedCategory !== 'All',
            selectedMetroLine !== 'all',
            selectedStationIds.length > 0,
            selectedTimeOfDay.length > 0,
            selectedDays.length > 0 && selectedDays.length < 7,
            attendanceMode !== 'All',
            selectedLanguage !== 'All',
          ].filter(Boolean).length
        }
        onClear={handleResetFilters}
        onApply={() => {
          setMobileSheetOpen(false);
          executeSearch({}, true);
        }}
      >
        <div className="space-y-6">
          {/* 1. ACTIVE FILTER SUMMARY PILLS (if active) */}
          {(() => {
            const pills: { id: string; label: string; onRemove: () => void }[] = [];
            if (selectedCategory && selectedCategory !== 'All Categories' && selectedCategory !== 'All') {
              pills.push({
                id: 'cat',
                label: `Category: ${selectedCategory}`,
                onRemove: () => {
                  setSelectedCategory('All Categories');
                  executeSearch({ category: 'All Categories' });
                },
              });
            }
            if (selectedMetroLine && selectedMetroLine !== 'all') {
              const lineObj = METRO_LINES.find((l) => l.id === selectedMetroLine);
              pills.push({
                id: 'line',
                label: lineObj?.name.split(':')[1]?.trim() || lineObj?.name || 'Metro Line',
                onRemove: () => {
                  setSelectedMetroLine('all');
                  setSelectedStationIds([]);
                  executeSearch({ metroLineId: 'all', metroStationIds: [] });
                },
              });
            }
            if (selectedStationIds.length > 0) {
              pills.push({
                id: 'stations',
                label: selectedStationIds.length === 1
                  ? METRO_STATIONS.find((s) => s.id === selectedStationIds[0])?.name || '1 Station'
                  : `${selectedStationIds.length} Stations`,
                onRemove: () => {
                  setSelectedStationIds([]);
                  executeSearch({ metroStationIds: [] });
                },
              });
            }
            selectedTimeOfDay.forEach((t) => {
              pills.push({
                id: `time-${t}`,
                label: t,
                onRemove: () => {
                  const newTimes = selectedTimeOfDay.filter((item) => item !== t);
                  setSelectedTimeOfDay(newTimes);
                  executeSearch({ timeOfDaySlots: newTimes });
                },
              });
            });
            if (selectedDays.length > 0 && selectedDays.length < 7) {
              const isWeekend = selectedDays.includes('Saturday') && selectedDays.includes('Sunday') && selectedDays.length === 2;
              const isWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].every((d) => selectedDays.includes(d as DayOfWeek)) && selectedDays.length === 5;
              pills.push({
                id: 'days',
                label: isWeekend ? 'Weekend' : isWeekdays ? 'Weekdays' : `${selectedDays.length} Days`,
                onRemove: () => {
                  setSelectedDays([]);
                  executeSearch({ daysOfWeek: [] });
                },
              });
            }
            if (attendanceMode && attendanceMode !== 'All') {
              pills.push({
                id: 'mode',
                label: attendanceMode,
                onRemove: () => {
                  setAttendanceMode('All');
                  executeSearch({ deliveryMode: 'All' });
                },
              });
            }
            if (selectedLanguage && selectedLanguage !== 'All') {
              pills.push({
                id: 'lang',
                label: selectedLanguage,
                onRemove: () => {
                  setSelectedLanguage('All');
                  executeSearch({ language: 'All' });
                },
              });
            }

            if (pills.length === 0) return null;

            return (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Active Filters ({pills.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-950 hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {pills.map((pill) => (
                    <span
                      key={pill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-semibold shadow-2xs"
                    >
                      <span>{pill.label}</span>
                      <button
                        type="button"
                        onClick={pill.onRemove}
                        aria-label={`Remove ${pill.label} filter`}
                        className="hover:text-[#A2FF00] p-0.5 rounded-full cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 2. CATEGORY SECTION */}
          <div className="space-y-2">
            <CategoryPopover
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                executeSearch({ category: cat });
              }}
              label="Category"
              isMobileModal
            />
          </div>

          {/* 3. AVAILABLE TIME SECTION */}
          <div className="space-y-2 pt-5 border-t border-slate-200/80">
            <label className="text-[11px] font-bold tracking-wider uppercase block text-slate-700">
              Available Time
            </label>
            <TimeSelectorPopover
              selectedTimes={selectedTimeOfDay}
              selectedDays={selectedDays}
              onToggleTime={(t) => {
                toggleTimeOfDay(t);
                const newTimes = selectedTimeOfDay.includes(t)
                  ? selectedTimeOfDay.filter((item) => item !== t)
                  : [...selectedTimeOfDay, t];
                executeSearch({ timeOfDaySlots: newTimes });
              }}
              onSelectDays={(d) => {
                setSelectedDays(d);
                executeSearch({ daysOfWeek: d });
              }}
              isMobileModal
            />
          </div>

          {/* 4. MOSCOW METRO SECTION */}
          {!isOnlineMode && (() => {
            const selectedLineObj = selectedMetroLine !== 'all' ? METRO_LINES.find((l) => l.id === selectedMetroLine) : null;
            const lineColor = selectedLineObj?.color || '#A2FF00';
            const lineShortName = selectedLineObj
              ? selectedLineObj.name.includes(':')
                ? selectedLineObj.name.split(':')[1].trim()
                : selectedLineObj.name
              : 'All Metro Lines';

            return (
              <div className="space-y-3 pt-5 border-t border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-md bg-[#074213]/10 flex items-center justify-center text-[#074213] text-xs font-black">
                      M
                    </div>
                    <label className="text-[11px] font-bold tracking-wider uppercase block text-slate-700">
                      Moscow Metro Discovery
                    </label>
                  </div>
                  {selectedStationIds.length > 0 && (
                    <span className="text-[11px] font-extrabold text-[#074213] bg-[#A2FF00]/30 px-2.5 py-0.5 rounded-full">
                      {selectedStationIds.length} {selectedStationIds.length === 1 ? 'station' : 'stations'} selected
                    </span>
                  )}
                </div>

                {/* Connected Metro Line -> Station Treatment */}
                <div className="space-y-2">
                  {/* Step 1: Metro Line Selector */}
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none z-10">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-slate-900/20 shadow-2xs shrink-0 transition-colors"
                        style={{ backgroundColor: lineColor }}
                      />
                    </div>
                    <select
                      aria-label="Metro Line"
                      value={selectedMetroLine}
                      onChange={(e) => {
                        setSelectedMetroLine(e.target.value);
                        setSelectedStationIds([]);
                        executeSearch({ metroLineId: e.target.value, metroStationIds: [] });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-8 py-2.5 min-h-[46px] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#A2FF00] cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="all">All Metro Lines (Entire Network)</option>
                      {METRO_LINES.map((line) => (
                        <option key={line.id} value={line.id}>
                          {line.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Subtle Metro Connector Line */}
                  <div className="flex items-center pl-5 -my-1">
                    <div className="w-0.5 h-3 bg-slate-300" />
                  </div>

                  {/* Step 2: Station Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMetroSheetOpen(true);
                    }}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 min-h-[46px] text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 transition-colors shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#074213] flex items-center justify-center shrink-0">
                        <div className="w-1 h-1 rounded-full bg-[#074213]" />
                      </div>
                      <span className="truncate">
                        {selectedStationIds.length > 0
                          ? `${selectedStationIds.length} Stations selected on ${lineShortName}`
                          : selectedMetroLine !== 'all'
                          ? `Choose stations on ${lineShortName} →`
                          : 'All Stations (Choose specific stations →)'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 5. DELIVERY MODE & LANGUAGE (when relevant) */}
          {attendanceMode === 'Live Online' && (
            <div className="space-y-2 pt-5 border-t border-slate-200/80">
              <LanguagePopover
                selectedLanguage={selectedLanguage}
                onSelectLanguage={(lang) => {
                  setSelectedLanguage(lang);
                  executeSearch({ language: lang });
                }}
                isMobileModal
              />
            </div>
          )}
        </div>
      </MobileSearchSheet>
    </section>
  );
};
