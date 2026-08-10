import React, { useState } from 'react';
import { Booking } from '../types';
import {
  DashboardHeader
} from '../components/dashboard/DashboardHeader';
import {
  UpcomingSection,
  BookedSession
} from '../components/dashboard/UpcomingSection';
import {
  SavedActivities,
  SavedActivityItem
} from '../components/SavedActivities';
import {
  DiscoverySection
} from '../components/dashboard/DiscoverySection';
import {
  HistorySection
} from '../components/dashboard/HistorySection';
import {
  ProfileSettingsSection,
  UserPreferencesData
} from '../components/dashboard/ProfileSettingsSection';
import {
  Calendar,
  Heart,
  Sparkles,
  Award,
  SlidersHorizontal,
  Zap,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface UserDashboardProps {
  onNavigateHome?: () => void;
  onNavigateSearch?: (query?: string) => void;
  onSelectActivityDetails?: (activityId: string) => void;
  liveBookings?: Booking[];
  onCancelBooking?: (bookingId: string) => void;
}

const MOCK_USER_PROFILE = {
  name: 'Amar Sharma',
  email: 'amar.sharma@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  memberSince: 'March 2026',
  preferredMetro: 'Taganskaya',
  favoriteCategories: ['Ceramics & Art', 'Yoga & Wellness', 'Culinary & Beverage'],
  preferredTimeSlot: 'Weekday Evenings (18:00 - 21:00)',
  audienceLevel: 'Adult (Beginner Friendly)',
  language: 'English',
  totalHoursSpent: 34.5,
  completedCount: 8,
  savedCount: 4,
  certificatesCount: 2
};

const INITIAL_BOOKINGS: BookedSession[] = [
  {
    id: 'bk-101',
    activityTitle: 'Wheel Throwing & Clay Sculpting Masterclass',
    category: 'Ceramics & Pottery',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    date: 'Today, Aug 4',
    time: '18:30 - 20:30',
    isToday: true,
    metroStation: 'Taganskaya',
    walkTime: '4 min walk',
    address: 'ul. Taganskaya, d. 12, Moscow',
    seats: 1,
    spotNumber: 'Spot #4',
    instructorName: 'Elena Rostova',
    instructorNote: 'Please arrive 10 minutes early. Clay & aprons provided.',
    userName: 'Amar Sharma',
    userEmail: 'amar.sharma@example.com',
    status: 'Confirmed'
  },
  {
    id: 'bk-102',
    activityTitle: 'Vinyasa Flow & Deep Breathwork Evening',
    category: 'Yoga & Wellness',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    date: 'Saturday, Aug 8',
    time: '10:00 AM - 11:30 AM',
    isToday: false,
    metroStation: 'Chistye Prudy',
    walkTime: '2 min walk',
    address: 'Chistoprudny Blvd, 8, Moscow',
    seats: 2,
    spotNumber: 'Spots #7 & #8',
    instructorName: 'Mikhail Volkov',
    instructorNote: 'Bring your preferred water bottle. Mats provided.',
    userName: 'Amar Sharma',
    userEmail: 'amar.sharma@example.com',
    status: 'Confirmed'
  }
];

const NAV_TABS = [
  { id: 'overview', label: 'Overview', icon: Zap },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'saved', label: 'Saved', icon: Heart },
  { id: 'discovery', label: 'Discovery', icon: Sparkles },
  { id: 'history', label: 'History', icon: Award },
  { id: 'profile', label: 'Profile', icon: SlidersHorizontal }
];

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onNavigateHome,
  onNavigateSearch,
  onSelectActivityDetails,
  liveBookings = [],
  onCancelBooking: parentOnCancelBooking
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userProfile, setUserProfile] = useState(MOCK_USER_PROFILE);

  const mappedLiveBookings: BookedSession[] = liveBookings.map((b) => ({
    id: b.id,
    activityTitle: b.activityTitle,
    category: b.category,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
    date: b.selectedDate || 'Upcoming Session',
    time: b.scheduleText || '18:00 - 20:00',
    isToday: false,
    metroStation: b.metroStationName || 'Central Metro',
    walkTime: '4 min walk',
    address: 'Moscow Studio Venue',
    seats: 1,
    spotNumber: 'Spot #1',
    instructorName: 'Certified Instructor',
    instructorNote: 'Confirmed reservation.',
    userName: b.userName,
    userEmail: b.userEmail,
    status: 'Confirmed'
  }));

  const combinedBookings = [...mappedLiveBookings, ...INITIAL_BOOKINGS];

  const handleCancelBooking = (bookingId: string) => {
    if (parentOnCancelBooking) {
      parentOnCancelBooking(bookingId);
    }
  };

  const handleSavePreferences = (newPrefs: UserPreferencesData) => {
    setUserProfile((prev) => ({
      ...prev,
      preferredMetro: newPrefs.preferredMetro,
      favoriteCategories: newPrefs.favoriteCategories,
      preferredTimeSlot: newPrefs.preferredTime,
      audienceLevel: newPrefs.audience,
      language: newPrefs.language
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 pt-3 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fade-in overflow-x-hidden w-full">

      {/* ── MOBILE STICKY TAB NAV ── */}
      {/* Icon-only on xs screens (<360px), icon+label on sm+ */}
      <div className="sticky top-2 z-40 md:hidden">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-1 shadow-md grid grid-cols-6 gap-0.5">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all min-h-[48px] ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[9px] leading-none font-semibold hidden xs:block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DASHBOARD HEADER ── */}
      <DashboardHeader
        user={userProfile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEditProfileClick={() => setActiveTab('profile')}
      />

      {/* ── TAB: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Hub Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div
              onClick={() => setActiveTab('upcoming')}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
            >
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Upcoming Sessions
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full shrink-0">
                    {combinedBookings.length}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {combinedBookings.length > 0
                    ? combinedBookings[0].activityTitle
                    : 'No upcoming sessions booked.'}
                </p>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-2">
                  View Schedule <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('saved')}
              className="bg-white border border-slate-200 hover:border-rose-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
            >
              <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-rose-500" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Saved & Wishlist
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full shrink-0">
                    {userProfile.savedCount}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Collections, comparisons, and recently viewed activities.
                </p>
                <span className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-2">
                  Manage Wishlist <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('discovery')}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
            >
              <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Discovery Hub
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full shrink-0 truncate max-w-[80px]">
                    {userProfile.preferredMetro}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Free trials, weekend workshops near your metro line.
                </p>
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mt-2">
                  Explore Activities <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>

          {/* Next Scheduled Activity Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Next Scheduled Activity</h2>
              <button
                onClick={() => setActiveTab('upcoming')}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                View All ({combinedBookings.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <UpcomingSection
              bookings={combinedBookings}
              onCancelBooking={handleCancelBooking}
              onExploreMore={() => setActiveTab('discovery')}
            />
          </div>

          {/* Discovery Teaser — only on desktop to avoid overwhelming mobile */}
          <div className="hidden sm:block space-y-3 pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Recommended for You</h2>
                <p className="text-xs text-slate-500">Near {userProfile.preferredMetro} · Your preferred times.</p>
              </div>
              <button
                onClick={() => setActiveTab('discovery')}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 shrink-0"
              >
                Open Hub
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <DiscoverySection
              userMetro={userProfile.preferredMetro}
              onSelectActivity={onSelectActivityDetails}
              onSearchTagClick={(tag) => onNavigateSearch && onNavigateSearch(tag)}
            />
          </div>

          {/* Mobile: simple CTA to explore discovery */}
          <div className="sm:hidden">
            <button
              onClick={() => setActiveTab('discovery')}
              className="w-full py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-indigo-600 flex items-center justify-center gap-2 hover:border-indigo-300 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Explore Recommended Activities Near {userProfile.preferredMetro}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: UPCOMING ── */}
      {activeTab === 'upcoming' && (
        <div className="animate-fade-in">
          <UpcomingSection
            bookings={combinedBookings}
            onCancelBooking={handleCancelBooking}
            onExploreMore={() => setActiveTab('discovery')}
          />
        </div>
      )}

      {/* ── TAB: SAVED ── */}
      {activeTab === 'saved' && (
        <div className="animate-fade-in">
          <SavedActivities
            onViewActivityDetails={onSelectActivityDetails}
            onReserveSpot={(id) => onSelectActivityDetails && onSelectActivityDetails(id)}
          />
        </div>
      )}

      {/* ── TAB: DISCOVERY ── */}
      {activeTab === 'discovery' && (
        <div className="animate-fade-in">
          <DiscoverySection
            userMetro={userProfile.preferredMetro}
            onSelectActivity={onSelectActivityDetails}
            onSearchTagClick={(tag) => onNavigateSearch && onNavigateSearch(tag)}
          />
        </div>
      )}

      {/* ── TAB: HISTORY ── */}
      {activeTab === 'history' && (
        <div className="animate-fade-in">
          <HistorySection />
        </div>
      )}

      {/* ── TAB: PROFILE ── */}
      {activeTab === 'profile' && (
        <div className="animate-fade-in">
          <ProfileSettingsSection
            initialPreferences={{
              preferredMetro: userProfile.preferredMetro,
              favoriteCategories: userProfile.favoriteCategories,
              preferredTime: userProfile.preferredTimeSlot,
              audience: userProfile.audienceLevel,
              language: userProfile.language,
              emailNotifications: true,
              smsNotifications: true,
              pushNotifications: false,
              publicProfile: false,
              savedCardMask: '•••• •••• •••• 4242',
              calendarAutoSync: true
            }}
            onSavePreferences={handleSavePreferences}
          />
        </div>
      )}
    </div>
  );
};
