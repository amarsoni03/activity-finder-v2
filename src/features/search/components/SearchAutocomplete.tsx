import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from '../../../types';

interface SearchAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (keyword: string) => void;
  activities?: Activity[];
}

const ROTATING_PLACEHOLDERS = [
  'Search classes, activities, courses...',
  'Search yoga, swimming, pottery...',
  'Search tennis, padel, sports...',
  'Search cooking, photography, workshops...',
];

const EXAMPLE_SUGGESTIONS = ['Yoga', 'English', 'Cooking', 'Photography'];

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  onSearch,
  activities = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const autocompleteSuggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];

    const matches: { id: string; title: string; category: string; subSkill?: string; type: 'activity' | 'category' | 'tag' }[] = [];
    const seenTitles = new Set<string>();

    for (const act of activities) {
      if (matches.length >= 6) break;

      const titleLower = act.title.toLowerCase();
      const catLower = act.category.toLowerCase();
      const subLower = (act.subSkill || '').toLowerCase();

      if (titleLower.includes(query) && !seenTitles.has(act.title)) {
        seenTitles.add(act.title);
        matches.push({
          id: act.id,
          title: act.title,
          category: act.category,
          subSkill: act.subSkill,
          type: 'activity',
        });
      } else if (subLower.includes(query) && !seenTitles.has(act.subSkill)) {
        seenTitles.add(act.subSkill);
        matches.push({
          id: `sub-${act.subSkill}`,
          title: act.subSkill,
          category: act.category,
          type: 'tag',
        });
      } else if (catLower.includes(query) && !seenTitles.has(act.category)) {
        seenTitles.add(act.category);
        matches.push({
          id: `cat-${act.category}`,
          title: act.category,
          category: 'Category',
          type: 'category',
        });
      }
    }

    return matches;
  }, [value, activities]);

  // Reset highlight index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (highlightedIndex >= 0 && autocompleteSuggestions[highlightedIndex]) {
      handleSelectSuggestion(autocompleteSuggestions[highlightedIndex].title);
      return;
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSearch(value);
  };

  const handleSelectSuggestion = (term: string) => {
    onChange(term);
    onSearch(term);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isDropdownVisible = isOpen && (value.trim().length > 0 || autocompleteSuggestions.length > 0);

    if (e.key === 'ArrowDown') {
      if (!isDropdownVisible) {
        setIsOpen(true);
        if (autocompleteSuggestions.length > 0) {
          setHighlightedIndex(0);
        }
        return;
      }
      if (autocompleteSuggestions.length > 0) {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < autocompleteSuggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      if (isDropdownVisible && autocompleteSuggestions.length > 0) {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : autocompleteSuggestions.length - 1
        );
      }
    } else if (e.key === 'Escape') {
      if (isDropdownVisible) {
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    } else if (e.key === 'Enter') {
      if (isDropdownVisible && highlightedIndex >= 0 && autocompleteSuggestions[highlightedIndex]) {
        e.preventDefault();
        e.stopPropagation();
        handleSelectSuggestion(autocompleteSuggestions[highlightedIndex].title);
      }
    }
  };

  const isDropdownVisible = isOpen && (value.trim().length > 0 || autocompleteSuggestions.length > 0);
  const activeDescendantId =
    highlightedIndex >= 0 && autocompleteSuggestions[highlightedIndex]
      ? `autocomplete-opt-${autocompleteSuggestions[highlightedIndex].id}`
      : undefined;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors z-10">
          <Search className="w-5 h-5 text-slate-400" />
        </div>

        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isDropdownVisible}
            aria-controls="search-autocomplete-list"
            aria-activedescendant={activeDescendantId}
            aria-label="Search activities, classes, and workshops"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
            className="w-full pl-11 sm:pl-12 pr-11 h-[56px] bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-sm sm:text-base font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#A2FF00] focus:border-[#A2FF00] transition-all shadow-inner"
          />
        </div>

        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange('');
              onSearch('');
              setIsOpen(false);
              setHighlightedIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown Popover (Dark Theme) */}
      <AnimatePresence>
        {isDropdownVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 0.99, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            id="search-autocomplete-list"
            role="listbox"
            aria-label="Activity suggestions"
            className="absolute left-0 right-0 top-full mt-2 bg-slate-900 rounded-2xl shadow-2xl border border-slate-750 p-3 z-50 overflow-hidden max-h-96 text-white border-slate-700/90"
          >
            {autocompleteSuggestions.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Suggested Matching Activities</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#A2FF00]" />
                </div>
                {autocompleteSuggestions.map((item, index) => {
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <button
                      key={item.id}
                      id={`autocomplete-opt-${item.id}`}
                      role="option"
                      aria-selected={isHighlighted}
                      type="button"
                      onClick={() => handleSelectSuggestion(item.title)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between group cursor-pointer ${
                        isHighlighted ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          isHighlighted
                            ? 'bg-slate-700 border-slate-600 text-[#A2FF00]'
                            : 'bg-slate-800 border-slate-700/60 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                        }`}>
                          <Search className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-slate-100 group-hover:text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{item.category}</p>
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-all shrink-0 ml-2 ${
                        isHighlighted
                          ? 'opacity-100 text-[#A2FF00]'
                          : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-[#A2FF00]'
                      }`} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-sm text-slate-400">
                Press enter to search for <span className="font-semibold text-white">"{value}"</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline Example Suggestions under Search bar */}
      <div className="flex flex-wrap items-center text-xs text-slate-400 pt-2 px-1 gap-y-1">
        <span className="font-bold text-slate-400 mr-1.5">Try:</span>
        {EXAMPLE_SUGGESTIONS.map((term, idx) => (
          <React.Fragment key={term}>
            <button
              type="button"
              onClick={() => handleSelectSuggestion(term)}
              className="inline-flex items-center min-h-[24px] px-1 py-0.5 rounded text-slate-300 hover:text-[#A2FF00] transition-colors cursor-pointer font-semibold"
            >
              {term}
            </button>
            {idx < EXAMPLE_SUGGESTIONS.length - 1 && <span className="mx-1.5 text-slate-600 select-none">·</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
