import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, MapPin, Globe, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OptionItem {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string | React.ReactNode;
  color?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  placeholder?: string;
  options: OptionItem[];
  selectedIds: string[];
  onSelectOption: (id: string) => void;
  allowMultiple?: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  title,
  placeholder = 'Type to search...',
  options,
  selectedIds,
  onSelectOption,
  allowMultiple = false,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col z-10 overflow-hidden max-h-[80vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 shadow-2xs"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = selectedIds.includes(opt.id);

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onSelectOption(opt.id);
                        if (!allowMultiple) {
                          onClose();
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl text-sm font-bold flex items-center justify-between transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.01]'
                          : 'bg-white text-slate-800 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {opt.color ? (
                          <div
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                            style={{ backgroundColor: opt.color }}
                          />
                        ) : typeof opt.icon === 'string' ? (
                          <span className="text-lg shrink-0">{opt.icon}</span>
                        ) : (
                          opt.icon
                        )}
                        <div className="min-w-0 truncate">
                          <p className="truncate font-extrabold">{opt.label}</p>
                          {opt.sublabel && (
                            <p
                              className={`text-xs font-normal truncate mt-0.5 ${
                                isSelected ? 'text-slate-300' : 'text-slate-400'
                              }`}
                            >
                              {opt.sublabel}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-4 h-4 font-bold" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-sm text-slate-400">
                  No matching options found
                </div>
              )}
            </div>

            {/* Footer */}
            {allowMultiple && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Done ({selectedIds.length} Selected)
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
