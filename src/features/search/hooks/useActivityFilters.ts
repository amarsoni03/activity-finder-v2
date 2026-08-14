import { useState, useEffect, useMemo, useCallback } from 'react';
import { FilterState, PersonalizedTab } from '../types';
import { Activity, UserPreferences } from '../../../types';
import { DEFAULT_FILTERS } from '../constants';
import { parseStateFromUrl, syncStateToUrl } from '../utils/filterUrlSync';
import { calculateSearchRelevance } from '../utils/search';
import { mapGoalToCategories } from '../../personalization/utils/personalization';
import { rankActivitiesWithEngine } from '../../activities/utils/ranking';

export function useActivityFilters(
  enrichedActivities: Activity[],
  userPrefs: UserPreferences,
  onActivitySelectByHash?: (activityId: string | null) => void
) {
  // Initial URL state synchronization
  const initialUrlState = useMemo(() => {
    if (typeof window === 'undefined') {
      return { filters: DEFAULT_FILTERS, tab: 'all' as PersonalizedTab, view: 'list' as const };
    }
    return parseStateFromUrl(window.location.search, DEFAULT_FILTERS);
  }, []);

  const [filters, setFilters] = useState<FilterState>(initialUrlState.filters);
  const [activePersonalizedTab, setActivePersonalizedTab] = useState<PersonalizedTab>(initialUrlState.tab);
  const [activeView, setActiveView] = useState<'list' | 'map' | 'schedule'>(initialUrlState.view);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state to URL
  useEffect(() => {
    syncStateToUrl(filters, activePersonalizedTab, activeView, DEFAULT_FILTERS);
  }, [filters, activePersonalizedTab, activeView]);

  // Listen to browser Back/Forward & URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseStateFromUrl(window.location.search, DEFAULT_FILTERS);
      setFilters(parsed.filters);
      setActivePersonalizedTab(parsed.tab);
      setActiveView(parsed.view);

      const hash = window.location.hash;
      if (hash.startsWith('#activity/')) {
        const id = hash.replace('#activity/', '');
        if (onActivitySelectByHash) onActivitySelectByHash(id);
      } else {
        if (onActivitySelectByHash) onActivitySelectByHash(null);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [onActivitySelectByHash]);

  // Reset pagination when filters or tab change
  useEffect(() => {
    setVisibleCount(10);
  }, [filters, activePersonalizedTab]);

  const updateFilters = useCallback((newPartial: Partial<FilterState>) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, ...newPartial }));
    setTimeout(() => setIsLoading(false), 200);
  }, []);

  const resetFilters = useCallback(() => {
    setIsLoading(true);
    setFilters(DEFAULT_FILTERS);
    setActivePersonalizedTab('all');
    setTimeout(() => setIsLoading(false), 200);
  }, []);

  // Filtered & Ranked Activities Engine
  const filteredActivities = useMemo(() => {
    const result = enrichedActivities.filter((act) => {
      // Program Type Filter
      if (
        filters.programTypeFilter &&
        filters.programTypeFilter !== 'All' &&
        act.programType !== filters.programTypeFilter
      ) {
        return false;
      }

      // Goal Filter
      if (filters.goal && filters.goal !== 'All Goals') {
        const goalCategories = mapGoalToCategories(filters.goal);
        if (goalCategories.length > 0 && !goalCategories.includes(act.category)) {
          return false;
        }
      }

      // Category
      if (filters.category !== 'All Categories' && filters.category !== ('All' as any) && act.category !== filters.category) {
        return false;
      }

      // SubSkill
      if (filters.subSkill !== 'All' && act.subSkill !== filters.subSkill) {
        return false;
      }

      // Audience
      if (
        filters.audience !== 'All' &&
        act.audience !== filters.audience &&
        act.audience !== 'All'
      ) {
        return false;
      }

      // Delivery Mode (Offline vs Online)
      if (filters.deliveryMode && filters.deliveryMode !== 'All') {
        if (filters.deliveryMode === 'In Person') {
          if (act.deliveryMode !== 'In Person' && act.deliveryMode !== 'Hybrid') {
            return false;
          }
        } else if (filters.deliveryMode === 'Live Online') {
          if (
            act.deliveryMode !== 'Live Online' &&
            act.deliveryMode !== 'Self-Paced' &&
            act.deliveryMode !== 'Hybrid'
          ) {
            return false;
          }
        } else if (act.deliveryMode !== filters.deliveryMode) {
          return false;
        }
      }

      // Language Filter
      if (filters.language && filters.language !== 'All') {
        const actLang = act.language || 'Russian';
        if (filters.language === 'English') {
          if (!actLang.toLowerCase().includes('english')) {
            return false;
          }
        } else if (filters.language === 'Russian') {
          if (!actLang.toLowerCase().includes('russian')) {
            return false;
          }
        } else if (filters.language === 'English & Russian') {
          if (!actLang.toLowerCase().includes('english') || !actLang.toLowerCase().includes('russian')) {
            return false;
          }
        }
      }

      // Metro Line
      if (filters.metroLineId !== 'all' && act.metroLineId !== filters.metroLineId) {
        return false;
      }

      // Metro Station
      if (filters.metroStationIds.length > 0 && !filters.metroStationIds.includes(act.metroStationId)) {
        return false;
      }

      // Regularity
      if (filters.regularity !== 'All' && act.frequency !== filters.regularity) {
        return false;
      }

      // Time of Day Slots
      if (
        filters.timeOfDaySlots.length > 0 &&
        !filters.timeOfDaySlots.includes(act.schedule.timeOfDay)
      ) {
        return false;
      }

      // Days of Week
      if (
        filters.daysOfWeek.length > 0 &&
        !filters.daysOfWeek.some((d) => act.schedule.days.includes(d))
      ) {
        return false;
      }

      // Level
      if (filters.level !== 'All Levels' && act.level !== filters.level && act.level !== 'All Levels') {
        return false;
      }

      // Rating
      if (filters.minRating > 0 && act.rating < filters.minRating) {
        return false;
      }

      // Price
      if (act.price > filters.maxPrice) {
        return false;
      }

      // Degree requirement
      if (filters.requireDegree && !act.teacher?.qualifications?.degree) {
        return false;
      }

      // Provider Trust requirements
      const trust = act.providerTrust || act.teacher?.trust || act.studio?.trust;
      if (filters.requireVerified && !trust?.isVerified) {
        return false;
      }
      if (filters.requireBackgroundChecked && !trust?.isBackgroundChecked) {
        return false;
      }
      if (filters.requireTopRated && (!trust?.isTopRated && act.rating < 4.8)) {
        return false;
      }

      // Min Teacher Experience
      if (
        filters.minTeacherExperience > 0 &&
        (act.teacher?.qualifications?.experienceYears || 0) < filters.minTeacherExperience
      ) {
        return false;
      }

      // Search keyword with typo tolerance & multi-field matching
      if (filters.searchKeyword.trim() !== '') {
        const searchRes = calculateSearchRelevance(act, filters.searchKeyword);
        if (!searchRes.isMatch) {
          return false;
        }
      }

      // Personalized Discovery Section Tabs
      if (activePersonalizedTab === 'free-time') {
        if ((act.scheduleMatchPercentage || 0) < 70) return false;
      } else if (activePersonalizedTab === 'trending-today') {
        if ((act.popularityScore || 0) < 55 && (act.reviewCount || 0) < 15 && (act.rating || 0) < 4.7) return false;
      } else if (activePersonalizedTab === 'tonight') {
        if (act.schedule.timeOfDay !== 'Evening') return false;
      } else if (activePersonalizedTab === 'weekend') {
        if (!act.schedule.days.includes('Saturday') && !act.schedule.days.includes('Sunday')) return false;
      } else if (activePersonalizedTab === 'starts-this-week') {
        if (!act.startDate?.toLowerCase().includes('ongoing') && !act.startDate?.toLowerCase().includes('sep') && !act.startDate?.toLowerCase().includes('starts')) return false;
      } else if (activePersonalizedTab === 'near-metro') {
        if ((act.commuteInfo?.walkMinutes || act.walkMinutes) > 5) return false;
      } else if (activePersonalizedTab === 'free-trial') {
        if (!act.isFreeTrial && act.price > 30) return false;
      } else if (activePersonalizedTab === 'popular') {
        if (act.rating < 4.8 || act.reviewCount < 25) return false;
      }

      return true;
    });

    // Intelligent Ranking & Sorting
    const sortVal = filters.sortBy as string;
    if (sortVal === 'starting-soon' || sortVal === 'starts-soon' || sortVal === 'start-date') {
      return result.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
    }
    if (sortVal === 'nearest-metro' || sortVal === 'nearest' || sortVal === 'distance') {
      return result.sort((a, b) => (a.commuteInfo?.walkMinutes || a.walkMinutes || 5) - (b.commuteInfo?.walkMinutes || b.walkMinutes || 5));
    }
    if (sortVal === 'lowest-price' || sortVal === 'price-low') {
      return result.sort((a, b) => a.price - b.price);
    }
    if (sortVal === 'best-rated' || sortVal === 'highest-rated' || sortVal === 'rating') {
      return result.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
    }
    if (sortVal === 'newest') {
      return result.sort((a, b) => (b.newActivity ? 1 : 0) - (a.newActivity ? 1 : 0) || b.id.localeCompare(a.id));
    }
    if (sortVal === 'most-popular' || sortVal === 'popular') {
      return result.sort((a, b) => (b.popularityScore || b.reviewCount || 0) - (a.popularityScore || a.reviewCount || 0));
    }

    // Default (Recommended): 10-Factor Intelligent Weighted Ranking Engine with Category Diversification
    return rankActivitiesWithEngine(result, {
      userPreferences: userPrefs,
      filterState: filters,
      searchKeyword: filters.searchKeyword,
    });
  }, [enrichedActivities, filters, userPrefs, activePersonalizedTab]);

  const visibleActivities = useMemo(() => {
    return filteredActivities.slice(0, visibleCount);
  }, [filteredActivities, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 10);
  }, []);

  const summaryPills = useMemo(() => {
    const pills: { label: string; type: string }[] = [];

    if (filters.searchKeyword) {
      pills.push({ label: `Keyword: "${filters.searchKeyword}"`, type: 'keyword' });
    }
    if (filters.category && filters.category !== 'All Categories') {
      pills.push({ label: filters.category, type: 'category' });
    }
    if (filters.metroStationIds && filters.metroStationIds.length > 0) {
      pills.push({
        label: `${filters.metroStationIds.length} Stations`,
        type: 'metro',
      });
    } else if (filters.metroLineId && filters.metroLineId !== 'all') {
      pills.push({ label: 'Metro Line', type: 'metroLine' });
    }
    if (filters.timeOfDaySlots && filters.timeOfDaySlots.length > 0) {
      pills.push({ label: filters.timeOfDaySlots.join(', '), type: 'time' });
    }
    if (filters.daysOfWeek && filters.daysOfWeek.length > 0) {
      pills.push({
        label:
          filters.daysOfWeek.length === 2 &&
          filters.daysOfWeek.includes('Saturday') &&
          filters.daysOfWeek.includes('Sunday')
            ? 'Weekends'
            : `${filters.daysOfWeek.length} Days`,
        type: 'days',
      });
    }
    if (filters.audience && filters.audience !== 'All') {
      pills.push({ label: filters.audience, type: 'audience' });
    }

    if (pills.length === 0) {
      pills.push({ label: 'All Moscow Activities', type: 'default' });
    }

    return pills;
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    activePersonalizedTab,
    setActivePersonalizedTab,
    activeView,
    setActiveView,
    visibleCount,
    visibleActivities,
    filteredActivities,
    isLoading,
    loadMore,
    summaryPills,
  };
}
