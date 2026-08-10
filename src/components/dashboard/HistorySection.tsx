import React, { useState } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  Star,
  MessageSquare,
  FileCheck,
  Download,
  Share2,
  Calendar,
  MapPin,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';

export interface CompletedActivity {
  id: string;
  title: string;
  category: string;
  completedDate: string;
  hoursSpent: number;
  metroStation: string;
  instructor: string;
  certificateEarned?: string;
  userRating?: number;
  userReview?: string;
  image: string;
}

const COMPLETED_HISTORY: CompletedActivity[] = [
  {
    id: 'hist-1',
    title: 'Beginner Pottery & Wheel Throwing Fundamentals',
    category: 'Ceramics & Art',
    completedDate: 'Jul 28, 2026',
    hoursSpent: 4.5,
    metroStation: 'Taganskaya',
    instructor: 'Elena Rostova',
    certificateEarned: 'Ceramic Crafting Level 1 Certificate',
    userRating: 5,
    userReview: 'Super intuitive instructor and great studio environment! Loved hands-on wheel throwing.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hist-2',
    title: 'Sunrise Vinyasa Flow & Pranayama',
    category: 'Yoga & Wellness',
    completedDate: 'Jul 20, 2026',
    hoursSpent: 3.0,
    metroStation: 'Chistye Prudy',
    instructor: 'Mikhail Volkov',
    userRating: 5,
    userReview: 'Calming morning session right before work. Will definitely attend again.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hist-3',
    title: 'Espresso Extraction & Milk Texturing Lab',
    category: 'Culinary & Beverage',
    completedDate: 'Jul 12, 2026',
    hoursSpent: 2.5,
    metroStation: 'Mayakovskaya',
    instructor: 'Dmitry Orlov',
    certificateEarned: 'Home Barista Skills Badge',
    userRating: 4,
    userReview: 'Learned the science behind espresso grinder calibration and latte art folding.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
  }
];

const CATEGORY_STATS = [
  { name: 'Ceramics & Art', hours: 14.5, count: 5, color: 'bg-indigo-600', percent: 42 },
  { name: 'Yoga & Wellness', hours: 10.0, count: 4, color: 'bg-emerald-500', percent: 29 },
  { name: 'Culinary & Beverage', hours: 6.0, count: 2, color: 'bg-amber-500', percent: 18 },
  { name: 'Dance & Movement', hours: 4.0, count: 1, color: 'bg-rose-500', percent: 11 }
];

export const HistorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'completed' | 'certificates' | 'reviews' | 'analytics'>('completed');

  const totalHours = COMPLETED_HISTORY.reduce((acc, curr) => acc + curr.hoursSpent, 34.5);

  return (
    <div className="space-y-5 overflow-x-hidden w-full">
      {/* Overview Analytics Bar (Coursera Inspired) */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-lg space-y-5 sm:space-y-6 relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Skill Hours</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalHours} hrs</span>
              <span className="text-xs text-emerald-400 font-semibold">+6.5 hrs this month</span>
            </div>
            <p className="text-xs text-slate-400">Tracked learning & activity practice time.</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Categories Explored</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4 Distinct Fields</div>
            <p className="text-xs text-slate-400">Ceramics, Yoga, Culinary, Dance.</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Certificates Earned</span>
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 shrink-0" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white">2 Credentials</span>
            </div>
            <p className="text-xs text-slate-400">Verified by host studios & instructors.</p>
          </div>
        </div>

        {/* Category Breakdown Progress Bar */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Category Time Distribution</span>
            <span className="text-slate-400">100% Verified</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            {CATEGORY_STATS.map((cat, idx) => (
              <div
                key={idx}
                style={{ width: `${cat.percent}%` }}
                className={`${cat.color} h-full border-r border-slate-900`}
                title={`${cat.name}: ${cat.hours} hrs (${cat.percent}%)`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 pt-1">
            {CATEGORY_STATS.map((cat, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
                <span>{cat.name} ({cat.hours}h)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 snap-start cursor-pointer ${
            activeTab === 'completed' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Completed Sessions ({COMPLETED_HISTORY.length})
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 snap-start cursor-pointer ${
            activeTab === 'certificates' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Certificates & Badges (2)
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 snap-start cursor-pointer ${
            activeTab === 'reviews' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Reviews Written (3)
        </button>
      </div>

      {/* TAB 1: COMPLETED SESSIONS */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {COMPLETED_HISTORY.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4"
            >
              <div className="flex items-start space-x-3 sm:space-x-4 min-w-0">
                <img src={item.image} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">Completed {item.completedDate}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.metroStation}</span>
                      <span>•</span>
                      <span>{item.hoursSpent} hrs session</span>
                    </p>
                    <p className="text-slate-500 truncate">Instructor: <strong className="text-slate-700">{item.instructor}</strong></p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full sm:w-auto shrink-0 gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {item.certificateEarned && (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl">
                    <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Certificate Earned</span>
                  </span>
                )}
                {item.userRating && (
                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                    <span>Your rating: {item.userRating}/5</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CERTIFICATES & BADGES */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 space-y-4 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold px-3 py-1 bg-amber-200/60 text-amber-900 rounded-full">
                VERIFIED CREDENTIAL
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Ceramic Crafting Level 1</h4>
              <p className="text-xs text-slate-600">Issued by Taganskaya Craft Studio • July 2026</p>
              <p className="text-xs text-slate-500 pt-1">
                Demonstrated mastery in basic centering, wheel throwing, cylinder shaping, and glaze application.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 hover:bg-slate-800">
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button className="px-3 py-2 bg-white border border-amber-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-amber-100/50">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-3xl p-6 space-y-4 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold px-3 py-1 bg-indigo-200/60 text-indigo-900 rounded-full">
                SPECIALTY BADGE
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Home Barista Skills Certification</h4>
              <p className="text-xs text-slate-600">Issued by Mayakovskaya Roastery • July 2026</p>
              <p className="text-xs text-slate-500 pt-1">
                Completed sensory cupping, espresso recipe dialing, milk aeration temperature control.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 hover:bg-slate-800">
                <Download className="w-3.5 h-3.5" />
                <span>Download Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS WRITTEN */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {COMPLETED_HISTORY.filter((item) => item.userReview).map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h5 className="text-xs font-bold text-slate-900 flex-1 min-w-0 leading-snug">{item.title}</h5>
                <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{item.userRating}.0 / 5.0</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                "{item.userReview}"
              </p>
              <span className="text-[11px] text-slate-400 block text-right">Reviewed on {item.completedDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
