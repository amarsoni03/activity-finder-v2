import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialogFocus } from '../../../hooks/useDialogFocus';

interface MobileSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onApply?: () => void;
  onClear?: () => void;
  activeCount?: number;
}

export const MobileSearchSheet: React.FC<MobileSearchSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onApply,
  onClear,
  activeCount = 0,
}) => {
  const dialogRef = useDialogFocus(isOpen, onClose);

  // Prevent background scrolling when sheet is open (iOS & Mobile web compatible)
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const transition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.2, ease: [0.16, 1, 0.3, 1] };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Sheet Modal Container */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-sheet-title"
            tabIndex={-1}
            initial={{ y: prefersReducedMotion ? 0 : 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: prefersReducedMotion ? 0 : 16, opacity: 0 }}
            transition={transition}
            className="relative w-full sm:max-w-xl md:max-w-2xl bg-slate-900 text-white rounded-t-3xl sm:rounded-3xl shadow-2xl h-[86dvh] sm:h-[80vh] max-h-[680px] flex flex-col z-10 overflow-hidden border border-slate-750 focus:outline-none mb-0"
          >
            {/* Sticky Sheet Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900/95 backdrop-blur-xs z-10">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#A2FF00]/15 text-[#A2FF00] flex items-center justify-center shrink-0 border border-[#A2FF00]/25">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-[#A2FF00]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h2 id="search-sheet-title" className="text-base sm:text-lg font-black tracking-tight text-white truncate">
                      {title}
                    </h2>
                    {activeCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#A2FF00] text-slate-950 shadow-2xs">
                        {activeCount} active
                      </span>
                    )}
                  </div>
                  {subtitle && (
                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{subtitle}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Body Content (Single Primary Scroll Container) */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 flex-1 min-h-0 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-750">
              {children}
            </div>

            {/* Sticky Sheet Footer Action Bar */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] z-10">
              {onClear ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear all</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800 hover:text-white transition-colors cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                {onApply && (
                  <button
                    type="button"
                    onClick={() => {
                      onApply();
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#A2FF00] hover:bg-[#8ee600] text-[#0A0A0A] text-xs font-extrabold transition-all cursor-pointer shadow-md min-h-[44px] flex items-center justify-center"
                  >
                    Show Results
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
