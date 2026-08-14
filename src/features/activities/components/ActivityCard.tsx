import React from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Star,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Activity } from '../types';
import { formatPrice } from '../../../utils/formatters';
import { ProviderTrustBadge } from './ProviderTrustBadge';

interface ActivityCardProps {
  activity: Activity;
  isSaved: boolean;
  onToggleSave: (activityId: string) => void;
  onSelectActivity: (activity: Activity) => void;
  onQuickBook: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isSaved,
  onToggleSave,
  onSelectActivity,
  onQuickBook,
}) => {
  const seatsLeft = activity.seatsLeft || 3;
  const walkMins = activity.commuteInfo?.walkMinutes || activity.walkMinutes || 4;

  const listingType = activity.programType === 'Program'
    ? 'Course'
    : (activity.isOneTimeWorkshop || activity.frequency?.includes('Workshop'))
    ? 'Workshop'
    : 'Class';

  const primaryCtaText = activity.programType === 'Program'
    ? 'Reserve Spot'
    : (activity.isOneTimeWorkshop || activity.frequency?.includes('Workshop'))
    ? 'Book Workshop'
    : 'Book Class';

  const scheduleText = activity.programType === 'Program'
    ? (activity.weeklySchedule || `${activity.schedule?.specificDaysText || 'Fixed Days'} • ${activity.startTime || '18:00'}–${activity.endTime || '19:30'}`)
    : `${activity.sessionDate || activity.startDate} • ${activity.startTime || '18:00'}–${activity.endTime || '19:30'}`;

  // Delivery format logic: scheduled activities are In Person or Live Online
  const isOnline = activity.deliveryMode === 'Live Online' || activity.isOnline;
  const isHybrid = activity.deliveryMode === 'Hybrid';
  const hasFixedSchedule = Boolean(
    activity.sessionDate ||
    activity.startDate ||
    activity.startTime ||
    activity.schedule ||
    activity.weeklySchedule ||
    activity.metroStationId ||
    activity.metroStationName
  );

  const displayDeliveryMode = isOnline
    ? 'Live Online'
    : isHybrid
    ? 'Hybrid'
    : (activity.deliveryMode === 'Self-Paced' && !hasFixedSchedule)
    ? 'Self-Paced'
    : 'In Person';

  const deliveryIcon = displayDeliveryMode === 'Live Online'
    ? '💻'
    : displayDeliveryMode === 'Hybrid'
    ? '🔄'
    : displayDeliveryMode === 'Self-Paced'
    ? '🎬'
    : '📍';

  return (
    <motion.article
      onClick={() => onSelectActivity(activity)}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/60 hover:border-slate-300 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group cursor-pointer overflow-hidden relative h-full min-w-0 w-full"
    >
      <div className="flex-1 flex flex-col">
        {/* Cover Image Container (Fixed Height h-56 for 100% Layout Consistency) */}
        <div className="relative h-44 sm:h-56 w-full rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 bg-slate-100 shrink-0">
          <img
            src={activity.coverImage || activity.image}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

          {/* Top Floating Header Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-medium tracking-wide rounded-full backdrop-blur-md bg-black/45 text-white shadow-sm border border-white/20">
              {activity.category}
            </span>

            <motion.button
              whileTap={{ scale: 0.88 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(activity.id);
              }}
              className={`p-2 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                isSaved
                  ? 'bg-slate-900 text-[#A2FF00]'
                  : 'bg-white/85 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-white/40'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save activity'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#A2FF00]' : ''}`} />
            </motion.button>
          </div>

          {/* Bottom Info Bar: Availability & Price */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between gap-1 text-white text-xs font-bold min-w-0">
            {seatsLeft === 0 ? (
              <span className="bg-amber-950/90 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-amber-300 border border-amber-500/30 shrink-0">
                Full
              </span>
            ) : (
              <span className="bg-slate-950/80 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium text-slate-200 border border-white/10 shrink-0">
                {seatsLeft} left
              </span>
            )}

            <span className="bg-slate-950/90 backdrop-blur-md px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold text-[#A2FF00] border border-white/10 shrink-0 max-w-[55%] truncate">
              {formatPrice(activity.price)}
            </span>
          </div>
        </div>

        {/* Listing Type Tagline & Delivery Format Badge */}
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#074213]">
            {listingType}
          </span>
          <span className="text-slate-300">•</span>
          <span className="bg-neutral-100 text-neutral-600 text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-neutral-200/70 shrink-0">
            <span>{deliveryIcon}</span>
            <span>{displayDeliveryMode}</span>
          </span>
        </div>

        {/* Activity Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-[#074213] transition-colors line-clamp-2 sm:min-h-[52px]">
          {activity.title}
        </h3>

        {/* Highest Priority Metadata: When & Where */}
        <div className="space-y-1.5 text-xs text-slate-700 mb-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
          
          {/* WHEN: Schedule & Time */}
          <div className="flex items-center space-x-2 font-semibold text-slate-900">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{scheduleText}</span>
          </div>

          {/* START DATE (if course/program) */}
          {activity.programType === 'Program' && activity.startDate && (
            <div className="flex items-center space-x-2 text-slate-600 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Starts {activity.startDate}</span>
            </div>
          )}

          {/* WHERE: Metro Station, Line & Walk time */}
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-[#074213] shrink-0 mt-0.5" />
            <span className="min-w-0 break-words">
              <span className="font-semibold text-slate-800">{activity.metroStationName}</span>
              {activity.metroLineName && (
                <span className="text-slate-500"> · {activity.metroLineName.split('(')[0].trim()}</span>
              )}
              <span className="text-slate-600 font-medium"> ({walkMins}m walk)</span>
            </span>
          </div>

        </div>

        {/* Secondary Metadata: Level, Rating, Duration */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 mb-3 font-medium">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold shrink-0">{activity.level}</span>
          <div className="flex items-center gap-1 font-bold text-slate-800 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{activity.rating}</span>
            <span className="text-slate-600 font-medium">({activity.reviewCount})</span>
          </div>
          {activity.duration && (
            <span className="shrink-0">{activity.duration}</span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal min-h-[40px]">
          {activity.shortDescription}
        </p>
      </div>

      {/* Footer: Quiet Provider Info + Micro Trust Badge + Single Primary CTA */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:justify-between text-xs mt-auto w-full">
        <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5 flex-1 min-w-0 pr-2">
          <span className="truncate flex-1 min-w-0">
            Taught by {activity.instructorName || activity.teacher?.name || 'Instructor'}
          </span>
          <ProviderTrustBadge
            variant="micro"
            trust={activity.providerTrust || activity.teacher?.trust || activity.studio?.trust}
            className="shrink-0"
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickBook(activity);
          }}
          className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 text-xs font-black rounded-xl transition-all shrink-0 min-h-[44px] flex items-center justify-center cursor-pointer shadow-2xs ${
            seatsLeft === 0
              ? 'bg-amber-400 hover:bg-amber-300 text-[#111827]'
              : 'bg-[#A2FF00] hover:bg-[#91E600] text-[#111827]'
          }`}
        >
          <span>{seatsLeft === 0 ? 'Join Waitlist' : primaryCtaText}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1 text-[#111827]" />
        </button>
      </div>
    </motion.article>
  );
};
