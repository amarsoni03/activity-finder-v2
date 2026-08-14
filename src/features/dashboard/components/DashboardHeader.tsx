import React from 'react';
import {
  MapPin,
  Clock,
  Award,
  Calendar,
  Sparkles,
  CheckCircle2,
  Heart,
  SlidersHorizontal,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  preferredMetro: string;
  favoriteCategories: string[];
  preferredTimeSlot: string;
  audienceLevel: string;
  language: string;
  totalHoursSpent: number;
  completedCount: number;
  savedCount: number;
  certificatesCount: number;
}

interface DashboardHeaderProps {
  user: UserProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEditProfileClick: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab,
  onTabChange,
  onEditProfileClick
}) => {
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Zap },
    { id: 'upcoming', label: 'Upcoming', badge: '2', icon: Calendar },
    { id: 'saved', label: 'Saved & Wishlist', icon: Heart },
    { id: 'discovery', label: 'Discovery Hub', icon: Sparkles },
    { id: 'history', label: 'Activity History', icon: Award },
    { id: 'profile', label: 'Profile & Settings', icon: SlidersHorizontal }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl relative w-full">
      {/* Blur elements in their own clipping container */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-indigo-600/30 to-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 space-y-4 sm:space-y-6">
        {/* Profile Row */}
        <div className="flex items-start justify-between gap-3">
          {/* Avatar + Identity */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl object-cover border-2 border-slate-700 shadow-md"
              />
              <span
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 sm:p-1 rounded-full border-2 border-slate-900"
                title="Active Explorer"
              >
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </span>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-white truncate">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full shrink-0 hidden sm:inline-flex">
                  Level 3 Explorer
                </span>
              </div>
              {/* Email hidden on mobile to save space */}
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">{user.email}</p>
              {/* Metro + Time badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-300">
                  <MapPin className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-white">{user.preferredMetro}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-300 max-w-[130px] sm:max-w-[180px]">
                  <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="truncate">{user.preferredTimeSlot.split('(')[0].trim()}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit button — always visible, top-right */}
          <button
            onClick={onEditProfileClick}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Edit Preferences</span>
            <span className="sm:hidden">Edit</span>
          </button>
        </div>

        {/* Stats Grid — 2-col on mobile, 4-col on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-800/80">
          {[
            { icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10', value: `${user.totalHoursSpent}h`, label: 'Activity Time' },
            { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', value: user.completedCount, label: 'Completed' },
            { icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10', value: user.savedCount, label: 'Saved' },
            { icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', value: user.certificatesCount, label: 'Badges' },
          ].map(({ icon: Icon, color, bg, value, label }) => (
            <div key={label} className="bg-slate-800/50 border border-slate-700/40 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 ${bg} ${color} rounded-lg sm:rounded-xl shrink-0`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-sm sm:text-lg font-extrabold text-white block truncate">{value}</span>
                <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation — DESKTOP ONLY (mobile uses sticky quick-nav in UserDashboard) */}
        <div className="pt-1 hidden md:block">
          <nav className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer snap-start ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md font-bold'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
