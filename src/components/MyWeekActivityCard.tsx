import React from 'react';
import { Clock, MapPin, Heart, ArrowRight } from 'lucide-react';
import { Activity } from '../types';
import { formatPrice } from '../utils/formatters';

interface MyWeekActivityCardProps {
  activity: Activity;
  isSaved: boolean;
  onToggleSave: (activityId: string) => void;
  onSelectActivity: (activity: Activity) => void;
  onQuickBook: (activity: Activity) => void;
}

export const MyWeekActivityCard: React.FC<MyWeekActivityCardProps> = ({
  activity,
  isSaved,
  onToggleSave,
  onSelectActivity,
  onQuickBook,
}) => {
  const seatsLeft = activity.seatsLeft || 3;
  const walkMins = activity.commuteInfo?.walkMinutes || activity.walkMinutes || 4;

  const primaryCtaText =
    activity.programType === 'Program'
      ? 'Reserve'
      : activity.isOneTimeWorkshop || activity.frequency?.includes('Workshop')
      ? 'Book'
      : 'Book';

  const scheduleText =
    activity.programType === 'Program'
      ? activity.weeklySchedule ||
        `${activity.schedule?.specificDaysText || 'Fixed Days'} • ${activity.startTime || '18:00'}`
      : `${activity.sessionDate || activity.startDate} • ${activity.startTime || '18:00'}`;

  return (
    <article
      onClick={() => onSelectActivity(activity)}
      className="flex gap-3 p-3 bg-white rounded-xl border border-slate-200/60 shadow-2xs active:bg-slate-50 cursor-pointer min-w-0 w-full max-w-full overflow-hidden"
    >
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(activity.id);
          }}
          className={`absolute top-1 right-1 p-1.5 rounded-full min-h-[32px] min-w-[32px] flex items-center justify-center ${
            isSaved ? 'bg-slate-900 text-[#A2FF00]' : 'bg-white/90 text-slate-600'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save activity'}
        >
          <Heart className={`w-3 h-3 ${isSaved ? 'fill-[#A2FF00]' : ''}`} />
        </button>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#074213] truncate">
          {activity.category}
        </span>
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
          {activity.title}
        </h3>
        <div className="flex items-center gap-1 text-[11px] text-slate-600 min-w-0">
          <Clock className="w-3 h-3 shrink-0 text-slate-400" />
          <span className="truncate">{scheduleText}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 min-w-0">
          <MapPin className="w-3 h-3 shrink-0 text-[#074213]" />
          <span className="truncate">
            {activity.metroStationName}
            {activity.metroLineName ? ` · ${activity.metroLineName.split('(')[0].trim()}` : ''}
            {' · '}{walkMins}m walk
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-slate-100">
          <span className="text-sm font-extrabold text-[#074213] truncate">
            {formatPrice(activity.price)}
            <span className="text-[10px] font-normal text-slate-400"> / {activity.priceUnit}</span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickBook(activity);
            }}
            className={`shrink-0 px-3 py-2 text-[11px] font-bold rounded-lg min-h-[36px] flex items-center gap-1 ${
              seatsLeft === 0
                ? 'bg-amber-400 text-slate-950'
                : 'bg-[#A2FF00] text-[#074213]'
            }`}
          >
            {seatsLeft === 0 ? 'Waitlist' : primaryCtaText}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
