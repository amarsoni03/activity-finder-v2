import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Sparkles,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  Building2,
  Eye,
  ChevronRight,
  ChevronLeft,
  Info,
  Check,
  Star,
  Layers,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DRAFT_STORAGE_KEY = 'activity_finder_provider_draft';

// Convert readable date strings to YYYY-MM-DD for <input type="date" />
const toInputDateString = (dateStr?: string): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return '';
};

// Format YYYY-MM-DD to human friendly "15 Sep 2026"
const formatHumanDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIdx = parseInt(month, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      return `${parseInt(day, 10)} ${monthNames[mIdx]} ${year}`;
    }
  }
  return dateStr;
};
import {
  Activity,
  Category,
  AudienceType,
  SkillLevel,
  RegularityType,
  TimeOfDay,
  DayOfWeek,
  ActivityType,
  ProviderType,
  DeliveryMode
} from '../types';
import { CATEGORIES } from '../data/activitiesData';
import { METRO_LINES, METRO_STATIONS } from '../data/metroData';

export interface CreateActivityModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onAddActivity: (newActivity: Activity) => void;
  activityToEdit?: Activity | null;
}

// Preset cover images for fast selection
const PRESET_COVER_IMAGES = [
  { label: 'Crafts / Pottery', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fitness & Yoga', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dance & Performing', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80' },
  { label: 'Coding & Tech', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cooking & Culinary', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Photography', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80' },
];

// Preset instructor avatars
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
];

const STEP_ICONS = [Layers, GraduationCap, Calendar, MapPin, DollarSign, User, Building2, Eye];

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen = true,
  onClose,
  onBack,
  onAddActivity,
  activityToEdit,
}) => {
  if (isOpen === false) return null;

  const handleClose = () => {
    if (onClose) onClose();
    if (onBack) onBack();
  };

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const instructorFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomCoverUrl(result);
          setCoverImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInstructorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setInstructorAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Wizard Step State (1 to 8)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // Form Fields
  // Step 1: Type
  const [activityType, setActivityType] = useState<ActivityType>('Program');

  // Step 2: Basic Info
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Languages');
  const [subSkill, setSubSkill] = useState('');
  const [audience, setAudience] = useState<AudienceType>('Adults');
  const [level, setLevel] = useState<SkillLevel>('Beginner');
  const [instructionLanguage, setInstructionLanguage] = useState<string>('English');
  const [shortDescription, setShortDescription] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVER_IMAGES[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');

  // Step 3: Schedule (conditional on activityType)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [meetingDays, setMeetingDays] = useState<DayOfWeek[]>(['Tuesday', 'Thursday']);
  const [startTime, setStartTime] = useState('18:30');
  const [endTime, setEndTime] = useState('20:00');
  const [duration, setDuration] = useState('90 mins');
  const [totalSessions, setTotalSessions] = useState(8);
  const [workshopSessionsText, setWorkshopSessionsText] = useState('Saturdays 14:00 - 17:00');
  const [eventVenue, setEventVenue] = useState('');

  // Step 4: Location
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('In Person');
  const [metroStationId, setMetroStationId] = useState(METRO_STATIONS[0].id);
  const [walkMinutes, setWalkMinutes] = useState(5);
  const [address, setAddress] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [onlinePlatform, setOnlinePlatform] = useState('Zoom');

  // Step 5: Pricing & Policy
  const [regularPrice, setRegularPrice] = useState(3500);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [hasTrial, setHasTrial] = useState(true);
  const [trialPrice, setTrialPrice] = useState(1500);
  const [priceUnit, setPriceUnit] = useState<'per class' | 'per session' | 'per program' | 'per month' | 'total program'>('per session');
  const [materialsIncluded, setMaterialsIncluded] = useState('All professional tools & materials provided');
  const [refundPolicy, setRefundPolicy] = useState('Free cancellation up to 24 hours before first session');

  // Step 6: Instructor
  const [instructorName, setInstructorName] = useState('');
  const [instructorExperience, setInstructorExperience] = useState('5 years teaching experience');
  const [instructorAvatar, setInstructorAvatar] = useState(PRESET_AVATARS[0]);
  const [degree, setDegree] = useState('');
  const [certificatesText, setCertificatesText] = useState('Certified Professional Instructor');

  // Step 7: Provider
  const [providerType, setProviderType] = useState<ProviderType>('Studio');
  const [studioName, setStudioName] = useState('');
  const [providerContact, setProviderContact] = useState('');
  const [providerWebsite, setProviderWebsite] = useState('');
  const [providerSocial, setProviderSocial] = useState('');

  // UX & Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewTab, setPreviewTab] = useState<'card' | 'detail'>('card');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pre-fill state when editing existing activity listing
  useEffect(() => {
    if (activityToEdit) {
      if (activityToEdit.activityType) setActivityType(activityToEdit.activityType);
      if (activityToEdit.title) setTitle(activityToEdit.title);
      if (activityToEdit.category) setCategory(activityToEdit.category);
      if (activityToEdit.subSkill) setSubSkill(activityToEdit.subSkill);
      if (activityToEdit.audience) setAudience(activityToEdit.audience);
      if (activityToEdit.level) setLevel(activityToEdit.level);
      if (activityToEdit.language) setInstructionLanguage(activityToEdit.language);
      if (activityToEdit.shortDescription) setShortDescription(activityToEdit.shortDescription);
      if (activityToEdit.coverImage || activityToEdit.image) setCoverImage(activityToEdit.coverImage || activityToEdit.image || PRESET_COVER_IMAGES[0].url);
      if (activityToEdit.startDate) setStartDate(activityToEdit.startDate);
      if (activityToEdit.endDate) setEndDate(activityToEdit.endDate || '');
      if (activityToEdit.weekdays && activityToEdit.weekdays.length > 0) setMeetingDays(activityToEdit.weekdays);
      if (activityToEdit.startTime) setStartTime(activityToEdit.startTime);
      if (activityToEdit.endTime) setEndTime(activityToEdit.endTime);
      if (activityToEdit.duration) setDuration(activityToEdit.duration);
      if (activityToEdit.totalSessions) setTotalSessions(activityToEdit.totalSessions);
      if (activityToEdit.deliveryMode) setDeliveryMode(activityToEdit.deliveryMode);
      if (activityToEdit.metroStationId) setMetroStationId(activityToEdit.metroStationId);
      if (activityToEdit.walkMinutes || activityToEdit.walkTimeMinutes) setWalkMinutes(activityToEdit.walkMinutes || activityToEdit.walkTimeMinutes || 5);
      if (activityToEdit.address) setAddress(activityToEdit.address);
      if (activityToEdit.googleMapsLink) setGoogleMapsLink(activityToEdit.googleMapsLink || '');
      if (activityToEdit.regularPrice || activityToEdit.price) setRegularPrice(activityToEdit.regularPrice || activityToEdit.price || 3500);
      if (activityToEdit.discountPrice) setDiscountPrice(activityToEdit.discountPrice);
      if (activityToEdit.trialPrice) {
        setHasTrial(true);
        setTrialPrice(activityToEdit.trialPrice);
      }
      if (activityToEdit.priceUnit) setPriceUnit(activityToEdit.priceUnit);
      if (activityToEdit.materialsIncluded) setMaterialsIncluded(activityToEdit.materialsIncluded);
      if (activityToEdit.cancellationPolicy) setRefundPolicy(activityToEdit.cancellationPolicy);
      if (activityToEdit.instructorName || activityToEdit.teacher?.name) setInstructorName(activityToEdit.instructorName || activityToEdit.teacher?.name || '');
      if (activityToEdit.instructorExperience) setInstructorExperience(activityToEdit.instructorExperience);
      if (activityToEdit.teacher?.avatar) setInstructorAvatar(activityToEdit.teacher.avatar);
      if (activityToEdit.instructorQualifications || activityToEdit.teacher?.qualifications?.degree) setDegree(activityToEdit.instructorQualifications || activityToEdit.teacher?.qualifications?.degree || '');
      if (activityToEdit.teacher?.qualifications?.certificates) setCertificatesText(activityToEdit.teacher.qualifications.certificates.join(', '));
      if (activityToEdit.providerType) setProviderType(activityToEdit.providerType);
      if (activityToEdit.studioName || activityToEdit.studio?.name) setStudioName(activityToEdit.studioName || activityToEdit.studio?.name || '');
      if (activityToEdit.providerContact) setProviderContact(activityToEdit.providerContact || '');
      if (activityToEdit.providerWebsite || activityToEdit.studio?.website) setProviderWebsite(activityToEdit.providerWebsite || activityToEdit.studio?.website || '');
      if (activityToEdit.providerSocial) setProviderSocial(activityToEdit.providerSocial || '');
    }
  }, [activityToEdit]);

  // Restore Draft on mount (only when creating a new activity, not editing)
  useEffect(() => {
    if (activityToEdit) return;
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.activityType) setActivityType(parsed.activityType);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.subSkill) setSubSkill(parsed.subSkill);
        if (parsed.audience) setAudience(parsed.audience);
        if (parsed.shortDescription) setShortDescription(parsed.shortDescription);
        if (parsed.regularPrice) setRegularPrice(parsed.regularPrice);
        if (parsed.studioName) setStudioName(parsed.studioName);
        if (parsed.instructorName) setInstructorName(parsed.instructorName);
        if (parsed.metroStationId) setMetroStationId(parsed.metroStationId);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        setDraftSavedAt('Restored draft');
      }
    } catch {
      // Ignore parse errors
    }
  }, [activityToEdit]);

  // Save Draft to LocalStorage on field changes
  useEffect(() => {
    const draftData = {
      activityType,
      title,
      category,
      subSkill,
      audience,
      level,
      shortDescription,
      coverImage,
      startDate,
      endDate,
      meetingDays,
      startTime,
      endTime,
      duration,
      totalSessions,
      deliveryMode,
      metroStationId,
      walkMinutes,
      address,
      regularPrice,
      hasTrial,
      trialPrice,
      priceUnit,
      materialsIncluded,
      instructorName,
      instructorExperience,
      providerType,
      studioName,
      providerContact,
      currentStep,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      setDraftSavedAt('Autosaved');
    } catch {
      // Ignore quota errors
    }
  }, [
    activityType,
    title,
    category,
    subSkill,
    audience,
    level,
    shortDescription,
    coverImage,
    startDate,
    endDate,
    meetingDays,
    startTime,
    endTime,
    duration,
    totalSessions,
    deliveryMode,
    metroStationId,
    walkMinutes,
    address,
    regularPrice,
    hasTrial,
    trialPrice,
    priceUnit,
    materialsIncluded,
    instructorName,
    instructorExperience,
    providerType,
    studioName,
    providerContact,
    currentStep,
  ]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setTitle('');
    setShortDescription('');
    setInstructorName('');
    setStudioName('');
    setCurrentStep(1);
    setDraftSavedAt(null);
  };

  // Step Validation logic
  const validateCurrentStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!title.trim()) {
        newErrors.title = 'Please provide an activity title.';
      } else if (title.trim().length < 5) {
        newErrors.title = 'Title should be at least 5 characters for discovery.';
      }

      if (!shortDescription.trim()) {
        newErrors.shortDescription = 'Please enter a short description.';
      }
    }

    if (step === 3) {
      if (activityType === 'Program' && !startDate.trim()) {
        newErrors.startDate = 'Please specify a start date (e.g. 15 Sep 2026).';
      }
    }

    if (step === 4) {
      if (deliveryMode !== 'Live Online' && !metroStationId) {
        newErrors.metroStationId = 'Please select the nearest metro station.';
      }
    }

    if (step === 5) {
      if (!regularPrice || regularPrice <= 0) {
        newErrors.regularPrice = 'Please specify a valid price.';
      }
    }

    if (step === 6) {
      if (!instructorName.trim()) {
        newErrors.instructorName = 'Instructor name helps build learner trust.';
      }
    }

    if (step === 7) {
      if (!studioName.trim()) {
        newErrors.studioName = 'Organization / Studio name is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      if (currentStep < 8) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePublish = () => {
    if (!validateCurrentStep(7) || !validateCurrentStep(2)) {
      return;
    }

    const stationObj = METRO_STATIONS.find((s) => s.id === metroStationId) || METRO_STATIONS[0];
    const finalCover = customCoverUrl.trim() || coverImage;

    const newAct: Activity = {
      id: activityToEdit ? activityToEdit.id : `act-published-${Date.now()}`,
      title: title || 'New Published Activity',
      category,
      subSkill: subSkill || title,
      audience,
      activityType,
      programType: activityType === 'Program' ? 'Program' : 'Session',
      startDate: formatHumanDate(startDate) || startDate || 'Starts Next Month',
      endDate: endDate ? formatHumanDate(endDate) : undefined,
      weeklySchedule: meetingDays.join(' & '),
      numberOfSessions: totalSessions,
      frequency:
        activityType === 'Workshop' || activityType === 'Event'
          ? 'One-Time Workshop'
          : activityType === 'Program'
          ? 'Weekly Program'
          : 'Twice a Week',
      weekdays: meetingDays,
      startTime: startTime || '18:30',
      endTime: endTime || '20:00',
      duration: duration || '90 mins',
      nextSession: `${meetingDays[0] || 'Tuesday'} at ${startTime || '18:30'}`,
      availableSessions: [`${meetingDays[0] || 'Tuesday'} • ${startTime || '18:30'}`],
      availableSeats: 8,
      totalSeats: 12,
      metroLine: stationObj.lineName,
      metroStation: stationObj.name,
      walkTimeMinutes: walkMinutes,
      travelTimeMinutes: walkMinutes + 10,
      address: address || `${stationObj.name} District`,
      googleMapsLink: googleMapsLink || undefined,

      trialPrice: hasTrial ? trialPrice : regularPrice,
      regularPrice: regularPrice,
      discountPrice: discountPrice,
      currency: '₽',
      level,
      language: instructionLanguage,
      ageGroup: audience === 'Children' ? '7-14 yrs' : '18+',
      classSize: 'Small Group (max 12)',
      learningOutcomes: [
        'Hands-on skill building with guided supervision',
        'Structured modules designed for clear progression',
        'Interactive Q&A and practical takeaway project',
      ],
      shortDescription: shortDescription || 'Master fundamental skills through immersive guided practice.',
      fullDescription: shortDescription || 'Experience high-quality interactive learning led by experienced instructors in a modern facility.',

      tags: [category, audience, activityType, level],
      goals: ['Learn', 'Create'],
      popularityScore: 92,
      featured: true,
      newActivity: true,

      rating: 5.0,
      reviewCount: 1,

      providerType,
      studioName: studioName || 'Independent Activity Studio',
      instructorName: instructorName || 'Certified Instructor',
      instructorExperience: instructorExperience || '5 years experience',
      instructorQualifications: degree || 'Certified Specialist',
      providerContact: providerContact || undefined,
      providerWebsite: providerWebsite || undefined,
      providerSocial: providerSocial || undefined,
      materialsIncluded: materialsIncluded || undefined,

      coverImage: finalCover,
      image: finalCover,
      galleryImages: [finalCover],

      instantBooking: true,
      cancellationPolicy: refundPolicy,
      bookingDeadline: '4 hours before session',

      metroStationId: stationObj.id,
      metroStationName: stationObj.name,
      metroLineId: stationObj.lineId,
      metroLineName: stationObj.lineName,
      metroLineColor:
        stationObj.lineId === 'red-line'
          ? '#EF4444'
          : stationObj.lineId === 'blue-line'
          ? '#2563EB'
          : stationObj.lineId === 'green-line'
          ? '#10B981'
          : '#9333EA',
      walkMinutes,
      schedule: {
        days: meetingDays,
        timeOfDay: 'Evening',
        timeRange: `${startTime} - ${endTime}`,
        specificDaysText: meetingDays.join(' & '),
      },
      price: regularPrice,
      priceUnit,
      syllabi: [
        'Module 1: Foundations & Core Concepts',
        'Module 2: Guided Supervised Practice',
        'Module 3: Project Completion & Mastery',
      ],
      teacher: {
        name: instructorName || 'Certified Instructor',
        avatar: instructorAvatar,
        title: degree || 'Senior Course Lead',
        qualifications: {
          degree: degree || 'Certified Specialist',
          certificates: certificatesText.split(',').map((c) => c.trim()),
          experienceYears: 5,
        },
        bio: `${instructorName || 'Our instructor'} brings extensive experience with a passionate, encouraging teaching methodology.`,
        rating: 5.0,
      },
      studio: {
        name: studioName || 'Activity Studio',
        address: address || stationObj.name,
        metroDistanceWalkMinutes: walkMinutes,
        website: providerWebsite,
      },
      accentColor: 'soft-green',
      durationWeeks: activityType === 'Program' ? 4 : 1,
      totalSessions: totalSessions,
      registrationDeadline: 'Limited Spots Remaining',
      nextClassDate: startDate || 'Starts next week',
      isOneTimeWorkshop: activityType === 'Workshop' || activityType === 'Event',
      deliveryMode,
      meetingPlatform: deliveryMode !== 'In Person' ? onlinePlatform : undefined,
      timezone: 'MSK (UTC+3)',
      bookingType: 'Instant Booking',
      capacity: 12,
    };

    onAddActivity(newAct);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      handleClose();
    }, 1600);
  };

  const selectedStationObj = METRO_STATIONS.find((s) => s.id === metroStationId) || METRO_STATIONS[0];
  const activeCover = customCoverUrl.trim() || coverImage;

  // Step Indicators metadata
  const STEPS = [
    { num: 1, label: 'Type' },
    { num: 2, label: 'Basic Info' },
    { num: 3, label: 'Schedule' },
    { num: 4, label: 'Location' },
    { num: 5, label: 'Pricing' },
    { num: 6, label: 'Instructor' },
    { num: 7, label: 'Provider' },
    { num: 8, label: 'Preview' },
  ];

  const goToStep = (stepNum: number) => {
    if (stepNum < currentStep || validateCurrentStep(currentStep)) {
      setCurrentStep(stepNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 4 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#F9FAFB] flex flex-col pb-28"
        >
      {/* Page hero header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <button
                onClick={handleClose}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-xl hover:bg-slate-800 shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A2FF00] text-[#074213] flex items-center justify-center shadow-md shrink-0">
                  <Sparkles className="w-5 h-5 fill-[#074213]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                      {activityToEdit ? 'Edit Activity Listing' : 'Publish New Activity'}
                    </h1>
                    <span className="text-[10px] font-bold text-[#A2FF00] uppercase tracking-wider bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                      ⏱️ &lt; 5 mins
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Airbnb-style effortless listing for studios & independent hosts
                  </p>
                </div>
              </div>
            </div>
            {draftSavedAt && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 self-start sm:self-auto">
                <Check className="w-3.5 h-3.5 text-[#A2FF00]" />
                <span>{draftSavedAt}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Desktop sidebar navigation */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {STEPS.map((step, idx) => {
                const isPassed = currentStep > step.num;
                const isCurrent = currentStep === step.num;
                const StepIcon = STEP_ICONS[idx];

                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => goToStep(step.num)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      isCurrent
                        ? 'bg-slate-900 text-white shadow-sm'
                        : isPassed
                        ? 'text-[#074213] hover:bg-[#A2FF00]/10'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-[#A2FF00] text-[#074213]'
                          : isPassed
                          ? 'bg-green-100 text-[#074213]'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
                    </span>
                    <span className="flex-1">{step.label}</span>
                    {isCurrent && <ChevronRight className="w-4 h-4 text-[#A2FF00] shrink-0" />}
                  </button>
                );
              })}
            </nav>
            <div className="sticky top-[calc(6rem+22rem)] mt-6 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Progress</span>
                <span>{Math.round((currentStep / 8) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#A2FF00] h-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / 8) * 100}%` }}
                />
              </div>
            </div>
          </aside>

          {/* Content column */}
          <div className="flex-1 min-w-0">
            {/* Mobile step indicator */}
            <div className="lg:hidden mb-6 space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {STEPS.map((step, idx) => {
                  const isPassed = currentStep > step.num;
                  const isCurrent = currentStep === step.num;
                  const StepIcon = STEP_ICONS[idx];

                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => goToStep(step.num)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                        isCurrent
                          ? 'bg-slate-900 text-white shadow-sm font-semibold'
                          : isPassed
                          ? 'bg-[#A2FF00]/10 text-[#074213] border border-[#A2FF00]/30'
                          : 'text-slate-500 bg-white border border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-[#A2FF00] text-[#074213]'
                            : isPassed
                            ? 'bg-[#074213] text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isPassed ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <StepIcon className="w-3 h-3" />
                        )}
                      </span>
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[#A2FF00] h-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / 8) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 lg:p-10">
          {isSuccess ? (
            <div className="py-16 text-center space-y-4 animate-scale-in">
              <div className="w-20 h-20 bg-green-100 text-[#074213] rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-12 h-12 text-[#074213] animate-bounce" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {activityToEdit ? 'Activity Listing Updated!' : 'Activity Successfully Published!'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your course is live on the marketplace. Learners near <span className="font-semibold text-slate-900">{selectedStationObj.name}</span> can now discover and reserve spots!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* STEP 1: ACTIVITY TYPE */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">Step 1 of 8</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">What format is your activity?</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Selecting the right format ensures relevant schedule fields and accurate filtering for learners.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {[
                      {
                        type: 'Program' as ActivityType,
                        icon: '🎓',
                        title: 'Program / Course',
                        desc: 'Multi-week curriculum with structured start & end dates',
                        badge: 'Most Popular',
                      },
                      {
                        type: 'Class' as ActivityType,
                        icon: '🏋️',
                        title: 'Recurring Class',
                        desc: 'Ongoing regular weekly sessions open for drop-ins',
                      },
                      {
                        type: 'Workshop' as ActivityType,
                        icon: '🎨',
                        title: 'Workshop',
                        desc: 'Intensive single-day or weekend hands-on session',
                      },
                      {
                        type: 'Event' as ActivityType,
                        icon: '🎟️',
                        title: 'Event / Masterclass',
                        desc: 'Special one-time performance, lecture, or showcase',
                      },
                      {
                        type: 'Camp' as ActivityType,
                        icon: '🏕️',
                        title: 'Camp / Intensive',
                        desc: 'Multi-day full-day or half-day seasonal intensive',
                      },
                      {
                        type: 'Corporate' as ActivityType,
                        icon: '🏢',
                        title: 'Corporate Session',
                        desc: 'Tailored team building & professional training',
                      },
                      {
                        type: 'Club' as ActivityType,
                        icon: '👥',
                        title: 'Club / Meetup',
                        desc: 'Community hobby group meeting on regular schedules',
                      },
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setActivityType(item.type)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between group relative ${
                          activityType === item.type
                            ? 'border-[#074213] bg-[#A2FF00]/10 ring-4 ring-[#A2FF00]/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {item.badge && (
                          <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#A2FF00] text-[#074213] px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <div>
                          <span className="text-2xl mb-2 block">{item.icon}</span>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#074213] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="mt-3 flex items-center text-xs font-semibold text-[#074213] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Select format</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start space-x-3">
                    <Info className="w-5 h-5 text-[#074213] shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Dynamic Form Customization:</strong> Depending on your choice, subsequent steps will only present fields relevant to <span className="font-semibold text-[#074213]">{activityType}s</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: BASIC INFORMATION */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">Step 2 of 8</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Basic Information</h3>
                    <p className="text-xs text-slate-500 mt-1">Clear titles and descriptions help learners find your listing quickly.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Activity Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                        }}
                        placeholder="e.g. Evening Beginners Pottery & Ceramic Glazing Course"
                        className={`w-full bg-slate-50 border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#A2FF00]/25 outline-none transition-all ${
                          errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#074213]'
                        }`}
                      />
                      {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
                    </div>

                    {/* Category, Subcategory, Audience, Level */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as Category)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#A2FF00]/25 outline-none"
                        >
                          {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Subcategory / Skill</label>
                        <input
                          type="text"
                          value={subSkill}
                          onChange={(e) => setSubSkill(e.target.value)}
                          placeholder="e.g. Wheel Throwing"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-[#A2FF00]/25 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Audience</label>
                        <select
                          value={audience}
                          onChange={(e) => setAudience(e.target.value as AudienceType)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#A2FF00]/25 outline-none"
                        >
                          <option value="Adults">Adults</option>
                          <option value="Children">Children</option>
                          <option value="Corporate">Corporate</option>
                          <option value="All">All Audiences</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Skill Level</label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value as SkillLevel)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#A2FF00]/25 outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Instruction Language</label>
                        <select
                          value={instructionLanguage}
                          onChange={(e) => setInstructionLanguage(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#A2FF00]/25 outline-none"
                        >
                          <option value="English">English 🇬🇧</option>
                          <option value="Russian">Russian 🇷🇺</option>
                          <option value="English & Russian">Bilingual (English & Russian) 🇬🇧🇷🇺</option>
                        </select>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Short Description <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={shortDescription}
                        onChange={(e) => {
                          setShortDescription(e.target.value);
                          if (errors.shortDescription) setErrors((prev) => ({ ...prev, shortDescription: '' }));
                        }}
                        placeholder="Summarize what participants will experience, learn, or take home..."
                        className={`w-full bg-slate-50 border rounded-2xl p-3 text-xs focus:ring-2 focus:ring-[#A2FF00]/25 outline-none transition-all ${
                          errors.shortDescription ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#074213]'
                        }`}
                      />
                      {errors.shortDescription && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.shortDescription}</p>}
                    </div>

                    {/* Cover Image Preset & File Upload Picker */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-slate-800">Select or Upload Cover Photo</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {PRESET_COVER_IMAGES.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => {
                              setCoverImage(preset.url);
                              setCustomCoverUrl('');
                            }}
                            className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all group cursor-pointer ${
                              coverImage === preset.url && !customCoverUrl
                                ? 'border-[#074213] ring-2 ring-[#A2FF00]/40 shadow-md'
                                : 'border-transparent hover:opacity-90'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[9px] font-bold text-white px-1 text-center">{preset.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <input
                          type="file"
                          ref={coverFileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverFileUpload}
                        />
                        <button
                          type="button"
                          onClick={() => coverFileInputRef.current?.click()}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shrink-0 transition-all cursor-pointer shadow-xs"
                        >
                          <Upload className="w-4 h-4 text-[#A2FF00]" />
                          <span>Upload Cover Image File</span>
                        </button>
                        <input
                          type="text"
                          value={customCoverUrl}
                          onChange={(e) => {
                            setCustomCoverUrl(e.target.value);
                            if (e.target.value.trim()) {
                              setCoverImage(e.target.value.trim());
                            }
                          }}
                          placeholder="Or paste a custom image URL (Unsplash, Imgur, CDN...)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#A2FF00]/25 outline-none"
                        />
                      </div>

                      {/* Cover Photo Live Preview */}
                      {(coverImage || customCoverUrl) && (
                        <div className="relative aspect-[21/9] sm:aspect-[3/1] max-h-44 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner mt-2">
                          <img
                            src={customCoverUrl || coverImage}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            Selected Cover Preview
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SCHEDULE */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">Step 3 of 8</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                      Schedule Details ({activityType})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Specify meeting dates, times, and regularity for this activity format.</p>
                  </div>

                  <div className="space-y-4">
                    {/* PROGRAM / CAMP FIELDS */}
                    {(activityType === 'Program' || activityType === 'Camp') && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-[#074213]" />
                              <span>
                                Start Date <span className="text-rose-500">*</span>
                              </span>
                            </label>
                            <input
                              type="date"
                              value={toInputDateString(startDate)}
                              onChange={(e) => {
                                setStartDate(e.target.value);
                                if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' }));
                              }}
                              className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#A2FF00]/25 transition-all cursor-pointer ${
                                errors.startDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-[#074213]'
                              }`}
                            />
                            {errors.startDate && <p className="text-xs text-rose-500 mt-1">{errors.startDate}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>End Date (Optional)</span>
                            </label>
                            <input
                              type="date"
                              value={toInputDateString(endDate)}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#A2FF00]/25 focus:border-[#074213] cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Meeting Days Multiselect */}
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">Meeting Days</label>
                          <div className="flex flex-wrap gap-2">
                            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as DayOfWeek[]).map(
                              (day) => {
                                const selected = meetingDays.includes(day);
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                      if (selected) {
                                        setMeetingDays(meetingDays.filter((d) => d !== day));
                                      } else {
                                        setMeetingDays([...meetingDays, day]);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                      selected
                                        ? 'bg-[#074213] text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {day.slice(0, 3)}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-[#074213]" />
                              <span>Start Time</span>
                            </label>
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#A2FF00]/25 focus:border-[#074213] cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>End Time</span>
                            </label>
                            <input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#A2FF00]/25 focus:border-[#074213] cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Total Sessions</label>
                            <input
                              type="number"
                              value={totalSessions}
                              onChange={(e) => setTotalSessions(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#A2FF00]/25 focus:border-[#074213]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CLASS / CLUB FIELDS */}
                    {(activityType === 'Class' || activityType === 'Club') && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-[#074213]" />
                            <span>Start Date</span>
                          </label>
                          <input
                            type="date"
                            value={toInputDateString(startDate)}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#A2FF00]/25 focus:border-[#074213] cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-[#074213]" />
                            <span>Start Time</span>
                          </label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#A2FF00]/25 focus:border-[#074213] cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>End Time</span>
                          </label>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#A2FF00]/25 focus:border-[#074213] cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {/* WORKSHOP / EVENT / CORPORATE */}
                    {(activityType === 'Workshop' || activityType === 'Event' || activityType === 'Corporate') && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Available Session Slots</label>
                          <input
                            type="text"
                            value={workshopSessionsText}
                            onChange={(e) => setWorkshopSessionsText(e.target.value)}
                            placeholder="e.g. Sat Aug 15 @ 14:00 - 17:00, Sun Aug 16 @ 10:00 - 13:00"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs"
                          />
                        </div>

                        {activityType === 'Event' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">Event Venue Name</label>
                            <input
                              type="text"
                              value={eventVenue}
                              onChange={(e) => setEventVenue(e.target.value)}
                              placeholder="e.g. Main Concert Hall / Creative Loft 4"
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: LOCATION */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">Step 4 of 8</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Location & Delivery Mode</h3>
                    <p className="text-xs text-slate-500 mt-1">Specify metro station proximity or online platform details.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Delivery Mode Pills */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">Delivery Format</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { mode: 'In Person' as DeliveryMode, label: '📍 In Person' },
                          { mode: 'Live Online' as DeliveryMode, label: '💻 Live Online' },
                          { mode: 'Hybrid' as DeliveryMode, label: '🔄 Hybrid' },
                          { mode: 'Self-Paced' as DeliveryMode, label: '🎬 Self-Paced' },
                        ].map((item) => (
                          <button
                            key={item.mode}
                            type="button"
                            onClick={() => setDeliveryMode(item.mode)}
                            className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                              deliveryMode === item.mode
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Offline / Hybrid Location */}
                    {deliveryMode !== 'Live Online' && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                              Nearest Metro Station <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={metroStationId}
                              onChange={(e) => setMetroStationId(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#A2FF00]/25 outline-none"
                            >
                              {METRO_STATIONS.map((st) => (
                                <option key={st.id} value={st.id}>
                                  {st.name} ({st.lineName})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                              Walk Time from Metro ({walkMinutes} mins)
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="15"
                              value={walkMinutes}
                              onChange={(e) => setWalkMinutes(Number(e.target.value))}
                              className="w-full accent-[#074213] mt-2"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Full Studio Address</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. Sadovaya St. 12, Floor 2, Studio 204"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Google Maps / Yandex Maps Link (Optional)</label>
                          <input
                            type="url"
                            value={googleMapsLink}
                            onChange={(e) => setGoogleMapsLink(e.target.value)}
                            placeholder="https://maps.google.com/..."
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Online Details */}
                    {deliveryMode !== 'In Person' && (
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">Live Online Settings</span>
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Meeting Platform</label>
                          <select
                            value={onlinePlatform}
                            onChange={(e) => setOnlinePlatform(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          >
                            <option value="Zoom">Zoom Meeting</option>
                            <option value="Google Meet">Google Meet</option>
                            <option value="Microsoft Teams">Microsoft Teams</option>
                            <option value="Custom Link">Custom Platform Link</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: PRICING */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">Step 5 of 8</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Pricing & Refund Policy</h3>
                    <p className="text-xs text-slate-500 mt-1">Set clear prices, trial offers, and cancellation policies.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Regular Price (₽) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={regularPrice}
                          onChange={(e) => setRegularPrice(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#074213]"
                        />
                        {errors.regularPrice && <p className="text-xs text-rose-500 mt-1">{errors.regularPrice}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Discount Price (₽ Optional)</label>
                        <input
                          type="number"
                          value={discountPrice || ''}
                          onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g. 2900"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Price Unit</label>
                        <select
                          value={priceUnit}
                          onChange={(e) => setPriceUnit(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 outline-none"
                        >
                          <option value="per class">per class</option>
                          <option value="per session">per session</option>
                          <option value="per program">per program</option>
                          <option value="per month">per month</option>
                          <option value="total program">total program</option>
                        </select>
                      </div>
                    </div>

                    {/* Trial Option Toggle */}
                    <div className="bg-[#A2FF00]/10 p-4 rounded-2xl border border-[#A2FF00]/20 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#074213]">Offer Trial / Demo Session?</h4>
                        <p className="text-[11px] text-[#074213]">Trial sessions increase conversion by 40%.</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {hasTrial && (
                          <input
                            type="number"
                            value={trialPrice}
                            onChange={(e) => setTrialPrice(Number(e.target.value))}
                            className="w-24 bg-white border border-[#A2FF00]/30 rounded-xl px-2.5 py-1 text-xs font-bold text-[#074213]"
                            placeholder="Trial ₽"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setHasTrial(!hasTrial)}
                          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                            hasTrial ? 'bg-[#074213]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                              hasTrial ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Materials Included</label>
                      <input
                        type="text"
                        value={materialsIncluded}
                        onChange={(e) => setMaterialsIncluded(e.target.value)}
                        placeholder="e.g. All tools, clay, paints & apron provided"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Cancellation & Refund Policy</label>
                      <select
                        value={refundPolicy}
                        onChange={(e) => setRefundPolicy(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-800 outline-none"
                      >
                        <option value="Free cancellation up to 24 hours before first session">
                          Flexible - Free cancellation 24h prior
                        </option>
                        <option value="Free cancellation up to 48 hours before start">Moderate - Free cancellation 48h prior</option>
                        <option value="Non-refundable within 7 days of start date">Strict - Non-refundable inside 7 days</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: INSTRUCTOR */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">Step 6 of 8</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Instructor Profile</h3>
                    <p className="text-xs text-slate-500 mt-1">Learners connect with authentic teachers and certified expertise.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Instructor Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={instructorName}
                          onChange={(e) => {
                            setInstructorName(e.target.value);
                            if (errors.instructorName) setErrors((prev) => ({ ...prev, instructorName: '' }));
                          }}
                          placeholder="e.g. Elena Rostova"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs outline-none focus:border-[#074213]"
                        />
                        {errors.instructorName && <p className="text-xs text-rose-500 mt-1">{errors.instructorName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Years / Experience Summary</label>
                        <input
                          type="text"
                          value={instructorExperience}
                          onChange={(e) => setInstructorExperience(e.target.value)}
                          placeholder="e.g. 7 years experience in fine art pottery"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Instructor Avatar Selection & Upload */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-slate-800">Select or Upload Instructor Photo</label>
                      <div className="flex flex-wrap items-center gap-3">
                        {PRESET_AVATARS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setInstructorAvatar(av)}
                            className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              instructorAvatar === av ? 'border-[#074213] ring-2 ring-[#A2FF00]/40 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                          </button>
                        ))}

                        <input
                          type="file"
                          ref={instructorFileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleInstructorFileUpload}
                        />
                        <button
                          type="button"
                          onClick={() => instructorFileInputRef.current?.click()}
                          className="h-12 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shrink-0 transition-all cursor-pointer shadow-xs"
                        >
                          <Upload className="w-4 h-4 text-[#A2FF00]" />
                          <span>Upload Photo File</span>
                        </button>
                      </div>

                      <div className="pt-1 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-2xs">
                          <img src={instructorAvatar} alt="Instructor preview" className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={instructorAvatar}
                          onChange={(e) => setInstructorAvatar(e.target.value)}
                          placeholder="Or paste custom photo URL..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#A2FF00]/25"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Degree / Qualification (Optional)</label>
                        <input
                          type="text"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          placeholder="e.g. MA St. Petersburg Academy of Fine Arts"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Certificates / License (Optional)</label>
                        <input
                          type="text"
                          value={certificatesText}
                          onChange={(e) => setCertificatesText(e.target.value)}
                          placeholder="e.g. Licensed Craft Master, Member of Art Guild"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: PROVIDER */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">Step 7 of 8</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Provider Details</h3>
                    <p className="text-xs text-slate-500 mt-1">Information about your studio, organization, or hosting entity.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">Hosting Entity Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { type: 'Studio' as ProviderType, icon: '🏛️', label: 'Studio Space' },
                          { type: 'Organization' as ProviderType, icon: '🏢', label: 'Organization' },
                          { type: 'Independent Instructor' as ProviderType, icon: '👤', label: 'Independent Host' },
                        ].map((item) => (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => setProviderType(item.type)}
                            className={`p-3 rounded-2xl border text-center transition-all ${
                              providerType === item.type
                                ? 'border-[#074213] bg-[#A2FF00]/10 ring-2 ring-[#A2FF00]/25 font-bold text-slate-900'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-lg block mb-1">{item.icon}</span>
                            <span className="text-xs">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Studio / Organization Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={studioName}
                          onChange={(e) => {
                            setStudioName(e.target.value);
                            if (errors.studioName) setErrors((prev) => ({ ...prev, studioName: '' }));
                          }}
                          placeholder="e.g. Master Ceramics Studio"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs outline-none focus:border-[#074213]"
                        />
                        {errors.studioName && <p className="text-xs text-rose-500 mt-1">{errors.studioName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Contact Email / Phone</label>
                        <input
                          type="text"
                          value={providerContact}
                          onChange={(e) => setProviderContact(e.target.value)}
                          placeholder="e.g. hello@masterceramics.ru"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Website URL (Optional)</label>
                        <input
                          type="url"
                          value={providerWebsite}
                          onChange={(e) => setProviderWebsite(e.target.value)}
                          placeholder="https://masterceramics.ru"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Social Media Handle (Optional)</label>
                        <input
                          type="text"
                          value={providerSocial}
                          onChange={(e) => setProviderSocial(e.target.value)}
                          placeholder="@masterceramics_spb"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: PREVIEW & PUBLISH */}
              {currentStep === 8 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">Step 8 of 8</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">Preview Activity Listing</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Review exactly how your listing will appear to learners before publishing.
                    </p>
                  </div>

                  {/* Preview Toggle Bar */}
                  <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl">
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => setPreviewTab('card')}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          previewTab === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        📇 Marketplace Card View
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('detail')}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          previewTab === 'detail' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        📄 Full Product Page View
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500 hidden sm:inline-block pr-2">
                      Course-First Layout Verified ✓
                    </span>
                  </div>

                  {/* TAB 1: CARD PREVIEW */}
                  {previewTab === 'card' && (
                    <div className="max-w-sm mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img src={activeCover} alt={title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                            {category}
                          </span>
                          <span className="bg-[#074213] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {activityType}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center space-x-1 font-semibold text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-[#A2FF00]"></span>
                            <span>{selectedStationObj.name}</span>
                            <span className="text-slate-400">({walkMinutes}m walk)</span>
                          </span>
                          <div className="flex items-center space-x-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>5.0</span>
                          </div>
                        </div>

                        <h4 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug">
                          {title || 'Untitled Activity'}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-2">{shortDescription || 'Short description summary...'}</p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 block">Tuition</span>
                            <div className="flex items-baseline space-x-1">
                              <span className="text-lg font-black text-slate-900">{regularPrice} ₽</span>
                              <span className="text-[10px] text-slate-500">{priceUnit}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                          >
                            Reserve Spot
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DETAIL PAGE PREVIEW */}
                  {previewTab === 'detail' && (
                    <div className="border border-slate-200 rounded-3xl overflow-hidden bg-slate-50 p-4 space-y-4">
                      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#074213] uppercase">{activityType} • {category}</span>
                          <span className="text-xs text-slate-400">Hosted by {studioName || 'Studio'}</span>
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900">{title || 'Untitled Activity'}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{shortDescription}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-slate-400 block text-[10px]">Metro</span>
                            <span className="font-bold text-slate-800">{selectedStationObj.name} ({walkMinutes}m)</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-slate-400 block text-[10px]">Instructor</span>
                            <span className="font-bold text-slate-800">{instructorName || 'Teacher'}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-slate-400 block text-[10px]">Pricing</span>
                            <span className="font-bold text-[#074213]">{regularPrice} ₽ {priceUnit}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-slate-400 block text-[10px]">Format</span>
                            <span className="font-bold text-slate-800">{deliveryMode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section Quick Jump Buttons */}
                      <div className="flex flex-wrap gap-2 text-xs pt-2">
                        <span className="text-slate-500 font-medium text-xs self-center">Quick Edits:</span>
                        <button onClick={() => setCurrentStep(2)} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100">
                          ✏️ Basic Info
                        </button>
                        <button onClick={() => setCurrentStep(3)} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100">
                          ✏️ Schedule
                        </button>
                        <button onClick={() => setCurrentStep(4)} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100">
                          ✏️ Location
                        </button>
                        <button onClick={() => setCurrentStep(5)} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100">
                          ✏️ Pricing
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      {!isSuccess && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              {draftSavedAt && (
                <button
                  type="button"
                  onClick={clearDraft}
                  className="text-xs text-slate-400 hover:text-rose-500 underline ml-2 transition-colors"
                >
                  Clear draft
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
                Step {currentStep} of 8
              </span>

              {currentStep < 8 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#074213] hover:bg-[#05320e] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 group"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-7 py-3 bg-[#A2FF00] hover:bg-[#91E600] text-[#074213] font-black text-xs rounded-2xl shadow-lg hover:shadow-[#A2FF00]/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#074213] fill-[#074213]" />
                  <span>{activityToEdit ? 'Save Listing Changes' : 'Publish Activity Listing'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CreateActivityPage = CreateActivityModal;
