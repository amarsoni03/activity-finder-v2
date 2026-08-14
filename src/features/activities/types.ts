export type {
  Category,
  AudienceType,
  ActivityType,
  ProviderType,
  ProgramType,
  RegularityType,
  TimeOfDay,
  DayOfWeek,
  SkillLevel,
  DeliveryMode,
  MeetingPlatform,
  BookingType,
  GoalType
} from '../../types/common';
import {
  Category,
  AudienceType,
  ActivityType,
  ProviderType,
  ProgramType,
  RegularityType,
  TimeOfDay,
  DayOfWeek,
  SkillLevel,
  DeliveryMode,
  MeetingPlatform,
  BookingType,
  GoalType
} from '../../types/common';
import { CommuteInfo, UserPreferences } from '../personalization/types';

export interface TeacherQualifications {
  degree: string;
  certificates: string[];
  experienceYears: number;
}

export interface ProviderTrustInfo {
  isVerified?: boolean;             // Identity & venue address verified
  isPremium?: boolean;              // Premium partner studio
  isTopRated?: boolean;             // Consistently 4.8+ rating & high volume
  isCertified?: boolean;            // Degrees & professional credentials verified
  isBackgroundChecked?: boolean;    // Safety & background check verified
  yearsActive?: number;             // Years of active operating/teaching experience
  verificationDate?: string;        // e.g. "Verified Jan 2026"
  licenseNumber?: string;           // e.g. "LIC-8842-RU"
}

export interface TeacherInfo {
  name: string;
  avatar: string;
  title: string;
  qualifications: TeacherQualifications;
  bio: string;
  rating: number;
  trust?: ProviderTrustInfo;
}

export interface StudioInfo {
  name: string;
  address: string;
  metroDistanceWalkMinutes: number;
  website?: string;
  trust?: ProviderTrustInfo;
}

export interface ScheduleSlot {
  days: DayOfWeek[];
  timeOfDay: TimeOfDay;
  timeRange: string; // e.g., "19:00 - 20:30"
  specificDaysText: string; // e.g., "Tuesdays & Thursdays"
}

export interface SessionItem {
  id: string;
  title: string;
  sessionDate: string; // e.g. "2026-08-15" or "Sat, Aug 15"
  sessionTime: string; // e.g. "14:00 - 16:00"
  duration: string;
  availableSeats: number;
  totalSeats: number;
  location?: string;
  description?: string;
}

export interface ReviewBreakdown {
  instructor: number;
  activityQuality: number;
  value: number;
  location: number;
  organization: number;
  atmosphere: number;
  facilities: number;
  beginnerFriendly: number;
  kidsFriendly?: number;
  corporateFriendly?: number;
}

export interface Review {
  id: string;
  activityId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  breakdown?: ReviewBreakdown;
  comment: string;
  date: string;
  isVerifiedAttendee?: boolean;
  attendedDate?: string;
  positiveTags?: string[];
  photos?: string[];
  videos?: string[];
  helpfulCount?: number;
  userHelpfulVoted?: boolean;
}

export interface ReviewSummary {
  overallRating: number;
  totalReviews: number;
  recommendationPercentage: number;
  repeatBookingPercentage: number;
  averageBreakdown: ReviewBreakdown;
  popularTags: { tag: string; count: number }[];
  insights: string[];
}

export interface Booking {
  id: string;
  activityId: string;
  activityTitle: string;
  category: Category;
  deliveryMode?: DeliveryMode;
  meetingPlatform?: string;
  metroStationName: string;
  scheduleText: string;
  priceText: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  selectedDate: string;
  bookedAt: string;
  accentColor: 'soft-green' | 'warm-yellow' | 'gentle-pink';
}

export interface WaitlistEntry {
  id: string;
  activityId: string;
  activityTitle: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  position?: number;
  joinedAt?: string;
  requestedDate?: string;
  createdAt?: string;
  status: 'pending' | 'notified' | 'fulfilled';
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'pdf';
  size?: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'provider';
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  attachments?: MessageAttachment[];
  quickTopic?: string;
}

export interface ActivityConversation {
  id: string;
  activityId: string;
  activityTitle: string;
  activityImage: string;
  metroStation: string;
  price: string;
  providerName: string;
  providerAvatar: string;
  responseTimeText?: string;
  lastUpdated: string;
  status: 'answered' | 'awaiting_reply' | 'closed';
  messages: ConversationMessage[];
}

export interface InstructorInquiry {
  id: string;
  activityId: string;
  activityTitle: string;
  teacherName: string;
  userName: string;
  userEmail: string;
  message: string;
  sentAt: string;
}

export interface AiMatchResult {
  activityId: string;
  matchPercentage: number;
  reason: string;
  highlights: string[];
}

export interface Activity {
  // --- Identity ---
  id: string;
  title: string;
  category: Category;
  subSkill: string;
  audience: AudienceType;

  // --- Delivery Architecture (Program vs Session) ---
  programType: ProgramType;

  // --- Program Specific Attributes ---
  startDate: string;
  endDate?: string;
  weeklySchedule?: string;
  numberOfSessions?: number;
  programOutcomes?: string[];

  // --- Session Specific Attributes ---
  sessionDate?: string;
  sessionTime?: string;
  sessions?: SessionItem[];

  // --- Common Scheduling & Seats ---
  frequency: RegularityType;
  weekdays: DayOfWeek[];
  startTime: string;
  endTime: string;
  duration: string;
  nextSession: string;
  availableSessions: string[];
  availableSeats: number;
  totalSeats: number;

  // --- Location ---
  metroLine: string;
  metroStation: string;
  walkTimeMinutes: number;
  travelTimeMinutes: number;
  address: string;

  // --- Pricing ---
  trialPrice: number;
  regularPrice: number;
  currency: string;

  // --- Learning / Outcomes ---
  level: SkillLevel;
  language: string;
  ageGroup: string;
  classSize: string;
  learningOutcomes: string[];
  shortDescription: string;
  fullDescription: string;

  // --- Discovery ---
  tags: string[];
  goals: GoalType[];
  popularityScore: number;
  featured: boolean;
  newActivity: boolean;

  // --- Ratings ---
  rating: number;
  reviewCount: number;

  // --- Supporting Information ---
  studioName: string;
  instructorName: string;
  instructorExperience: string;
  instructorQualifications: string;

  // --- Media ---
  coverImage: string;
  galleryImages: string[];

  // --- Booking ---
  instantBooking: boolean;
  cancellationPolicy: string;
  bookingDeadline: string;

  // --- UI Compatibility Fields ---
  metroStationId: string;
  metroStationName: string;
  metroLineId: string;
  metroLineName: string;
  metroLineColor: string;
  walkMinutes: number;
  schedule: ScheduleSlot;
  price: number;
  priceUnit: 'per session' | 'per program' | 'per month' | 'total program' | 'per class';
  syllabi?: string[];
  teacher: TeacherInfo;
  studio: StudioInfo;
  image: string;
  accentColor: 'soft-green' | 'warm-yellow' | 'gentle-pink';
  userReviews?: Review[];

  // --- Personalization & Dynamic Discovery State ---
  scheduleMatchPercentage?: number;
  seatsLeft?: number;
  isFreeTrial?: boolean;
  isNewThisWeek?: boolean;
  commuteInfo?: CommuteInfo;

  // --- Program Model Extension ---
  skillsGained?: string[];
  certificateOffered?: boolean;
  prerequisites?: string;

  // --- Instance Model ---
  durationWeeks?: number;
  totalSessions?: number;
  registrationDeadline?: string;
  nextClassDate?: string;
  isOneTimeWorkshop?: boolean;

  // --- Delivery Mode Attributes ---
  deliveryMode: DeliveryMode;
  meetingPlatform?: MeetingPlatform | string;
  onlineSchedule?: string;
  timezone: string;
  bookingType: BookingType;
  capacity: number;

  // --- Provider Listing Extended Metadata ---
  activityType?: ActivityType;
  googleMapsLink?: string;
  discountPrice?: number;
  materialsIncluded?: string;
  providerType?: ProviderType;
  providerContact?: string;
  providerWebsite?: string;
  providerSocial?: string;

  // --- Provider Trust & Communication ---
  providerTrust?: ProviderTrustInfo;
  responseTimeText?: string;
}

export interface RankingWeights {
  exactSearchRelevance: number;
  metroProximity: number;
  scheduleMatch: number;
  startsSoon: number;
  availableSeats: number;
  rating: number;
  reviewCount: number;
  popularity: number;
  featured: number;
  newListingBoost: number;
}

export interface ScoringBreakdown {
  searchRelevanceScore: number;
  metroProximityScore: number;
  scheduleMatchScore: number;
  startsSoonScore: number;
  availableSeatsScore: number;
  ratingScore: number;
  reviewCountScore: number;
  popularityScore: number;
  featuredScore: number;
  newListingScore: number;
  boostScore: number;
  penaltyScore: number;
  totalScore: number;
}

export interface RankingContext {
  userPreferences?: UserPreferences;
  filterState?: {
    searchKeyword?: string;
    category?: string;
    metroStationIds?: string[];
    [key: string]: any;
  };
  currentDate?: Date;
  searchKeyword?: string;
  selectedMetroStationId?: string;
}

export interface RankingOptions {
  weights?: Partial<RankingWeights>;
  applyCategoryDiversity?: boolean;
  maxConsecutiveSameCategory?: number;
}

export interface BackendRankingRequest {
  activityIds: string[];
  context: RankingContext;
  weights?: Partial<RankingWeights>;
}

export interface BackendRankingResponse {
  rankedActivityIds: string[];
  scores: Record<string, number>;
  breakdowns?: Record<string, ScoringBreakdown>;
}
