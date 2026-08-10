import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Star,
  Heart,
  GraduationCap,
  Award,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Download,
  User,
  Mail,
  Phone,
  CheckCircle2,
  BookOpen,
  Flame,
  Building,
  FileText,
  MessageSquare,
  Sparkles,
  Navigation,
  Edit,
  Laptop,
  Video,
  Globe,
  RefreshCw,
  PlayCircle,
} from 'lucide-react';
import { Activity } from '../types';
import { formatPrice } from '../utils/formatters';
import {
  AvailableSession,
  DayGroup,
  generateMockAvailableSessions,
} from '../data/availableSessions';
import { ActivityCard } from './ActivityCard';
import { Reviews } from './Reviews';
import { ProviderTrustBadge } from './ProviderTrustBadge';
import { MobileBookingDrawer } from './MobileBookingDrawer';

interface BookingFormContentProps {
  activity: Activity;
  userName: string;
  setUserName: (val: string) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  userPhone: string;
  setUserPhone: (val: string) => void;
  enrollmentMode: 'trial' | 'full';
  setEnrollmentMode: (mode: 'trial' | 'full') => void;
  selectedSession: AvailableSession | null;
  isWorkshop: boolean;
  isBookedSuccess: boolean;
  setIsBookedSuccess: (val: boolean) => void;
  handleSubmitBooking: (e: React.FormEvent) => void;
  ctaText: string;
  trialText: string;
  generateGoogleCalendarUrl: () => string;
  downloadIcs: () => void;
  isMobileDrawer?: boolean;
}

const BookingFormContent: React.FC<BookingFormContentProps> = ({
  activity,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userPhone,
  setUserPhone,
  enrollmentMode,
  setEnrollmentMode,
  selectedSession,
  isWorkshop,
  isBookedSuccess,
  setIsBookedSuccess,
  handleSubmitBooking,
  ctaText,
  trialText,
  generateGoogleCalendarUrl,
  downloadIcs,
  isMobileDrawer = false,
}) => {
  const isSubmitDisabled =
    !userName.trim() || !userEmail.trim() || (isWorkshop && !selectedSession);

  const priceAndEssentials = (
    <div className="space-y-4">
      {/* Price */}
      <div className="space-y-1.5 pb-4 border-b border-slate-100">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Price</span>
        <div className="flex items-baseline space-x-2">
          <div className="text-3xl font-extrabold text-[#074213]">
            {formatPrice(activity.regularPrice || activity.price)}
          </div>
          <span className="text-xs text-slate-500 font-normal">/ {activity.priceUnit || 'per class'}</span>
        </div>
      </div>

      {/* Key Booking Essentials Strip */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-emerald-950">
          <span className="font-semibold">Trial availability:</span>
          <span className="font-extrabold text-emerald-700">{trialText}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-amber-50/70 rounded-xl border border-amber-100 text-amber-950">
          <span className="font-semibold">Seats remaining:</span>
          <span className="font-extrabold text-amber-800">{activity.availableSeats || 8} spots left</span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Start date:</span>
          <span className="font-bold text-slate-900">{activity.startDate}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Next session:</span>
          <span className="font-bold text-slate-900">
            {activity.schedule?.specificDaysText || 'Tue & Thu'} ({activity.startTime || '18:30'})
          </span>
        </div>
      </div>
    </div>
  );

  const formFields = (
    <div className="space-y-4">
      {/* Enrollment Option Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setEnrollmentMode('trial')}
          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
            enrollmentMode === 'trial'
              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/30'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className="text-[10px] text-emerald-600 uppercase font-extrabold">Option 1</div>
          <div>
            {activity.trialPrice === 0 || activity.isFreeTrial
              ? 'Free Trial (0 ₽)'
              : activity.trialPrice !== undefined && activity.trialPrice > 0
              ? `Trial (${activity.trialPrice.toLocaleString()} ₽)`
              : 'Trial Session'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setEnrollmentMode('full')}
          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
            enrollmentMode === 'full'
              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/30'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className="text-[10px] text-slate-400 uppercase font-extrabold">Option 2</div>
          <div>Full Course</div>
        </button>
      </div>

      {/* Contact Inputs */}
      <div className="space-y-2.5">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-400/50 min-h-[42px]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-400/50 min-h-[42px]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number (Optional)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="+7 999 123-45-67"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-400/50 min-h-[42px]"
            />
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="pt-1 text-[11px] text-slate-500 space-y-1.5">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Free cancellation up to 24 hours prior</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Instant seat reservation & calendar sync</span>
        </div>
      </div>
    </div>
  );

  const submitButton = (
    <button
      type="submit"
      disabled={isSubmitDisabled}
      className={`w-full py-3.5 px-4 text-[#A2FF00] font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 min-h-[48px] cursor-pointer ${
        isSubmitDisabled
          ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none opacity-80'
          : 'bg-[#074213] hover:bg-[#05310e]'
      }`}
    >
      <span>{ctaText}</span>
      <ArrowRight className="w-4 h-4 text-[#A2FF00]" />
    </button>
  );

  const successContent = (
    <div className="bg-[#074213] text-white p-5 rounded-2xl space-y-3 text-center animate-fade-in">
      <CheckCircle2 className="w-10 h-10 mx-auto text-[#A2FF00]" />
      <h3 className="font-bold text-base">Booking Confirmed!</h3>
      <p className="text-xs opacity-90 leading-relaxed">
        Confirmation sent to <strong>{userEmail}</strong>. Class starts <strong>{activity.startDate}</strong>!
      </p>

      {/* Calendar Export Buttons */}
      <div className="pt-2 space-y-2 text-xs">
        <a
          href={generateGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          <span>Add to Google Calendar</span>
        </a>
        <button
          type="button"
          onClick={downloadIcs}
          className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download .ics</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsBookedSuccess(false)}
        className="text-xs underline pt-2 block mx-auto text-emerald-200 cursor-pointer"
      >
        Modify Booking
      </button>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <form onSubmit={handleSubmitBooking} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-5 space-y-5 overscroll-contain">
          {priceAndEssentials}
          {isBookedSuccess ? successContent : formFields}
        </div>
        {!isBookedSuccess && (
          <div className="shrink-0 p-4 border-t border-slate-100 bg-white pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg">
            {submitButton}
          </div>
        )}
      </form>
    );
  }

  return (
    <div className="space-y-5">
      {priceAndEssentials}
      {isBookedSuccess ? (
        successContent
      ) : (
        <form onSubmit={handleSubmitBooking} className="space-y-4">
          {formFields}
          {submitButton}
        </form>
      )}
    </div>
  );
};

interface ActivityDetailPageProps {
  activity: Activity;
  activities?: Activity[];
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (activityId: string) => void;
  onConfirmBooking: (
    activity: Activity,
    bookingDetails: { userName: string; userEmail: string; userPhone: string; date: string }
  ) => void;
  onOpenContactInstructor?: (activity: Activity) => void;
  onSelectActivity?: (activity: Activity) => void;
  onAddReview?: (activityId: string, rating: number, comment: string) => void;
  onEditActivity?: (activity: Activity) => void;
}

export const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({
  activity,
  activities = [],
  onBack,
  isSaved,
  onToggleSave,
  onConfirmBooking,
  onOpenContactInstructor,
  onSelectActivity,
  onAddReview,
  onEditActivity,
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const isWorkshop =
    activity.isOneTimeWorkshop ||
    activity.frequency === 'One-time Event' ||
    activity.frequency === 'One-Time Workshop';

  // Available Sessions Widget State (Only used if one-time workshop)
  const [dayGroups] = useState<DayGroup[]>(() => generateMockAvailableSessions(activity));
  const [selectedSession, setSelectedSession] = useState<AvailableSession | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Enrollment mode selection (Free Trial vs Full Course)
  const [enrollmentMode, setEnrollmentMode] = useState<'trial' | 'full'>('trial');
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Active gallery image index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Scroll to top on page mount or activity change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activity.id]);

  const handleSelectSession = (session: AvailableSession) => {
    setSelectedSession(session);
    setSelectedDate(session.formattedFull);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    if (isWorkshop && !selectedSession) return;

    const finalDate = isWorkshop
      ? selectedDate || selectedSession?.formattedFull || activity.startDate
      : `Course Instance starting ${activity.startDate} (${activity.schedule?.specificDaysText || 'Fixed Schedule'}, ${activity.startTime}–${activity.endTime})`;

    onConfirmBooking(activity, {
      userName,
      userEmail,
      userPhone,
      date: `${enrollmentMode === 'trial' ? 'Free Trial: ' : 'Full Course: '}${finalDate}`,
    });
    setIsBookedSuccess(true);
  };

  const formatIsoBasic = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Course: ${activity.title}`);
    const details = encodeURIComponent(
      `Booked for ${userName || 'Student'}. Start Date: ${activity.startDate}. Schedule: ${activity.schedule?.specificDaysText || 'Fixed Schedule'} (${activity.startTime}–${activity.endTime}). Metro: ${activity.metroStationName || activity.metroStation}`
    );
    const location = encodeURIComponent(
      `${activity.studio?.name || activity.studioName || ''}, ${activity.metroStationName || activity.metroStation} Station`
    );
    let datesParam = '';
    if (selectedSession && selectedSession.startDateTime && selectedSession.endDateTime) {
      const startStr = formatIsoBasic(selectedSession.startDateTime);
      const endStr = formatIsoBasic(selectedSession.endDateTime);
      datesParam = `&dates=${startStr}/${endStr}`;
    }
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${datesParam}`;
  };

  const downloadIcs = () => {
    const dtStart = selectedSession ? formatIsoBasic(selectedSession.startDateTime) : '20260915T183000Z';
    const dtEnd = selectedSession ? formatIsoBasic(selectedSession.endDateTime) : '20260915T200000Z';
    const content = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ActivityFinder//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Course: ${activity.title}`,
      `DESCRIPTION:Start Date: ${activity.startDate}. Schedule: ${activity.schedule?.specificDaysText || 'Fixed Schedule'}. Metro: ${activity.metroStationName || activity.metroStation}`,
      `LOCATION:${activity.studio?.name || activity.studioName || ''}, ${activity.metroStationName || activity.metroStation} Station`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `enrollment-${activity.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine Primary CTA text dynamically
  const getPrimaryCtaText = (act: Activity): string => {
    const typeStr = (
      (act as any).listingType ||
      (act as any).type ||
      (act as any).programType ||
      act.category ||
      act.frequency ||
      (act as any).regularity ||
      ''
    ).toLowerCase();
    if (typeStr.includes('corporate')) return 'Request Quote';
    if (typeStr.includes('camp')) return 'Reserve Place';
    if (act.isOneTimeWorkshop || typeStr.includes('workshop')) return 'Book Workshop';
    if (typeStr.includes('class') || typeStr.includes('single')) return 'Book Class';
    return 'Reserve Spot';
  };

  const ctaText = getPrimaryCtaText(activity);

  // Determine Activity Type Category for Dynamic Rendering
  const getActivityTypeCategory = (act: Activity): 'program' | 'class' | 'workshop' | 'event' | 'camp' => {
    const typeStr = (
      (act as any).listingType ||
      (act as any).type ||
      (act as any).programType ||
      act.category ||
      act.frequency ||
      (act as any).regularity ||
      ''
    ).toLowerCase();
    if (typeStr.includes('camp')) return 'camp';
    if (typeStr.includes('event')) return 'event';
    if (act.isOneTimeWorkshop || typeStr.includes('workshop')) return 'workshop';
    if (typeStr.includes('class') || typeStr.includes('single')) return 'class';
    return 'program';
  };

  const activityTypeCat = getActivityTypeCategory(activity);

  // Image Gallery setup
  const primaryImg = activity.coverImage || activity.image || (activity.galleryImages && activity.galleryImages[0]) || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80';
  const galleryImages = [
    primaryImg,
    ...(activity.galleryImages && activity.galleryImages.length > 1 ? activity.galleryImages.slice(1) : [
      'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    ]),
  ];

  // Similar Activities logic
  const similarActivities = activities
    .filter((act) => act.id !== activity.id && (act.category === activity.category || act.audience === activity.audience))
    .slice(0, 3);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = () => {
    if (window.innerWidth < 1024) {
      setIsMobileDrawerOpen(true);
    } else {
      scrollToSection('booking-panel');
    }
  };

  const learningOutcomes = activity.learningOutcomes || [
    'Master foundational and intermediate skill techniques',
    'Practical execution under experienced instructor guidance',
    'Build confidence and performance capability in small group sessions',
  ];

  const trialText =
    activity.trialPrice === 0 || activity.isFreeTrial
      ? '0 ₽ Free Trial'
      : activity.trialPrice !== undefined && activity.trialPrice > 0
      ? `${activity.trialPrice.toLocaleString()} ₽ Trial Session`
      : 'Trial Available';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col pb-28 lg:pb-16 font-sans">
      
      {/* Top Header Navigation */}
      <div className="sticky top-16 sm:top-18 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to search</span>
          </button>

          <div className="flex items-center space-x-3">
            {onEditActivity && (
              <button
                onClick={() => onEditActivity(activity)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-full transition-all min-h-[44px] cursor-pointer shadow-xs"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Listing</span>
              </button>
            )}

            <button
              onClick={() => onToggleSave(activity.id)}
              aria-label={isSaved ? 'Remove from saved' : 'Save activity'}
              className={`inline-flex items-center justify-center rounded-full border text-xs font-semibold transition-all shrink-0 w-11 h-11 sm:w-auto sm:h-auto sm:min-h-[44px] sm:px-4 sm:py-2 sm:gap-1.5 ${
                isSaved
                  ? 'bg-slate-900 border-slate-900 text-[#A2FF00]'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#A2FF00]' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleOpenBooking}
              className="px-5 py-2.5 bg-[#074213] hover:bg-[#05310e] text-[#A2FF00] font-bold text-xs rounded-full transition-all min-h-[44px] flex items-center justify-center cursor-pointer shadow-sm"
            >
              {ctaText}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-8">
        
        {/* ========================================================================= */}
        {/* HERO & GALLERY SECTION (DESKTOP GRID / MOBILE COMPACT) */}
        {/* ========================================================================= */}
        <section id="hero-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Gallery Preview (Left side) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60">
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#074213] text-[#A2FF00] text-[11px] font-extrabold px-3 py-1 rounded-full tracking-wide uppercase shadow-md">
                  {activity.category}
                </span>
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-[#074213] ring-2 ring-[#074213]/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Hero Information (Right side of top area) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              
              <div>
                {/* Meta details strip with Delivery Mode */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                  <span className="text-emerald-700 font-extrabold uppercase tracking-wider">
                    {(activity as any).listingType || (activity as any).type || (activity as any).programType || activity.frequency || 'Course Program'}
                  </span>
                  <span>•</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] uppercase tracking-wide border ${
                    activity.deliveryMode === 'Live Online'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : activity.deliveryMode === 'Self-Paced'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : activity.deliveryMode === 'Hybrid'
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {activity.deliveryMode === 'Live Online'
                      ? '💻 Live Online'
                      : activity.deliveryMode === 'Self-Paced'
                      ? '🎬 Self-Paced'
                      : activity.deliveryMode === 'Hybrid'
                      ? '🔄 Hybrid'
                      : '📍 In Person Studio'}
                  </span>
                  <span>•</span>
                  <div className="flex items-center space-x-1 text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{activity.rating}</span>
                    <span className="text-slate-400 font-normal">({activity.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
                  {activity.title}
                </h1>

                {/* Subtitle / Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
                  {activity.shortDescription}
                </p>
              </div>

              {/* Instant Decision Key Info Grid (Immediately Visible Above Fold) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Class Format</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                    {activity.deliveryMode === 'Live Online' ? (
                      <Laptop className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : activity.deliveryMode === 'Self-Paced' ? (
                      <PlayCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    ) : activity.deliveryMode === 'Hybrid' ? (
                      <RefreshCw className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span>{activity.deliveryMode || 'In Person'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {activity.deliveryMode === 'Live Online'
                      ? `Interactive Video ${activity.meetingPlatform ? `(${activity.meetingPlatform})` : ''}`
                      : activity.deliveryMode === 'Self-Paced'
                      ? 'Study At Your Pace'
                      : activity.deliveryMode === 'Hybrid'
                      ? 'In-Person & Online'
                      : `${activity.walkMinutes || activity.walkTimeMinutes || 4} min from metro`}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Location / Metro</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{activity.deliveryMode === 'Live Online' || activity.deliveryMode === 'Self-Paced' ? 'Online (Remote)' : (activity.metroStationName || activity.metroStation)}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {activity.deliveryMode === 'Live Online' || activity.deliveryMode === 'Self-Paced' ? 'No travel required' : `${activity.walkMinutes || activity.walkTimeMinutes || 4} min walk`}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Schedule & Days</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{activity.schedule?.specificDaysText || 'Flexible Schedule'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {activity.startTime || '18:30'} – {activity.endTime || '20:00'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Start Date & Duration</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{activity.startDate}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {activity.durationWeeks ? `${activity.durationWeeks} Weeks` : activity.duration}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Price</span>
                  <span className="font-extrabold text-[#074213] text-sm mt-0.5 block">
                    {formatPrice(activity.regularPrice || activity.price)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">/ {activity.priceUnit || 'per class'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Availability</span>
                  <span className="font-extrabold text-amber-700 flex items-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 shrink-0" />
                    <span>{activity.availableSeats || 8} Seats Left</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">{trialText}</span>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <button
                    onClick={handleOpenBooking}
                    className="w-full py-2.5 px-4 bg-[#074213] hover:bg-[#05310e] text-[#A2FF00] font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer min-h-[40px]"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* MOBILE INSTANT BOOKING CTA STRIP */}
        <div className="lg:hidden bg-[#074213] text-white p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div>
            <div className="text-xs text-[#A2FF00] font-bold uppercase">Starts {activity.startDate}</div>
            <div className="text-lg font-extrabold">{formatPrice(activity.price)}</div>
          </div>
          <button
            onClick={handleOpenBooking}
            className="px-5 py-2.5 bg-[#A2FF00] text-[#074213] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer min-h-[44px]"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MAIN CONTENT & STICKY BOOKING PANEL GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTENT COLUMN (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            
            {/* ========================================================================= */}
            {/* 1. OVERVIEW */}
            {/* ========================================================================= */}
            <section id="overview-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 order-1">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Overview</span>
              </h2>

              {/* Short Description */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Description</span>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {activity.description || activity.shortDescription}
                </p>
              </div>

              {/* Who It's For */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">Who It's For</span>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {activity.targetAudience || activity.audience || 'Designed for beginners and enthusiasts looking to master practical skills in small, guided sessions.'}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Key Highlights</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activity.highlights || [
                    'Small group format for personalized instructor feedback',
                    'All essential gear and materials provided on-site',
                    'Flexible schedule near metro with free trial availability',
                    'Hands-on practical training from day one',
                  ]).map((highlight, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* 2. PROGRAM / SESSION DETAILS (DYNAMIC BY TYPE) */}
            {/* ========================================================================= */}
            <section
              id="program-section"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 order-4 lg:order-2"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>
                    {activityTypeCat === 'program' && 'Program & Session Details'}
                    {activityTypeCat === 'class' && 'Class Session Details'}
                    {activityTypeCat === 'workshop' && 'Workshop Details'}
                    {activityTypeCat === 'event' && 'Event Agenda & Details'}
                    {activityTypeCat === 'camp' && 'Camp Program & Schedule'}
                  </span>
                </h2>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                  {activity.level || 'All Levels'}
                </span>
              </div>

              {/* Dynamic Content Rendering */}
              {activityTypeCat === 'program' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
                      <span className="font-bold text-slate-900">{activity.durationWeeks ? `${activity.durationWeeks} Weeks` : activity.duration}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Sessions</span>
                      <span className="font-bold text-slate-900">{activity.totalSessions ? `${activity.totalSessions} Sessions` : '16 Sessions'}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Class Size</span>
                      <span className="font-bold text-slate-900">{activity.classSize || 'Max 12 Students'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block">Expected Outcomes:</span>
                    <div className="space-y-2">
                      {learningOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start space-x-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium text-emerald-950">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activityTypeCat === 'class' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Date</span>
                      <span className="font-bold text-slate-900">{activity.startDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Time</span>
                      <span className="font-bold text-slate-900">{activity.startTime || '18:30'} – {activity.endTime || '20:00'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Session Duration</span>
                      <span className="font-bold text-slate-900">{activity.duration || '90 minutes'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activityTypeCat === 'workshop' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Workshop Duration</span>
                      <span className="font-bold text-slate-900">{activity.duration || '3 Hours'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Materials Provided</span>
                      <span className="font-bold text-slate-900">All tools, raw materials & equipment included</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-1 text-xs">
                    <span className="font-extrabold text-indigo-900 uppercase text-[10px] block">What You'll Make & Take Home</span>
                    <p className="text-indigo-950 font-medium leading-relaxed">
                      Custom handcrafted project under expert guidance, fully finished and ready to take home at the end of the session.
                    </p>
                  </div>
                </div>
              )}

              {activityTypeCat === 'event' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Event Agenda</span>
                    <div className="space-y-2 text-xs text-slate-800">
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="font-bold text-slate-900">{activity.startTime || '18:30'} – Welcome & Setup</span>
                        <span className="text-slate-500">15 min</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="font-bold text-slate-900">Guided Interactive Session & Clinic</span>
                        <span className="text-slate-500">60 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-900">Q&A, Feedback & Social Networking</span>
                        <span className="text-slate-500">30 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activityTypeCat === 'camp' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Camp Dates</span>
                      <span className="font-bold text-slate-900">{activity.startDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Daily Schedule</span>
                      <span className="font-bold text-slate-900">{activity.startTime || '09:00'} – {activity.endTime || '15:00'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Age Group</span>
                      <span className="font-bold text-slate-900">{activity.ageGroup || '7-14 Years'}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ========================================================================= */}
            {/* 3. SCHEDULE */}
            {/* ========================================================================= */}
            <section id="schedule-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 order-2 lg:order-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Schedule Timeline</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">Scannable timeline</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold shrink-0">
                    1
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Course Starts</span>
                    <span className="font-bold text-slate-900">{activity.startDate}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-extrabold shrink-0">
                    2
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Weekly Days & Time</span>
                    <span className="font-bold text-slate-900">
                      {activity.schedule?.specificDaysText || 'Tuesday & Thursday'} ({activity.startTime || '18:30'} – {activity.endTime || '20:00'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold shrink-0">
                    3
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Registration Deadline</span>
                    <span className="font-bold text-slate-900">{activity.registrationDeadline || '14 September 2026'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* 4. LOCATION */}
            {/* ========================================================================= */}
            <section id="location-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 order-3 lg:order-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <span>Location & Directions</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Nearest Metro</span>
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{activity.metroStationName || activity.metroStation}</span>
                  </span>
                  <span className="text-slate-500 font-medium block">
                    {activity.walkMinutes || activity.walkTimeMinutes || 4} minute walk
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Venue Address</span>
                  <span className="font-bold text-slate-900 block">
                    {activity.studio?.address || activity.address || 'Address provided upon booking confirmation'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center space-x-3 text-xs text-emerald-950 font-medium">
                <Navigation className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Convenient location within 5 minutes of metro exit. Free parking available at the venue.</span>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* 5. INSTRUCTOR */}
            {/* ========================================================================= */}
            <section id="instructor-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 order-5">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Instructor</span>
              </h2>

              <div className="flex items-start space-x-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                <img
                  src={activity.teacher?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={activity.teacher?.name || activity.instructorName || 'Instructor'}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 text-xs sm:text-sm">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {activity.teacher?.name || activity.instructorName || 'Master Instructor'}
                  </h3>
                  <p className="text-slate-600 font-medium">
                    {activity.teacher?.title || activity.instructorQualifications || 'Certified Professional Educator'}
                  </p>
                  <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activity.teacher?.rating || activity.rating || 4.9} Educator Rating</span>
                  </div>

                  <div className="pt-1 text-[11px] font-semibold text-emerald-700 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{activity.responseTimeText || '⚡ Usually replies in 15 mins • 98% Response Rate'}</span>
                  </div>
                </div>
              </div>

              {onOpenContactInstructor && (
                <button
                  onClick={() => onOpenContactInstructor(activity)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-2 min-h-[44px] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Ask Instructor a Question</span>
                </button>
              )}
            </section>

            {/* ========================================================================= */}
            {/* 6. PROVIDER (STUDIO & TRUST VERIFICATION) */}
            {/* ========================================================================= */}
            <section id="provider-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 order-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <Building className="w-5 h-5 text-slate-600" />
                  <span>Provider & Studio Trust</span>
                </h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hosted Studio</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                  <span>{activity.studio?.name || activity.studioName || 'Partner Studio Space'}</span>
                  {activity.studio?.website && (
                    <a
                      href={activity.studio.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-slate-600">
                  {activity.studio?.address || activity.address || 'Verified activity venue partner.'}
                </p>
              </div>

              {/* Detailed Provider Trust Badges */}
              <ProviderTrustBadge
                variant="detailed"
                showModalTrigger={true}
                trust={activity.providerTrust || activity.teacher?.trust || activity.studio?.trust}
              />
            </section>

            {/* ========================================================================= */}
            {/* 7. REVIEWS */}
            {/* ========================================================================= */}
            <section id="reviews-section" className="order-7">
              <Reviews
                activity={activity}
                customReviews={activity.userReviews}
                onAddReview={(newRev) => {
                  if (onAddReview) {
                    onAddReview(activity.id, newRev.rating, newRev.comment);
                  }
                }}
              />
            </section>

            {/* ========================================================================= */}
            {/* 8. SIMILAR ACTIVITIES */}
            {/* ========================================================================= */}
            {similarActivities.length > 0 && (
              <section id="similar-activities-section" className="space-y-4 pt-2 order-8">
                <h2 className="text-xl font-extrabold text-slate-900">Similar Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {similarActivities.map((simAct) => (
                    <ActivityCard
                      key={simAct.id}
                      activity={simAct}
                      isSaved={false}
                      onToggleSave={onToggleSave}
                      onSelectActivity={(act) => onSelectActivity && onSelectActivity(act)}
                      onQuickBook={(act) => onSelectActivity && onSelectActivity(act)}
                    />
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: STICKY BOOKING PANEL (DESKTOP STICKY SIDEBAR) */}
          {/* ========================================================================= */}
          <div
            id="booking-panel"
            className="hidden lg:block lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg space-y-5 sticky top-36"
          >
            <BookingFormContent
              activity={activity}
              userName={userName}
              setUserName={setUserName}
              userEmail={userEmail}
              setUserEmail={setUserEmail}
              userPhone={userPhone}
              setUserPhone={setUserPhone}
              enrollmentMode={enrollmentMode}
              setEnrollmentMode={setEnrollmentMode}
              selectedSession={selectedSession}
              isWorkshop={isWorkshop}
              isBookedSuccess={isBookedSuccess}
              setIsBookedSuccess={setIsBookedSuccess}
              handleSubmitBooking={handleSubmitBooking}
              ctaText={ctaText}
              trialText={trialText}
              generateGoogleCalendarUrl={generateGoogleCalendarUrl}
              downloadIcs={downloadIcs}
              isMobileDrawer={false}
            />
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* MOBILE STICKY BOTTOM CTA BAR */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Starts {activity.startDate}</span>
            <div className="text-base font-extrabold text-slate-900">{formatPrice(activity.price)}</div>
          </div>

          <button
            onClick={handleOpenBooking}
            className="flex-1 py-3 px-4 bg-[#074213] hover:bg-[#05310e] text-[#A2FF00] font-extrabold text-xs rounded-xl transition-all text-center min-h-[48px] shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Booking Drawer */}
      <MobileBookingDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title={activity.title}
        subtitle={`${formatPrice(activity.price)} • Starts ${activity.startDate}`}
      >
        <BookingFormContent
          activity={activity}
          userName={userName}
          setUserName={setUserName}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          userPhone={userPhone}
          setUserPhone={setUserPhone}
          enrollmentMode={enrollmentMode}
          setEnrollmentMode={setEnrollmentMode}
          selectedSession={selectedSession}
          isWorkshop={isWorkshop}
          isBookedSuccess={isBookedSuccess}
          setIsBookedSuccess={setIsBookedSuccess}
          handleSubmitBooking={handleSubmitBooking}
          ctaText={ctaText}
          trialText={trialText}
          generateGoogleCalendarUrl={generateGoogleCalendarUrl}
          downloadIcs={downloadIcs}
          isMobileDrawer={true}
        />
      </MobileBookingDrawer>

    </div>
  );
};
