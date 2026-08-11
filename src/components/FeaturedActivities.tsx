import React from 'react';
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  Heart,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Footprints,
} from 'lucide-react';
import { Activity } from '../types';

interface FeaturedActivitiesProps {
  activities: Activity[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectActivity: (activity: Activity) => void;
  onQuickBook: (activity: Activity) => void;
}

export const FeaturedActivities: React.FC<FeaturedActivitiesProps> = ({
  activities,
  savedIds,
  onToggleSave,
  onSelectActivity,
  onQuickBook,
}) => {
  if (!activities || activities.length === 0) return null;

  const spotlightActivity = activities[0];
  const horizontalActivities = activities.slice(1, 4);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#074213] flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 fill-[#074213]" />
            CURATED SELECTION
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Featured Experiences
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs font-normal">
          Handpicked top-rated courses around Moscow metro lines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 1. Large Spotlight Hero Card (Lg: 7 cols) */}
        {spotlightActivity && (
          <div
            onClick={() => onSelectActivity(spotlightActivity)}
            className="lg:col-span-7 group relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between border border-slate-800"
          >
            {/* Image Container with Ambient Gradient */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={spotlightActivity.image}
                alt={spotlightActivity.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 bg-[#A2FF00] text-[#074213] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
                  ★ FEATURED SPOTLIGHT
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(spotlightActivity.id);
                  }}
                  className="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-900 transition-colors cursor-pointer border border-white/20"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      savedIds.includes(spotlightActivity.id)
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-white'
                    }`}
                  />
                </button>
              </div>

              {/* Quick Info Bar Overlay at Bottom of Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 font-medium">
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold border border-white/20">
                  {spotlightActivity.category}
                </span>
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-slate-950/80 rounded-full text-[11px] font-bold backdrop-blur-md text-[#A2FF00]">
                  <Star className="w-3.5 h-3.5 fill-[#A2FF00]" />
                  <span>{spotlightActivity.rating}</span>
                  <span className="text-slate-400">({spotlightActivity.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Spotlight Content Area */}
            <div className="p-6 space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#A2FF00] transition-colors leading-tight mb-2">
                  {spotlightActivity.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 font-normal leading-relaxed">
                  {spotlightActivity.shortDescription}
                </p>
              </div>

              {/* Details Row: Schedule & Metro */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/80 text-slate-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#A2FF00] shrink-0" />
                  <span className="truncate">
                    {spotlightActivity.metroStationName} ({spotlightActivity.walkTimeMinutes} min walk)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#A2FF00] shrink-0" />
                  <span className="truncate">
                    {spotlightActivity.schedule.days.join(', ')} • {spotlightActivity.schedule.timeOfDay}
                  </span>
                </div>
              </div>

              {/* Bottom CTA & Pricing */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PRICE</span>
                  <span className="text-xl sm:text-2xl font-black text-[#A2FF00]">
                    {spotlightActivity.price} ₽
                    <span className="text-xs font-normal text-slate-400 ml-1">/ session</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickBook(spotlightActivity);
                  }}
                  className="px-6 py-2.5 bg-[#074213] hover:bg-[#05320e] text-white text-xs sm:text-sm font-extrabold rounded-full transition-all flex items-center space-x-2 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>Reserve Spot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Horizontal Mini Spotlight Cards Stack (Lg: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {horizontalActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="group relative rounded-2xl bg-white p-3.5 border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex gap-4 items-center"
            >
              {/* Thumbnail Image */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(act.id);
                  }}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      savedIds.includes(act.id) ? 'fill-rose-500 text-rose-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-md truncate">
                    {act.category}
                  </span>
                  <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{act.rating}</span>
                  </div>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#074213] transition-colors truncate">
                  {act.title}
                </h4>

                <div className="flex items-center space-x-2 text-[11px] text-slate-500 truncate">
                  <MapPin className="w-3 h-3 text-[#074213] shrink-0" />
                  <span className="truncate">{act.metroStationName} • {act.walkTimeMinutes} min walk</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-extrabold text-[#074213]">
                    {act.price} ₽
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickBook(act);
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-[11px] font-bold rounded-full transition-colors cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
