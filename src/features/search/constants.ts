import { FilterState, PersonalizedTab } from './types';

export const DEFAULT_FILTERS: FilterState = {
  category: 'All Categories',
  programTypeFilter: 'All',
  subSkill: 'All',
  audience: 'All',
  deliveryMode: 'All',
  language: 'All',
  metroLineId: 'all',
  metroStationIds: [],
  regularity: 'All',
  timeOfDaySlots: [],
  daysOfWeek: [],
  level: 'All Levels',
  minRating: 0,
  maxPrice: 15000,
  requireDegree: false,
  requireVerified: false,
  requireBackgroundChecked: false,
  requireTopRated: false,
  minTeacherExperience: 0,
  searchKeyword: '',
  goal: 'All Goals',
  sortBy: 'recommended',
};

export const QUICK_FILTER_TABS: { id: PersonalizedTab; label: string }[] = [
  { id: 'all', label: 'All Activities' },
  { id: 'free-time', label: 'Fits Free Time' },
  { id: 'trending-today', label: 'Trending Today' },
  { id: 'tonight', label: 'Tonight' },
  { id: 'weekend', label: 'This Weekend' },
  { id: 'near-metro', label: 'Near Metro' },
  { id: 'starts-this-week', label: 'Starts This Week' },
  { id: 'free-trial', label: 'Free Trial' },
  { id: 'popular', label: 'Popular' },
];
