import {
  Activity,
  RankingContext,
  RankingOptions,
  RankingWeights,
  ScoringBreakdown,
  BackendRankingRequest,
  BackendRankingResponse,
} from '../types';
import { calculateSearchRelevance } from './search';
import { calculateCommute, calculateScheduleMatch } from './personalization';

/**
 * Default ranking weights adhering strictly to requested priority order:
 * 1. Exact search relevance (35)
 * 2. Metro proximity (15)
 * 3. Schedule match (12)
 * 4. Starts soon (10)
 * 5. Available seats (8)
 * 6. Rating (6)
 * 7. Review count (5)
 * 8. Popularity (4)
 * 9. Featured (3)
 * 10. New listing boost (2)
 */
export const DEFAULT_RANKING_WEIGHTS: RankingWeights = {
  exactSearchRelevance: 35,
  metroProximity: 15,
  scheduleMatch: 12,
  startsSoon: 10,
  availableSeats: 8,
  rating: 6,
  reviewCount: 5,
  popularity: 4,
  featured: 3,
  newListingBoost: 2,
};

/**
 * Calculates start urgency score (0 - 100).
 */
export function calculateStartsSoonScore(activity: Activity): number {
  const startStr = (activity.startDate || '').toLowerCase();
  const nextSess = (activity.nextSession || '').toLowerCase();

  if (startStr.includes('today') || nextSess.includes('today')) return 100;
  if (startStr.includes('tomorrow') || nextSess.includes('tomorrow')) return 90;
  if (startStr.includes('this week') || startStr.includes('ongoing') || startStr.includes('aug')) return 80;
  if (startStr.includes('sep') || startStr.includes('next week')) return 60;

  return 40; // Default baseline
}

/**
 * Evaluates individual activity score with breakdown based on priority order, boosts & penalties.
 */
export function calculateActivityScore(
  activity: Activity,
  context: RankingContext = {},
  customWeights?: Partial<RankingWeights>
): { totalScore: number; breakdown: ScoringBreakdown } {
  const w: RankingWeights = { ...DEFAULT_RANKING_WEIGHTS, ...(customWeights || {}) };

  // 1. Exact Search Relevance (Factor 1)
  const searchKeyword = context.searchKeyword || context.filterState?.searchKeyword || '';
  const searchResult = calculateSearchRelevance(activity, searchKeyword);
  const searchRelevanceScore = (searchResult.score / 100) * w.exactSearchRelevance;

  // 2. Metro Proximity (Factor 2)
  const prefStationId =
    context.selectedMetroStationId ||
    context.userPreferences?.preferredMetroStationId ||
    (context.filterState?.metroStationIds?.[0] || 'all');

  const commute = activity.commuteInfo || calculateCommute(activity, prefStationId);
  const totalTravel = commute.totalTravelMinutes || activity.walkMinutes || 10;
  // Inverse score: 0 mins travel = 100%, 30+ mins = 0%
  const proximityNormalized = Math.max(0, Math.min(100, (30 - totalTravel) / 30 * 100));
  const metroProximityScore = (proximityNormalized / 100) * w.metroProximity;

  // 3. Schedule Match (Factor 3)
  const freeTime = context.userPreferences?.freeTime;
  const matchPct = freeTime
    ? calculateScheduleMatch(activity, freeTime)
    : (activity.scheduleMatchPercentage || 70);
  const scheduleMatchScore = (matchPct / 100) * w.scheduleMatch;

  // 4. Starts Soon (Factor 4)
  const startsSoonNormalized = calculateStartsSoonScore(activity);
  const startsSoonScore = (startsSoonNormalized / 100) * w.startsSoon;

  // 5. Available Seats (Factor 5)
  const seatsLeft = activity.seatsLeft ?? activity.availableSeats ?? 5;
  const totalSeats = activity.totalSeats || 10;
  const seatRatio = seatsLeft / totalSeats;
  // Healthy availability (3-6 seats) gets top score. Zero seats gets 0.
  const seatsNormalized = seatsLeft === 0 ? 0 : seatRatio >= 0.2 && seatRatio <= 0.8 ? 100 : 60;
  const availableSeatsScore = (seatsNormalized / 100) * w.availableSeats;

  // 6. Rating (Factor 6)
  const ratingNormalized = Math.max(0, Math.min(100, ((activity.rating - 3.0) / 2.0) * 100));
  const ratingScore = (ratingNormalized / 100) * w.rating;

  // 7. Review Count (Factor 7)
  const reviewsNormalized = Math.min(100, (activity.reviewCount / 50) * 100);
  const reviewCountScore = (reviewsNormalized / 100) * w.reviewCount;

  // 8. Popularity (Factor 8)
  const popNormalized = Math.min(100, activity.popularityScore || (activity.rating * activity.reviewCount) / 2);
  const popularityScore = (popNormalized / 100) * w.popularity;

  // 9. Featured (Factor 9)
  const featuredScore = activity.featured ? w.featured : 0;

  // 10. New Listing Boost (Factor 10)
  const newListingScore = (activity.newActivity || activity.isNewThisWeek) ? w.newListingBoost : 0;

  // --- BOOSTS ---
  let boostScore = 0;

  // Boost: Activities starting this week (+10 pts)
  if (startsSoonNormalized >= 80) {
    boostScore += 10;
  }

  // Boost: Activities with trial (+8 pts)
  const hasTrial = activity.isFreeTrial || activity.trialPrice > 0 || activity.tags.some((t) => t.toLowerCase().includes('trial'));
  if (hasTrial) {
    boostScore += 8;
  }

  // Boost: Highly rated (+8 pts)
  if (activity.rating >= 4.8) {
    boostScore += 8;
  }

  // Boost: Near selected metro (+10 pts)
  if (totalTravel <= 8 || (activity.walkMinutes && activity.walkMinutes <= 5)) {
    boostScore += 10;
  }

  // Boost: Matching available time (+10 pts)
  if (matchPct >= 85) {
    boostScore += 10;
  }

  // --- PENALTIES ---
  let penaltyScore = 0;

  // Penalty: Nearly full (-15 pts if <= 1 seat left)
  if (seatsLeft <= 1) {
    penaltyScore += 15;
  }

  // Penalty: Far away (-15 pts if > 20 mins travel)
  if (totalTravel > 20 || (activity.walkMinutes && activity.walkMinutes > 15)) {
    penaltyScore += 15;
  }

  // Penalty: Old listings with low popularity (-10 pts)
  if (!activity.newActivity && !activity.isNewThisWeek && activity.reviewCount < 5) {
    penaltyScore += 10;
  }

  // Penalty: Low ratings (-20 pts if rating < 4.2)
  if (activity.rating < 4.2) {
    penaltyScore += 20;
  }

  // Final aggregate weighted score
  const totalScore = Math.max(
    0,
    Number(
      (
        searchRelevanceScore +
        metroProximityScore +
        scheduleMatchScore +
        startsSoonScore +
        availableSeatsScore +
        ratingScore +
        reviewCountScore +
        popularityScore +
        featuredScore +
        newListingScore +
        boostScore -
        penaltyScore
      ).toFixed(2)
    )
  );

  const breakdown: ScoringBreakdown = {
    searchRelevanceScore,
    metroProximityScore,
    scheduleMatchScore,
    startsSoonScore,
    availableSeatsScore,
    ratingScore,
    reviewCountScore,
    popularityScore,
    featuredScore,
    newListingScore,
    boostScore,
    penaltyScore,
    totalScore,
  };

  return { totalScore, breakdown };
}

/**
 * Result Quality: Category Diversification.
 * Prevents showing 10 yoga classes consecutively in recommended results.
 * Interleaves items while preserving high overall quality.
 */
export function applyCategoryDiversity(
  activities: Activity[],
  maxConsecutive: number = 2
): Activity[] {
  if (activities.length <= maxConsecutive) return activities;

  const result: Activity[] = [];
  const pool = [...activities];

  while (pool.length > 0) {
    let selectedIdx = 0;

    // Check last N items in result to see if they share the same category
    if (result.length >= maxConsecutive) {
      const lastCat = result[result.length - 1].category;
      let consecutiveCount = 0;
      for (let i = result.length - 1; i >= 0; i--) {
        if (result[i].category === lastCat) {
          consecutiveCount++;
        } else {
          break;
        }
      }

      if (consecutiveCount >= maxConsecutive) {
        // Find highest ranked item in pool with a DIFFERENT category
        const diffCatIdx = pool.findIndex((item) => item.category !== lastCat);
        if (diffCatIdx !== -1) {
          selectedIdx = diffCatIdx;
        }
      }
    }

    result.push(pool[selectedIdx]);
    pool.splice(selectedIdx, 1);
  }

  return result;
}

/**
 * Intelligent Ranking Engine Entry Point.
 */
export function rankActivitiesWithEngine(
  activities: Activity[],
  context: RankingContext = {},
  options: RankingOptions = {}
): Activity[] {
  const scored = activities.map((act) => {
    const { totalScore, breakdown } = calculateActivityScore(act, context, options.weights);
    return { activity: act, totalScore, breakdown };
  });

  // Sort by calculated total weighted score descending
  scored.sort((a, b) => b.totalScore - a.totalScore);

  let rankedList = scored.map((item) => item.activity);

  // Apply category diversification for Recommended sort if keyword search is not active or not specific
  const isSearchActive = Boolean(context.searchKeyword || context.filterState?.searchKeyword);
  const isCategoryFilterActive =
    context.filterState?.category &&
    context.filterState.category !== 'All Categories' &&
    context.filterState.category !== ('All' as any);

  const shouldDiversify =
    options.applyCategoryDiversity !== false && !isSearchActive && !isCategoryFilterActive;

  if (shouldDiversify) {
    rankedList = applyCategoryDiversity(rankedList, options.maxConsecutiveSameCategory || 2);
  }

  return rankedList;
}

/**
 * Future-Ready Architecture API Contract.
 * Allows replacing client-side ranking with remote backend server ranking seamlessly.
 */
export async function rankActivitiesBackend(
  request: BackendRankingRequest
): Promise<BackendRankingResponse> {
  // Client-side fallback implementation matching backend interface contract
  const mockActivities = request.activityIds.map((id) => ({ id } as Activity));
  const scoredMap: Record<string, number> = {};
  const breakdownMap: Record<string, ScoringBreakdown> = {};

  mockActivities.forEach((act) => {
    const { totalScore, breakdown } = calculateActivityScore(act, request.context, request.weights);
    scoredMap[act.id] = totalScore;
    breakdownMap[act.id] = breakdown;
  });

  const sortedIds = [...request.activityIds].sort((a, b) => (scoredMap[b] || 0) - (scoredMap[a] || 0));

  return {
    rankedActivityIds: sortedIds,
    scores: scoredMap,
    breakdowns: breakdownMap,
  };
}
