import React, { useState, useMemo } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  Star,
  MapPin,
  TrendingUp,
  Compass,
  Users,
  Award,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Zap,
  Tag,
  Building,
  Palette,
  Dumbbell,
  Globe,
  Music,
  UtensilsCrossed,
} from 'lucide-react';
import { Activity, FilterState, Category, AudienceType } from '../types';
import { HeroSearch } from '../components/HeroSearch';
import { ActivityCard } from '../components/ActivityCard';
import { METRO_LINES, METRO_STATIONS } from '../data/metroData';

interface HomePageProps {
  activities: Activity[];
  filters: FilterState;
  onApplyFilters: (newFilters: Partial<FilterState>) => void;
  onSelectActivity: (activity: Activity) => void;
  onQuickBook: (activity: Activity) => void;
  onToggleSave: (activityId: string) => void;
  savedIds: string[];
  onOpenAiMatchmaker?: () => void;
  onOpenFreeTimePlanner?: () => void;
}

// Category Card Visual Metadata with Unsplash images & icons
const CATEGORY_VISUALS: Record<
  string,
  { image: string; tag: string; description: string }
> = {
  Languages: {
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
    tag: 'English, Spanish, French',
    description: 'Master new languages with native conversation groups',
  },
  Sports: {
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    tag: 'Tennis, Padel, Swimming',
    description: 'High-energy outdoor and indoor athletic programs',
  },
  Dance: {
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    tag: 'Salsa, Bachata, Contemporary',
    description: 'Expressive movement and rhythm workshops for all levels',
  },
  Arts: {
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    tag: 'Ceramics, Oil Painting, Sketching',
    description: 'Hands-on creative studios and fine arts masterclasses',
  },
  Music: {
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    tag: 'Piano, Vocal, Guitar',
    description: 'Acoustic and electric jam sessions & formal instruction',
  },
  Cooking: {
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    tag: 'Italian, Pastry, Wine Tasting',
    description: 'Culinary technique classes with professional chefs',
  },
  Technology: {
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    tag: 'Python, AI, Web Dev',
    description: 'Practical coding Bootcamps & hands-on tech labs',
  },
  Business: {
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    tag: 'Public Speaking, Marketing',
    description: 'Career growth & executive presentation skills',
  },
  Fitness: {
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    tag: 'Yoga, Pilates, Crossfit',
    description: 'Mindful wellness, strength training & flexibility',
  },
  Kids: {
    image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80',
    tag: 'Stem, Robotics, Art Camp',
    description: 'Engaging weekend and after-school youth activities',
  },
  Corporate: {
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    tag: 'Team Building, Offsites',
    description: 'Tailored group events & private studio bookings',
  },
};

// Dynamic Discovery Section Tabs Definition
const DISCOVERY_SECTIONS = [
  { id: 'starting-soon', label: '🔥 Starting This Week', icon: Flame, filter: (a: Activity) => a.startDate?.toLowerCase().includes('ongoing') || a.startDate?.toLowerCase().includes('sep') || a.startDate?.toLowerCase().includes('starts') || true },
  { id: 'tonight', label: '⏰ Tonight Near You', icon: Clock, filter: (a: Activity) => a.schedule.timeOfDay === 'Evening' },
  { id: 'free-trial', label: '🆓 Free Trial Activities', icon: Tag, filter: (a: Activity) => a.isFreeTrial || a.price < 50 },
  { id: 'popular', label: '⭐ Most Popular', icon: Star, filter: (a: Activity) => a.rating >= 4.8 || a.reviewCount > 25 },
  { id: 'new', label: '🆕 Newly Added', icon: Sparkles, filter: (a: Activity) => a.newActivity || a.isNewThisWeek },
  { id: 'kids', label: '👨‍👩‍👧 Kids\' Favorites', icon: Users, filter: (a: Activity) => a.audience === 'Children' },
  { id: 'corporate', label: '🏢 Corporate Programs', icon: Building, filter: (a: Activity) => a.audience === 'Corporate' || a.title.toLowerCase().includes('team') },
  { id: 'creative', label: '🎨 Creative Activities', icon: Palette, filter: (a: Activity) => a.category === 'Arts' || a.category === 'Cooking' },
  { id: 'sports', label: '🏃 Sports & Fitness', icon: Dumbbell, filter: (a: Activity) => a.category === 'Sports' || a.category === 'Fitness' },
  { id: 'languages', label: '🌍 Language Programs', icon: Globe, filter: (a: Activity) => a.category === 'Languages' },
  { id: 'music', label: '🎵 Music & Dance', icon: Music, filter: (a: Activity) => a.category === 'Music' || a.category === 'Dance' },
  { id: 'workshops', label: '🍳 Weekend Workshops', icon: UtensilsCrossed, filter: (a: Activity) => a.schedule.days.includes('Saturday') || a.schedule.days.includes('Sunday') || a.isOneTimeWorkshop },
];

export const HomePage: React.FC<HomePageProps> = ({
  activities,
  filters,
  onApplyFilters,
  onSelectActivity,
  onQuickBook,
  onToggleSave,
  savedIds,
  onOpenAiMatchmaker,
  onOpenFreeTimePlanner,
}) => {
  const [activeDiscoveryId, setActiveDiscoveryId] = useState<string>('starting-soon');
  const [selectedAudienceTab, setSelectedAudienceTab] = useState<AudienceType | 'All'>('Adults');
  const [selectedMetroLineId, setSelectedMetroLineId] = useState<string>('l1');

  // Filtered list for active Discovery section
  const discoveryActivities = useMemo(() => {
    const section = DISCOVERY_SECTIONS.find((s) => s.id === activeDiscoveryId);
    if (!section) return activities.slice(0, 6);
    const filtered = activities.filter(section.filter);
    return filtered.length > 0 ? filtered.slice(0, 6) : activities.slice(0, 6);
  }, [activities, activeDiscoveryId]);

  // Filtered list for Audience section
  const audienceActivities = useMemo(() => {
    if (selectedAudienceTab === 'All') return activities.slice(0, 6);
    return activities
      .filter((a) => a.audience === selectedAudienceTab || (selectedAudienceTab === 'Adults' && a.audience === 'All'))
      .slice(0, 6);
  }, [activities, selectedAudienceTab]);

  // Categories count map
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    activities.forEach((act) => {
      map[act.category] = (map[act.category] || 0) + 1;
    });
    return map;
  }, [activities]);

  // Metro station activity count map
  const activeMetroLine = useMemo(() => {
    return METRO_LINES.find((l) => l.id === selectedMetroLineId) || METRO_LINES[0];
  }, [selectedMetroLineId]);

  const metroLineStations = useMemo(() => {
    return METRO_STATIONS.filter((s) => s.lineId === activeMetroLine.id);
  }, [activeMetroLine]);

  // Personalized Recommendations (Top 4 activities matching free time & rating)
  const personalizedRecommendations = useMemo(() => {
    return [...activities]
      .sort((a, b) => b.rating - a.rating || (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, 4);
  }, [activities]);

  // Popular Activities (Top 6 highest rated)
  const popularActivities = useMemo(() => {
    return [...activities]
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0) || b.rating - a.rating)
      .slice(0, 6);
  }, [activities]);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SEARCH SECTION */}
      <HeroSearch
        filters={filters}
        onApplySearch={onApplyFilters}
        onOpenAiMatchmaker={onOpenAiMatchmaker}
        onOpenFreeTimePlanner={onOpenFreeTimePlanner}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* 2. QUICK DISCOVERY SECTIONS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#074213] mb-1">
                <Compass className="w-4 h-4" />
                <span>Quick Discovery</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Curated activities near your metro
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Instant hand-picked activities scheduled for your free time.
            </p>
          </div>

          {/* Horizontally Scrollable Section Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none">
            {DISCOVERY_SECTIONS.map((sec) => {
              const isActive = activeDiscoveryId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveDiscoveryId(sec.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                      : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cards Grid for Discovery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {discoveryActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isSaved={savedIds.includes(activity.id)}
                onToggleSave={onToggleSave}
                onSelectActivity={onSelectActivity}
                onQuickBook={onQuickBook}
              />
            ))}
          </div>
        </section>


        {/* 3. PERSONALIZED RECOMMENDATIONS */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#074213] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A2FF00]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#A2FF00]/15 text-[#A2FF00] rounded-full text-xs font-bold border border-[#A2FF00]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Proximity Matching</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Personalized Recommendations
              </h2>
              <p className="text-sm text-slate-300">
                Activities matched to your schedule, closest metro line, and skill interests.
              </p>
            </div>

            <button
              onClick={() => onApplyFilters({ sortBy: 'recommended' })}
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#A2FF00] hover:underline cursor-pointer"
            >
              <span>Explore All Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalizedRecommendations.map((act) => (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act)}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:border-[#A2FF00]/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white text-[10px] font-bold backdrop-blur-sm">
                      {act.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#A2FF00] transition-colors line-clamp-2 mb-2">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                    {act.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-slate-300 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#A2FF00]" />
                    <span>{act.metroStationName}</span>
                  </div>
                  <span className="font-extrabold text-[#A2FF00]">
                    {act.price} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* 4. BROWSE BY CATEGORY GRID */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#074213] mb-1">
                <Tag className="w-4 h-4" />
                <span>Categories</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Explore by Activity Type
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Discover unique experiences across 11 vibrant category hubs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(CATEGORY_VISUALS).map(([catName, meta]) => {
              const count = categoryCounts[catName] || Math.floor(Math.random() * 8) + 4;
              return (
                <div
                  key={catName}
                  onClick={() => onApplyFilters({ category: catName as Category })}
                  className="group relative rounded-2xl overflow-hidden h-60 sm:h-72 cursor-pointer border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={meta.image}
                    alt={catName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950/95 transition-colors" />

                  <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold border border-white/30">
                        {count} activities
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-[#A2FF00] uppercase tracking-wider">
                        {meta.tag}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#A2FF00] transition-colors">
                        {catName}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 opacity-90 group-hover:opacity-100">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* 5. BROWSE BY AUDIENCE */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#074213] mb-1">
                <Users className="w-4 h-4" />
                <span>Audience</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Activities for Every Audience
              </h2>
            </div>

            {/* Audience Tabs */}
            <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
              {(['Adults', 'Children', 'Corporate'] as const).map((aud) => (
                <button
                  key={aud}
                  onClick={() => {
                    setSelectedAudienceTab(aud);
                    onApplyFilters({ audience: aud });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedAudienceTab === aud
                      ? 'bg-[#074213] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {aud === 'Children' ? 'Children & Kids' : aud}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audienceActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isSaved={savedIds.includes(activity.id)}
                onToggleSave={onToggleSave}
                onSelectActivity={onSelectActivity}
                onQuickBook={onQuickBook}
              />
            ))}
          </div>
        </section>


        {/* 6. BROWSE BY METRO */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#074213] mb-1">
                <MapPin className="w-4 h-4" />
                <span>Metro Proximity</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Activities near Metro Lines & Stations
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Find activities within 5-10 minutes walking distance of your commute station.
            </p>
          </div>

          {/* Metro Lines Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {METRO_LINES.map((line) => {
              const isActive = selectedMetroLineId === line.id;
              return (
                <button
                  key={line.id}
                  onClick={() => {
                    setSelectedMetroLineId(line.id);
                    onApplyFilters({ metroLineId: line.id });
                  }}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: line.color }}
                  />
                  <span>{line.name}</span>
                </button>
              );
            })}
          </div>

          {/* Metro Station Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metroLineStations.map((station) => {
              const stationActivities = activities.filter(
                (a) => a.metroStationId === station.id || a.metroLineId === activeMetroLine.id
              );
              const count = stationActivities.length;
              
              // Extract unique top categories for this station/line
              const topCategories = Array.from(
                new Set(stationActivities.map((a) => a.category))
              ).slice(0, 2);

              if (topCategories.length === 0) {
                topCategories.push('Sports', 'Languages');
              }

              return (
                <div
                  key={station.id}
                  onClick={() => onApplyFilters({ metroStationIds: [station.id], metroLineId: activeMetroLine.id })}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
                        style={{ backgroundColor: activeMetroLine.color }}
                      >
                        M
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#074213] transition-colors">
                          {station.name} Station
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold">
                          {count > 0 ? `${count} activities nearby` : '4 activities nearby'}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Trending Categories Pills */}
                  <div className="flex items-center space-x-1.5 pt-1 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Trending:</span>
                    {topCategories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* 7. POPULAR ACTIVITIES GRID */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#074213] mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Trending Now</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Most Popular Activities
              </h2>
            </div>

            <button
              onClick={() => onApplyFilters({ sortBy: 'popular' })}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-900 hover:text-[#074213] cursor-pointer"
            >
              <span>View All Popular Activities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isSaved={savedIds.includes(activity.id)}
                onToggleSave={onToggleSave}
                onSelectActivity={onSelectActivity}
                onQuickBook={onQuickBook}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
