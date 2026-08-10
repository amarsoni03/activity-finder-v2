import React from 'react';
import { X, Heart, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Activity } from '../types';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedActivities: Activity[];
  onRemoveSaved: (activityId: string) => void;
  onSelectActivity: (activity: Activity) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedActivities,
  onRemoveSaved,
  onSelectActivity,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-[#A2FF00] fill-[#A2FF00]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Saved Activities</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {savedActivities.length === 0
                  ? 'Bookmark activities to review later'
                  : `${savedActivities.length} bookmarked`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {savedActivities.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No saved activities yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Tap the heart on any activity card to save it here for quick access.
              </p>
            </div>
          ) : (
            savedActivities.map((act) => (
              <article
                key={act.id}
                onClick={() => {
                  onClose();
                  onSelectActivity(act);
                }}
                className="group relative flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 bg-white hover:shadow-md transition-all cursor-pointer"
              >
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#074213]">
                    {act.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5 line-clamp-2 group-hover:text-[#074213] transition-colors">
                    {act.title}
                  </h3>
                  <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#074213] shrink-0" />
                      <span className="truncate">{act.metroStationName}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{act.schedule.specificDaysText}</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-bold text-[#074213] opacity-0 group-hover:opacity-100 transition-opacity">
                    View details
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSaved(act.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-900 text-[#A2FF00] hover:bg-slate-800 transition-colors shadow-2xs"
                  title="Remove from saved"
                  aria-label="Remove from saved"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
