import React, { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle, Trash2, ExternalLink, Download, Navigation, Users, CalendarDays, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../types';
import { useDialogFocus } from '../../../hooks/useDialogFocus';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
}) => {
  const [selectedDirectionBooking, setSelectedDirectionBooking] = useState<Booking | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const dialogRef = useDialogFocus(isOpen, onClose);

  const generateGoogleCalendarUrl = (b: Booking) => {
    const title = encodeURIComponent(`Trial Class: ${b.activityTitle}`);
    const details = encodeURIComponent(`Booked for ${b.userName} (${b.userEmail}). Schedule: ${b.scheduleText}`);
    const location = encodeURIComponent(`${b.metroStationName} Station`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const downloadIcs = (b: Booking) => {
    const content = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ActivityFinder//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Trial Class: ${b.activityTitle}`,
      `DESCRIPTION:Booked for ${b.userName}. Schedule: ${b.scheduleText}`,
      `LOCATION:${b.metroStationName} Station`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `booking-${b.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancelClick = (bookingId: string) => {
    if (cancelConfirmId === bookingId) {
      onCancelBooking(bookingId);
      setCancelConfirmId(null);
    } else {
      setCancelConfirmId(bookingId);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookings-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/70 overflow-hidden flex flex-col max-h-[90vh] focus:outline-none"
          >

        {/* ── Modal Header ── */}
        <div className="px-5 py-4 bg-white border-b border-slate-200/70 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#A2FF00] text-[#074213] flex items-center justify-center shrink-0">
              <CalendarDays className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 id="bookings-modal-title" className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">My Bookings</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {bookings.length === 0 ? 'No sessions yet' : `${bookings.length} reserved session${bookings.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {bookings.length > 0 && (
              <span className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-[#074213] text-[#A2FF00] text-[10px] font-extrabold rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span>All Confirmed</span>
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Close bookings"
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-slate-50/50">
          {bookings.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-800">No trial classes booked yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Explore activities near your metro line and reserve a trial spot in one click!
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs hover:shadow-sm overflow-hidden"
              >
                {/* Card Top: Status Bar */}
                <div className="px-4 py-2 bg-[#074213]/[0.03] border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md uppercase tracking-wider">
                      {b.category}
                    </span>
                  </div>
                  <span className="flex items-center space-x-1 text-[11px] font-bold text-[#074213] bg-[#A2FF00]/20 px-2.5 py-0.5 rounded-full border border-[#A2FF00]/30">
                    <CheckCircle className="w-3 h-3" />
                    <span>Confirmed</span>
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {b.activityTitle}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-[#074213] shrink-0" />
                      <span className="font-semibold">{b.scheduleText}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{b.metroStationName} Station</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 sm:col-span-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Booked for <strong className="text-slate-800">{b.userName}</strong> ({b.userEmail}) · 1 Seat
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <a
                      href={generateGoogleCalendarUrl(b)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#074213]/30 text-slate-700 hover:text-[#074213] font-semibold rounded-xl flex items-center space-x-1.5 transition-colors text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Google Calendar</span>
                    </a>
                    <button
                      onClick={() => downloadIcs(b)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl flex items-center space-x-1.5 transition-colors text-[11px] cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-slate-400" />
                      <span>.ics</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setSelectedDirectionBooking(b)}
                      className="px-3 py-1.5 bg-[#074213] text-white hover:bg-[#074213]/90 font-bold rounded-xl text-[11px] flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3 h-3 text-[#A2FF00]" />
                      <span>Directions</span>
                    </button>

                    <button
                      onClick={() => handleCancelClick(b.id)}
                      className={`px-3 py-1.5 font-semibold rounded-xl text-[11px] flex items-center space-x-1 transition-all cursor-pointer ${
                        cancelConfirmId === b.id
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200'
                      }`}
                      title={cancelConfirmId === b.id ? 'Click again to confirm' : 'Cancel booking'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {cancelConfirmId === b.id && <span>Confirm?</span>}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Directions Sub-Panel ── */}
        {selectedDirectionBooking && (
          <div className="px-5 py-4 bg-[#074213] text-white space-y-2 border-t border-[#074213]/50 shrink-0" style={{ animation: 'fadeIn .15s ease-out' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A2FF00] flex items-center space-x-1.5">
                <Navigation className="w-4 h-4" />
                <span>Directions to {selectedDirectionBooking.activityTitle}</span>
              </span>
              <button
                onClick={() => setSelectedDirectionBooking(null)}
                className="text-xs text-white/60 hover:text-white font-semibold px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Location: <strong className="text-white">{selectedDirectionBooking.metroStationName} Station</strong> exit #2. Studio is 3–5 minutes walk down the main street.
            </p>
          </div>
        )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
