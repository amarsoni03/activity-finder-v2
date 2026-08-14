import { Activity, Booking, WaitlistEntry, ActivityConversation } from '../types';
import { INITIAL_ACTIVITIES } from '../data/activitiesData';

export const STORAGE_KEYS = {
  ACTIVITIES: 'af_activities_moscow',
  SAVED: 'af_saved',
  BOOKINGS: 'af_bookings',
  WAITLISTS: 'af_waitlists',
  CONVERSATIONS: 'af_conversations',
  USER_PREFERENCES: 'af_user_preferences',
  USER_WAITLIST_STATE: 'af_user_waitlist_state',
  PROVIDER_DRAFT: 'activity_finder_provider_draft',
} as const;

export const INITIAL_WAITLISTS: WaitlistEntry[] = [
  {
    id: 'wl-1',
    activityId: 'act-1',
    activityTitle: 'Wheel Throwing & Clay Sculpting Masterclass',
    userName: 'Svetlana Ivanova',
    userEmail: 'svetlana.i@example.com',
    userPhone: '+7 999 444-55-66',
    requestedDate: 'Aug 12, 2026',
    createdAt: 'Aug 1, 2026',
    status: 'pending',
  },
];

export const INITIAL_CONVERSATIONS: ActivityConversation[] = [
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
        quickTopic: 'Skill Level',
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
            size: '1.1 MB',
          },
        ],
      },
    ],
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
        quickTopic: 'Equipment & Gear',
      },
      {
        id: 'msg-4',
        sender: 'provider',
        senderName: 'Anna Karenina',
        text: 'Hi Alex! High-quality Manduka mats and blocks are provided free of charge. You just need comfortable workout clothes!',
        timestamp: 'Today at 12:30',
      },
    ],
  },
];

export function loadStoredActivities(): Activity[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return local ? JSON.parse(local) : INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function saveStoredActivities(activities: Activity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch {}
}

export function loadStoredSavedIds(): string[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.SAVED);
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

export function saveStoredSavedIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(ids));
  } catch {}
}

export function loadStoredBookings(): Booking[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return local ? JSON.parse(local) : [];
  } catch {
    return [];
  }
}

export function saveStoredBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch {}
}

export function loadStoredWaitlists(): WaitlistEntry[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.WAITLISTS);
    return local ? JSON.parse(local) : INITIAL_WAITLISTS;
  } catch {
    return INITIAL_WAITLISTS;
  }
}

export function saveStoredWaitlists(waitlists: WaitlistEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WAITLISTS, JSON.stringify(waitlists));
  } catch {}
}

export function loadStoredConversations(): ActivityConversation[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return local ? JSON.parse(local) : INITIAL_CONVERSATIONS;
  } catch {
    return INITIAL_CONVERSATIONS;
  }
}

export function saveStoredConversations(conversations: ActivityConversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } catch {}
}
