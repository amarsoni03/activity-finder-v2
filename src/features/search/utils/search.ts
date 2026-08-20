import { Activity, DeliveryFilter } from '../../../types';
import { calculateSearchRelevance } from '../../activities/utils/searchRelevance';

export {
  calculateLevenshteinDistance,
  matchToken,
  calculateSearchRelevance,
} from '../../activities/utils/searchRelevance';
export type {
  TokenMatchResult,
  SearchRelevanceResult,
} from '../../activities/utils/searchRelevance';

/**
 * Normalizes any domain or filter delivery mode value into canonical 3-way toggle representation:
 * 'In Person', 'Live Online' (covers Live Online, Online, Self-Paced, Hybrid), or 'All'.
 */
export function normalizeDeliveryMode(mode: DeliveryFilter | string | undefined | null): 'In Person' | 'Live Online' | 'All' {
  if (mode === 'Live Online' || mode === 'Online' || mode === 'Self-Paced' || mode === 'Hybrid') {
    return 'Live Online';
  }
  if (mode === 'In Person') {
    return 'In Person';
  }
  return 'All';
}

/**
 * Determines whether a delivery mode represents an online-only mode that ignores/clears Metro filtering.
 */
export function isOnlineDeliveryMode(mode: DeliveryFilter | string | undefined | null): boolean {
  return normalizeDeliveryMode(mode) === 'Live Online';
}

/**
 * Filter and score activities based on search query.
 */
export function searchActivities(activities: Activity[], query: string): Activity[] {
  if (!query.trim()) return activities;

  return activities
    .map((act) => {
      const searchRes = calculateSearchRelevance(act, query);
      return { activity: act, searchRes };
    })
    .filter(({ searchRes }) => searchRes.isMatch)
    .map(({ activity }) => activity);
}


