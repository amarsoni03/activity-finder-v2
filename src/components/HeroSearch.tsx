import React, { useState } from 'react';
import { Search, Sparkles, Calendar, MapPin, Globe } from 'lucide-react';
import { Category, AudienceType, TimeOfDay, DayOfWeek, FilterState, GoalType, DeliveryFilter } from '../types';
import { CATEGORIES } from '../data/activitiesData';
import { METRO_LINES, METRO_STATIONS } from '../data/metroData';

interface HeroSearchProps {
  filters: FilterState;
  onApplySearch: (newFilters: Partial<FilterState>) => void;
  onOpenAiMatchmaker?: () => void;
  onOpenFreeTimePlanner?: () => void;
}

const QUICK_CHIPS = [
  'Today',
  'Tomorrow',
  'Weekend',
  'Morning',
  'Afternoon',
  'Evening',
  'Beginner',
  'Free Trial',
  'Instant Booking',
] as const;

type QuickChip = (typeof QUICK_CHIPS)[number];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onApplySearch,
  onOpenAiMatchmaker,
  onOpenFreeTimePlanner,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(filters.category);
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<DeliveryFilter>(filters.deliveryMode || 'In Person');
  const [selectedMetroLine, setSelectedMetroLine] = useState<string>(filters.metroLineId);
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>(filters.metroStationIds);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(filters.daysOfWeek);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TimeOfDay[]>(filters.timeOfDaySlots);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>(filters.audience);
  const [selectedGoal, setSelectedGoal] = useState<GoalType>(filters.goal || 'All Goals');
  const [searchKeyword, setSearchKeyword] = useState<string>(filters.searchKeyword);

  React.useEffect(() => {
    setSelectedCategory(filters.category);
    setSelectedDeliveryMode(filters.deliveryMode || 'In Person');
    setSelectedMetroLine(filters.metroLineId);
    setSelectedStationIds(filters.metroStationIds);
    setSelectedDays(filters.daysOfWeek);
    setSelectedTimeOfDay(filters.timeOfDaySlots);
    setSelectedAudience(filters.audience);
    setSelectedGoal(filters.goal || 'All Goals');
    setSearchKeyword(filters.searchKeyword);
  }, [filters]);

  const toggleTimeOfDay = (slot: TimeOfDay) => {
    if (selectedTimeOfDay.includes(slot)) {
      setSelectedTimeOfDay(selectedTimeOfDay.filter((s) => s !== slot));
    } else {
      setSelectedTimeOfDay([...selectedTimeOfDay, slot]);
    }
  };

  const handleDeliveryModeChange = (mode: DeliveryFilter) => {
    setSelectedDeliveryMode(mode);
    onApplySearch({
      category: selectedCategory,
      deliveryMode: mode,
      metroLineId: selectedMetroLine,
      metroStationIds: selectedStationIds,
      daysOfWeek: selectedDays,
      timeOfDaySlots: selectedTimeOfDay,
      audience: selectedAudience,
      goal: selectedGoal,
      searchKeyword: searchKeyword,
    });
  };

  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplySearch({
      category: selectedCategory,
      deliveryMode: selectedDeliveryMode,
      metroLineId: selectedMetroLine,
      metroStationIds: selectedStationIds,
      daysOfWeek: selectedDays,
      timeOfDaySlots: selectedTimeOfDay,
      audience: selectedAudience,
      goal: selectedGoal,
      searchKeyword: searchKeyword,
    });
  };

  const handleClearAll = () => {
    setSelectedCategory('All Categories');
    setSelectedDeliveryMode('In Person');
    setSelectedMetroLine('all');
    setSelectedStationIds([]);
    setSelectedDays([]);
    setSelectedTimeOfDay([]);
    setSelectedAudience('All');
    setSelectedGoal('All Goals');
    setSearchKeyword('');
    onApplySearch({
      category: 'All Categories',
      deliveryMode: 'In Person',
      metroLineId: 'all',
      metroStationIds: [],
      daysOfWeek: [],
      timeOfDaySlots: [],
      audience: 'All',
      goal: 'All Goals',
      searchKeyword: '',
    });
  };

  const getTodayDayOfWeek = (): DayOfWeek => {
    const days: DayOfWeek[] = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[new Date().getDay()];
  };

  const getTomorrowDayOfWeek = (): DayOfWeek => {
    const days: DayOfWeek[] = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[(new Date().getDay() + 1) % 7];
  };

  const isChipActive = (chip: QuickChip): boolean => {
    const today = getTodayDayOfWeek();
    const tomorrow = getTomorrowDayOfWeek();
    switch (chip) {
      case 'Today':
        return selectedDays.length === 1 && selectedDays.includes(today);
      case 'Tomorrow':
        return selectedDays.length === 1 && selectedDays.includes(tomorrow);
      case 'Weekend':
        return selectedDays.includes('Saturday') && selectedDays.includes('Sunday');
      case 'Morning':
        return selectedTimeOfDay.length === 1 && selectedTimeOfDay.includes('Morning');
      case 'Afternoon':
        return selectedTimeOfDay.length === 1 && selectedTimeOfDay.includes('Afternoon');
      case 'Evening':
        return selectedTimeOfDay.length === 1 && selectedTimeOfDay.includes('Evening');
      case 'Beginner':
        return filters.level === 'Beginner' || searchKeyword === 'Beginner';
      case 'Free Trial':
        return searchKeyword === 'Free Trial';
      case 'Instant Booking':
        return searchKeyword === 'Instant Booking';
      default:
        return false;
    }
  };

  const handleQuickFilter = (chip: QuickChip) => {
    let newDays = [...selectedDays];
    let newTime = [...selectedTimeOfDay];
    let newKeyword = searchKeyword;
    let newLevel = filters.level;

    const today = getTodayDayOfWeek();
    const tomorrow = getTomorrowDayOfWeek();

    switch (chip) {
      case 'Today':
        newDays = isChipActive('Today') ? [] : [today];
        break;
      case 'Tomorrow':
        newDays = isChipActive('Tomorrow') ? [] : [tomorrow];
        break;
      case 'Weekend':
        newDays = isChipActive('Weekend') ? [] : ['Saturday', 'Sunday'];
        break;
      case 'Morning':
        newTime = isChipActive('Morning') ? [] : ['Morning'];
        break;
      case 'Afternoon':
        newTime = isChipActive('Afternoon') ? [] : ['Afternoon'];
        break;
      case 'Evening':
        newTime = isChipActive('Evening') ? [] : ['Evening'];
        break;
      case 'Beginner':
        newKeyword = isChipActive('Beginner') ? '' : 'Beginner';
        newLevel = isChipActive('Beginner') ? 'All Levels' : 'Beginner';
        break;
      case 'Free Trial':
        newKeyword = searchKeyword === 'Free Trial' ? '' : 'Free Trial';
        break;
      case 'Instant Booking':
        newKeyword = searchKeyword === 'Instant Booking' ? '' : 'Instant Booking';
        break;
    }

    setSelectedDays(newDays);
    setSelectedTimeOfDay(newTime);
    setSearchKeyword(newKeyword);

    onApplySearch({
      daysOfWeek: newDays,
      timeOfDaySlots: newTime,
      searchKeyword: newKeyword,
      level: newLevel,
    });
  };

  return (
    <section className="bg-slate-50/50 px-4 sm:px-6 md:px-8 py-10 sm:py-16 border-b border-slate-200/50">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Headline */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-3xl mx-auto">
            Find activities that fit your free time.
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-normal leading-relaxed">
            Discover courses, classes, workshops, sports, events and camps near your metro station.
          </p>
        </div>

        {/* Format Toggle Tabs: offline | online */}
        <div className="flex items-center justify-center -mb-2 z-10 relative">
          <div className="inline-flex items-center p-1 bg-white/90 backdrop-blur-md rounded-2xl md:rounded-full border border-slate-200/90 shadow-md shadow-slate-900/5 gap-1">
            <button
              type="button"
              onClick={() => handleDeliveryModeChange('In Person')}
              className={`relative flex items-center space-x-2 px-6 py-2 rounded-xl md:rounded-full text-sm font-extrabold transition-all cursor-pointer ${
                selectedDeliveryMode === 'In Person' || selectedDeliveryMode === 'All'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Offline</span>
              {(selectedDeliveryMode === 'In Person' || selectedDeliveryMode === 'All') && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#074213] rounded-full" />
              )}
            </button>

            <span className="text-slate-300 font-light select-none px-1">|</span>

            <button
              type="button"
              onClick={() => handleDeliveryModeChange('Live Online')}
              className={`relative flex items-center space-x-2 px-6 py-2 rounded-xl md:rounded-full text-sm font-extrabold transition-all cursor-pointer ${
                selectedDeliveryMode === 'Live Online'
                  ? 'bg-[#074213] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Online</span>
              {selectedDeliveryMode === 'Live Online' && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#A2FF00] rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* ONE Premium Search Container */}
        <form onSubmit={handleExecuteSearch} className="relative">
          <div className="bg-white rounded-2xl md:rounded-full p-2.5 md:p-3 border border-slate-200/90 shadow-xl shadow-slate-900/5 hover:shadow-2xl transition-all">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* 1. Category (optional) */}
              <div className="md:w-1/4 px-4 py-2 hover:bg-slate-50/70 rounded-xl md:rounded-l-full transition-colors">
                <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                  1. Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none cursor-pointer border-none p-0 focus:ring-0 truncate"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All Categories' ? 'All Categories (Optional)' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Metro Line */}
              <div className="md:w-1/5 px-4 py-2 hover:bg-slate-50/70 rounded-xl transition-colors">
                <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                  2. Metro Line
                </label>
                <select
                  value={selectedMetroLine}
                  onChange={(e) => {
                    setSelectedMetroLine(e.target.value);
                    setSelectedStationIds([]);
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none cursor-pointer border-none p-0 focus:ring-0 truncate"
                >
                  <option value="all">All Lines</option>
                  {METRO_LINES.map((line) => (
                    <option key={line.id} value={line.id}>
                      {line.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Metro Station — shown when a line is selected */}
              {selectedMetroLine !== 'all' && (() => {
                const stationsForLine = METRO_STATIONS.filter(s => s.lineId === selectedMetroLine);
                return (
                  <div className="md:w-1/5 px-4 py-2 hover:bg-slate-50/70 rounded-xl transition-colors">
                    <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                      3. Station
                    </label>
                    <select
                      value={selectedStationIds[0] ?? ''}
                      onChange={(e) =>
                        setSelectedStationIds(e.target.value ? [e.target.value] : [])
                      }
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none cursor-pointer border-none p-0 focus:ring-0 truncate"
                    >
                      <option value="">All Stations</option>
                      {stationsForLine.map((station) => (
                        <option key={station.id} value={station.id}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })()}

              {/* 4. Time */}
              <div className="md:w-1/5 px-4 py-2 hover:bg-slate-50/70 rounded-xl transition-colors">
                <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                  {selectedMetroLine !== 'all' ? '4. Time' : '3. Time'}
                </label>
                <div className="flex items-center gap-1">
                  {(['Morning', 'Afternoon', 'Evening'] as TimeOfDay[]).map((slot) => {
                    const isSelected = selectedTimeOfDay.includes(slot);
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => toggleTimeOfDay(slot)}
                        className={`flex-1 py-1 px-1.5 text-[11px] font-semibold rounded-md transition-all text-center ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        {slot === 'Morning' ? 'Morn' : slot === 'Afternoon' ? 'Aft' : 'Eve'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Audience */}
              <div className="md:w-1/5 px-4 py-2 hover:bg-slate-50/70 rounded-xl transition-colors">
                <label className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                  {selectedMetroLine !== 'all' ? '5. Audience' : '4. Audience'}
                </label>
                <div className="flex items-center gap-1">
                  {(['All', 'Adults', 'Children'] as AudienceType[]).map((aud) => {
                    const isSelected = selectedAudience === aud;
                    return (
                      <button
                        type="button"
                        key={aud}
                        onClick={() => setSelectedAudience(aud)}
                        className={`flex-1 py-1 px-1.5 text-[11px] font-semibold rounded-md transition-all text-center ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        {aud === 'Children' ? 'Kids' : aud}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Search Button */}
              <div className="p-1 md:pl-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="w-full md:w-auto h-12 px-7 bg-[#074213] hover:bg-[#05320e] text-white text-sm font-bold rounded-xl md:rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

            </div>
          </div>
        </form>

        {/* Quick Filters */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Quick filters:</span>
            {QUICK_CHIPS.map((chip) => {
              const isActive = isChipActive(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickFilter(chip)}
                  className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary AI Concierge & Reset Links */}
        <div className="flex items-center justify-center gap-4 text-xs pt-1">
          {onOpenAiMatchmaker && (
            <button
              type="button"
              onClick={onOpenAiMatchmaker}
              className="text-slate-500 hover:text-slate-800 font-medium transition-colors flex items-center gap-1.5 opacity-80 hover:opacity-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Matchmaker</span>
            </button>
          )}
          {onOpenFreeTimePlanner && (
            <>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={onOpenFreeTimePlanner}
                className="text-slate-500 hover:text-slate-800 font-medium transition-colors flex items-center gap-1.5 opacity-80 hover:opacity-100"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Free Time Planner</span>
              </button>
            </>
          )}
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-slate-400 hover:text-slate-700 font-medium transition-colors"
          >
            Reset filters
          </button>
        </div>

      </div>
    </section>
  );
};

