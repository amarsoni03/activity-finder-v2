import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Tag, Compass, X } from 'lucide-react';
import { Activity, Category, FilterState } from '../types';
import { METRO_STATIONS, METRO_LINES } from '../data/metroData';

interface SearchBarProps {
  activities: Activity[];
  filters: FilterState;
  onApplyFilters: (newFilters: Partial<FilterState>) => void;
  onSelectActivity?: (activity: Activity) => void;
  className?: string;
  placeholder?: string;
}

const CATEGORIES: (Category | string)[] = [
  'Languages',
  'Sports',
  'Dance',
  'Arts',
  'Music',
  'Kids',
  'Corporate',
  'Cooking',
  'Technology',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  activities,
  filters,
  onApplyFilters,
  onSelectActivity,
  className = '',
  placeholder = 'Search activities, categories (e.g. Salsa, Languages) or metro stations...',
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchQuery || '');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(filters.searchQuery || '');
  }, [filters.searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmedQuery = searchTerm.trim().toLowerCase();

  // Autocomplete Suggestions
  const matchingCategories = trimmedQuery
    ? CATEGORIES.filter((cat) => cat.toLowerCase().includes(trimmedQuery))
    : [];

  const matchingMetros = trimmedQuery
    ? METRO_STATIONS.filter(
        (st) =>
          st.name.toLowerCase().includes(trimmedQuery) ||
          st.lineName.toLowerCase().includes(trimmedQuery)
      ).slice(0, 4)
    : [];

  const matchingActivities = trimmedQuery
    ? activities
        .filter(
          (act) =>
            act.title.toLowerCase().includes(trimmedQuery) ||
            act.category.toLowerCase().includes(trimmedQuery) ||
            act.metroStationName.toLowerCase().includes(trimmedQuery) ||
            act.shortDescription.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 5)
    : [];

  const hasSuggestions =
    trimmedQuery.length > 0 &&
    (matchingCategories.length > 0 || matchingMetros.length > 0 || matchingActivities.length > 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters({ searchQuery: searchTerm });
    setIsOpen(false);
  };

  const handleSelectCategory = (cat: Category | string) => {
    onApplyFilters({ category: cat as Category, searchQuery: '' });
    setSearchTerm(cat);
    setIsOpen(false);
  };

  const handleSelectMetro = (stationId: string, stationName: string, lineId: string) => {
    onApplyFilters({ metroStationIds: [stationId], metroLineId: lineId, searchQuery: '' });
    setSearchTerm(stationName);
    setIsOpen(false);
  };

  const handleSelectActivityItem = (activity: Activity) => {
    if (onSelectActivity) {
      onSelectActivity(activity);
    } else {
      onApplyFilters({ searchQuery: activity.title });
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onApplyFilters({ searchQuery: '' });
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full max-w-3xl ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <div className="absolute left-4 sm:left-5 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#074213]" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            onApplyFilters({ searchQuery: e.target.value });
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 sm:pl-14 pr-12 py-3.5 sm:py-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-lg shadow-slate-900/5 focus:outline-none focus:ring-2 focus:ring-[#074213] focus:border-transparent text-sm sm:text-base font-medium transition-all"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && hasSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {/* Matching Categories */}
          {matchingCategories.length > 0 && (
            <div className="p-3">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Categories</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchingCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#074213]/10 hover:text-[#074213] transition-colors flex items-center justify-between"
                  >
                    <span>{cat}</span>
                    <span className="text-xs text-slate-400 font-normal">Browse category</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Metros */}
          {matchingMetros.length > 0 && (
            <div className="p-3">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Metro Stations</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchingMetros.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelectMetro(st.id, st.name, st.lineId)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#074213]/10 hover:text-[#074213] transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: METRO_LINES.find((l) => l.id === st.lineId)?.color || '#22c55e' }}
                      />
                      <span>{st.name} Station</span>
                    </div>
                    <span className="text-xs text-slate-400 font-normal">{st.lineName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Activities */}
          {matchingActivities.length > 0 && (
            <div className="p-3">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Activities</span>
              </div>
              <div className="mt-1 space-y-1">
                {matchingActivities.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleSelectActivityItem(act)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors flex items-center space-x-3 group"
                  >
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold group-hover:text-[#074213] transition-colors">
                        {act.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {act.category} • {act.metroStationName}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#074213] shrink-0">
                      {act.price} ₽
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
