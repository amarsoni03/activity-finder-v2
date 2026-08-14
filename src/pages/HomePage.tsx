import React from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  MapPin,
  Calendar,
  ArrowUpDown,
  X,
  Sparkles,
} from 'lucide-react';
import {
  Activity,
  FilterState,
  PersonalizedTab,
} from '../types';
import { HeroSearch } from '../features/search/components/HeroSearch';
import { SidebarFilters } from '../components/layout/SidebarFilters';
import { ActivityCard } from '../features/activities/components/ActivityCard';
import { MetroMapView } from '../features/metro/components/MetroMapView';
import { WeeklyScheduleView } from '../features/schedule/components/WeeklyScheduleView';

interface HomePageProps {
  activities: Activity[];
  filteredActivities: Activity[];
  visibleActivities: Activity[];
  filters: FilterState;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  savedIds: string[];
  toggleSave: (activityId: string) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: any) => void;
  activePersonalizedTab: PersonalizedTab;
  setActivePersonalizedTab: (tab: PersonalizedTab) => void;
  activeView: 'list' | 'map' | 'schedule';
  setActiveView: (view: 'list' | 'map' | 'schedule') => void;
  isLoading: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
  openActivityDetail: (activity: Activity) => void;
  handleQuickBook: (activity: Activity) => void;
  summaryPills: { label: string; type: string }[];
  onOpenAiMatchmaker: () => void;
  onOpenFreeTimePlanner: () => void;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (open: boolean) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activities,
  filteredActivities,
  visibleActivities,
  filters,
  updateFilters,
  resetFilters,
  savedIds,
  toggleSave,
  activeNavTab,
  setActiveNavTab,
  activePersonalizedTab,
  setActivePersonalizedTab,
  activeView,
  setActiveView,
  isLoading,
  hasMore,
  handleLoadMore,
  openActivityDetail,
  handleQuickBook,
  summaryPills,
  onOpenAiMatchmaker,
  onOpenFreeTimePlanner,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
}) => {
  return (
    <>
      {/* Primary Search Hero Box */}
      <HeroSearch
        filters={filters}
        activities={activities}
        onApplySearch={(newF) => {
          if (activeNavTab !== 'explore') {
            setActiveNavTab('explore');
          }
          updateFilters(newF);
        }}
        onSelectActivity={(act) => openActivityDetail(act)}
        onOpenAiMatchmaker={onOpenAiMatchmaker}
        onOpenFreeTimePlanner={onOpenFreeTimePlanner}
      />

      {/* Main Page Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-12 flex-1 w-full space-y-10">
        {/* Ambient subtle boundary softening line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent -mt-2" />

        {/* Shared layout: sidebar + toolbar persist across list / map / schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          {/* Desktop Left Sidebar Filters (Sticky) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20 pt-0">
            <SidebarFilters
              filters={filters}
              onFilterChange={updateFilters}
              onResetFilters={resetFilters}
              resultsCount={filteredActivities.length}
            />
          </div>

          {/* Mobile Filter Toggle Drawer Trigger */}
          <div className="lg:hidden bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900">Filter Results</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs hover:bg-slate-800 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Open Filters</span>
            </button>
          </div>

          {/* Main Content Area (Right Side - 2-Column Desktop Grid) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Result Header & Current Search Summary Box */}
            <div
              id="results-section"
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4 sticky top-20 z-30 scroll-mt-24"
            >
              {/* Top Row: Total Count, View Toggle & Premium Sort */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                {/* Prominent Activity Count */}
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {filteredActivities.length} Activities
                  </h2>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 bg-[#A2FF00] text-[#111827] rounded-full shadow-2xs">
                    Available Near You
                  </span>
                </div>

                {/* Right Controls: View Switcher & Premium Sort */}
                <div className="flex items-center space-x-3 flex-wrap">
                  {/* Minimalist View Switcher */}
                  <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-full text-xs relative z-10">
                    <button
                      type="button"
                      onClick={() => setActiveView('list')}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                        activeView === 'list'
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">List</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('map')}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                        activeView === 'map'
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Metro Map</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('schedule')}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                        activeView === 'schedule'
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Schedule</span>
                    </button>
                  </div>

                  {/* Premium Sort Dropdown */}
                  <div className="flex items-center space-x-1.5 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      id="homepage-sort-select"
                      aria-label="Sort activities by"
                      value={filters.sortBy}
                      onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                      className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none min-h-[40px] cursor-pointer"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="starts-soon">Starts Soon</option>
                      <option value="nearest">Nearest</option>
                      <option value="highest-rated">Highest Rated</option>
                      <option value="lowest-price">Lowest Price</option>
                      <option value="newest">Newest</option>
                      <option value="popular">Popular</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Current Search Summary Pills Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider mr-1">
                    Current Search:
                  </span>
                  {summaryPills.map((pill, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (pill.type === 'category') updateFilters({ category: 'All Categories' });
                        else if (pill.type === 'metro' || pill.type === 'metroLine')
                          updateFilters({ metroStationIds: [], metroLineId: 'all' });
                        else if (pill.type === 'time') updateFilters({ timeOfDaySlots: [] });
                        else if (pill.type === 'days') updateFilters({ daysOfWeek: [] });
                        else if (pill.type === 'audience') updateFilters({ audience: 'All' });
                        else if (pill.type === 'keyword') updateFilters({ searchKeyword: '' });
                        else {
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }
                      }}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full font-medium text-xs transition-colors cursor-pointer ${
                        pill.type === 'default'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200/80'
                          : 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-800'
                      }`}
                      title={pill.type === 'default' ? 'Click to adjust search' : `Remove "${pill.label}" filter`}
                    >
                      <span>{pill.label}</span>
                      {pill.type !== 'default' && (
                        <X className="w-3 h-3 text-slate-300 hover:text-white" />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                    setIsMobileFiltersOpen(true);
                  }}
                  className="text-xs font-bold text-slate-900 hover:text-emerald-700 underline cursor-pointer ml-auto"
                >
                  Edit Search
                </button>
              </div>
            </div>

            {activeView === 'list' && (
              <>
                {/* Quick Filter Tabs */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xs after:pointer-events-none after:absolute after:right-0 after:top-0 after:bottom-0 after:w-12 after:bg-gradient-to-l after:from-[#F9FAFB] after:to-transparent">
                  <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex items-center space-x-1.5 min-w-max text-xs font-medium pr-12">
                      {[
                        { id: 'all', label: 'All Activities' },
                        { id: 'free-time', label: 'Fits Free Time' },
                        { id: 'trending-today', label: 'Trending Today' },
                        { id: 'tonight', label: 'Tonight' },
                        { id: 'weekend', label: 'This Weekend' },
                        { id: 'near-metro', label: 'Near Metro' },
                        { id: 'starts-this-week', label: 'Starts This Week' },
                        { id: 'free-trial', label: 'Free Trial' },
                        { id: 'popular', label: 'Popular' },
                      ].map((tab) => {
                        const isActive = activePersonalizedTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActivePersonalizedTab(tab.id as PersonalizedTab)}
                            className={`px-4 py-2 rounded-xl transition-all min-h-[38px] whitespace-nowrap cursor-pointer ${
                              isActive
                                ? 'bg-slate-900 text-white shadow-2xs font-bold'
                                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 font-semibold'
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Skeleton Cards or Empty State or Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-2xs animate-pulse flex flex-col justify-between h-[480px]"
                      >
                        <div>
                          <div className="h-56 w-full bg-slate-200 rounded-2xl mb-4" />
                          <div className="h-3 w-1/4 bg-slate-200 rounded mb-2" />
                          <div className="h-6 w-3/4 bg-slate-200 rounded mb-4" />
                          <div className="h-16 w-full bg-slate-100 rounded-2xl mb-4" />
                          <div className="h-4 w-1/2 bg-slate-200 rounded" />
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="h-4 w-1/3 bg-slate-200 rounded" />
                          <div className="h-10 w-28 bg-slate-200 rounded-xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredActivities.length === 0 ? (
                  /* EMPTY STATE FALLBACK */
                  <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/60 text-center space-y-6 shadow-2xs">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8" />
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">No matching activities found</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
                        We couldn't find any activities matching your exact filters. Try relaxing your schedule or location criteria.
                      </p>
                    </div>

                    {/* Actionable Recovery Options */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => updateFilters({ metroStationIds: [], metroLineId: 'all' })}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Try another metro
                      </button>
                      <button
                        onClick={() => updateFilters({ timeOfDaySlots: [], daysOfWeek: [] })}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Remove time filter
                      </button>
                      <button
                        onClick={() => setActiveView('map')}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Explore nearby stations
                      </button>
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Clear All Filters
                      </button>
                    </div>

                    {/* Suggested Activities Section */}
                    <div className="pt-8 border-t border-slate-100 space-y-4 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
                        Suggested Activities You Might Like
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activities.slice(0, 2).map((act) => (
                          <ActivityCard
                            key={act.id}
                            activity={act}
                            isSaved={savedIds.includes(act.id)}
                            onToggleSave={toggleSave}
                            onSelectActivity={(activity) => openActivityDetail(activity)}
                            onQuickBook={handleQuickBook}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 2-COLUMN DESKTOP GRID RESULTS */
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                      {visibleActivities.map((act, index) => (
                        <React.Fragment key={act.id}>
                          {/* Insert "You May Also Like" Inline Recommendation after every 8-10 cards */}
                          {index > 0 && index % 8 === 0 && (
                            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 my-2">
                              <div className="space-y-2 text-center md:text-left">
                                <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-[#A2FF00] uppercase tracking-wider bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Curated For You</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                                  You May Also Like
                                </h3>
                                <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-normal">
                                  Browse popular courses with available slots nearby matching your current schedule interests.
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  window.scrollTo({ top: 350, behavior: 'smooth' });
                                  onOpenAiMatchmaker();
                                }}
                                className="px-6 py-3.5 bg-[#A2FF00] hover:bg-[#91E600] text-[#111827] text-xs font-black rounded-2xl transition-all shadow-md shrink-0 cursor-pointer min-h-[44px]"
                              >
                                Get AI Recommendations
                              </button>
                            </div>
                          )}

                          <ActivityCard
                            activity={act}
                            isSaved={savedIds.includes(act.id)}
                            onToggleSave={toggleSave}
                            onSelectActivity={(activity) => openActivityDetail(activity)}
                            onQuickBook={handleQuickBook}
                          />
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Pagination / Load More */}
                    {hasMore && (
                      <div className="pt-8 text-center">
                        <button
                          type="button"
                          onClick={handleLoadMore}
                          className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-extrabold text-sm border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[48px]"
                        >
                          Load More Activities ({filteredActivities.length - visibleActivities.length} remaining)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ROUTE 2: METRO MAP VIEW */}
            {activeView === 'map' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
                <MetroMapView
                  activities={filteredActivities}
                  onSelectStation={(stId) => {
                    updateFilters({ metroStationIds: [stId] });
                    setActiveView('list');
                  }}
                  onSelectActivity={(act) => openActivityDetail(act)}
                  selectedStationId={filters.metroStationIds?.[0]}
                />
              </div>
            )}

            {/* ROUTE 3: WEEKLY SCHEDULE VIEW */}
            {activeView === 'schedule' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
                <WeeklyScheduleView
                  activities={filteredActivities}
                  onSelectActivity={(act) => openActivityDetail(act)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
