import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  SlidersHorizontal,
  Image as ImageIcon,
  PlayCircle,
  Sparkles,
  Users,
  Award,
  Heart,
  TrendingUp,
  X,
  Plus,
  MessageCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Review, ReviewBreakdown, ReviewSummary, Activity } from '../types';

interface ReviewsProps {
  activity: Activity;
  customReviews?: Review[];
  onAddReview?: (newReview: Review) => void;
}

const DEFAULT_MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    activityId: 'act-1',
    userName: 'Daria M.',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    breakdown: {
      instructor: 5.0,
      activityQuality: 5.0,
      value: 4.8,
      location: 4.9,
      organization: 5.0,
      atmosphere: 4.9,
      facilities: 4.8,
      beginnerFriendly: 5.0,
      kidsFriendly: 4.7
    },
    comment:
      'Exceptional instructor! Elena took the time to guide each student through centering the clay on the wheel. The studio is literally 4 minutes from Taganskaya metro exit #2. Highly recommend the free trial session!',
    date: 'July 28, 2026',
    isVerifiedAttendee: true,
    attendedDate: 'Attended July 2026',
    positiveTags: ['Great Instructor', 'Small Groups', 'Well Organized', 'Easy Metro Access', 'Worth the Money'],
    photos: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    ],
    helpfulCount: 24,
    userHelpfulVoted: false
  },
  {
    id: 'rev-2',
    activityId: 'act-1',
    userName: 'Alexey K.',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    breakdown: {
      instructor: 4.9,
      activityQuality: 4.9,
      value: 4.9,
      location: 5.0,
      organization: 4.8,
      atmosphere: 5.0,
      facilities: 4.9,
      beginnerFriendly: 5.0,
      corporateFriendly: 4.8
    },
    comment:
      'Fits perfectly with my evening schedule after work. All clay materials and glazing tools were provided. Fun, relaxed atmosphere and great background music.',
    date: 'July 15, 2026',
    isVerifiedAttendee: true,
    attendedDate: 'Attended July 2026',
    positiveTags: ['Fun Atmosphere', 'Excellent for Beginners', 'Worth the Money', 'Easy Metro Access'],
    photos: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
    ],
    helpfulCount: 18,
    userHelpfulVoted: false
  },
  {
    id: 'rev-3',
    activityId: 'act-1',
    userName: 'Marina S.',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    breakdown: {
      instructor: 5.0,
      activityQuality: 4.9,
      value: 5.0,
      location: 4.8,
      organization: 5.0,
      atmosphere: 4.9,
      facilities: 4.8,
      beginnerFriendly: 4.9,
      kidsFriendly: 4.9
    },
    comment:
      'Came here with my daughter for a weekend session. Extremely patient teacher and small group size (only 8 people). We ended up making two ceramic bowls!',
    date: 'June 30, 2026',
    isVerifiedAttendee: true,
    attendedDate: 'Attended June 2026',
    positiveTags: ['Small Groups', 'Family Friendly', 'Great Instructor', 'Highly Interactive'],
    photos: [],
    helpfulCount: 12,
    userHelpfulVoted: false
  }
];

const PRESET_TAGS = [
  'All Tags',
  'Great Instructor',
  'Small Groups',
  'Fun Atmosphere',
  'Worth the Money',
  'Well Organized',
  'Easy Metro Access',
  'Excellent for Beginners',
  'Family Friendly',
  'Highly Interactive'
];

export const Reviews: React.FC<ReviewsProps> = ({
  activity,
  customReviews = DEFAULT_MOCK_REVIEWS,
  onAddReview
}) => {
  const [reviewsList, setReviewsList] = useState<Review[]>(customReviews);
  const [selectedTag, setSelectedTag] = useState<string>('All Tags');
  const [sortBy, setSortBy] = useState<'most-helpful' | 'newest' | 'highest-rated' | 'lowest-rated'>('most-helpful');
  const [activeMediaModal, setActiveMediaModal] = useState<string | null>(null);

  // Form Modal for adding a new review
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [selectedNewTags, setSelectedNewTags] = useState<string[]>(['Great Instructor']);

  const recommendationPercentage = 96;
  const repeatBookingPercentage = 42;

  const averageBreakdown: ReviewBreakdown = {
    instructor: 4.95,
    activityQuality: 4.92,
    value: 4.85,
    location: 4.9,
    organization: 4.88,
    atmosphere: 4.93,
    facilities: 4.82,
    beginnerFriendly: 4.96,
    kidsFriendly: 4.85,
    corporateFriendly: 4.8
  };

  const activityInsights = [
    '96% of attendees recommend this activity to friends',
    'Most attendees (78%) are first-time beginners',
    'Average group size: 8–10 participants',
    'Popular with young professionals & couples'
  ];

  const handleHelpfulClick = (reviewId: string) => {
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const isVoted = r.userHelpfulVoted;
          return {
            ...r,
            helpfulCount: (r.helpfulCount || 0) + (isVoted ? -1 : 1),
            userHelpfulVoted: !isVoted
          };
        }
        return r;
      })
    );
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      activityId: activity.id,
      userName: newUserName,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: newRating,
      breakdown: {
        instructor: newRating,
        activityQuality: newRating,
        value: newRating,
        location: 5.0,
        organization: 5.0,
        atmosphere: 4.9,
        facilities: 4.8,
        beginnerFriendly: 5.0
      },
      comment: newComment,
      date: 'Just now',
      isVerifiedAttendee: true,
      attendedDate: 'Attended August 2026',
      positiveTags: selectedNewTags,
      helpfulCount: 1,
      userHelpfulVoted: true
    };

    setReviewsList((prev) => [newRev, ...prev]);
    if (onAddReview) {
      onAddReview(newRev);
    }
    setShowAddReviewModal(false);
    setNewUserName('');
    setNewComment('');
  };

  // Filter & Sort reviews
  const filteredReviews = reviewsList.filter((rev) => {
    if (selectedTag === 'All Tags') return true;
    return rev.positiveTags?.includes(selectedTag);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'most-helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    if (sortBy === 'highest-rated') return b.rating - a.rating;
    if (sortBy === 'lowest-rated') return a.rating - b.rating;
    return 0;
  });

  // Extract all media photos across reviews for gallery preview
  const allPhotos = reviewsList.flatMap((r) => r.photos || []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ========================================================================= */}
      {/* 1. TRUST SUMMARY BANNER & OVERALL RATING METRICS */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Main Score Box */}
          <div className="flex items-center space-x-5">
            <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl text-center shrink-0 shadow-md">
              <span className="text-4xl sm:text-5xl font-extrabold text-amber-400 block tracking-tight">
                {activity.rating || 4.95}
              </span>
              <div className="flex items-center justify-center space-x-1 text-amber-400 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block font-semibold">
                Based on {activity.reviewCount || reviewsList.length * 42} verified reviews
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Verified Attendee Trust Rating
              </h3>
              <p className="text-xs text-slate-300 max-w-md">
                100% of reviews are collected exclusively from verified participants who completed a session.
              </p>
              
              {/* Trust Metric Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{recommendationPercentage}% Recommend Rate</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>{repeatBookingPercentage}% Repeat Attendees</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <button
              onClick={() => setShowAddReviewModal(true)}
              className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-900" />
              <span>Write a Verified Review</span>
            </button>
          </div>
        </div>

        {/* Activity Insights Bar */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activityInsights.map((insight, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700/40 p-3 rounded-2xl text-xs text-slate-200 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span className="font-medium leading-snug">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RATING BREAKDOWN (SUB-RATINGS) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Category Rating Breakdown</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Verified Criteria Scoring</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 pt-2">
          {[
            { label: 'Instructor Skill & Guidance', score: averageBreakdown.instructor },
            { label: 'Activity Quality & Content', score: averageBreakdown.activityQuality },
            { label: 'Value for Money', score: averageBreakdown.value },
            { label: 'Metro Accessibility & Location', score: averageBreakdown.location },
            { label: 'Studio Organization & Setup', score: averageBreakdown.organization },
            { label: 'Atmosphere & Energy', score: averageBreakdown.atmosphere },
            { label: 'Facilities & Equipment', score: averageBreakdown.facilities },
            { label: 'Beginner Friendliness', score: averageBreakdown.beginnerFriendly },
            { label: 'Kids & Family Friendly', score: averageBreakdown.kidsFriendly || 4.85 },
            { label: 'Corporate & Team Friendly', score: averageBreakdown.corporateFriendly || 4.8 }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{item.label}</span>
                <span className="font-extrabold text-slate-900">{item.score.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(item.score / 5) * 100}%` }}
                  className="h-full bg-slate-900 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MEDIA GALLERY STREAM (PHOTOS & VIDEOS) */}
      {/* ========================================================================= */}
      {allPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Attendee Photo & Video Gallery ({allPhotos.length})</span>
            </h4>
            <span className="text-xs text-slate-400">Captured by verified participants</span>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-2 no-scrollbar">
            {allPhotos.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMediaModal(imgUrl)}
                className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-200 cursor-pointer group shadow-xs hover:shadow-md transition-all"
              >
                <img
                  src={imgUrl}
                  alt={`Attendee photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ImageIcon className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. POSITIVE REVIEW TAGS & SORT CONTROLS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          {/* Tag Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="most-helpful">Most Helpful</option>
              <option value="newest">Newest First</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="lowest-rated">Lowest Rated</option>
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. REVIEW LIST CARDS */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          {sortedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
            >
              {/* User Identity Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={rev.userName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{rev.userName}</h4>
                      {rev.isVerifiedAttendee && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Participant</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{rev.attendedDate || rev.date}</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-amber-800 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                "{rev.comment}"
              </p>

              {/* Attached Positive Tags */}
              {rev.positiveTags && rev.positiveTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rev.positiveTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Photos Attachment */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex items-center space-x-2 pt-1">
                  {rev.photos.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      alt="Review attachment"
                      onClick={() => setActiveMediaModal(p)}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 cursor-pointer hover:opacity-90"
                    />
                  ))}
                </div>
              )}

              {/* Bottom Helpful Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Was this review helpful for booking?</span>
                <button
                  onClick={() => handleHelpfulClick(rev.id)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    rev.userHelpfulVoted
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${rev.userHelpfulVoted ? 'text-white' : 'text-slate-500'}`} />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD VERIFIED REVIEW */}
      {/* ========================================================================= */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleAddReviewSubmit}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col space-y-4 p-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Write a Verified Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Amar S."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700">{newRating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Detailed Feedback *</label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details about the instructor, atmosphere, equipment, and metro convenience..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MEDIA PREVIEW */}
      {/* ========================================================================= */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeMediaModal}
              alt="Expanded preview"
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
