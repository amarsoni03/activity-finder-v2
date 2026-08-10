import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Bell,
  UserCheck,
  Users,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Plus,
  AlertCircle,
  Bookmark,
} from 'lucide-react';
import { Activity } from '../types';
import { formatPrice } from '../utils/formatters';

export interface WaitlistState {
  joinedActivityIds: Record<string, { position: number; joinedAt: string }>;
  notifiedActivityIds: Record<string, boolean>;
}

export interface WaitlistModalProps {
  isOpen: boolean;
  activity: Activity | null;
  allActivities?: Activity[];
  onClose: () => void;
  onSelectActivity: (activity: Activity) => void;
  onBookAlternativeSession?: (activity: Activity, sessionDate: string) => void;
}

// Generate mock alternative upcoming session dates for an activity
const getMockAlternativeSessions = (act: Activity) => {
  const baseDays = act.weekdays || ['Sat', 'Wed'];
  return [
    {
      id: 'alt-1',
      date: 'Sat, Aug 15',
      time: act.schedule?.timeRange || act.sessionTime || '14:00 - 16:00',
      availableSeats: 4,
    },
    {
      id: 'alt-2',
      date: 'Wed, Aug 19',
      time: act.schedule?.timeRange || act.sessionTime || '18:30 - 20:30',
      availableSeats: 6,
    },
    {
      id: 'alt-3',
      date: 'Sat, Aug 22',
      time: act.schedule?.timeRange || act.sessionTime || '14:00 - 16:00',
      availableSeats: 2,
    },
  ];
};

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  activity,
  allActivities = [],
  onClose,
  onSelectActivity,
  onBookAlternativeSession,
}) => {
  // Load waitlist state from local storage
  const [waitlistState, setWaitlistState] = useState<WaitlistState>(() => {
    const local = localStorage.getItem('af_user_waitlist_state');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return { joinedActivityIds: {}, notifiedActivityIds: {} };
  });

  const [notificationSuccessMsg, setNotificationSuccessMsg] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('af_user_waitlist_state', JSON.stringify(waitlistState));
  }, [waitlistState]);

  if (!isOpen || !activity) return null;

  const actId = activity.id;
  const isWaitlisted = Boolean(waitlistState.joinedActivityIds[actId]);
  const isNotified = Boolean(waitlistState.notifiedActivityIds[actId]);
  const userPosition = waitlistState.joinedActivityIds[actId]?.position || 3;

  // Toggle Join Waitlist
  const handleToggleWaitlist = () => {
    setWaitlistState((prev) => {
      const nextJoined = { ...prev.joinedActivityIds };
      if (nextJoined[actId]) {
        delete nextJoined[actId];
      } else {
        // Assign mock position (e.g. #3 or random 2-4)
        const mockPos = Math.floor(Math.random() * 3) + 2;
        nextJoined[actId] = { position: mockPos, joinedAt: new Date().toISOString() };
      }
      return { ...prev, joinedActivityIds: nextJoined };
    });
  };

  // Toggle Notify Me
  const handleToggleNotify = () => {
    const nextState = !isNotified;
    setWaitlistState((prev) => ({
      ...prev,
      notifiedActivityIds: {
        ...prev.notifiedActivityIds,
        [actId]: nextState,
      },
    }));

    if (nextState) {
      setNotificationSuccessMsg("Instant notifications enabled! We'll SMS & email you the moment a spot opens.");
      setTimeout(() => setNotificationSuccessMsg(null), 4000);
    }
  };

  // Find similar activities with open seats
  const similarActivities = allActivities
    .filter(
      (a) =>
        a.id !== actId &&
        (a.category === activity.category || a.metroStationName === activity.metroStationName) &&
        (a.availableSeats || a.seatsLeft || 0) > 0
    )
    .slice(0, 3);

  const alternativeSessions = getMockAlternativeSessions(activity);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* --- 1. TOP HEADER BANNER --- */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Session Fully Booked • High Demand</span>
            </div>

            <h2 className="text-xl font-extrabold text-white pt-1">
              Join Waitlist & Explore Open Dates
            </h2>
            <p className="text-xs text-slate-300">
              Don't miss out! Get priority alerts if a spot opens up or book alternative dates instantly.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- 2. MODAL CONTENT CONTAINER --- */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* Toast Alert Feedback */}
          {notificationSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center space-x-2 animate-fade-in shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{notificationSuccessMsg}</span>
            </div>
          )}

          {/* Activity Target Preview Card (Course First Philosophy) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={activity.image || activity.coverImage}
                alt={activity.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div>
                <span className="text-[10px] font-extrabold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                  {activity.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">{activity.title}</h3>
                <p className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                  <span className="flex items-center space-x-1 text-slate-700 font-medium">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{activity.metroStationName || activity.metroStation}</span>
                  </span>
                  <span>•</span>
                  <span>{formatPrice(activity.price)}</span>
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-bold inline-block">
                0 Seats Available
              </span>
            </div>
          </div>

          {/* --- 3. WAITLIST & NOTIFY ACTION CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Action 1: Join Waitlist */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isWaitlisted
                ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl ${isWaitlisted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Waitlist Status</h4>
                </div>

                {isWaitlisted && (
                  <span className="px-2.5 py-1 text-xs font-black bg-emerald-600 text-white rounded-full shadow-xs">
                    Position #{userPosition}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mb-3">
                {isWaitlisted
                  ? `You are #${userPosition} on the waitlist! If someone cancels, your spot will be held.`
                  : 'Join the priority waitlist. If a participant cancels, you will get top priority.'}
              </p>

              <button
                onClick={handleToggleWaitlist}
                className={`w-full py-2.5 px-3 font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 ${
                  isWaitlisted
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isWaitlisted ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>On Waitlist (#Position {userPosition})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Join Waitlist</span>
                  </>
                )}
              </button>
            </div>

            {/* Action 2: Notify Me */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isNotified
                ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl ${isNotified ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Instant Notifications</h4>
                </div>

                {isNotified && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-md">
                    Active
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mb-3">
                {isNotified
                  ? 'Notification alerts enabled! We will alert you immediately if a spot opens.'
                  : 'Get instant SMS and email notifications when a seat opens up for this session.'}
              </p>

              <button
                onClick={handleToggleNotify}
                className={`w-full py-2.5 px-3 font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 ${
                  isNotified
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{isNotified ? 'Notifications Enabled' : 'Notify Me When Spot Opens'}</span>
              </button>
            </div>

          </div>

          {/* --- 4. ALTERNATIVE SESSIONS FOR THIS ACTIVITY --- */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Alternative Session Dates (Open Spots)</span>
            </h4>

            <div className="space-y-2">
              {alternativeSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3.5 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-extrabold text-xs shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs block">
                        {session.date} • {session.time}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{session.availableSeats} spots open</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onBookAlternativeSession) {
                        onBookAlternativeSession(activity, session.date);
                      } else {
                        onSelectActivity(activity);
                      }
                      onClose();
                    }}
                    className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center space-x-1.5"
                  >
                    <span>Reserve Date</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- 5. SIMILAR AVAILABLE ACTIVITIES --- */}
          {similarActivities.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Similar Activities with Open Seats</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarActivities.map((simAct) => (
                  <div
                    key={simAct.id}
                    onClick={() => {
                      onSelectActivity(simAct);
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl space-y-2 cursor-pointer transition-all group shadow-2xs"
                  >
                    <img
                      src={simAct.image || simAct.coverImage}
                      alt={simAct.title}
                      className="w-full h-20 rounded-xl object-cover group-hover:scale-102 transition-transform"
                    />
                    <span className="text-[9px] font-extrabold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded-md inline-block">
                      {simAct.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                      {simAct.title}
                    </h5>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="font-extrabold text-slate-900">{formatPrice(simAct.price)}</span>
                      <span className="text-emerald-700 font-bold">{simAct.availableSeats || 4} left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
