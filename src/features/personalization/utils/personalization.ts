import {
  Activity,
  UserPreferences,
  UserFreeTime,
  DayOfWeek,
  TimeOfDay,
  CommuteInfo,
  GoalType,
  Category,
} from '../../../types';
import { METRO_STATIONS } from '../../metro/data/metroData';

export const DEFAULT_FREE_TIME: UserFreeTime = {
  Monday: ['Evening'],
  Tuesday: ['Evening'],
  Wednesday: ['Evening'],
  Thursday: ['Evening'],
  Friday: ['Evening'],
  Saturday: ['Morning', 'Afternoon'],
  Sunday: ['Morning', 'Afternoon'],
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  freeTime: DEFAULT_FREE_TIME,
  preferredMetroStationId: 'arbatskaya',
  preferredCategories: [],
  maxBudget: 15000,
  audience: 'All',
  selectedGoals: [],
};

const STORAGE_KEY = 'af_user_preferences';

export function getUserPreferences(): UserPreferences {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (!local) return DEFAULT_USER_PREFERENCES;
    const parsed = JSON.parse(local);
    return {
      ...DEFAULT_USER_PREFERENCES,
      ...parsed,
      freeTime: {
        ...DEFAULT_FREE_TIME,
        ...(parsed.freeTime || {}),
      },
    };
  } catch (e) {
    return DEFAULT_USER_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save user preferences', e);
  }
}

export function calculateScheduleMatch(activity: Activity, freeTime: UserFreeTime): number {
  const actDays = activity.schedule.days;
  const actTimeOfDay = activity.schedule.timeOfDay;

  if (!actDays || actDays.length === 0) return 70;

  let totalSlots = actDays.length;
  let matchedSlots = 0;

  actDays.forEach((day) => {
    const userSlotsForDay = freeTime[day] || [];
    if (userSlotsForDay.includes(actTimeOfDay)) {
      matchedSlots += 1;
    } else if (userSlotsForDay.length > 0) {
      // Partial credit if user is free on that day during another time slot
      matchedSlots += 0.4;
    }
  });

  const percentage = Math.round((matchedSlots / totalSlots) * 100);
  return Math.min(99, Math.max(25, percentage));
}

export function calculateCommute(activity: Activity, preferredStationId: string): CommuteInfo {
  const walkMinutes = activity.walkMinutes || activity.studio?.metroDistanceWalkMinutes || 5;

  let metroStops = 0;
  if (preferredStationId && preferredStationId !== 'all') {
    const prefStation = METRO_STATIONS.find((s) => s.id === preferredStationId);
    const actStation = METRO_STATIONS.find((s) => s.id === activity.metroStationId);

    if (prefStation && actStation) {
      if (prefStation.id === actStation.id) {
        metroStops = 0;
      } else if (prefStation.lineId === actStation.lineId) {
        // Approximate distance on same line
        metroStops = Math.max(1, Math.min(5, Math.abs(prefStation.name.length - actStation.name.length) % 4 + 1));
      } else {
        // Different line transfer
        metroStops = Math.max(2, Math.min(7, Math.abs(prefStation.name.length - actStation.name.length) % 5 + 3));
      }
    }
  }

  const travelByMetroMinutes = metroStops * 3;
  const totalTravelMinutes = travelByMetroMinutes + walkMinutes;

  return {
    walkMinutes,
    metroStops,
    totalTravelMinutes: Math.max(walkMinutes, totalTravelMinutes),
  };
}

export function calculateSeatsLeft(activity: Activity): number {
  let charSum = 0;
  for (let i = 0; i < activity.id.length; i++) {
    charSum += activity.id.charCodeAt(i);
  }
  const seats = (charSum % 6) + 1; // 1 to 6 seats left
  return seats;
}

export function mapGoalToCategories(goal: GoalType): Category[] {
  switch (goal) {
    case 'Learn':
      return ['Languages', 'Technology', 'Business', 'Personal Development'];
    case 'Exercise':
      return ['Sports', 'Fitness', 'Dance'];
    case 'Create':
      return ['Arts', 'Crafts', 'Dance', 'Music'];
    case 'Relax':
      return ['Fitness', 'Music', 'Arts', 'Personal Development'];
    case 'Meet People':
      return ['Dance', 'Languages', 'Crafts', 'Sports'];
    case 'Career':
      return ['Business', 'Technology', 'Languages'];
    case 'Kids':
      return ['Arts', 'Sports', 'Music', 'Dance'];
    case 'All Goals':
    default:
      return [];
  }
}

export function isActivityNewThisWeek(activity: Activity): boolean {
  if (activity.tags.some(t => ['new', 'hot', 'popular', 'trending', 'featured'].includes(t.toLowerCase()))) {
    return true;
  }
  // Deterministic calculation based on ID for consistency
  let sum = 0;
  for (let i = 0; i < activity.id.length; i++) {
    sum += activity.id.charCodeAt(i);
  }
  return sum % 3 === 0;
}

export function calculateNextSessionDate(activity: Activity): string {
  const dayStr = activity.schedule.specificDaysText || activity.schedule.days.join(', ');
  const timeStr = activity.schedule.timeRange;
  if (activity.startDate && !activity.startDate.toLowerCase().includes('ongoing')) {
    return `${activity.startDate} (${dayStr}) • ${timeStr}`;
  }
  return `Next session (${dayStr}) • ${timeStr}`;
}

export function enrichActivity(activity: Activity, prefs: UserPreferences): Activity {
  const scheduleMatchPercentage = calculateScheduleMatch(activity, prefs.freeTime);
  const commuteInfo = calculateCommute(activity, prefs.preferredMetroStationId);
  const seatsLeft = calculateSeatsLeft(activity);
  const isFreeTrial = activity.price <= 25 || activity.tags.some(t => t.toLowerCase().includes('trial') || t.toLowerCase().includes('free'));
  const isNewThisWeek = isActivityNewThisWeek(activity);

  return {
    ...activity,
    scheduleMatchPercentage,
    commuteInfo,
    seatsLeft,
    isFreeTrial,
    isNewThisWeek,
  };
}

export function rankActivities(activities: Activity[], prefs: UserPreferences): Activity[] {
  const enriched = activities.map((act) => enrichActivity(act, prefs));

  return enriched.sort((a, b) => {
    // 1. Schedule Match %
    const matchDiff = (b.scheduleMatchPercentage || 0) - (a.scheduleMatchPercentage || 0);
    if (Math.abs(matchDiff) >= 15) return matchDiff;

    // 2. Metro Proximity (Total travel time)
    const commuteDiff = (a.commuteInfo?.totalTravelMinutes || 0) - (b.commuteInfo?.totalTravelMinutes || 0);
    if (Math.abs(commuteDiff) >= 5) return commuteDiff;

    // 3. Availability (urgent seat count first)
    const seatsDiff = (a.seatsLeft || 0) - (b.seatsLeft || 0);
    if (Math.abs(seatsDiff) >= 3) return seatsDiff;

    // 4. Rating
    const ratingDiff = b.rating - a.rating;
    if (Math.abs(ratingDiff) >= 0.2) return ratingDiff;

    // 5. Price
    return a.price - b.price;
  });
}
