import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Frown } from 'lucide-react';
import { motion } from 'motion/react';
import { Activity } from '../types';
import { ActivityCard } from './ActivityCard';

interface ActivityGridProps {
  activities: Activity[];
  savedIds: string[];
  onToggleSave: (activityId: string) => void;
  onSelectActivity: (activity: Activity) => void;
  onQuickBook: (activity: Activity) => void;
  onOpenFilters: () => void;
  activeFilterCount?: number;
  sortBy?: string;
  onSortChange?: (sortBy: string) => void;
  title?: string;
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities,
  savedIds,
  onToggleSave,
  onSelectActivity,
  onQuickBook,
  onOpenFilters,
  activeFilterCount = 0,
  sortBy = 'recommended',
  onSortChange,
  title = 'Available Activities',
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.03,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Showing {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          {onSortChange && (
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 transition-all">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          )}

          {/* Filter Trigger Button */}
          <button
            type="button"
            onClick={onOpenFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white hover:bg-black rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#A2FF00] text-slate-950 text-[10px] font-extrabold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      {activities.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activities.map((activity) => (
            <motion.div key={activity.id} variants={itemVariants}>
              <ActivityCard
                activity={activity}
                isSaved={savedIds.includes(activity.id)}
                onToggleSave={onToggleSave}
                onSelectActivity={onSelectActivity}
                onQuickBook={onQuickBook}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="py-16 text-center space-y-4 max-w-md mx-auto"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Frown className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No activities match your filters</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your category, metro station, or time filters to discover more options.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
