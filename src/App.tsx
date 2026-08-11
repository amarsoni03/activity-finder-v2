import React, { useState, useEffect, useMemo } from 'react';
import { Activity, FilterState, Booking, AudienceType, InstructorInquiry, UserPreferences, ActivityConversation, MessageAttachment, WaitlistEntry, Review } from './types';
import { INITIAL_ACTIVITIES } from './data/activitiesData';
import { METRO_LINES, METRO_STATIONS } from './data/metroData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSearch } from './components/HeroSearch';
import { SidebarFilters } from './components/SidebarFilters';
import { ActivityCard } from './components/ActivityCard';
import { ActivityDetailPage } from './components/ActivityDetailPage';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { MetroMapView } from './components/MetroMapView';
import { MyBookingsModal } from './components/MyBookingsModal';
import { SavedModal } from './components/SavedModal';
import { CreateActivityModal } from './components/CreateActivityModal';
import { AiConciergeModal } from './components/AiConciergeModal';
import { ContactInstructorModal } from './components/ContactInstructorModal';
import { ActivityMessagingModal } from './components/ActivityMessagingModal';
import { WaitlistModal } from './components/WaitlistModal';
import { MyFreeTimePlanner } from './components/MyFreeTimePlanner';
import { MyWeekView } from './components/MyWeekView';
import { UserDashboard } from './pages/UserDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  getUserPreferences,
  saveUserPreferences,
  enrichActivity,
  mapGoalToCategories,
} from './utils/personalization';
import { calculateSearchRelevance } from './utils/search';
import { rankActivitiesWithEngine } from './utils/ranking';
import {
  ArrowUpDown,
  Sparkles,
  X,
  MapPin,
  SlidersHorizontal,
  Calendar,
  Clock,
  LayoutGrid,
  PlusCircle,
  RotateCcw,
  Search,
  ArrowRight,
  Compass,
} from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  category: 'All Categories',
  programTypeFilter: 'All',
  subSkill: 'All',
  audience: 'All',
  deliveryMode: 'All',
  language: 'All',
  metroLineId: 'all',
  metroStationIds: [],
  regularity: 'All',
  timeOfDaySlots: [],
  daysOfWeek: [],
  level: 'All Levels',
  minRating: 0,
  maxPrice: 15000,
  requireDegree: false,
  requireVerified: false,
  requireBackgroundChecked: false,
  requireTopRated: false,
  minTeacherExperience: 0,
  searchKeyword: '',
  goal: 'All Goals',
  sortBy: 'recommended',
};

type PersonalizedTab =
  | 'all'
  | 'free-time'
  | 'tonight'
  | 'weekend'
  | 'starts-this-week'
  | 'near-metro'
  | 'free-trial'
  | 'popular';

export default function App() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const local = localStorage.getItem('af_activities_moscow');
      return local ? JSON.parse(local) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [userPrefs, setUserPrefs] = useState<UserPreferences>(() => getUserPreferences());
  const [activeNavTab, setActiveNavTab] = useState<'my-week' | 'explore' | 'free-time' | 'user-dashboard' | 'provider-dashboard'>('explore');
  const [activePersonalizedTab, setActivePersonalizedTab] = useState<PersonalizedTab>('all');

  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [activeView, setActiveView] = useState<'list' | 'map' | 'schedule'>('list');
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Waitlist State with localStorage
  const [waitlists, setWaitlists] = useState<WaitlistEntry[]>(() => {
    try {
      const local = localStorage.getItem('af_waitlists');
      return local ? JSON.parse(local) : [
        {
          id: 'wl-1',
          activityId: 'act-1',
          activityTitle: 'Wheel Throwing & Clay Sculpting Masterclass',
          userName: 'Svetlana Ivanova',
          userEmail: 'svetlana.i@example.com',
          userPhone: '+7 999 444-55-66',
          requestedDate: 'Aug 12, 2026',
          createdAt: 'Aug 1, 2026',
          status: 'pending'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('af_waitlists', JSON.stringify(waitlists));
    } catch {}
  }, [waitlists]);

  // Routing State for Listing Details Page
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#activity/')) {
        return hash.replace('#activity/', '');
      }
    } catch {}
    return null;
  });
  const [savedScrollPosition, setSavedScrollPosition] = useState<number>(0);

  // Bookmarks state with localStorage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('af_saved');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // Bookings state with localStorage
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const local = localStorage.getItem('af_bookings');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers visibility
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isAiMatchmakerOpen, setIsAiMatchmakerOpen] = useState(false);
  const [contactActivity, setContactActivity] = useState<Activity | null>(null);
  const [waitlistActivity, setWaitlistActivity] = useState<Activity | null>(null);

  // Messaging & Provider Communication State
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);
  const [messagingActivity, setMessagingActivity] = useState<Activity | null>(null);
  const [conversations, setConversations] = useState<ActivityConversation[]>(() => {
    try {
      const local = localStorage.getItem('af_conversations');
      if (local) return JSON.parse(local);
    } catch {}
    return [
      {
        id: 'thread-1',
        activityId: 'act-1',
        activityTitle: 'Conversational Russian & Cultural Salon',
        activityImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
        metroStation: 'Okhotny Ryad',
        price: '2,200 ₽',
        providerName: 'Elena Volkova',
        providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        responseTimeText: '⚡ Usually replies in 15 mins',
        lastUpdated: '10 mins ago',
        status: 'answered',
        messages: [
          {
            id: 'msg-1',
            sender: 'user',
            senderName: 'Alex Morgan',
            text: 'Hi! Could you please specify what level of vocabulary is expected for the first salon session?',
            timestamp: 'Today at 14:30',
            quickTopic: 'Skill Level'
          },
          {
            id: 'msg-2',
            sender: 'provider',
            senderName: 'Elena Volkova',
            senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            text: 'Hello Alex! We welcome A2 to B2 speakers. I have attached the session vocabulary sheet so you can prepare in advance.',
            timestamp: 'Today at 14:42',
            attachments: [
              {
                id: 'att-1',
                name: 'Russian_Salon_Vocabulary_A2.pdf',
                url: '#',
                type: 'pdf',
                size: '1.1 MB'
              }
            ]
          }
        ]
      },
      {
        id: 'thread-2',
        activityId: 'act-2',
        activityTitle: 'Vinyasa Sunset Yoga & Breathwork',
        activityImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
        metroStation: 'Park Kultury',
        price: '1,800 ₽',
        providerName: 'Anna Karenina',
        providerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        responseTimeText: '⚡ Usually replies in 20 mins',
        lastUpdated: '1 hour ago',
        status: 'answered',
        messages: [
          {
            id: 'msg-3',
            sender: 'user',
            senderName: 'Alex Morgan',
            text: 'Hi! Are yoga mats provided at the venue or should I bring my own?',
            timestamp: 'Today at 12:15',
            quickTopic: 'Equipment & Gear'
          },
          {
            id: 'msg-4',
            sender: 'provider',
            senderName: 'Anna Karenina',
            text: 'Hi Alex! High-quality Manduka mats and blocks are provided free of charge. You just need comfortable workout clothes!',
            timestamp: 'Today at 12:30'
          }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('af_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const handleSendMessage = (
    targetActId: string,
    text: string,
    attachments: MessageAttachment[],
    quickTopic?: string
  ) => {
    const act = activities.find(a => a.id === targetActId) || activities[0];
    const existingThread = conversations.find(c => c.activityId === targetActId);

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      senderName: 'Alex Morgan',
      text: text || (quickTopic ? `Inquiring about ${quickTopic}` : 'Sent an attachment'),
      timestamp: 'Just now',
      attachments: attachments.length > 0 ? attachments : undefined,
      quickTopic
    };

    let updatedThreads: ActivityConversation[];

    if (existingThread) {
      updatedThreads = conversations.map(c => {
        if (c.id === existingThread.id) {
          return {
            ...c,
            lastMessage: userMessage.text,
            lastUpdated: 'Just now',
            status: 'awaiting_reply' as const,
            messages: [...c.messages, userMessage]
          };
        }
        return c;
      });
    } else {
      const newThread: ActivityConversation = {
        id: `thread-${Date.now()}`,
        activityId: act.id,
        activityTitle: act.title,
        activityImage: act.image,
        metroStation: act.metroStationName || act.metroStation || 'Moscow Central',
        price: `${act.price} ₽ / ${act.priceUnit}`,
        providerName: act.instructorName || act.teacher?.name || 'Instructor',
        providerAvatar: act.teacher?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        responseTimeText: act.responseTimeText || '⚡ Usually replies in 15 mins',
        lastUpdated: 'Just now',
        status: 'awaiting_reply',
        messages: [userMessage]
      };
      updatedThreads = [newThread, ...conversations];
    }

    setConversations(updatedThreads);
    addToast('success', 'Message Sent!', 'Instructor will review and reply soon.');

    // Simulate provider auto-reply after 2.5 seconds
    setTimeout(() => {
      setConversations(prev => prev.map(c => {
        if (c.activityId === targetActId) {
          const providerReply = {
            id: `msg-reply-${Date.now()}`,
            sender: 'provider' as const,
            senderName: c.providerName,
            senderAvatar: c.providerAvatar,
            text: `Hi Alex! Thank you for inquiring about ${c.activityTitle}. Regarding your question: all prerequisites and preparation details are confirmed for your session. Feel free to ask if you need anything else!`,
            timestamp: 'Just now'
          };
          return {
            ...c,
            lastMessage: providerReply.text,
            lastUpdated: 'Just now',
            status: 'answered' as const,
            messages: [...c.messages, providerReply]
          };
        }
        return c;
      }));
      addToast('info', 'New Provider Reply!', `Reply received from ${act.instructorName || 'Instructor'}`);
    }, 2500);
  };

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Listen to browser Back/Forward navigation & URL Hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#activity/')) {
        const id = hash.replace('#activity/', '');
        setSelectedActivityId(id);
      } else {
        setSelectedActivityId(null);
        setTimeout(() => {
          window.scrollTo(0, savedScrollPosition);
        }, 50);
      }
    };

    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [savedScrollPosition]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(10);
  }, [filters, activePersonalizedTab]);

  const handleSavePreferences = (newPrefs: UserPreferences) => {
    setUserPrefs(newPrefs);
    saveUserPreferences(newPrefs);
    addToast('success', 'Free Time Preferences Saved!', 'Your recommendations have been updated.');
  };

  const handleQuickBook = (activity: Activity) => {
    const seats = activity.seatsLeft ?? activity.availableSeats ?? 4;
    if (seats === 0) {
      setWaitlistActivity(activity);
    } else {
      openActivityDetail(activity);
    }
  };

  const openActivityDetail = (activity: Activity) => {
    setSavedScrollPosition(window.scrollY);
    setSelectedActivityId(activity.id);
    window.location.hash = `activity/${activity.id}`;
  };

  const closeActivityDetail = () => {
    if (window.location.hash.startsWith('#activity/')) {
      window.history.back();
    } else {
      setSelectedActivityId(null);
    }
  };

  const goHome = () => {
    setSelectedActivityId(null);
    if (window.location.hash.startsWith('#activity/')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setActiveNavTab('explore');
    setActiveView('list');
    setActivePersonalizedTab('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('af_saved', JSON.stringify(savedIds));
    } catch {}
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('af_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('af_activities_moscow', JSON.stringify(activities));
    } catch {}
  }, [activities]);

  const toggleSave = (activityId: string) => {
    const act = activities.find((a) => a.id === activityId);
    if (savedIds.includes(activityId)) {
      setSavedIds(savedIds.filter((id) => id !== activityId));
      if (act) addToast('info', 'Removed from saved', act.title);
    } else {
      setSavedIds([...savedIds, activityId]);
      if (act) addToast('success', 'Saved to your list!', act.title);
    }
  };

  const handleConfirmBooking = (
    activity: Activity,
    details: { userName: string; userEmail: string; userPhone: string; date: string }
  ) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      activityId: activity.id,
      activityTitle: activity.title,
      category: activity.category,
      metroStationName: activity.metroStationName,
      scheduleText: `${activity.schedule?.specificDaysText || 'Schedule'} (${activity.schedule?.timeRange || activity.startTime})`,
      priceText: `${activity.price} ₽ / ${activity.priceUnit}`,
      userName: details.userName,
      userEmail: details.userEmail,
      userPhone: details.userPhone,
      selectedDate: details.date,
      bookedAt: new Date().toLocaleDateString(),
      accentColor: activity.accentColor,
    };
    setBookings([newBooking, ...bookings]);

    // Decrement available seats dynamically across application state
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activity.id) {
          const currentSeats = act.seatsLeft ?? act.availableSeats ?? 4;
          const nextSeats = Math.max(0, currentSeats - 1);
          return {
            ...act,
            seatsLeft: nextSeats,
            availableSeats: nextSeats,
          };
        }
        return act;
      })
    );

    addToast('success', 'Trial Class Booked!', `${activity.title} at ${activity.metroStationName}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    const found = bookings.find((b) => b.id === bookingId);
    setBookings(bookings.filter((b) => b.id !== bookingId));

    if (found) {
      // Increment available seats back upon cancellation
      setActivities((prev) =>
        prev.map((act) => {
          if (act.id === found.activityId) {
            const currentSeats = act.seatsLeft ?? act.availableSeats ?? 0;
            const maxCap = act.totalSeats || act.capacity || 10;
            const nextSeats = Math.min(maxCap, currentSeats + 1);
            return {
              ...act,
              seatsLeft: nextSeats,
              availableSeats: nextSeats,
            };
          }
          return act;
        })
      );
      addToast('info', 'Booking Cancelled', found.activityTitle);
    }
  };

  const handleAddReview = (activityId: string, rating: number, comment: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const currentCount = act.reviewCount || 0;
          const currentRating = act.rating || 5;
          const newCount = currentCount + 1;
          const newAvgRating = parseFloat(
            ((currentRating * currentCount + rating) / newCount).toFixed(2)
          );

          const newRev: Review = {
            id: `rev-${Date.now()}`,
            activityId,
            userName: 'Alex Morgan',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            rating,
            comment,
            date: 'Just now',
            isVerifiedAttendee: true,
            attendedDate: 'Attended August 2026',
            helpfulCount: 1,
          };

          return {
            ...act,
            rating: newAvgRating,
            reviewCount: newCount,
            userReviews: [newRev, ...(act.userReviews || [])],
          };
        }
        return act;
      })
    );
    addToast('success', 'Review Submitted!', 'Thank you for your feedback.');
  };

  const handleNotifyWaitlistUser = (waitlistId: string) => {
    setWaitlists((prev) =>
      prev.map((w) => (w.id === waitlistId ? { ...w, status: 'notified' as const } : w))
    );
    const item = waitlists.find((w) => w.id === waitlistId);
    if (item) {
      addToast('success', 'Waitlist User Notified!', `Spot offer email sent to ${item.userName}`);
    }
  };

  const handleEditActivity = (act: Activity) => {
    setActivityToEdit(act);
    setIsCreateModalOpen(true);
  };

  const handleAddActivity = (newAct: Activity) => {
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === newAct.id);
      const updated = exists
        ? prev.map((a) => (a.id === newAct.id ? newAct : a))
        : [newAct, ...prev];
      localStorage.setItem('af_activities_moscow', JSON.stringify(updated));
      return updated;
    });
    addToast('success', activityToEdit ? 'Listing Updated!' : 'New Class Posted!', newAct.title);
    setActivityToEdit(null);
  };

  const handleSendInquiry = (inquiry: {
    activityId: string;
    activityTitle: string;
    teacherName: string;
    userName: string;
    userEmail: string;
    message: string;
  }) => {
    addToast('success', 'Message Delivered', `Inquiry sent to ${inquiry.teacherName}`);
  };

  const updateFilters = (newPartial: Partial<FilterState>) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, ...newPartial }));
    setTimeout(() => setIsLoading(false), 200);
  };

  const resetFilters = () => {
    setIsLoading(true);
    setFilters(DEFAULT_FILTERS);
    setActivePersonalizedTab('all');
    setTimeout(() => setIsLoading(false), 200);
  };

  // Enriched Activities Engine
  const enrichedActivities = useMemo(() => {
    return activities.map((act) => enrichActivity(act, userPrefs));
  }, [activities, userPrefs]);

  // Filtered & Ranked Activities Engine
  const filteredActivities = useMemo(() => {
    let result = enrichedActivities.filter((act) => {
      // Program Type Filter
      if (
        filters.programTypeFilter &&
        filters.programTypeFilter !== 'All' &&
        act.programType !== filters.programTypeFilter
      ) {
        return false;
      }

      // Goal Filter
      if (filters.goal && filters.goal !== 'All Goals') {
        const goalCategories = mapGoalToCategories(filters.goal);
        if (goalCategories.length > 0 && !goalCategories.includes(act.category)) {
          return false;
        }
      }

      // Category
      if (filters.category !== 'All Categories' && filters.category !== 'All' && act.category !== filters.category) {
        return false;
      }

      // SubSkill
      if (filters.subSkill !== 'All' && act.subSkill !== filters.subSkill) {
        return false;
      }

      // Audience
      if (
        filters.audience !== 'All' &&
        act.audience !== filters.audience &&
        act.audience !== 'All'
      ) {
        return false;
      }

      // Delivery Mode (Offline vs Online)
      if (filters.deliveryMode && filters.deliveryMode !== 'All') {
        if (filters.deliveryMode === 'In Person') {
          if (act.deliveryMode !== 'In Person' && act.deliveryMode !== 'Hybrid') {
            return false;
          }
        } else if (filters.deliveryMode === 'Live Online') {
          if (
            act.deliveryMode !== 'Live Online' &&
            act.deliveryMode !== 'Self-Paced' &&
            act.deliveryMode !== 'Hybrid'
          ) {
            return false;
          }
        } else if (act.deliveryMode !== filters.deliveryMode) {
          return false;
        }
      }

      // Language Filter
      if (filters.language && filters.language !== 'All') {
        const actLang = act.language || 'Russian';
        if (filters.language === 'English') {
          if (!actLang.toLowerCase().includes('english')) {
            return false;
          }
        } else if (filters.language === 'Russian') {
          if (!actLang.toLowerCase().includes('russian')) {
            return false;
          }
        } else if (filters.language === 'English & Russian') {
          if (!actLang.toLowerCase().includes('english') || !actLang.toLowerCase().includes('russian')) {
            return false;
          }
        }
      }

      // Metro Line
      if (filters.metroLineId !== 'all' && act.metroLineId !== filters.metroLineId) {
        return false;
      }

      // Metro Station
      if (filters.metroStationIds.length > 0 && !filters.metroStationIds.includes(act.metroStationId)) {
        return false;
      }

      // Regularity
      if (filters.regularity !== 'All' && act.frequency !== filters.regularity) {
        return false;
      }

      // Time of Day Slots
      if (
        filters.timeOfDaySlots.length > 0 &&
        !filters.timeOfDaySlots.includes(act.schedule.timeOfDay)
      ) {
        return false;
      }

      // Days of Week
      if (
        filters.daysOfWeek.length > 0 &&
        !filters.daysOfWeek.some((d) => act.schedule.days.includes(d))
      ) {
        return false;
      }

      // Level
      if (filters.level !== 'All Levels' && act.level !== filters.level && act.level !== 'All Levels') {
        return false;
      }

      // Rating
      if (filters.minRating > 0 && act.rating < filters.minRating) {
        return false;
      }

      // Price
      if (act.price > filters.maxPrice) {
        return false;
      }

      // Degree requirement
      if (filters.requireDegree && !act.teacher.qualifications.degree) {
        return false;
      }

      // Provider Trust requirements
      const trust = act.providerTrust || act.teacher?.trust || act.studio?.trust;
      if (filters.requireVerified && !trust?.isVerified) {
        return false;
      }
      if (filters.requireBackgroundChecked && !trust?.isBackgroundChecked) {
        return false;
      }
      if (filters.requireTopRated && (!trust?.isTopRated && act.rating < 4.8)) {
        return false;
      }

      // Min Teacher Experience
      if (
        filters.minTeacherExperience > 0 &&
        act.teacher.qualifications.experienceYears < filters.minTeacherExperience
      ) {
        return false;
      }

      // Search keyword with typo tolerance & multi-field matching
      if (filters.searchKeyword.trim() !== '') {
        const searchRes = calculateSearchRelevance(act, filters.searchKeyword);
        if (!searchRes.isMatch) {
          return false;
        }
      }

      // Personalized Discovery Section Tabs
      if (activePersonalizedTab === 'free-time') {
        if ((act.scheduleMatchPercentage || 0) < 70) return false;
      } else if (activePersonalizedTab === 'tonight') {
        if (act.schedule.timeOfDay !== 'Evening') return false;
      } else if (activePersonalizedTab === 'weekend') {
        if (!act.schedule.days.includes('Saturday') && !act.schedule.days.includes('Sunday')) return false;
      } else if (activePersonalizedTab === 'starts-this-week') {
        if (!act.startDate.toLowerCase().includes('ongoing') && !act.startDate.toLowerCase().includes('sep') && !act.startDate.toLowerCase().includes('starts')) return false;
      } else if (activePersonalizedTab === 'near-metro') {
        if ((act.commuteInfo?.walkMinutes || act.walkMinutes) > 5) return false;
      } else if (activePersonalizedTab === 'free-trial') {
        if (!act.isFreeTrial && act.price > 30) return false;
      } else if (activePersonalizedTab === 'popular') {
        if (act.rating < 4.8 || act.reviewCount < 25) return false;
      }

      return true;
    });

    // Intelligent Ranking & Sorting
    const sortVal = filters.sortBy as string;
    if (sortVal === 'starting-soon' || sortVal === 'starts-soon' || sortVal === 'start-date') {
      return result.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
    }
    if (sortVal === 'nearest-metro' || sortVal === 'nearest' || sortVal === 'distance') {
      return result.sort((a, b) => (a.commuteInfo?.walkMinutes || a.walkMinutes || 5) - (b.commuteInfo?.walkMinutes || b.walkMinutes || 5));
    }
    if (sortVal === 'lowest-price' || sortVal === 'price-low') {
      return result.sort((a, b) => a.price - b.price);
    }
    if (sortVal === 'best-rated' || sortVal === 'highest-rated' || sortVal === 'rating') {
      return result.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      });
    }
    if (sortVal === 'newest') {
      return result.sort((a, b) => (b.newActivity ? 1 : 0) - (a.newActivity ? 1 : 0) || b.id.localeCompare(a.id));
    }
    if (sortVal === 'most-popular' || sortVal === 'popular') {
      return result.sort((a, b) => (b.popularityScore || b.reviewCount || 0) - (a.popularityScore || a.reviewCount || 0));
    }
    
    // Default (Recommended): 10-Factor Intelligent Weighted Ranking Engine with Category Diversification
    return rankActivitiesWithEngine(result, {
      userPreferences: userPrefs,
      filterState: filters,
      searchKeyword: filters.searchKeyword,
    });
  }, [enrichedActivities, filters, userPrefs, activePersonalizedTab]);

  const activeSelectedActivity = useMemo(() => {
    if (!selectedActivityId) return null;
    return enrichedActivities.find((a) => a.id === selectedActivityId) || null;
  }, [enrichedActivities, selectedActivityId]);

  const savedActivitiesList = useMemo(() => {
    return enrichedActivities.filter((a) => savedIds.includes(a.id));
  }, [enrichedActivities, savedIds]);

  // Dynamic Search Summary Pills calculation
  const summaryPills = useMemo(() => {
    const pills: { label: string; type: string }[] = [];
    
    if (filters.category !== 'All Categories' && filters.category !== 'All') {
      pills.push({ label: filters.category, type: 'category' });
    }

    if (filters.metroStationIds.length > 0) {
      const stationName = METRO_STATIONS.find((s) => s.id === filters.metroStationIds[0])?.name || 'Metro Station';
      pills.push({
        label: filters.metroStationIds.length === 1 ? `Near ${stationName}` : `${filters.metroStationIds.length} Stations`,
        type: 'metro',
      });
    } else if (filters.metroLineId !== 'all') {
      const lineName = METRO_LINES.find((l) => l.id === filters.metroLineId)?.name || 'Metro Line';
      pills.push({ label: `Near ${lineName}`, type: 'metroLine' });
    }

    if (filters.timeOfDaySlots.length > 0) {
      pills.push({ label: filters.timeOfDaySlots.join(', '), type: 'time' });
    }

    if (filters.daysOfWeek.length > 0) {
      pills.push({ label: filters.daysOfWeek.map((d) => d.substring(0, 3)).join(', '), type: 'days' });
    }

    if (filters.audience !== 'All') {
      pills.push({ label: filters.audience, type: 'audience' });
    }

    if (filters.searchKeyword) {
      pills.push({ label: `"${filters.searchKeyword}"`, type: 'keyword' });
    }

    if (pills.length === 0) {
      pills.push({ label: 'All Activities', type: 'default' });
      pills.push({ label: 'All Metro Lines', type: 'default' });
      pills.push({ label: 'Any Time', type: 'default' });
    }

    return pills;
  }, [filters]);

  const visibleActivities = useMemo(() => {
    return filteredActivities.slice(0, visibleCount);
  }, [filteredActivities, visibleCount]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased flex flex-col selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
      
      {/* Toast Feedback Overlay */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Header Navigation */}
      <Header
        savedCount={savedIds.length}
        bookingsCount={bookings.length}
        messagesCount={conversations.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        onOpenMessages={() => {
          setMessagingActivity(activeSelectedActivity || activities[0]);
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
        activeNavTab={activeNavTab}
        onNavTabChange={(tab) => setActiveNavTab(tab)}
      />

      {/* ROUTE 1: FULL PAGE DEDICATED LISTING DETAILS VIEW */}
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
          onAddReview={handleAddReview}
          onEditActivity={handleEditActivity}
        />
      ) : activeNavTab === 'my-week' ? (
        <MyWeekView
          activities={activities}
          userPreferences={userPrefs}
          onSavePreferences={handleSavePreferences}
          onSelectActivity={openActivityDetail}
          onReserveSpot={openActivityDetail}
          onToggleSave={toggleSave}
          savedIds={savedIds}
        />
      ) : activeNavTab === 'free-time' ? (
        <MyFreeTimePlanner
          preferences={userPrefs}
          onSavePreferences={handleSavePreferences}
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
        /* ROUTE 3: CUSTOMER DASHBOARD HUB */
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
        /* ROUTE 4: INSTRUCTOR & PROVIDER HUB */
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
        /* ROUTE 3: EXPLORE & SEARCH DISCOVERY VIEW */
        <>
          {/* Primary Search Hero Box */}
          <HeroSearch
            filters={filters}
            onApplySearch={(newF) => updateFilters(newF)}
            onOpenAiMatchmaker={() => setIsAiMatchmakerOpen(true)}
            onOpenFreeTimePlanner={() => {
          setActiveNavTab('free-time');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
          />

          {/* Main Page Layout Container */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
            
            {/* Shared layout: sidebar + toolbar persist across list / map / schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
                
                {/* Desktop Left Sidebar Filters (Sticky) */}
                <div className="hidden lg:block lg:col-span-1 sticky top-24">
                  <SidebarFilters
                    filters={filters}
                    onFilterChange={updateFilters}
                    onResetFilters={resetFilters}
                    resultsCount={filteredActivities.length}
                  />
                </div>

                {/* Mobile Filter Toggle Drawer Trigger */}
                <div className="lg:hidden">
                  <SidebarFilters
                    filters={filters}
                    onFilterChange={updateFilters}
                    onResetFilters={resetFilters}
                    resultsCount={filteredActivities.length}
                  />
                </div>

                {/* Main Content Area (Right Side - 2-Column Desktop Grid) */}
                <div className="lg:col-span-3 space-y-6">
                  
                  {/* Result Header & Current Search Summary Box — always visible across views */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-2xs space-y-4 sticky top-20 z-30">
                    
                    {/* Top Row: Total Count, View Toggle & Premium Sort */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      
                      {/* Prominent Activity Count */}
                      <div className="flex items-center space-x-3">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          {filteredActivities.length} Activities
                        </h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 bg-[#A2FF00] text-[#074213] rounded-full">
                          Available Near You
                        </span>
                      </div>

                      {/* Right Controls: View Switcher & Premium Sort */}
                      <div className="flex items-center space-x-3 flex-wrap">
                        
                        {/* Minimalist View Switcher */}
                        <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-full text-xs relative z-10">
                          <button
                            type="button"
                            onClick={() => setActiveView('list')}
                            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                              activeView === 'list'
                                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">List</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveView('map')}
                            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                              activeView === 'map'
                                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Metro Map</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveView('schedule')}
                            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                              activeView === 'schedule'
                                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Schedule</span>
                          </button>
                        </div>

                        {/* Premium Sort Dropdown */}
                        <div className="flex items-center space-x-1.5 text-xs">
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <select
                            value={filters.sortBy}
                            onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                            className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none min-h-[40px] cursor-pointer"
                          >
                            <option value="recommended">Recommended</option>
                            <option value="starts-soon">Starts Soon</option>
                            <option value="nearest">Nearest</option>
                            <option value="highest-rated">Highest Rated</option>
                            <option value="lowest-price">Lowest Price</option>
                            <option value="newest">Newest</option>
                            <option value="popular">Popular</option>
                          </select>
                        </div>

                      </div>

                    </div>

                    {/* Bottom Row: Current Search Summary Pills Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider mr-1">
                          Current Search:
                        </span>
                        {summaryPills.map((pill, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-medium border border-slate-200/60"
                          >
                            {pill.label}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                          setIsMobileFiltersOpen(true);
                        }}
                        className="text-xs font-bold text-slate-900 hover:text-emerald-700 underline cursor-pointer ml-auto"
                      >
                        Edit Search
                      </button>
                    </div>

                  </div>

                  {activeView === 'list' && (
                  <>
                  {/* Personalized Homepage Section Tabs */}
                  <div className="bg-slate-100/70 p-1.5 rounded-2xl overflow-x-auto">
                    <div className="flex space-x-1 min-w-max text-xs font-medium">
                      {[
                        { id: 'all', label: 'All Courses' },
                        { id: 'free-time', label: 'Fits Free Time' },
                        { id: 'tonight', label: 'Tonight' },
                        { id: 'weekend', label: 'This Weekend' },
                        { id: 'starts-this-week', label: 'Starts This Week' },
                        { id: 'near-metro', label: 'Near Metro' },
                        { id: 'free-trial', label: 'Free Trial' },
                        { id: 'popular', label: 'Popular' },
                      ].map((tab) => {
                        const isActive = activePersonalizedTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActivePersonalizedTab(tab.id as PersonalizedTab)}
                            className={`px-4 py-2 rounded-xl transition-all min-h-[38px] whitespace-nowrap cursor-pointer ${
                              isActive
                                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* LOADING STATE: Skeleton Cards */}
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-2xs animate-pulse flex flex-col justify-between h-[480px]"
                        >
                          <div>
                            <div className="h-56 w-full bg-slate-200 rounded-2xl mb-4" />
                            <div className="h-3 w-1/4 bg-slate-200 rounded mb-2" />
                            <div className="h-6 w-3/4 bg-slate-200 rounded mb-4" />
                            <div className="h-16 w-full bg-slate-100 rounded-2xl mb-4" />
                            <div className="h-4 w-1/2 bg-slate-200 rounded" />
                          </div>
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="h-4 w-1/3 bg-slate-200 rounded" />
                            <div className="h-10 w-28 bg-slate-200 rounded-xl" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredActivities.length === 0 ? (
                    /* EMPTY STATE FALLBACK (Enhanced with recovery actions) */
                    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/60 text-center space-y-6 shadow-2xs">
                      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8" />
                      </div>
                      
                      <div className="max-w-md mx-auto space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">No matching activities found</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          We couldn't find any activities matching your exact filters. Try relaxing your schedule or location criteria.
                        </p>
                      </div>

                      {/* Actionable Recovery Options */}
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          onClick={() => updateFilters({ metroStationIds: [], metroLineId: 'all' })}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                        >
                          Try another metro
                        </button>
                        <button
                          onClick={() => updateFilters({ timeOfDaySlots: [], daysOfWeek: [] })}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                        >
                          Remove time filter
                        </button>
                        <button
                          onClick={() => setActiveView('map')}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                        >
                          Explore nearby stations
                        </button>
                        <button
                          onClick={resetFilters}
                          className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          Clear All Filters
                        </button>
                      </div>

                      {/* Suggested Activities Section */}
                      <div className="pt-8 border-t border-slate-100 space-y-4 text-left">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
                          Suggested Activities You Might Like
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {enrichedActivities.slice(0, 2).map((act) => (
                            <ActivityCard
                              key={act.id}
                              activity={act}
                              isSaved={savedIds.includes(act.id)}
                              onToggleSave={toggleSave}
                              onSelectActivity={(activity) => openActivityDetail(activity)}
                              onQuickBook={handleQuickBook}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 2-COLUMN DESKTOP GRID RESULTS */
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {visibleActivities.map((act, index) => (
                          <React.Fragment key={act.id}>
                            {/* Insert "You May Also Like" Inline Recommendation after every 8-10 cards */}
                            {index > 0 && index % 8 === 0 && (
                              <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 my-2">
                                <div className="space-y-2 text-center md:text-left">
                                  <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-[#A2FF00] uppercase tracking-wider bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Curated For You</span>
                                  </div>
                                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                                    You May Also Like
                                  </h3>
                                  <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-normal">
                                    Browse popular courses with available slots nearby matching your current schedule interests.
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    window.scrollTo({ top: 350, behavior: 'smooth' });
                                    setIsAiMatchmakerOpen(true);
                                  }}
                                  className="px-6 py-3.5 bg-[#A2FF00] hover:bg-[#91E600] text-[#074213] text-xs font-bold rounded-2xl transition-all shadow-md shrink-0 cursor-pointer min-h-[44px]"
                                >
                                  Get AI Recommendations
                                </button>
                              </div>
                            )}

                            <ActivityCard
                              activity={act}
                              isSaved={savedIds.includes(act.id)}
                              onToggleSave={toggleSave}
                              onSelectActivity={(activity) => openActivityDetail(activity)}
                              onQuickBook={handleQuickBook}
                            />
                          </React.Fragment>
                        ))}
                      </div>

                      {/* PAGINATION / LOAD MORE CONTROL */}
                      {filteredActivities.length > visibleCount && (
                        <div className="pt-6 text-center space-y-3">
                          <p className="text-xs text-slate-500 font-medium">
                            Showing <strong className="text-slate-900 font-bold">{visibleActivities.length}</strong> of{' '}
                            <strong className="text-slate-900 font-bold">{filteredActivities.length}</strong> activities
                          </p>

                          <button
                            onClick={() => setVisibleCount((prev) => prev + 10)}
                            className="px-8 py-3.5 bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md text-slate-900 text-xs font-bold rounded-2xl transition-all cursor-pointer min-h-[44px] inline-flex items-center space-x-2"
                          >
                            <span>Load More Activities</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  </>
                  )}

                {activeView === 'map' && (
                  <div className="relative z-0">
                    <MetroMapView
                      activities={filteredActivities}
                      onSelectStation={(stId) => {
                        if (stId === 'all') {
                          updateFilters({ metroStationIds: [] });
                        } else {
                          updateFilters({ metroStationIds: [stId] });
                        }
                      }}
                      onSelectActivity={(act) => openActivityDetail(act)}
                      selectedStationId={filters.metroStationIds[0]}
                    />
                  </div>
                )}

                {activeView === 'schedule' && (
                  <WeeklyScheduleView
                    activities={filteredActivities}
                    onSelectActivity={(act) => openActivityDetail(act)}
                    userFreeTime={userPrefs.freeTime}
                  />
                )}

                </div>

              </div>

          </main>
        </>
      )}

      <Footer
        activityCount={filteredActivities.length}
        onGoHome={goHome}
        onNavTabChange={setActiveNavTab}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onOpenFreeTimePlanner={() => setActiveNavTab('free-time')}
      />

      {/* Modals & Utility Drawers */}
      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
      />

      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedActivities={savedActivitiesList}
        onRemoveSaved={toggleSave}
        onSelectActivity={(act) => {
          setIsSavedModalOpen(false);
          openActivityDetail(act);
        }}
      />

      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setActivityToEdit(null);
        }}
        onAddActivity={handleAddActivity}
        activityToEdit={activityToEdit}
      />

      <AiConciergeModal
        isOpen={isAiMatchmakerOpen}
        onClose={() => setIsAiMatchmakerOpen(false)}
        activities={activities}
        onSelectActivity={(act) => {
          setIsAiMatchmakerOpen(false);
          openActivityDetail(act);
        }}
      />

      <ContactInstructorModal
        isOpen={!!contactActivity}
        activity={contactActivity}
        onClose={() => setContactActivity(null)}
        onSendInquiry={handleSendInquiry}
      />

      <WaitlistModal
        isOpen={!!waitlistActivity}
        activity={waitlistActivity}
        allActivities={activities}
        onClose={() => setWaitlistActivity(null)}
        onSelectActivity={(act) => {
          setWaitlistActivity(null);
          openActivityDetail(act);
        }}
        onBookAlternativeSession={(act, sessionDate) => {
          setWaitlistActivity(null);
          addToast('success', `Reserved for ${sessionDate}!`, `Your spot in ${act.title} is confirmed.`);
          handleConfirmBooking(act, {
            userName: 'Demo User',
            userEmail: 'user@example.com',
            userPhone: '+7 999 123-45-67',
            date: sessionDate,
          });
        }}
      />

      <ActivityMessagingModal
        isOpen={isMessagingModalOpen}
        activity={messagingActivity}
        onClose={() => {
          setIsMessagingModalOpen(false);
          setMessagingActivity(null);
        }}
        conversations={conversations}
        onSendMessage={handleSendMessage}
      />

      {/* Floating Action Button for Instructors */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-[5.5rem] sm:bottom-6 right-4 sm:right-6 z-30 flex items-center space-x-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-lg border border-slate-700 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
        title="Post a Class"
      >
        <PlusCircle className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform duration-200" />
        <span className="hidden sm:inline">Post a Class</span>
      </button>

    </div>
  );
}
