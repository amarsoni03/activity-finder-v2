import { DayOfWeek, TimeOfDay, Category, AudienceType, GoalType } from '../../types/common';

export type UserFreeTime = Record<DayOfWeek, TimeOfDay[]>;

export interface CommuteInfo {
  walkMinutes: number;
  metroStops: number;
  totalTravelMinutes: number;
}

export interface UserPreferences {
  freeTime: UserFreeTime;
  preferredMetroStationId: string;
  preferredCategories: Category[];
  maxBudget: number;
  audience: AudienceType;
  selectedGoals: GoalType[];
}
