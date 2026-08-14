import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  FilterState,
  Booking,
} from './types';

// Feature Hooks
import {
  useActivities,
  useBookings,
  useSavedActivities,
  useWaitlists,
  useActivityMessaging,
} from './features/activities';
import { useUserPreferences } from './features/personalization';
import { useActivityFilters } from './features/search';

// Layout & UI Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SidebarFilters } from './components/layout/SidebarFilters';
import { MobileStickyNav } from './components/layout/MobileStickyNav';
import { ToastContainer, ToastMessage } from './components/ui/Toast';

// Feature Pages & Modals
import { HomePage } from './pages/HomePage';
import { ActivityDetailPage } from './features/activities/components/ActivityDetailPage';
import { MyWeekView } from './features/schedule/components/MyWeekView';
import { MyFreeTimePlanner } from './features/schedule/components/MyFreeTimePlanner';
import { UserDashboard } from './features/dashboard/components/UserDashboard';
import { ProviderDashboard } from './features/dashboard/components/ProviderDashboard';

import { SavedModal } from './features/activities/components/SavedModal';
import { MyBookingsModal } from './features/activities/components/MyBookingsModal';
import { ActivityMessagingModal } from './features/activities/components/ActivityMessagingModal';
import { CreateActivityModal } from './features/activities/components/CreateActivityModal';
import { AiConciergeModal } from './features/activities/components/AiConciergeModal';

export function App() {
  // 1. Domain Data Hooks
  const { activities, addActivity, updateActivity, addReview } = useActivities();
  const { bookings, createBooking, cancelBooking } = useBookings();
  const { savedIds, toggleSave } = useSavedActivities();
  const { waitlists, joinWaitlist, notifyWaitlistUser } = useWaitlists();
  const { conversations, getConversationForActivity, sendMessage } = useActivityMessaging();
  const { preferences: userPrefs, savePreferences } = useUserPreferences();

  // 2. Search, Filter & Ranking Hook
  const {
    filters,
    updateFilters,
    resetFilters,
    filteredActivities,
    activePersonalizedTab,
    setActivePersonalizedTab,
    activeView,
    setActiveView,
    summaryPills,
  } = useActivityFilters(activities, userPrefs);

  // 3. Navigation & Detail Routing
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<'explore' | 'my-week' | 'free-time' | 'user-dashboard' | 'provider-dashboard'>('explore');
  const [savedScrollPosition, setSavedScrollPosition] = useState<number>(0);

  // 4. Modal States
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAiMatchmakerOpen, setIsAiMatchmakerOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [messagingActivity, setMessagingActivity] = useState<Activity | null>(null);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  // 5. Pagination / Visible Card Limit
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 6. Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = useCallback((type: 'success' | 'info' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 7. Mobile Sticky Nav Visibility (Hidden in Search & Hero section, visible after scrolling past it)
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  useEffect(() => {
    // If not on explore / home page (e.g. detail page or other tabs), always show nav
    if (selectedActivityId || activeNavTab !== 'explore') {
      setIsMobileNavVisible(true);
      return;
    }

    const checkHeroVisibility = () => {
      const heroEl = document.getElementById('hero-search-section');
      if (!heroEl) {
        setIsMobileNavVisible(window.scrollY > 200);
        return;
      }
      const rect = heroEl.getBoundingClientRect();
      // Hero & search section is scrolled through when its bottom reaches near the header (<= 70px)
      setIsMobileNavVisible(rect.bottom <= 70);
    };

    checkHeroVisibility();
    window.addEventListener('scroll', checkHeroVisibility, { passive: true });
    window.addEventListener('resize', checkHeroVisibility, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkHeroVisibility);
      window.removeEventListener('resize', checkHeroVisibility);
    };
  }, [selectedActivityId, activeNavTab]);

  // Hash-based detail page routing (#activity/<activityId>)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#activity/')) {
        const id = hash.replace('#activity/', '');
        setSelectedActivityId(id);
      } else if (hash === '#my-week') {
        setActiveNavTab('my-week');
      } else if (hash === '#free-time') {
        setActiveNavTab('free-time');
      } else if (hash === '#dashboard' || hash === '#user-dashboard') {
        setActiveNavTab('user-dashboard');
      } else if (hash === '#provider-dashboard') {
        setActiveNavTab('provider-dashboard');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync back button / detail open
  const openActivityDetail = useCallback((activity: Activity) => {
    setSavedScrollPosition(window.scrollY);
    setSelectedActivityId(activity.id);
    window.location.hash = `activity/${activity.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeActivityDetail = useCallback(() => {
    setSelectedActivityId(null);
    history.pushState(null, '', window.location.pathname + window.location.search);
    setTimeout(() => {
      window.scrollTo({ top: savedScrollPosition, behavior: 'smooth' });
    }, 50);
  }, [savedScrollPosition]);

  const goHome = useCallback(() => {
    setSelectedActivityId(null);
    setActiveNavTab('explore');
    resetFilters();
    history.pushState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resetFilters]);

  // Active selected activity object
  const activeSelectedActivity = useMemo(() => {
    if (!selectedActivityId) return null;
    return activities.find((a) => a.id === selectedActivityId) || null;
  }, [selectedActivityId, activities]);

  // Handle load more
  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setIsLoading(false);
    }, 250);
  };

  const visibleActivities = useMemo(() => {
    return filteredActivities.slice(0, visibleCount);
  }, [filteredActivities, visibleCount]);

  const hasMore = visibleCount < filteredActivities.length;

  // Booking handlers
  const handleConfirmBooking = useCallback((bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking = createBooking(bookingData);
    showToast('success', 'Booking Confirmed!', `You're booked for ${bookingData.activityTitle}`);
    return newBooking;
  }, [createBooking, showToast]);

  const handleCancelBooking = useCallback((bookingId: string) => {
    cancelBooking(bookingId);
    showToast('info', 'Booking Cancelled', 'Your reservation was successfully removed.');
  }, [cancelBooking, showToast]);

  const handleQuickBook = useCallback((activity: Activity) => {
    if (activity.seatsLeft === 0) {
      joinWaitlist(activity.id, {
        userName: 'Alex Morgan',
        userEmail: 'alex@example.com',
      });
      showToast('info', 'Waitlist Joined', `You have been added to the waitlist for ${activity.title}`);
    } else {
      openActivityDetail(activity);
    }
  }, [joinWaitlist, openActivityDetail, showToast]);

  const handleNotifyWaitlistUser = useCallback((activityId: string, email: string) => {
    notifyWaitlistUser(activityId, email);
    showToast('success', 'Notification Sent', `Slot opening alert sent to ${email}`);
  }, [notifyWaitlistUser, showToast]);

  const handleAddActivity = useCallback((newActivity: Activity) => {
    addActivity(newActivity);
    setIsCreateModalOpen(false);
    showToast('success', 'Course Published!', `${newActivity.title} is now discoverable.`);
  }, [addActivity, showToast]);

  const handleEditActivity = useCallback((activity: Activity) => {
    setActivityToEdit(activity);
    setIsCreateModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex flex-col font-sans selection:bg-[#A2FF00] selection:text-[#111827]">
      {/* 1. Global Header Navigation */}
      <Header
        currentAudience={filters.audience}
        onAudienceChange={(aud) => updateFilters({ audience: aud })}
        savedCount={savedIds.length}
        bookingsCount={bookings.length}
        messagesCount={conversations.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        onOpenMessages={() => {
          setMessagingActivity(activeSelectedActivity || null);
          setIsMessagingModalOpen(true);
        }}
        onOpenCreate={() => {
          setActivityToEdit(null);
          setIsCreateModalOpen(true);
        }}
        onOpenAiMatchmaker={() => setIsAiMatchmakerOpen(true)}
        onOpenFreeTimePlanner={() => {
          setActiveNavTab('free-time');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearchClick={() => {
          setActiveNavTab('explore');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onGoHome={goHome}
        showSearch={activeNavTab !== 'explore' || !!selectedActivityId}
        activeNavTab={activeNavTab}
        onNavTabChange={(tab) => setActiveNavTab(tab as any)}
      />

      {/* 2. Main Routing Section */}
      {activeSelectedActivity ? (
        <ActivityDetailPage
          activity={activeSelectedActivity}
          activities={activities}
          onBack={closeActivityDetail}
          isSaved={savedIds.includes(activeSelectedActivity.id)}
          onToggleSave={toggleSave}
          onConfirmBooking={handleConfirmBooking}
          onOpenContactInstructor={(act) => {
            setMessagingActivity(act);
            setIsMessagingModalOpen(true);
          }}
          onSelectActivity={openActivityDetail}
          onAddReview={addReview}
          onEditActivity={handleEditActivity}
        />
      ) : activeNavTab === 'my-week' ? (
        <MyWeekView
          activities={activities}
          userPreferences={userPrefs}
          onSavePreferences={savePreferences}
          onSelectActivity={openActivityDetail}
          onReserveSpot={openActivityDetail}
          onToggleSave={toggleSave}
          savedIds={savedIds}
        />
      ) : activeNavTab === 'free-time' ? (
        <MyFreeTimePlanner
          preferences={userPrefs}
          onSavePreferences={savePreferences}
          activities={activities}
          onViewMyWeek={() => {
            setActiveNavTab('my-week');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectActivity={openActivityDetail}
          onToggleSave={toggleSave}
          savedIds={savedIds}
        />
      ) : activeNavTab === 'user-dashboard' ? (
        <UserDashboard
          onNavigateHome={() => setActiveNavTab('explore')}
          onNavigateSearch={(query) => {
            if (query) updateFilters({ searchKeyword: query });
            setActiveNavTab('explore');
          }}
          onSelectActivityDetails={(id) => {
            const act = activities.find((a) => a.id === id);
            if (act) openActivityDetail(act);
          }}
          liveBookings={bookings}
          onCancelBooking={handleCancelBooking}
        />
      ) : activeNavTab === 'provider-dashboard' ? (
        <ProviderDashboard
          activities={activities}
          bookings={bookings}
          waitlists={waitlists}
          onOpenCreateActivity={() => {
            setActivityToEdit(null);
            setIsCreateModalOpen(true);
          }}
          onEditActivity={handleEditActivity}
          onSelectActivityDetails={(id) => {
            const act = activities.find((a) => a.id === id);
            if (act) openActivityDetail(act);
          }}
          onNotifyWaitlistUser={handleNotifyWaitlistUser}
        />
      ) : (
        <HomePage
          activities={activities}
          filteredActivities={filteredActivities}
          visibleActivities={visibleActivities}
          filters={filters}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          savedIds={savedIds}
          toggleSave={toggleSave}
          activeNavTab={activeNavTab}
          setActiveNavTab={setActiveNavTab}
          activePersonalizedTab={activePersonalizedTab}
          setActivePersonalizedTab={setActivePersonalizedTab}
          activeView={activeView}
          setActiveView={setActiveView}
          isLoading={isLoading}
          hasMore={hasMore}
          handleLoadMore={handleLoadMore}
          openActivityDetail={openActivityDetail}
          handleQuickBook={handleQuickBook}
          summaryPills={summaryPills}
          onOpenAiMatchmaker={() => setIsAiMatchmakerOpen(true)}
          onOpenFreeTimePlanner={() => {
            setActiveNavTab('free-time');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isMobileFiltersOpen={isMobileFiltersOpen}
          setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        />
      )}

      {/* 3. Global Footer */}
      <Footer
        activityCount={activities.length}
        onGoHome={goHome}
        onNavTabChange={(tab) => {
          if (tab === 'free-time') {
            setActiveNavTab('free-time');
          } else if (tab === 'my-week') {
            setActiveNavTab('my-week');
          } else {
            setActiveNavTab('explore');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => {
          setActivityToEdit(null);
          setIsCreateModalOpen(true);
        }}
        onOpenFreeTimePlanner={() => {
          setActiveNavTab('free-time');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 4. Mobile Sticky Bottom Navigation */}
      <MobileStickyNav
        activeTab={
          activeNavTab === 'my-week'
            ? 'my-week'
            : activeNavTab === 'user-dashboard'
            ? 'profile'
            : 'explore'
        }
        onSelectTab={(tab) => {
          if (tab === 'saved') {
            setIsSavedModalOpen(true);
          } else if (tab === 'profile') {
            setActiveNavTab('user-dashboard');
          } else if (tab === 'my-week') {
            setActiveNavTab('my-week');
          } else {
            setActiveNavTab('explore');
            setSelectedActivityId(null);
          }
        }}
        savedCount={savedIds.length}
        isVisible={isMobileNavVisible}
      />

      {/* 5. Mobile Filters Drawer Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-4 flex flex-col justify-between">
            <SidebarFilters
              filters={filters}
              onFilterChange={updateFilters}
              onResetFilters={resetFilters}
              resultsCount={filteredActivities.length}
              isOpen={isMobileFiltersOpen}
              onClose={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 6. Saved Activities Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedActivities={activities.filter((a) => savedIds.includes(a.id))}
        onRemoveSaved={toggleSave}
        onSelectActivity={(activity) => {
          setIsSavedModalOpen(false);
          openActivityDetail(activity);
        }}
      />

      {/* 7. Bookings Modal */}
      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
      />

      {/* 8. Activity Messaging Modal */}
      <ActivityMessagingModal
        isOpen={isMessagingModalOpen}
        onClose={() => setIsMessagingModalOpen(false)}
        activity={messagingActivity}
        conversations={conversations}
        onSendMessage={(activityId, text, attachments, topic) => {
          sendMessage(activityId, text, attachments, topic);
        }}
      />

      {/* 9. Create / Edit Activity Modal */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setActivityToEdit(null);
        }}
        onAddActivity={(act) => {
          if (activityToEdit) {
            updateActivity(act.id, act);
            showToast('success', 'Activity Updated', `${act.title} was updated.`);
            setIsCreateModalOpen(false);
            setActivityToEdit(null);
          } else {
            handleAddActivity(act);
          }
        }}
        activityToEdit={activityToEdit}
      />

      {/* 10. AI Concierge Modal */}
      <AiConciergeModal
        isOpen={isAiMatchmakerOpen}
        onClose={() => setIsAiMatchmakerOpen(false)}
        activities={activities}
        onSelectActivity={(act) => {
          setIsAiMatchmakerOpen(false);
          openActivityDetail(act);
        }}
      />

      {/* 11. Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
