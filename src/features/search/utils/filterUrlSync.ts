import { FilterState, PersonalizedTab } from '../types';
import { AudienceType, DeliveryFilter, TimeOfDay, DayOfWeek, Category, SkillLevel } from '../../../types/common';

export interface UrlSyncedState {
  filters: FilterState;
  tab: PersonalizedTab;
  view: 'list' | 'map' | 'schedule';
}

export function parseStateFromUrl(search: string, defaultFilters: FilterState): UrlSyncedState {
  const params = new URLSearchParams(search);
  const filters: FilterState = { ...defaultFilters };

  const q = params.get('q');
  if (q !== null) filters.searchKeyword = q;

  const category = params.get('category');
  if (category) filters.category = category as Category;

  const subSkill = params.get('subSkill');
  if (subSkill) filters.subSkill = subSkill;

  const audience = params.get('audience');
  if (audience && ['All', 'Adults', 'Children', 'Corporate'].includes(audience)) {
    filters.audience = audience as AudienceType;
  }

  const mode = params.get('mode');
  if (mode && ['All', 'In Person', 'Live Online', 'Self-Paced', 'Hybrid'].includes(mode)) {
    filters.deliveryMode = mode as DeliveryFilter;
  }

  const metroLine = params.get('metroLine');
  if (metroLine) filters.metroLineId = metroLine;

  const stations = params.get('stations');
  if (stations) {
    filters.metroStationIds = stations.split(',').filter(Boolean);
  }

  const time = params.get('time');
  if (time) {
    filters.timeOfDaySlots = time.split(',').filter(Boolean) as TimeOfDay[];
  }

  const days = params.get('days');
  if (days) {
    filters.daysOfWeek = days.split(',').filter(Boolean) as DayOfWeek[];
  }

  const level = params.get('level');
  if (level) filters.level = level as SkillLevel;

  const rating = params.get('rating');
  if (rating) {
    const num = parseFloat(rating);
    if (!isNaN(num)) filters.minRating = num;
  }

  const maxPrice = params.get('maxPrice');
  if (maxPrice) {
    const num = parseInt(maxPrice, 10);
    if (!isNaN(num)) filters.maxPrice = num;
  }

  const sort = params.get('sort');
  if (sort) filters.sortBy = sort as any;

  // Boolean flags
  if (params.has('verified')) filters.requireVerified = params.get('verified') === 'true';
  if (params.has('topRated')) filters.requireTopRated = params.get('topRated') === 'true';
  if (params.has('degree')) filters.requireDegree = params.get('degree') === 'true';
  if (params.has('checked')) filters.requireBackgroundChecked = params.get('checked') === 'true';

  // Tab & View
  let tab: PersonalizedTab = 'all';
  const tabParam = params.get('tab') as PersonalizedTab;
  if (
    tabParam &&
    [
      'all',
      'free-time',
      'trending-today',
      'tonight',
      'weekend',
      'starts-this-week',
      'near-metro',
      'free-trial',
      'popular',
    ].includes(tabParam)
  ) {
    tab = tabParam;
  }

  let view: 'list' | 'map' | 'schedule' = 'list';
  const viewParam = params.get('view');
  if (viewParam === 'list' || viewParam === 'map' || viewParam === 'schedule') {
    view = viewParam;
  }

  return { filters, tab, view };
}

export function syncStateToUrl(
  filters: FilterState,
  tab: PersonalizedTab,
  view: 'list' | 'map' | 'schedule',
  defaultFilters: FilterState
) {
  const params = new URLSearchParams();

  if (filters.searchKeyword && filters.searchKeyword.trim() !== '') {
    params.set('q', filters.searchKeyword.trim());
  }

  if (filters.category && filters.category !== defaultFilters.category) {
    params.set('category', filters.category);
  }

  if (filters.subSkill && filters.subSkill !== 'All') {
    params.set('subSkill', filters.subSkill);
  }

  if (filters.audience && filters.audience !== 'All') {
    params.set('audience', filters.audience);
  }

  if (filters.deliveryMode && filters.deliveryMode !== 'All') {
    params.set('mode', filters.deliveryMode);
  }

  if (filters.metroLineId && filters.metroLineId !== 'all') {
    params.set('metroLine', filters.metroLineId);
  }

  if (filters.metroStationIds && filters.metroStationIds.length > 0) {
    params.set('stations', filters.metroStationIds.join(','));
  }

  if (filters.timeOfDaySlots && filters.timeOfDaySlots.length > 0) {
    params.set('time', filters.timeOfDaySlots.join(','));
  }

  if (filters.daysOfWeek && filters.daysOfWeek.length > 0) {
    params.set('days', filters.daysOfWeek.join(','));
  }

  if (filters.level && filters.level !== 'All Levels') {
    params.set('level', filters.level);
  }

  if (filters.minRating && filters.minRating > 0) {
    params.set('rating', filters.minRating.toString());
  }

  if (filters.maxPrice && filters.maxPrice < 15000) {
    params.set('maxPrice', filters.maxPrice.toString());
  }

  if (filters.sortBy && filters.sortBy !== 'recommended') {
    params.set('sort', filters.sortBy);
  }

  if (filters.requireVerified) params.set('verified', 'true');
  if (filters.requireTopRated) params.set('topRated', 'true');
  if (filters.requireDegree) params.set('degree', 'true');
  if (filters.requireBackgroundChecked) params.set('checked', 'true');

  if (tab && tab !== 'all') {
    params.set('tab', tab);
  }

  if (view && view !== 'list') {
    params.set('view', view);
  }

  const queryString = params.toString();
  const newUrl =
    window.location.pathname +
    (queryString ? `?${queryString}` : '') +
    window.location.hash;

  window.history.replaceState(null, '', newUrl);
}
