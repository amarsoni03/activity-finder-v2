import { Activity } from '../../../types';
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

