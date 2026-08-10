import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Navigation,
  Download,
  ExternalLink,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

export interface BookedSession {
  id: string;
  activityTitle: string;
  category: string;
  image: string;
  date: string;
  time: string;
  isToday: boolean;
  metroStation: string;
  walkTime: string;
  address: string;
  seats: number;
  spotNumber: string;
  instructorName: string;
  instructorNote: string;
  userName: string;
  userEmail: string;
  status: 'Confirmed' | 'Waitlisted' | 'Pending';
}

interface UpcomingSectionProps {
  bookings: BookedSession[];
  onCancelBooking: (id: string) => void;
  onExploreMore?: () => void;
}

const DEFAULT_BOOKINGS: BookedSession[] = [
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
    instructorNote: 'Please arrive 10 minutes early. All clay & glazing materials provided on site.',
    userName: 'Amar Sharma',
    userEmail: 'amar@example.com',
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
    instructorNote: 'Bring your preferred water bottle. Mats and props are provided.',
    userName: 'Amar Sharma',
    userEmail: 'amar@example.com',
    status: 'Confirmed'
  }
];

export const UpcomingSection: React.FC<UpcomingSectionProps> = ({
  bookings = DEFAULT_BOOKINGS,
  onCancelBooking,
  onExploreMore
}) => {
  const [selectedDirectionBooking, setSelectedDirectionBooking] = useState<BookedSession | null>(null);

  const generateGoogleCalendarUrl = (b: BookedSession) => {
    const title = encodeURIComponent(`Activity: ${b.activityTitle}`);
    const details = encodeURIComponent(
      `Booked for ${b.userName}. Metro: ${b.metroStation} (${b.walkTime}). Instructor Note: ${b.instructorNote}`
    );
    const location = encodeURIComponent(`${b.address} near ${b.metroStation} Metro`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const downloadIcs = (b: BookedSession) => {
    const content = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ActivityFinderHub//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${b.activityTitle}`,
      `DESCRIPTION:Metro: ${b.metroStation} (${b.walkTime}). Address: ${b.address}`,
      `LOCATION:${b.address}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `session-${b.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const todaySessions = bookings.filter((b) => b.isToday);
  const futureSessions = bookings.filter((b) => !b.isToday);

  return (
    <div className="space-y-6">
      {/* Today's Sessions Highlight Banner */}
      {todaySessions.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-emerald-500/20 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  Today's Scheduled Session
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{todaySessions[0].activityTitle}</h3>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 pt-0.5">
                <span className="font-semibold text-emerald-300">{todaySessions[0].time}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{todaySessions[0].metroStation} ({todaySessions[0].walkTime})</span>
                </span>
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setSelectedDirectionBooking(todaySessions[0])}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Upcoming Section List */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Upcoming Activity Sessions</h2>
          <p className="text-xs text-slate-500">
            Your reserved spots and trial class schedules across metro locations.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full shrink-0">
          {bookings.length} {bookings.length === 1 ? 'Session' : 'Sessions'} Total
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-3">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No upcoming activity bookings</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore trial classes near your preferred metro line and reserve a spot in seconds.
          </p>
          {onExploreMore && (
            <button
              onClick={onExploreMore}
              className="mt-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all inline-flex items-center space-x-2"
            >
              <span>Explore Activities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {bookings.map((b) => (
            <div
              key={b.id}
              className={`bg-white border rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative ${
                b.isToday ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200'
              }`}
            >
              {/* Top Details Header */}
              <div className="flex items-start space-x-3 sm:space-x-4">
                <img
                  src={b.image}
                  alt={b.activityTitle}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-100"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md truncate max-w-[120px] sm:max-w-none">
                      {b.category}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{b.status}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {b.activityTitle}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-0.5 pt-0.5">
                    <p className="flex items-center space-x-1 font-semibold text-slate-800">
                      <CalendarIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{b.date} • {b.time}</span>
                    </p>
                    <p className="flex items-center space-x-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{b.metroStation} ({b.walkTime})</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Reserved Seats & Instructor Note */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center space-x-1 font-semibold">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Seats: <strong className="text-slate-900">{b.seats} Seat</strong> ({b.spotNumber})</span>
                  </span>
                </div>
                {b.instructorNote && (
                  <p className="text-[11px] text-slate-500 flex items-start space-x-1.5 pt-0.5 border-t border-slate-200/60">
                    <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-700">{b.instructorName}:</strong> {b.instructorNote}</span>
                  </p>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-center sm:space-x-2 text-xs">
                  <a
                    href={generateGoogleCalendarUrl(b)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors text-[11px] min-h-[36px]"
                  >
                    <ExternalLink className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>Google Cal</span>
                  </a>

                  <button
                    onClick={() => downloadIcs(b)}
                    className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors text-[11px] min-h-[36px] cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>.ics</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2 justify-between sm:justify-end">
                  <button
                    onClick={() => setSelectedDirectionBooking(b)}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors min-h-[36px] cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Get Directions</span>
                  </button>

                  <button
                    onClick={() => onCancelBooking(b.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Directions Modal */}
      {selectedDirectionBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Directions & Location Info</h3>
              </div>
              <button
                onClick={() => setSelectedDirectionBooking(null)}
                className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                  {selectedDirectionBooking.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{selectedDirectionBooking.activityTitle}</h4>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Address:</strong>
                    <span>{selectedDirectionBooking.address}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Navigation className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Nearest Metro Station:</strong>
                    <span>{selectedDirectionBooking.metroStation} ({selectedDirectionBooking.walkTime})</span>
                  </div>
                </div>
              </div>

              {/* Mock Map Preview Frame */}
              <div className="h-44 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center space-y-2 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                <MapPin className="w-8 h-8 text-rose-500 animate-bounce relative z-10" />
                <span className="font-semibold text-slate-800 relative z-10">
                  Interactive Route to {selectedDirectionBooking.metroStation} Metro
                </span>
                <span className="text-[11px] text-slate-500 relative z-10">
                  Turn-by-turn walking guidance from metro exit #2 directly to studio entrance.
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedDirectionBooking(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Close Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
