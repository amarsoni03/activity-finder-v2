import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../../../types';
import { CATEGORIES } from '../../activities/data/activitiesData';

interface CategoryPopoverProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  label?: string;
  isMobileModal?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  'All Categories': '✨',
  Languages: '🌍',
  Sports: '🏃',
  Dance: '💃',
  Music: '🎵',
  Arts: '🎨',
  Fitness: '🏋️‍♂️',
  Crafts: '🧶',
  Business: '💼',
  Technology: '💻',
  'Personal Development': '🧠',
  'Martial Arts': '🥋',
  Swimming: '🏊‍♂️',
  'Yoga & Pilates': '🧘‍♀️',
  'Coding & Robotics': '🤖',
  'Business & Finance': '📊',
  Photography: '📷',
  Cooking: '🍳',
  Chess: '♟️',
  Theatre: '🎭',
  'Public Speaking': '🎙️',
  STEM: '🔬',
  'Early Learning': '👶',
  'Exam Preparation': '📚',
  'Corporate Team Building': '🏢',
};

export const CategoryPopover: React.FC<CategoryPopoverProps> = ({
  selectedCategory,
  onSelectCategory,
  label = 'Category',
  isMobileModal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return CATEGORIES;
    return CATEGORIES.filter((c) => c.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleSelect = (category: Category) => {
    onSelectCategory(category);
    if (!isMobileModal) setIsOpen(false);
    setSearchQuery('');
  };

  // When rendered inside a mobile bottom sheet, render inline directly
  if (isMobileModal) {
    const allCat = filteredCategories.find((c) => c === 'All Categories');
    const otherCats = filteredCategories.filter((c) => c !== 'All Categories');

    return (
      <div className="space-y-2.5">
        <label className="text-[11px] font-bold tracking-wider uppercase block text-slate-700">
          {label}
        </label>
        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Search categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A2FF00] focus:border-[#A2FF00] bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 transition-colors min-h-[44px]"
          />
        </div>

        {/* Category Options: Top 'All Categories' followed by 2-column responsive grid */}
        <div className="space-y-2 max-h-[190px] sm:max-h-[210px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300">
          {allCat && (
            <button
              type="button"
              onClick={() => handleSelect('All Categories')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer border min-h-[44px] ${
                selectedCategory === 'All Categories'
                  ? 'bg-[#A2FF00] text-slate-950 font-bold border-[#8ee600]/40 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="text-base shrink-0">{CATEGORY_ICONS['All Categories'] || '✨'}</span>
                <span className="truncate">All Categories</span>
              </div>
              {selectedCategory === 'All Categories' && (
                <Check className="w-4 h-4 text-slate-950 shrink-0 ml-2 stroke-[3]" />
              )}
            </button>
          )}

          {otherCats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otherCats.map((cat) => {
                const isSelected = selectedCategory === cat;
                const icon = CATEGORY_ICONS[cat] || '🏷️';
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer border min-h-[44px] ${
                      isSelected
                        ? 'bg-[#A2FF00] text-slate-950 font-bold border-[#8ee600]/40 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="text-base shrink-0">{icon}</span>
                      <span className="truncate">{cat}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-slate-950 shrink-0 ml-2 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          ) : !allCat ? (
            <div className="p-4 text-center text-xs font-semibold text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              No matching categories found
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-[11px] font-bold tracking-wider uppercase block mb-1 text-slate-700">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-left flex items-center justify-between transition-all cursor-pointer shadow-xs group min-h-[44px]"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className="text-base shrink-0">
            {CATEGORY_ICONS[selectedCategory] || '🏷️'}
          </span>
          <span className="text-sm font-bold text-slate-900 truncate">
            {selectedCategory === 'All Categories' ? 'All Categories' : selectedCategory}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-900' : 'group-hover:text-slate-700'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -2 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full mt-1.5 w-full sm:w-80 rounded-2xl shadow-2xl z-50 p-3 overflow-hidden bg-white border border-slate-200 text-slate-900"
          >
            {/* Search Input Box */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#A2FF00]/30 focus:border-[#A2FF00] bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Category Options List */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-300">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const icon = CATEGORY_ICONS[cat] || '🏷️';
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSelect(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#A2FF00] text-[#0A0A0A] font-bold shadow-xs'
                          : 'text-[#475569] hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="text-sm shrink-0">{icon}</span>
                        <span className="truncate">{cat}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0A0A0A] shrink-0 ml-2" />}
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-center text-xs text-slate-500">
                  No matching categories found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
