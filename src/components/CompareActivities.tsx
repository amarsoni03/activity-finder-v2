import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Plus,
  Star,
  MapPin,
  Clock,
  Calendar,
  Users,
  Award,
  BookOpen,
  Sparkles,
  Zap,
  ChevronRight,
  ShieldCheck,
  Search,
  ArrowRight,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Activity } from '../types';
import { ProviderTrustBadge } from './ProviderTrustBadge';

export interface CompareActivitiesProps {
  /** Selected activities to compare (up to 4) */
  comparedActivities: Activity[];
  /** Full list of activities available to add to comparison */
  allActivities?: Activity[];
  /** Callback to remove an activity from comparison */
  onRemoveFromCompare: (activityId: string) => void;
  /** Callback to add an activity to comparison */
  onAddToCompare: (activityId: string) => void;
  /** Callback when user clicks to view an activity's details */
  onSelectActivity: (activity: Activity) => void;
  /** Callback when user clicks to reserve/book an activity */
  onBookActivity?: (activity: Activity) => void;
  /** Optional callback to close comparison modal/view */
  onClose?: () => void;
}

export const CompareActivities: React.FC<CompareActivitiesProps> = ({
  comparedActivities,
  allActivities = [],
  onRemoveFromCompare,
  onAddToCompare,
  onSelectActivity,
  onBookActivity,
  onClose,
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMobileCol, setActiveMobileCol] = useState(0);

  // Maximum 4 activities allowed for comparison
  const maxSlots = 4;
  const currentCount = comparedActivities.length;

  // Filter activities available to add (exclude currently compared ones)
  const availableToAdd = useMemo(() => {
    const comparedIds = new Set(comparedActivities.map((a) => a.id));
    return allActivities.filter(
      (a) =>
        !comparedIds.has(a.id) &&
        (searchQuery.trim() === '' ||
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.metroStationName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allActivities, comparedActivities, searchQuery]);

  // Compute highlights/badges for compared activities (e.g. Nearest Metro, Best Rating, Free Trial)
  const badges = useMemo(() => {
    if (comparedActivities.length < 2) return {};

    let minWalk = Infinity;
    let minWalkId = '';
    let maxRating = -1;
    let maxRatingId = '';
    let minPrice = Infinity;
    let minPriceId = '';

    comparedActivities.forEach((act) => {
      const walk = act.walkMinutes ?? act.walkTimeMinutes ?? 999;
      if (walk < minWalk) {
        minWalk = walk;
        minWalkId = act.id;
      }

      const rating = act.rating ?? 0;
      if (rating > maxRating) {
        maxRating = rating;
        maxRatingId = act.id;
      }

      const priceVal = act.trialPrice || act.price || act.regularPrice || 0;
      if (priceVal < minPrice) {
        minPrice = priceVal;
        minPriceId = act.id;
      }
    });

    return {
      nearestMetro: minWalkId,
      bestRating: maxRatingId,
      bestPrice: minPriceId,
    };
  }, [comparedActivities]);

  // Helper to determine if a specific attribute differs across all compared activities
  const isDifferent = (extractor: (a: Activity) => string | number | boolean | undefined) => {
    if (comparedActivities.length < 2) return false;
    const firstVal = JSON.stringify(extractor(comparedActivities[0]));
    return comparedActivities.some((a) => JSON.stringify(extractor(a)) !== firstVal);
  };

  // Difference checkers for each attribute row
  const diffs = {
    price: isDifferent((a) => a.price || a.regularPrice),
    trial: isDifferent((a) => a.trialPrice || a.isFreeTrial),
    schedule: isDifferent((a) => a.schedule?.specificDaysText || a.weeklySchedule || a.frequency),
    metro: isDifferent((a) => a.metroStationName || a.metroStation),
    walkTime: isDifferent((a) => a.walkMinutes || a.walkTimeMinutes),
    duration: isDifferent((a) => a.duration || a.schedule?.timeRange),
    audience: isDifferent((a) => a.audience),
    level: isDifferent((a) => a.level),
    rating: isDifferent((a) => a.rating),
    availability: isDifferent((a) => a.seatsLeft || a.availableSeats),
    outcomes: isDifferent((a) => (a.learningOutcomes || a.programOutcomes || []).length),
    included: isDifferent((a) => a.materialsIncluded || a.certificateOffered),
    provider: isDifferent((a) => a.studioName || a.studio?.name),
  };

  if (currentCount === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-xl mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <SlidersHorizontal className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Activities Selected for Comparison</h3>
        <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
          Compare up to 4 activities side-by-side to easily check schedules, pricing, metro locations, and inclusions before booking.
        </p>
        {allActivities.length > 0 && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Select Activities to Compare</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* --- Top Control Bar --- */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-green-50 text-green-700 rounded-2xl border border-green-100">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-900">Compare Activities</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                {currentCount} of {maxSlots}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Side-by-side comparison of schedule, metro location, pricing, and outcomes.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Highlight Differences Toggle */}
          {currentCount >= 2 && (
            <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 transition-colors">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 accent-green-600"
              />
              <span className="text-xs font-medium text-slate-700">Highlight differences</span>
            </label>
          )}

          {/* Add Activity Button (if slots open) */}
          {currentCount < maxSlots && allActivities.length > 0 && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Activity</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* --- Mobile Switcher Dots (Visible on mobile only) --- */}
      <div className="flex md:hidden items-center justify-between bg-slate-100 p-2 rounded-2xl">
        <span className="text-xs font-medium text-slate-600 px-2">Viewing Activity:</span>
        <div className="flex space-x-1.5 overflow-x-auto py-1">
          {comparedActivities.map((act, idx) => (
            <button
              key={act.id}
              onClick={() => setActiveMobileCol(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all truncate max-w-[120px] ${
                activeMobileCol === idx
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {act.title}
            </button>
          ))}
        </div>
      </div>

      {/* --- Comparison Hotel/Product Grid Container --- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              {/* --- HEADER CARDS ROW --- */}
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="w-48 p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50/90 backdrop-blur-xs z-20 border-r border-slate-200">
                  Activities ({currentCount}/{maxSlots})
                </th>
                {comparedActivities.map((act, idx) => {
                  const isVisibleOnMobile = activeMobileCol === idx;
                  return (
                    <th
                      key={act.id}
                      className={`p-4 align-top w-64 md:w-72 border-r border-slate-200 last:border-r-0 ${
                        !isVisibleOnMobile ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      <div className="relative bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-3 flex flex-col justify-between h-full group hover:border-green-300 transition-colors">
                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveFromCompare(act.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-slate-800 text-white rounded-full hover:bg-rose-600 transition-colors shadow-md z-10"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Card Top / Image & Badges */}
                        <div className="space-y-2">
                          <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100">
                            <img
                              src={act.image || act.coverImage}
                              alt={act.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white rounded-md">
                              {act.category}
                            </span>
                          </div>

                          {/* Quick Highlight Badges */}
                          <div className="flex flex-wrap gap-1">
                            {badges.nearestMetro === act.id && (
                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-md flex items-center space-x-1">
                                <Zap className="w-2.5 h-2.5" />
                                <span>Closest Metro</span>
                              </span>
                            )}
                            {badges.bestRating === act.id && (
                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-md flex items-center space-x-1">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                <span>Top Rated</span>
                              </span>
                            )}
                            {badges.bestPrice === act.id && (
                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-800 rounded-md flex items-center space-x-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Best Price</span>
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3
                            onClick={() => onSelectActivity(act)}
                            className="text-xs font-bold text-slate-900 hover:text-green-700 cursor-pointer line-clamp-2 transition-colors leading-snug"
                          >
                            {act.title}
                          </h3>
                        </div>

                        {/* Card Price & CTA */}
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Price</span>
                            <div className="flex items-baseline space-x-1">
                              <span className="text-sm font-black text-slate-900">
                                {act.price ? `₽${act.price.toLocaleString()}` : act.regularPrice ? `₽${act.regularPrice.toLocaleString()}` : 'Free'}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                /{act.priceUnit || 'session'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 pt-1">
                            <button
                              onClick={() => onSelectActivity(act)}
                              className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-xl transition-colors text-center"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => onBookActivity ? onBookActivity(act) : onSelectActivity(act)}
                              className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-xl transition-colors text-center shadow-xs"
                            >
                              Reserve
                            </button>
                          </div>
                        </div>
                      </div>
                    </th>
                  );
                })}

                {/* Open Slot (if less than 4) */}
                {currentCount < maxSlots && (
                  <th className="p-4 align-top w-60 border-r border-slate-200 hidden md:table-cell">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full h-full min-h-[260px] border-2 border-dashed border-slate-200 hover:border-green-400 rounded-2xl bg-slate-50/50 hover:bg-green-50/30 transition-all flex flex-col items-center justify-center p-4 text-center group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 group-hover:border-green-400 text-slate-400 group-hover:text-green-600 flex items-center justify-center mb-2 transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-green-700">
                        Add Activity #{currentCount + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        Compare up to 4 items side-by-side
                      </span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* --- SECTION 1: KEY SPECS & OVERVIEW --- */}
              <tr className="bg-slate-100/60">
                <td
                  colSpan={currentCount + 1 + (currentCount < maxSlots ? 1 : 0)}
                  className="py-2 px-4 text-[11px] font-black text-slate-700 uppercase tracking-wider"
                >
                  1. Activity Overview & Key Specs
                </td>
              </tr>

              {/* Price Row */}
              <tr className={highlightDifferences && diffs.price ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200 flex items-center space-x-1.5">
                  <span>Price & Trial</span>
                  {highlightDifferences && diffs.price && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" title="Differs" />
                  )}
                </td>
                {comparedActivities.map((act, idx) => (
                  <td
                    key={act.id}
                    className={`p-3 text-xs border-r border-slate-100 ${
                      activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-900">
                        {act.price ? `₽${act.price.toLocaleString()}` : `₽${act.regularPrice?.toLocaleString() || 0}`}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          ({act.priceUnit || 'per session'})
                        </span>
                      </div>
                      {act.trialPrice !== undefined && act.trialPrice > 0 ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 rounded-md">
                          Trial: ₽{act.trialPrice.toLocaleString()}
                        </span>
                      ) : act.isFreeTrial ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                          Free Trial Available
                        </span>
                      ) : null}
                    </div>
                  </td>
                ))}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* Rating Row */}
              <tr className={highlightDifferences && diffs.rating ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  Rating & Reviews
                </td>
                {comparedActivities.map((act, idx) => (
                  <td
                    key={act.id}
                    className={`p-3 text-xs border-r border-slate-100 ${
                      activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-extrabold text-slate-900 ml-1">{act.rating || 4.8}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">({act.reviewCount || 12} reviews)</span>
                    </div>
                  </td>
                ))}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* --- SECTION 2: SCHEDULE & LOCATION (PRODUCT CONSTITUTION PRIORITY) --- */}
              <tr className="bg-slate-100/60">
                <td
                  colSpan={currentCount + 1 + (currentCount < maxSlots ? 1 : 0)}
                  className="py-2 px-4 text-[11px] font-black text-slate-700 uppercase tracking-wider"
                >
                  2. Schedule & Metro Location
                </td>
              </tr>

              {/* Schedule Row */}
              <tr className={highlightDifferences && diffs.schedule ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Schedule</span>
                  </div>
                </td>
                {comparedActivities.map((act, idx) => {
                  const scheduleText =
                    act.schedule?.specificDaysText || act.weeklySchedule || act.schedule?.timeRange || 'Flexible Slots';
                  return (
                    <td
                      key={act.id}
                      className={`p-3 text-xs border-r border-slate-100 ${
                        activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">{scheduleText}</span>
                        <span className="text-[11px] text-slate-500 block">
                          {act.frequency || 'Regular'} • {act.startTime || '18:00'} - {act.endTime || '19:30'}
                        </span>
                        {act.startDate && (
                          <span className="text-[10px] text-green-700 font-medium block">
                            Starts: {act.startDate}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* Metro Station & Walk Time Row */}
              <tr className={highlightDifferences && (diffs.metro || diffs.walkTime) ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Metro Location</span>
                  </div>
                </td>
                {comparedActivities.map((act, idx) => {
                  const station = act.metroStationName || act.metroStation || 'Moscow Central';
                  const walk = act.walkMinutes ?? act.walkTimeMinutes ?? 5;
                  const color = act.metroLineColor || '#2563eb';
                  return (
                    <td
                      key={act.id}
                      className={`p-3 text-xs border-r border-slate-100 ${
                        activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-bold text-slate-900">{station}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          🚶 {walk} min walk from exit
                        </span>
                        {act.address && (
                          <span className="text-[10px] text-slate-400 block truncate" title={act.address}>
                            {act.address}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* Duration Row */}
              <tr className={highlightDifferences && diffs.duration ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration</span>
                  </div>
                </td>
                {comparedActivities.map((act, idx) => (
                  <td
                    key={act.id}
                    className={`p-3 text-xs border-r border-slate-100 ${
                      activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800">{act.duration || '90 min'} per class</span>
                      {act.programType && (
                        <span className="text-[10px] text-slate-500 block">
                          Format: {act.programType} {act.numberOfSessions ? `(${act.numberOfSessions} sessions)` : ''}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* --- SECTION 3: AUDIENCE, LEVEL & AVAILABILITY --- */}
              <tr className="bg-slate-100/60">
                <td
                  colSpan={currentCount + 1 + (currentCount < maxSlots ? 1 : 0)}
                  className="py-2 px-4 text-[11px] font-black text-slate-700 uppercase tracking-wider"
                >
                  3. Audience, Level & Availability
                </td>
              </tr>

              {/* Target Audience & Level Row */}
              <tr className={highlightDifferences && (diffs.audience || diffs.level) ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Audience & Level</span>
                  </div>
                </td>
                {comparedActivities.map((act, idx) => (
                  <td
                    key={act.id}
                    className={`p-3 text-xs border-r border-slate-100 ${
                      activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md">
                          {act.audience || 'All Audiences'}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-md">
                          {act.level || 'All Levels'}
                        </span>
                      </div>
                      {act.ageGroup && (
                        <span className="text-[10px] text-slate-400 block">Age: {act.ageGroup}</span>
                      )}
                    </div>
                  </td>
                ))}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* Availability & Seats Row */}
              <tr className={highlightDifferences && diffs.availability ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  Availability
                </td>
                {comparedActivities.map((act, idx) => {
                  const seats = act.seatsLeft ?? act.availableSeats ?? 4;
                  return (
                    <td
                      key={act.id}
                      className={`p-3 text-xs border-r border-slate-100 ${
                        activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        {seats <= 3 ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md inline-block">
                            Only {seats} spots left!
                          </span>
                        ) : (
                          <span className="text-slate-700 font-medium block">
                            {seats} spots open
                          </span>
                        )}
                        {act.instantBooking && (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>Instant Booking</span>
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* --- SECTION 4: OUTCOMES & WHAT'S INCLUDED --- */}
              <tr className="bg-slate-100/60">
                <td
                  colSpan={currentCount + 1 + (currentCount < maxSlots ? 1 : 0)}
                  className="py-2 px-4 text-[11px] font-black text-slate-700 uppercase tracking-wider"
                >
                  4. Outcomes & What's Included
                </td>
              </tr>

              {/* Learning Outcomes Row */}
              <tr className={highlightDifferences && diffs.outcomes ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Learning Outcomes</span>
                  </div>
                </td>
                {comparedActivities.map((act, idx) => {
                  const outcomes = act.learningOutcomes || act.programOutcomes || act.skillsGained || [];
                  return (
                    <td
                      key={act.id}
                      className={`p-3 text-xs border-r border-slate-100 ${
                        activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      {outcomes.length > 0 ? (
                        <ul className="space-y-1">
                          {outcomes.slice(0, 3).map((item, i) => (
                            <li key={i} className="flex items-start space-x-1.5 text-[11px] text-slate-700">
                              <Check className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">General practice session</span>
                      )}
                    </td>
                  );
                })}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* What's Included Row */}
              <tr className={highlightDifferences && diffs.included ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>What's Included</span>
                  </div>
                </td>
                {comparedActivities.map((act, idx) => (
                  <td
                    key={act.id}
                    className={`p-3 text-xs border-r border-slate-100 ${
                      activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    <div className="space-y-1 text-[11px]">
                      {act.materialsIncluded ? (
                        <div className="flex items-center space-x-1 text-slate-700 font-medium">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{act.materialsIncluded}</span>
                        </div>
                      ) : (
                        <div className="text-slate-500">Equipment / materials provided</div>
                      )}
                      {act.certificateOffered && (
                        <div className="inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 rounded-md border border-amber-100">
                          📜 Certificate of Completion
                        </div>
                      )}
                      {act.cancellationPolicy && (
                        <div className="text-[10px] text-slate-400 pt-0.5">
                          Policy: {act.cancellationPolicy}
                        </div>
                      )}
                    </div>
                  </td>
                ))}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* --- SECTION 5: PROVIDER (SECONDARY - PRODUCT CONSTITUTION RULE #8) --- */}
              <tr className="bg-slate-100/60">
                <td
                  colSpan={currentCount + 1 + (currentCount < maxSlots ? 1 : 0)}
                  className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  5. Studio / Provider Information (Secondary)
                </td>
              </tr>

              {/* Provider Row */}
              <tr className={highlightDifferences && diffs.provider ? 'bg-amber-50/60' : ''}>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  Studio & Instructor
                </td>
                {comparedActivities.map((act, idx) => {
                  const studio = act.studioName || act.studio?.name || 'Local Partner Studio';
                  const instructor = act.instructorName || act.teacher?.name;
                  return (
                    <td
                      key={act.id}
                      className={`p-3 text-xs border-r border-slate-100 ${
                        activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      <div className="space-y-0.5 text-[11px]">
                        <span className="font-semibold text-slate-700 block">{studio}</span>
                        {instructor && (
                          <span className="text-slate-500 block">Instructor: {instructor}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* Provider Trust Verification Row */}
              <tr>
                <td className="p-3 text-xs font-bold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-200">
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Trust Badges</span>
                  </div>
                </td>
                {comparedActivities.map((act, idx) => (
                  <td
                    key={act.id}
                    className={`p-3 text-xs border-r border-slate-100 ${
                      activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    <ProviderTrustBadge
                      variant="inline"
                      trust={act.providerTrust || act.teacher?.trust || act.studio?.trust}
                    />
                  </td>
                ))}
                {currentCount < maxSlots && <td className="p-3 hidden md:table-cell" />}
              </tr>

              {/* --- BOTTOM CTA ROW --- */}
              <tr className="bg-slate-50/80 border-t-2 border-slate-200">
                <td className="p-4 text-xs font-extrabold text-slate-700 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                  Action
                </td>
                {comparedActivities.map((act, idx) => (
                  <td
                    key={act.id}
                    className={`p-4 border-r border-slate-100 ${
                      activeMobileCol !== idx ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    <button
                      onClick={() => onBookActivity ? onBookActivity(act) : onSelectActivity(act)}
                      className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>Reserve Spot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
                {currentCount < maxSlots && <td className="p-4 hidden md:table-cell" />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD ACTIVITY SELECTION MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add Activity to Comparison</h3>
                <p className="text-xs text-slate-300">
                  Select an activity to compare side-by-side (Slot {currentCount + 1} of {maxSlots})
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities by title, category, or metro..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* Activity List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {availableToAdd.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No matching activities available to add.
                </div>
              ) : (
                availableToAdd.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-white border border-slate-200 hover:border-green-300 rounded-2xl flex items-center justify-between gap-3 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <img
                        src={act.image || act.coverImage}
                        alt={act.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {act.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{act.title}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span>{act.metroStationName || act.metroStation}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-800">
                            {act.price ? `₽${act.price.toLocaleString()}` : `₽${act.regularPrice || 0}`}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCompare(act.id);
                        setIsAddModalOpen(false);
                      }}
                      className="px-3 py-1.5 bg-green-800 hover:bg-green-900 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Compare</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
