import React, { useState } from 'react';
import { Activity, Booking, WaitlistEntry } from '../../../types';
import { formatPrice } from '../../../utils/formatters';
import { ProviderTrustBadge } from '../../activities/components/ProviderTrustBadge';
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Plus,
  Edit,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Mail,
  Phone,
  Search,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Bell
} from 'lucide-react';

interface ProviderDashboardProps {
  activities: Activity[];
  bookings: Booking[];
  waitlists: WaitlistEntry[];
  onOpenCreateActivity: () => void;
  onEditActivity?: (activity: Activity) => void;
  onSelectActivityDetails: (activityId: string) => void;
  onToggleActivityStatus?: (activityId: string) => void;
  onNotifyWaitlistUser?: (waitlistId: string) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  activities,
  bookings,
  waitlists,
  onOpenCreateActivity,
  onEditActivity,
  onSelectActivityDetails,
  onToggleActivityStatus,
  onNotifyWaitlistUser,
}) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'roster' | 'waitlist'>('activities');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Provider Stats
  const totalListings = activities.length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => {
    const rawPrice = parseInt(b.priceText.replace(/[^0-9]/g, ''), 10) || 1500;
    return sum + rawPrice;
  }, 0);
  const pendingWaitlists = waitlists.filter(w => w.status === 'pending');

  const filteredActivities = activities.filter((act) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.category.toLowerCase().includes(q) ||
        act.metroStationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredBookings = bookings.filter((b) => {
    if (selectedActivityFilter !== 'all' && b.activityId !== selectedActivityFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.userName.toLowerCase().includes(q) ||
        b.userEmail.toLowerCase().includes(q) ||
        b.activityTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Provider Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-[#A2FF00] uppercase tracking-wider bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                Instructor & Studio Portal
              </span>
              <ProviderTrustBadge
                trust={{ isVerified: true, isTopRated: true, isBackgroundChecked: true }}
                variant="micro"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Provider Management Hub
            </h1>
            <p className="text-xs text-slate-300 max-w-xl font-normal leading-relaxed">
              Manage your activity listings, review attendee rosters, handle waitlist requests, and publish new courses.
            </p>
          </div>

          <button
            onClick={onOpenCreateActivity}
            className="px-6 py-3.5 bg-[#A2FF00] hover:bg-[#91E600] text-[#074213] text-xs font-bold rounded-2xl transition-all shadow-md shrink-0 flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Activity</span>
          </button>

        </div>

        {/* Stats Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published Courses</span>
            <div className="text-2xl font-black text-white mt-1">{totalListings}</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Participants</span>
            <div className="text-2xl font-black text-[#A2FF00] mt-1">{totalBookings}</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Waitlist Requests</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{pendingWaitlists.length}</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Revenue</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{totalRevenue.toLocaleString()} ₽</div>
          </div>
        </div>

      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold w-fit">
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Activities ({activities.length})
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attendee Roster ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'waitlist'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Waitlist Queue</span>
            {pendingWaitlists.length > 0 && (
              <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
                {pendingWaitlists.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter / Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activities or participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* TAB 1: MY ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => {
            const actBookings = bookings.filter((b) => b.activityId === act.id);
            const seatsLeft = act.seatsLeft ?? act.availableSeats ?? 4;
            const totalCapacity = act.totalSeats || act.capacity || 10;
            const isFull = seatsLeft === 0;

            return (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={act.coverImage || act.image}
                      alt={act.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 border border-white/40">
                      {act.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/20">
                      {act.deliveryMode === 'Live Online' ? '💻 Live Online' : act.deliveryMode === 'Self-Paced' ? '🎬 Self-Paced' : act.deliveryMode === 'Hybrid' ? '🔄 Hybrid' : '📍 In Person'}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#A2FF00] border border-white/10">
                      {formatPrice(act.price)} / {act.priceUnit}
                    </div>
                  </div>

                  <div>
                    <h3
                      onClick={() => onSelectActivityDetails(act.id)}
                      className="text-base font-bold text-slate-900 line-clamp-1 hover:text-emerald-700 cursor-pointer"
                    >
                      {act.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{act.metroStationName} station</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{act.schedule?.timeRange || act.startTime || 'Evening'}</span>
                    </div>
                  </div>

                  {/* Seat Capacity Progress */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Enrollment</span>
                      <span className={isFull ? 'text-amber-600 font-bold' : 'text-slate-900'}>
                        {totalCapacity - seatsLeft} / {totalCapacity} Booked
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isFull ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, ((totalCapacity - seatsLeft) / totalCapacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-medium">
                    {actBookings.length} confirmed participant{actBookings.length === 1 ? '' : 's'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditActivity?.(act)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onSelectActivityDetails(act.id)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ATTENDEE ROSTER */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Enrolled Participants</h2>
              <p className="text-xs text-slate-500">Confirmed bookings and participant contact details</p>
            </div>

            {/* Filter by activity dropdown */}
            <select
              value={selectedActivityFilter}
              onChange={(e) => setSelectedActivityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Activities ({activities.length})</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-800">No participant bookings found</p>
              <p className="text-xs">When users reserve spots, their confirmation details will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {filteredBookings.map((b) => (
                <div key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                      {b.userName ? b.userName.charAt(0) : 'U'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900">{b.userName}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                          Confirmed Spot
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">{b.activityTitle}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{b.userEmail}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{b.userPhone || '+7 999 000-00-00'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 space-y-1">
                    <div className="text-xs font-bold text-slate-900">{b.selectedDate}</div>
                    <div className="text-[11px] font-semibold text-emerald-700">{b.priceText}</div>
                    <div className="text-[10px] text-slate-400">Booked: {b.bookedAt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WAITLIST QUEUE */}
      {activeTab === 'waitlist' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Waitlist Requests</h2>
            <p className="text-xs text-slate-500">Users waiting for available spots in sold-out sessions</p>
          </div>

          {waitlists.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-800">No active waitlist requests</p>
              <p className="text-xs">When an activity reaches maximum capacity, interested users can join the waitlist.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {waitlists.map((w) => (
                <div key={w.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{w.userName}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        w.status === 'notified'
                          ? 'bg-blue-100 text-blue-800'
                          : w.status === 'fulfilled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {w.status === 'notified' ? 'Spot Offered' : w.status === 'fulfilled' ? 'Enrolled' : 'Pending Spot'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700">{w.activityTitle}</p>
                    <p className="text-[11px] text-slate-500">Requested Date: {w.requestedDate} • Contact: {w.userEmail}</p>
                  </div>

                  {w.status === 'pending' && (
                    <button
                      onClick={() => onNotifyWaitlistUser && onNotifyWaitlistUser(w.id)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer shrink-0"
                    >
                      Notify Spot Available
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
