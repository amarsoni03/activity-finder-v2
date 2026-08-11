import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface PopoverItem {
  id: string;
  label: string;
  subLabel?: string;
  badge?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  icon?: React.ReactNode;
}

interface SearchPopoverProps {
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  items: PopoverItem[];
  selectedId: string;
  onSelect: (item: PopoverItem) => void;
  className?: string;
  disabled?: boolean;
}

export const SearchPopover: React.FC<SearchPopoverProps> = ({
  label,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  items,
  selectedId,
  onSelect,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = useMemo(() => {
    return items.find((i) => i.id === selectedId);
  }, [items, selectedId]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.subLabel && item.subLabel.toLowerCase().includes(q))
    );
  }, [items, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Field Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer group ${
          disabled
            ? 'opacity-40 cursor-not-allowed bg-slate-100/50'
            : isOpen
            ? 'bg-white ring-2 ring-slate-900 shadow-md'
            : 'hover:bg-slate-100/80 bg-slate-50/70 border border-slate-200/60'
        }`}
      >
        <div className="min-w-0 flex-1 pr-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
            {label}
          </span>
          <div className="flex items-center gap-2 truncate">
            {selectedItem?.icon && <span className="shrink-0">{selectedItem.icon}</span>}
            <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
              {selectedItem ? selectedItem.label : placeholder}
            </span>
            {selectedItem?.badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  selectedItem.badgeBg || 'bg-slate-100'
                } ${selectedItem.badgeTextColor || 'text-slate-700'}`}
              >
                {selectedItem.badge}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-900' : 'group-hover:text-slate-600'
          }`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden min-w-[240px] max-h-[340px] flex flex-col"
          >
            {/* Search Filter Header */}
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full text-xs font-medium text-slate-900 bg-transparent outline-none placeholder-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Scrollable Item List */}
            <div className="overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-50 flex-1">
              {filteredItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching options found
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'hover:bg-slate-100/90 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{item.label}</div>
                          {item.subLabel && (
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-slate-300' : 'text-slate-400'
                              }`}
                            >
                              {item.subLabel}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-slate-800 text-slate-200'
                                : `${item.badgeBg || 'bg-slate-100'} ${
                                    item.badgeTextColor || 'text-slate-700'
                                  }`
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
