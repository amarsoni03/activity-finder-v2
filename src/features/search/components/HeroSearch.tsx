import React, { useState, useEffect } from 'react';
import { Search, Sparkles, SlidersHorizontal, RotateCcw, ChevronRight, ChevronDown, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Category, AudienceType, TimeOfDay, DayOfWeek, FilterState, DeliveryFilter, LanguageFilter, Activity } from '../../../types';
import { INITIAL_ACTIVITIES } from '../../activities/data/activitiesData';
import { METRO_LINES, METRO_STATIONS } from '../../metro/data/metroData';

import { SearchAutocomplete } from './SearchAutocomplete';
import { AudienceSelector } from './AudienceSelector';
import { AttendanceModeSelector } from './AttendanceModeSelector';
import { CategoryPopover } from './CategoryPopover';
import { MetroPopover } from './MetroPopover';
import { LanguagePopover } from './LanguagePopover';
import { TimeSelectorPopover } from './TimeSelectorPopover';
import { MobileSearchSheet } from './MobileSearchSheet';
import { isOnlineDeliveryMode } from '../utils/search';

interface HeroSearchProps {
  filters: FilterState;
  onApplySearch: (newFilters: Partial<FilterState>) => void;
  activities?: Activity[];
}

interface SheetDraftState {
  category: Category;
  metroLineId: string;
  metroStationIds: string[];
  language: LanguageFilter;
  timeOfDaySlots: TimeOfDay[];
  daysOfWeek: DayOfWeek[];
  deliveryMode: DeliveryFilter;
  audience: AudienceType;
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

  // Staged draft state for Mobile More Filters Sheet
  const [draftFilters, setDraftFilters] = useState<SheetDraftState>({
    category: filters.category || 'All Categories',
    metroLineId: filters.metroLineId || 'all',
    metroStationIds: filters.metroStationIds || [],
    language: filters.language || 'All',
    timeOfDaySlots: filters.timeOfDaySlots || [],
    daysOfWeek: filters.daysOfWeek || [],
    deliveryMode: filters.deliveryMode || 'All',
    audience: filters.audience || 'All',
  });

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

  const isOnlineMode = isOnlineDeliveryMode(attendanceMode) || isOnlineDeliveryMode(filters.deliveryMode);

  const executeSearch = (overrideProps?: Partial<FilterState>, shouldScroll = false) => {
    const activeMode = overrideProps?.deliveryMode || attendanceMode;
    const activeIsOnline = isOnlineDeliveryMode(activeMode);

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

  // Open mobile "More Filters" sheet and initialize draft state
  const handleOpenMobileSheet = () => {
    setDraftFilters({
      category: selectedCategory,
      metroLineId: selectedMetroLine,
      metroStationIds: selectedStationIds,
      language: selectedLanguage,
      timeOfDaySlots: selectedTimeOfDay,
      daysOfWeek: selectedDays,
      deliveryMode: attendanceMode,
      audience: selectedAudience,
    });
    setMobileSheetOpen(true);
  };

  // Commit draft filters from mobile sheet
  const handleApplyMobileSheet = () => {
    setSelectedCategory(draftFilters.category);
    setSelectedMetroLine(draftFilters.metroLineId);
    setSelectedStationIds(draftFilters.metroStationIds);
    setSelectedLanguage(draftFilters.language);
    setSelectedTimeOfDay(draftFilters.timeOfDaySlots);
    setSelectedDays(draftFilters.daysOfWeek);
    setAttendanceMode(draftFilters.deliveryMode);
    setSelectedAudience(draftFilters.audience);

    setMobileSheetOpen(false);

    const activeIsOnline = isOnlineDeliveryMode(draftFilters.deliveryMode);
    onApplySearch({
      searchKeyword,
      deliveryMode: draftFilters.deliveryMode,
      category: draftFilters.category,
      metroLineId: activeIsOnline ? 'all' : draftFilters.metroLineId,
      metroStationIds: activeIsOnline ? [] : draftFilters.metroStationIds,
      language: activeIsOnline ? draftFilters.language : filters.language,
      timeOfDaySlots: draftFilters.timeOfDaySlots,
      daysOfWeek: draftFilters.daysOfWeek,
      audience: draftFilters.audience,
    });

    setTimeout(() => {
      const resultsEl = document.getElementById('results-section');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }
    }, 50);
  };

  // Clear draft filters inside mobile sheet without immediate search execution
  const handleClearMobileDraft = () => {
    setDraftFilters({
      category: 'All Categories',
      metroLineId: 'all',
      metroStationIds: [],
      language: 'All',
      timeOfDaySlots: [],
      daysOfWeek: [],
      deliveryMode: 'All',
      audience: 'All',
    });
  };

  const isDraftOnline = isOnlineDeliveryMode(draftFilters.deliveryMode);

  return (
    <section
      id="hero-search-section"
      className="relative z-40 bg-gradient-to-b from-slate-950 via-slate-900 to-[#0B1120] border-b border-slate-800/80 text-white pt-6 sm:pt-10 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8 shadow-md overflow-visible"
    >
      {/* Subtle Atmospheric Light Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 65% 50% at 20% 0%, rgba(162,255,0,0.1) 0%, transparent 70%)',
              'radial-gradient(ellipse 60% 50% at 85% 10%, rgba(59,130,246,0.08) 0%, transparent 65%)',
              'radial-gradient(ellipse 40% 30% at 50% 100%, rgba(15,23,42,0.9) 0%, transparent 100%)',
            ].join(', '),
          }}
        />

        {/* Subtle Metro Network Contour Lines */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none hidden sm:block opacity-35"
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <line x1="-60" y1="68" x2="780" y2="58" stroke="#334155" strokeWidth="0.8" strokeDasharray="6 6" />
          <line x1="200" y1="108" x2="1100" y2="95" stroke="#475569" strokeWidth="0.8" />
          <line x1="480" y1="148" x2="1480" y2="132" stroke="#334155" strokeWidth="0.6" strokeDasharray="4 4" />
          <circle cx="88" cy="26" r="3" fill="#A2FF00" stroke="#0F172A" strokeWidth="1" />
          <circle cx="1312" cy="30" r="3" fill="#A2FF00" stroke="#0F172A" strokeWidth="1" />
          <circle cx="175" cy="42" r="2.5" fill="#3B82F6" />
          <circle cx="1380" cy="38" r="2.5" fill="#EF4444" />
          <circle cx="720" cy="80" r="3" fill="#10B981" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Headline & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-2 max-w-3xl mx-auto px-2"
        >
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[#A2FF00] text-[11px] sm:text-xs font-extrabold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#A2FF00]" />
            <span>Activity Discovery • Moscow Metro</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight px-3">
            Find something worth doing in Moscow.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm md:text-base text-slate-300 font-normal max-w-xl mx-auto leading-relaxed px-2"
          >
            Find activities, courses, sports and workshops that fit your free time and metro location.
          </motion.p>
        </motion.div>

        {/* PRIMARY CONSTITUTION SEARCH SURFACE PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 bg-slate-900/90 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-800/90 shadow-2xl shadow-black/40 space-y-4"
        >
          {/* ROW 1: ACTIVITY KEYWORD SEARCH (WHAT) */}
          <div className="relative z-30">
            <SearchAutocomplete
              value={searchKeyword}
              onChange={(val) => setSearchKeyword(val)}
              onSearch={(kw) => executeSearch({ searchKeyword: kw }, true)}
              activities={activities}
            />
          </div>

          {/* ROW 2: WHO (Audience) & HOW (Attendance Mode) QUICK TOGGLES */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <AudienceSelector
                selectedAudience={selectedAudience}
                onSelectAudience={(aud) => {
                  setSelectedAudience(aud);
                  executeSearch({ audience: aud });
                }}
              />

              <AttendanceModeSelector
                selectedMode={attendanceMode}
                onSelectMode={handleAttendanceChange}
              />
            </div>

            {/* Quick Active Filter Count or Reset indicator */}
            {(selectedCategory !== 'All Categories' || selectedMetroLine !== 'all' || selectedTimeOfDay.length > 0 || searchKeyword) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-slate-400 hover:text-[#A2FF00] flex items-center space-x-1 cursor-pointer transition-colors px-2 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset search</span>
              </button>
            )}
          </div>

          {/* DESKTOP CONSTITUTION BAR: Category -> Metro -> Available Time -> Search */}
          <div className="hidden sm:grid grid-cols-12 gap-3 items-end pt-3 border-t border-slate-800/80 relative z-20">
            {/* 1. Category (Optional) */}
            <div className="col-span-3 relative z-30">
              <CategoryPopover
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  executeSearch({ category: cat });
                }}
                label="Category"
              />
            </div>

            {/* 2. Metro Line -> Station (WHERE) */}
            <div className="col-span-4 relative z-30">
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
                  label="Metro Line & Station"
                />
              )}
            </div>

            {/* 3. Available Time (WHEN) */}
            <div className="col-span-3 relative z-20">
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

            {/* 4. Desktop Search & Filter Buttons */}
            <div className="col-span-2 relative z-10 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => executeSearch({}, true)}
                className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#A2FF00] hover:bg-[#91E600] text-[#111827] rounded-xl font-extrabold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98 min-h-[44px]"
              >
                <Search className="w-4 h-4 text-[#111827] shrink-0" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={handleOpenMobileSheet}
                className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-950/80 rounded-xl border border-slate-700/80 transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-2xs"
                title="More Filters"
                aria-label="More Filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>

          {/* MOBILE RECOMPOSED CONTROLS */}
          <div className="sm:hidden space-y-2.5 pt-2.5 border-t border-slate-800/80">
            {/* Category Trigger on Mobile */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                  Category
                </label>
                <button
                  type="button"
                  onClick={handleOpenMobileSheet}
                  className="w-full bg-slate-950/80 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 h-[46px] text-left flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
                >
                  <span className="text-xs font-bold text-white truncate">
                    {selectedCategory}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              </div>

              {!isOnlineMode && (
                <div>
                  <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                    Metro
                  </label>
                  <button
                    type="button"
                    onClick={() => setMobileMetroSheetOpen(true)}
                    className="w-full bg-slate-950/80 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 h-[46px] text-left flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            selectedMetroLine !== 'all'
                              ? METRO_LINES.find((l) => l.id === selectedMetroLine)?.color || '#EF4444'
                              : '#A2FF00',
                        }}
                      />
                      <span className="text-xs font-bold text-white truncate">
                        {selectedStationIds.length > 0
                          ? `${selectedStationIds.length} Stations`
                          : selectedMetroLine !== 'all'
                          ? METRO_LINES.find((l) => l.id === selectedMetroLine)?.name.split(':')[1]?.trim() || 'Line'
                          : 'All Metro'}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => executeSearch({}, true)}
                className="flex-1 flex items-center justify-center space-x-2 h-[48px] bg-[#A2FF00] hover:bg-[#91E600] text-[#111827] rounded-xl font-extrabold text-sm transition-all shadow-sm cursor-pointer active:scale-98"
              >
                <Search className="w-4 h-4 text-[#111827] shrink-0" />
                <span>Search Activities</span>
              </button>

              <button
                type="button"
                onClick={handleOpenMobileSheet}
                className="h-[48px] px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 shadow-2xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer font-bold text-xs shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-300" />
                <span>Filters</span>
              </button>
            </div>
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

      {/* MORE FILTERS MODAL (Desktop & Mobile) — Staged Filtering */}
      <MobileSearchSheet
        isOpen={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        title="More Filters"
        subtitle="Filter activities by Category, Available Time & Moscow Metro"
        activeCount={
          [
            draftFilters.category !== 'All Categories' && draftFilters.category !== 'All',
            draftFilters.metroLineId !== 'all',
            draftFilters.metroStationIds.length > 0,
            draftFilters.timeOfDaySlots.length > 0,
            draftFilters.daysOfWeek.length > 0 && draftFilters.daysOfWeek.length < 7,
            draftFilters.deliveryMode !== 'All',
            draftFilters.language !== 'All',
            draftFilters.audience !== 'All',
          ].filter(Boolean).length
        }
        onClear={handleClearMobileDraft}
        onApply={handleApplyMobileSheet}
      >
        <div className="space-y-6">
          {/* 1. ACTIVE FILTER SUMMARY PILLS (if active in draft) */}
          {(() => {
            const pills: { id: string; label: string; onRemove: () => void }[] = [];
            if (draftFilters.category && draftFilters.category !== 'All Categories' && draftFilters.category !== 'All') {
              pills.push({
                id: 'cat',
                label: `Category: ${draftFilters.category}`,
                onRemove: () => {
                  setDraftFilters((prev) => ({ ...prev, category: 'All Categories' }));
                },
              });
            }
            if (draftFilters.metroLineId && draftFilters.metroLineId !== 'all') {
              const lineObj = METRO_LINES.find((l) => l.id === draftFilters.metroLineId);
              pills.push({
                id: 'line',
                label: lineObj?.name.split(':')[1]?.trim() || lineObj?.name || 'Metro Line',
                onRemove: () => {
                  setDraftFilters((prev) => ({ ...prev, metroLineId: 'all', metroStationIds: [] }));
                },
              });
            }
            if (draftFilters.metroStationIds.length > 0) {
              pills.push({
                id: 'stations',
                label: draftFilters.metroStationIds.length === 1
                  ? METRO_STATIONS.find((s) => s.id === draftFilters.metroStationIds[0])?.name || '1 Station'
                  : `${draftFilters.metroStationIds.length} Stations`,
                onRemove: () => {
                  setDraftFilters((prev) => ({ ...prev, metroStationIds: [] }));
                },
              });
            }
            draftFilters.timeOfDaySlots.forEach((t) => {
              pills.push({
                id: `time-${t}`,
                label: t,
                onRemove: () => {
                  setDraftFilters((prev) => ({
                    ...prev,
                    timeOfDaySlots: prev.timeOfDaySlots.filter((item) => item !== t),
                  }));
                },
              });
            });
            if (draftFilters.daysOfWeek.length > 0 && draftFilters.daysOfWeek.length < 7) {
              const isWeekend = draftFilters.daysOfWeek.includes('Saturday') && draftFilters.daysOfWeek.includes('Sunday') && draftFilters.daysOfWeek.length === 2;
              const isWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].every((d) => draftFilters.daysOfWeek.includes(d as DayOfWeek)) && draftFilters.daysOfWeek.length === 5;
              pills.push({
                id: 'days',
                label: isWeekend ? 'Weekend' : isWeekdays ? 'Weekdays' : `${draftFilters.daysOfWeek.length} Days`,
                onRemove: () => {
                  setDraftFilters((prev) => ({ ...prev, daysOfWeek: [] }));
                },
              });
            }
            if (draftFilters.deliveryMode && draftFilters.deliveryMode !== 'All') {
              pills.push({
                id: 'mode',
                label: draftFilters.deliveryMode,
                onRemove: () => {
                  setDraftFilters((prev) => ({ ...prev, deliveryMode: 'All' }));
                },
              });
            }
            if (draftFilters.audience && draftFilters.audience !== 'All') {
              pills.push({
                id: 'aud',
                label: `Audience: ${draftFilters.audience}`,
                onRemove: () => {
                  setDraftFilters((prev) => ({ ...prev, audience: 'All' }));
                },
              });
            }
            if (draftFilters.language && draftFilters.language !== 'All') {
              pills.push({
                id: 'lang',
                label: draftFilters.language,
                onRemove: () => {
                  setDraftFilters((prev) => ({ ...prev, language: 'All' }));
                },
              });
            }

            if (pills.length === 0) return null;

            return (
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Active Filters ({pills.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleClearMobileDraft}
                    className="text-[11px] font-bold text-slate-400 hover:text-white hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {pills.map((pill) => (
                    <span
                      key={pill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-white rounded-full text-xs font-semibold shadow-2xs border border-slate-700"
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
              selectedCategory={draftFilters.category}
              onSelectCategory={(cat) => {
                setDraftFilters((prev) => ({ ...prev, category: cat }));
              }}
              label="Category"
              isMobileModal
            />
          </div>

          {/* 3. AVAILABLE TIME SECTION */}
          <div className="space-y-2 pt-5 border-t border-slate-800">
            <label className="text-[11px] font-bold tracking-wider uppercase block text-slate-300">
              Available Time
            </label>
            <TimeSelectorPopover
              selectedTimes={draftFilters.timeOfDaySlots}
              selectedDays={draftFilters.daysOfWeek}
              onToggleTime={(t) => {
                setDraftFilters((prev) => ({
                  ...prev,
                  timeOfDaySlots: prev.timeOfDaySlots.includes(t)
                    ? prev.timeOfDaySlots.filter((item) => item !== t)
                    : [...prev.timeOfDaySlots, t],
                }));
              }}
              onSelectDays={(d) => {
                setDraftFilters((prev) => ({ ...prev, daysOfWeek: d }));
              }}
              isMobileModal
            />
          </div>

          {/* 4. MOSCOW METRO SECTION */}
          {!isDraftOnline && (() => {
            const selectedLineObj = draftFilters.metroLineId !== 'all' ? METRO_LINES.find((l) => l.id === draftFilters.metroLineId) : null;
            const lineColor = selectedLineObj?.color || '#A2FF00';
            const lineShortName = selectedLineObj
              ? selectedLineObj.name.includes(':')
                ? selectedLineObj.name.split(':')[1].trim()
                : selectedLineObj.name
              : 'All Metro Lines';

            return (
              <div className="space-y-3 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-md bg-[#A2FF00]/15 flex items-center justify-center text-[#A2FF00] text-xs font-black">
                      M
                    </div>
                    <label className="text-[11px] font-bold tracking-wider uppercase block text-slate-300">
                      Moscow Metro Discovery
                    </label>
                  </div>
                  {draftFilters.metroStationIds.length > 0 && (
                    <span className="text-[11px] font-extrabold text-slate-950 bg-[#A2FF00] px-2.5 py-0.5 rounded-full">
                      {draftFilters.metroStationIds.length} {draftFilters.metroStationIds.length === 1 ? 'station' : 'stations'} selected
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
                      value={draftFilters.metroLineId}
                      onChange={(e) => {
                        setDraftFilters((prev) => ({
                          ...prev,
                          metroLineId: e.target.value,
                          metroStationIds: [],
                        }));
                      }}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 min-h-[46px] text-xs sm:text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#A2FF00] cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="all" className="bg-slate-900 text-white">All Metro Lines (Entire Network)</option>
                      {METRO_LINES.map((line) => (
                        <option key={line.id} value={line.id} className="bg-slate-900 text-white">
                          {line.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Subtle Metro Connector Line */}
                  <div className="flex items-center pl-5 -my-1">
                    <div className="w-0.5 h-3 bg-slate-700" />
                  </div>

                  {/* Step 2: Station Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMetroSheetOpen(true);
                    }}
                    className="w-full bg-slate-950/80 hover:bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 min-h-[46px] text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white transition-colors shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#A2FF00] flex items-center justify-center shrink-0">
                        <div className="w-1 h-1 rounded-full bg-[#A2FF00]" />
                      </div>
                      <span className="truncate">
                        {draftFilters.metroStationIds.length > 0
                          ? `${draftFilters.metroStationIds.length} Stations selected on ${lineShortName}`
                          : draftFilters.metroLineId !== 'all'
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

          {/* 5. AUDIENCE & ATTENDANCE IN SHEET */}
          <div className="space-y-3 pt-5 border-t border-slate-800">
            <label className="text-[11px] font-bold tracking-wider uppercase block text-slate-300">
              Audience & Attendance
            </label>
            <div className="flex flex-wrap gap-2.5">
              <AudienceSelector
                selectedAudience={draftFilters.audience}
                onSelectAudience={(aud) => {
                  setDraftFilters((prev) => ({ ...prev, audience: aud }));
                }}
              />

              <AttendanceModeSelector
                selectedMode={draftFilters.deliveryMode}
                onSelectMode={(mode) => {
                  setDraftFilters((prev) => ({ ...prev, deliveryMode: mode }));
                }}
              />
            </div>
          </div>

          {/* 6. DELIVERY MODE & LANGUAGE (when relevant) */}
          {isDraftOnline && (
            <div className="space-y-2 pt-5 border-t border-slate-800">
              <LanguagePopover
                selectedLanguage={draftFilters.language}
                onSelectLanguage={(lang) => {
                  setDraftFilters((prev) => ({ ...prev, language: lang }));
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
