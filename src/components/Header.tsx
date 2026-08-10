import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Heart,
  Search,
  User,
  Menu,
  X,
  PlusCircle,
  Clock,
  ChevronDown,
  MapPin,
  Check,
  Building2,
  MessageSquare,
} from 'lucide-react';
import { AudienceType } from '../types';

interface HeaderProps {
  currentAudience?: AudienceType;
  onAudienceChange?: (audience: AudienceType) => void;
  savedCount: number;
  bookingsCount: number;
  messagesCount?: number;
  onOpenSaved: () => void;
  onOpenBookings: () => void;
  onOpenMessages?: () => void;
  onOpenCreate: () => void;
  onOpenAiMatchmaker: () => void;
  onOpenFreeTimePlanner: () => void;
  activeView?: 'list' | 'map' | 'schedule';
  onViewChange?: (view: 'list' | 'map' | 'schedule') => void;
  onSearchClick?: () => void;
  onGoHome?: () => void;
  activeNavTab?: 'my-week' | 'explore' | 'free-time' | 'user-dashboard' | 'provider-dashboard';
  onNavTabChange?: (tab: 'my-week' | 'explore' | 'free-time' | 'user-dashboard' | 'provider-dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  bookingsCount,
  messagesCount = 0,
  onOpenSaved,
  onOpenBookings,
  onOpenMessages,
  onOpenCreate,
  onOpenAiMatchmaker,
  onOpenFreeTimePlanner,
  onSearchClick,
  onGoHome,
  activeNavTab = 'my-week',
  onNavTabChange,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/70 transition-all h-16 sm:h-18 flex items-center text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          
          {/* 1. Brand Logo & Primary Navigation Tabs */}
          <div className="flex items-center space-x-6 sm:space-x-8 select-none">
            <div 
              className="flex items-center space-x-2.5 cursor-pointer group" 
              onClick={() => {
                if (onGoHome) {
                  onGoHome();
                } else if (onNavTabChange) {
                  onNavTabChange('explore');
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onGoHome) onGoHome();
                  else if (onNavTabChange) onNavTabChange('explore');
                }
              }}
              aria-label="Go to homepage"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#A2FF00] text-[#074213] rounded-xl flex items-center justify-center font-black text-base sm:text-lg transition-transform group-hover:scale-105">
                M
              </div>
              <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 leading-tight truncate max-w-[9rem] sm:max-w-none">
                ActivityFirst <span className="text-[#074213] font-extrabold">Moscow</span>
              </span>
            </div>

            {/* Core Primary Navigation Tabs */}
            <nav className="hidden sm:flex items-center bg-slate-100/80 p-1 rounded-full text-xs font-semibold">
              <button
                onClick={() => onNavTabChange && onNavTabChange('explore')}
                className={`px-4 py-1.5 rounded-full transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeNavTab === 'explore'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Explore</span>
              </button>
            </nav>
          </div>

          {/* 2. Desktop Primary Search Trigger */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <button
              onClick={onSearchClick || (() => window.scrollTo({ top: 300, behavior: 'smooth' }))}
              className="w-full flex items-center space-x-2.5 px-4 py-2 bg-slate-100/70 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full text-xs font-medium transition-all group"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
              <span className="truncate">Search activities, time, metro...</span>
            </button>
          </div>

          {/* 3. Primary Actions */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Action 1: AI Activity Concierge */}
            <button
              onClick={onOpenAiMatchmaker}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#A2FF00] hover:bg-[#91E600] text-[#074213] text-xs font-bold rounded-full transition-all cursor-pointer"
              title="AI Activity Concierge"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Concierge</span>
            </button>

            {/* Action 2: Saved activities */}
            <button
              onClick={onOpenSaved}
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-all active:scale-95 cursor-pointer"
              title={savedCount > 0 ? `Saved activities (${savedCount})` : 'Saved activities'}
              aria-label={savedCount > 0 ? `Saved activities, ${savedCount} items` : 'Saved activities'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  savedCount > 0 ? 'fill-slate-900 text-slate-900' : 'text-slate-400'
                }`}
              />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#A2FF00] text-[#074213] text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                  {savedCount > 99 ? '99+' : savedCount}
                </span>
              )}
            </button>

            {/* Action 3: My Activities */}
            <button
              onClick={onOpenBookings}
              className="flex items-center space-x-1.5 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-full transition-all text-xs font-semibold relative cursor-pointer"
              title="My Activities"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Bookings</span>
              {bookingsCount > 0 && (
                <span className="min-w-4 h-4 px-1 bg-[#074213] text-white text-[10px] font-bold rounded-full flex items-center justify-center ml-0.5">
                  {bookingsCount}
                </span>
              )}
            </button>

            {/* Action 4: Messages */}
            {onOpenMessages && (
              <button
                onClick={onOpenMessages}
                className="flex items-center space-x-1.5 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-full transition-all text-xs font-semibold relative cursor-pointer"
                title="Provider Q&A Messages"
              >
                <MessageSquare className="w-4 h-4 text-[#074213]" />
                <span>Messages</span>
                {messagesCount > 0 && (
                  <span className="min-w-4 h-4 px-1 bg-[#074213] text-[#A2FF00] text-[10px] font-bold rounded-full flex items-center justify-center ml-0.5">
                    {messagesCount}
                  </span>
                )}
              </button>
            )}

            {/* Action 4: User / Profile Menu Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-1 p-1 pl-2 pr-1.5 bg-slate-100/80 hover:bg-slate-100 rounded-full transition-all text-xs font-semibold text-slate-700 cursor-pointer"
                title="Account & Provider Menu"
              >
                <div className="w-6 h-6 bg-[#074213] text-[#A2FF00] rounded-full flex items-center justify-center text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/70 p-2 z-50 animate-fade-in space-y-1 text-xs text-slate-800">
                  <div className="p-3 bg-slate-50 rounded-xl mb-1">
                    <p className="font-bold text-slate-900 text-sm">Moscow Member</p>
                    <p className="text-[11px] text-slate-500">Activity Discovery Account</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      if (onNavTabChange) onNavTabChange('user-dashboard');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-left rounded-xl hover:bg-slate-100 text-slate-800 font-bold transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-700" />
                    <span>My Activity Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      if (onNavTabChange) onNavTabChange('provider-dashboard');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-left rounded-xl hover:bg-slate-100 text-slate-800 font-bold transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>Instructor & Provider Hub</span>
                  </button>

                  {/* Provider Action */}
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenCreate();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-left rounded-xl hover:bg-slate-100 text-slate-900 font-bold transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-[#074213]" />
                    <div>
                      <div>List Your Activity</div>
                      <div className="text-[10px] font-normal text-slate-500">Post a new class</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenFreeTimePlanner();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-left rounded-xl hover:bg-slate-100 text-slate-800 font-medium transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span>Set Weekly Free Time</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Course First. Studio Second.
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center space-x-1">
            <button
              onClick={onSearchClick || (() => window.scrollTo({ top: 300, behavior: 'smooth' }))}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Out Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in md:hidden">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto text-slate-900">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onGoHome) onGoHome();
                    else if (onNavTabChange) onNavTabChange('explore');
                  }}
                  className="flex items-center space-x-2.5 text-left cursor-pointer"
                  aria-label="Go to homepage"
                >
                  <div className="w-9 h-9 bg-[#A2FF00] text-[#074213] rounded-xl flex items-center justify-center font-black text-base shadow-2xs">
                    M
                  </div>
                  <span className="font-bold text-slate-900 text-base tracking-tight">
                    ActivityFirst <span className="text-[#074213] font-extrabold">Moscow</span>
                  </span>
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Actions & Options List */}
              <div className="py-4 space-y-1.5 text-xs">
                
                {/* 1. Explore / Search */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onNavTabChange) onNavTabChange('explore');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeNavTab === 'explore'
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100/80 font-semibold'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Search className={`w-4 h-4 ${activeNavTab === 'explore' ? 'text-[#A2FF00]' : 'text-slate-400'}`} />
                    <span>Explore / Search</span>
                  </div>
                  {activeNavTab === 'explore' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A2FF00]" />
                  )}
                </button>

                {/* 2. My Week (Personalized) */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onNavTabChange) onNavTabChange('my-week');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeNavTab === 'my-week'
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100/80 font-semibold'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className={`w-4 h-4 ${activeNavTab === 'my-week' ? 'text-[#A2FF00]' : 'text-slate-500'}`} />
                    <span>My Week (Personalized)</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${activeNavTab === 'my-week' ? 'bg-[#A2FF00]' : 'bg-[#074213]'} animate-pulse`} />
                </button>

                {/* 3. AI Activity Concierge (Premium Subtle Lime Accent Card) */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAiMatchmaker();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 bg-gradient-to-r from-[#A2FF00]/15 via-emerald-500/10 to-transparent border border-[#A2FF00]/40 text-[#074213] hover:bg-[#A2FF00]/25 font-bold rounded-xl transition-all cursor-pointer my-1"
                >
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-4 h-4 text-[#074213]" />
                    <span>AI Activity Concierge</span>
                  </div>
                  <span className="bg-[#A2FF00] text-[#074213] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AI Match
                  </span>
                </button>

                {/* 4. Saved activities */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenSaved();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 text-slate-700 hover:bg-slate-100/80 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Heart
                        className={`w-4 h-4 ${
                          savedCount > 0 ? 'fill-slate-900 text-slate-900' : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <span>Saved Activities</span>
                  </div>
                  {savedCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 bg-[#A2FF00] text-[#074213] text-[11px] font-extrabold rounded-full flex items-center justify-center">
                      {savedCount > 99 ? '99+' : savedCount}
                    </span>
                  )}
                </button>

                {/* 5. My Activities (Bookings) */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBookings();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 text-slate-700 hover:bg-slate-100/80 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>My Activities</span>
                  </div>
                  {bookingsCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 bg-[#074213] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center">
                      {bookingsCount}
                    </span>
                  )}
                </button>

                {/* 6. Messages (Q&A) */}
                {onOpenMessages && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenMessages();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-3 text-slate-700 hover:bg-slate-100/80 font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-4 h-4 text-[#074213]" />
                      <span>Messages</span>
                    </div>
                    {messagesCount > 0 && (
                      <span className="min-w-5 h-5 px-1.5 bg-[#074213] text-[#A2FF00] text-[11px] font-extrabold rounded-full flex items-center justify-center">
                        {messagesCount}
                      </span>
                    )}
                  </button>
                )}

                {/* 7. Weekly Free Time */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenFreeTimePlanner();
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-3 text-slate-700 hover:bg-slate-100/80 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Set Weekly Free Time</span>
                </button>

                {/* Divider for Portals */}
                <div className="pt-4 pb-1.5 px-3 border-t border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Account & Portals
                </div>

                {/* 8. My Activity Dashboard */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onNavTabChange) onNavTabChange('user-dashboard');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeNavTab === 'user-dashboard'
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100/80 font-semibold'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <User className={`w-4 h-4 ${activeNavTab === 'user-dashboard' ? 'text-[#A2FF00]' : 'text-slate-500'}`} />
                    <span>My Activity Dashboard</span>
                  </div>
                </button>

                {/* 9. Instructor & Provider Hub */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onNavTabChange) onNavTabChange('provider-dashboard');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeNavTab === 'provider-dashboard'
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100/80 font-semibold'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Building2 className={`w-4 h-4 ${activeNavTab === 'provider-dashboard' ? 'text-[#A2FF00]' : 'text-emerald-700'}`} />
                    <span>Instructor & Provider Hub</span>
                  </div>
                </button>

                {/* 10. List Your Activity (Provider CTA) */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCreate();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-2xs transition-all cursor-pointer mt-2"
                >
                  <div className="flex items-center space-x-3">
                    <PlusCircle className="w-4 h-4 text-[#A2FF00]" />
                    <span>List Your Activity</span>
                  </div>
                  <span className="text-[10px] font-normal text-slate-300">Post class</span>
                </button>

              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
              <p className="font-bold text-slate-900">Course First. Studio Second.</p>
              <p className="text-[10px] mt-0.5 text-slate-500">Moscow Activity Discovery Platform</p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
