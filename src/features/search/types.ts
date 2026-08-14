import {
  Category,
  AudienceType,
  ProgramTypeFilter,
  RegularityType,
  TimeOfDay,
  DayOfWeek,
  SkillLevel,
  DeliveryFilter,
  GoalType
} from '../../types/common';
import { UserPreferences } from '../personalization/types';

export type LanguageFilter = 'All' | 'English' | 'Russian' | 'English & Russian';

export type SortOption =
  | 'recommended'
  | 'starts-soon'
  | 'nearest'
  | 'highest-rated'
  | 'lowest-price'
  | 'newest'
  | 'popular'
  | 'distance'
  | 'price-low'
  | 'rating'
  | 'start-date'
  | 'match'
  | 'best-rated'
  | 'nearest-metro'
  | 'most-popular';

export interface FilterState {
  category: Category;
  programTypeFilter: ProgramTypeFilter;
  subSkill: string;
  audience: AudienceType;
  deliveryMode: DeliveryFilter;
  language: LanguageFilter;
  metroLineId: string;
  metroStationIds: string[];
  regularity: RegularityType;
  timeOfDaySlots: TimeOfDay[];
  daysOfWeek: DayOfWeek[];
  level: SkillLevel;
  minRating: number;
  maxPrice: number;
  requireDegree: boolean;
  minTeacherExperience: number;
  searchKeyword: string;
  goal: GoalType;
  requireVerified?: boolean;
  requireBackgroundChecked?: boolean;
  requireTopRated?: boolean;
  minYearsActive?: number;
  sortBy: SortOption;
}

export type PersonalizedTab =
  | 'all'
  | 'free-time'
  | 'trending-today'
  | 'tonight'
  | 'weekend'
  | 'starts-this-week'
  | 'near-metro'
  | 'free-trial'
  | 'popular';

// Re-export ranking types from activities domain
export type {
  RankingWeights,
  ScoringBreakdown,
  RankingContext,
  RankingOptions,
  BackendRankingRequest,
  BackendRankingResponse,
} from '../activities/types';

