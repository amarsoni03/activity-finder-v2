import React, { useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onApply?: () => void;
}

export const MobileSearchSheet: React.FC<MobileSearchSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onApply,
}) => {
  // Prevent background scrolling when sheet is open (iOS & Mobile web compatible)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const originalOverflow = document.body.style.overflow;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.overflow = originalOverflow;
        if (scrollY) {
          window.scrollTo(0, scrollY);
        }
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-16 sm:pb-4">
          {/* Backdrop overlay - restrained dark blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
          />

          {/* Sheet Modal Container (Light Theme) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl h-[80vh] max-h-[620px] flex flex-col z-10 overflow-hidden border border-slate-200/90"
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0 bg-slate-50/90 backdrop-blur-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#074213]/10 flex items-center justify-center text-[#074213]">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-[#074213]" />
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-950">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-200/70 rounded-full transition-colors cursor-pointer"
                aria-label="Close sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Body Content */}
            <div className="px-4 pt-4 pb-2 sm:px-5 sm:pt-5 sm:pb-3 flex-1 min-h-0 flex flex-col overflow-hidden">
              {children}
            </div>

            {/* Sheet Footer Action (Only rendered if onApply callback is provided) */}
            {onApply && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-200/70 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApply();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#A2FF00] hover:bg-[#8ee600] text-[#0A0A0A] text-xs font-extrabold transition-colors cursor-pointer shadow-md"
                >
                  Show Results
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
