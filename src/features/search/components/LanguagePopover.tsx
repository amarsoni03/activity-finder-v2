import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageFilter } from '../../../types';

interface LanguagePopoverProps {
  selectedLanguage: LanguageFilter;
  onSelectLanguage: (lang: LanguageFilter) => void;
  label?: string;
  isMobileModal?: boolean;
}

const LANGUAGES: { id: LanguageFilter; label: string; icon: string }[] = [
  { id: 'All', label: 'All Languages', icon: '🌐' },
  { id: 'English', label: 'English Instruction', icon: '🇬🇧' },
  { id: 'Russian', label: 'Russian Instruction', icon: '🇷🇺' },
  { id: 'English & Russian', label: 'Bilingual (Eng & Rus)', icon: '🔄' },
];

export const LanguagePopover: React.FC<LanguagePopoverProps> = ({
  selectedLanguage,
  onSelectLanguage,
  label = 'Language',
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

  const filteredLanguages = LANGUAGES.filter((l) =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedObj = LANGUAGES.find((l) => l.id === selectedLanguage) || LANGUAGES[0];

  // When rendered inside a mobile bottom sheet, render inline directly
  if (isMobileModal) {
    return (
      <div className="space-y-2.5">
        <label className="text-[11px] font-bold tracking-wider uppercase block text-slate-700">
          {label}
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Search language"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search language..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A2FF00] focus:border-[#A2FF00] bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 transition-colors min-h-[44px]"
          />
        </div>
        <div className="space-y-1.5">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => onSelectLanguage(lang.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer border min-h-[44px] ${
                  isSelected
                    ? 'bg-[#A2FF00] text-slate-950 font-bold border-[#8ee600]/40 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">{lang.icon}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-slate-950 shrink-0 stroke-[3]" />}
              </button>
            );
          })}
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
          <span className="text-base shrink-0">{selectedObj.icon}</span>
          <span className="text-sm font-bold text-slate-900 truncate">
            {selectedObj.label}
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
            className="absolute left-0 top-full mt-1.5 w-full sm:w-72 rounded-2xl shadow-2xl z-50 p-3 overflow-hidden bg-white border border-slate-200 text-slate-900"
          >
            {/* Search Input Box */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#A2FF00]/30 focus:border-[#A2FF00] bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      onSelectLanguage(lang.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#A2FF00] text-[#0A0A0A] font-bold shadow-xs'
                        : 'text-[#475569] hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">{lang.icon}</span>
                      <span>{lang.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0A0A0A] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
