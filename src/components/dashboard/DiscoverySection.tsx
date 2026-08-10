import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Gift,
  Clock,
  Star,
  Search,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Bookmark
} from 'lucide-react';

export interface RecommendedActivity {
  id: string;
  title: string;
  category: string;
  image: string;
  price: string;
  rating: number;
  metroStation: string;
  walkTime: string;
  schedule: string;
  badge?: string;
  reason?: string;
}

interface DiscoverySectionProps {
  userMetro?: string;
  onSelectActivity?: (id: string) => void;
  onSearchTagClick?: (tag: string) => void;
}

const RECENT_SEARCHES = [
  'Pottery Workshops Near Taganskaya',
  'Weekend Evening Yoga',
  'Salsa Dance Beginner',
  'Coffee Cupping Masterclass',
  'Free Trial Classes'
];

const RECOMMENDED_ITEMS: RecommendedActivity[] = [
  {
    id: 'rec-1',
    title: 'Advanced Clay Glazing & Firing Techniques',
    category: 'Ceramics & Art',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    price: '₽2,800',
    rating: 4.9,
    metroStation: 'Taganskaya',
    walkTime: '4 min walk',
    schedule: 'Sundays, 15:00',
    badge: 'Because You Booked Ceramics',
    reason: 'Similar technique & studio near your preferred metro line.'
  },
  {
    id: 'rec-2',
    title: 'Sound Bath & Tibetan Singing Bowls Meditation',
    category: 'Yoga & Wellness',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    price: '₽1,500',
    rating: 4.95,
    metroStation: 'Chistye Prudy',
    walkTime: '3 min walk',
    schedule: 'Friday Evenings, 19:30',
    badge: 'Near Your Metro',
    reason: 'Matches your preferred weekday evening schedule.'
  },
  {
    id: 'rec-3',
    title: 'Sourdough Artisan Bread Baking Workshop',
    category: 'Culinary & Baking',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    price: '₽3,200',
    rating: 4.88,
    metroStation: 'Taganskaya',
    walkTime: '5 min walk',
    schedule: 'Saturday Morning, 10:00 AM',
    badge: 'This Weekend',
    reason: 'Top trending weekend workshop in your metro radius.'
  },
  {
    id: 'rec-4',
    title: 'Introductory Spanish Conversation & Tapas Class',
    category: 'Languages & Culture',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    price: 'FREE TRIAL',
    rating: 4.92,
    metroStation: 'Arbatskaya',
    walkTime: '2 min walk',
    schedule: 'Thursdays, 18:30',
    badge: 'Free Trial',
    reason: '100% complimentary trial spot available this week.'
  },
  {
    id: 'rec-5',
    title: 'Contemporary Botanical Painting in Watercolors',
    category: 'Fine Arts',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80',
    price: '₽2,200',
    rating: 4.85,
    metroStation: 'Mayakovskaya',
    walkTime: '4 min walk',
    schedule: 'Saturdays, 14:00',
    badge: 'New Activity',
    reason: 'Fresh listing added to the marketplace 2 days ago.'
  }
];

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  userMetro = 'Taganskaya',
  onSelectActivity,
  onSearchTagClick
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Recommendations' },
    { id: 'booked', label: 'Because You Booked' },
    { id: 'metro', label: `Near ${userMetro}` },
    { id: 'weekend', label: 'This Weekend' },
    { id: 'free', label: 'Free Trials' },
    { id: 'new', label: 'New Activities' }
  ];

  const filteredItems = RECOMMENDED_ITEMS.filter((item) => {
    if (activeFilter === 'booked') return item.badge?.includes('Booked');
    if (activeFilter === 'metro') return item.metroStation.toLowerCase().includes(userMetro.toLowerCase()) || item.badge?.includes('Metro');
    if (activeFilter === 'weekend') return item.badge?.includes('Weekend');
    if (activeFilter === 'free') return item.price.includes('FREE');
    if (activeFilter === 'new') return item.badge?.includes('New');
    return true;
  });

  return (
    <div className="space-y-6 overflow-x-hidden w-full">
      {/* Search History & Re-explore Tags */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md border border-slate-800 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-4 h-4 text-indigo-400 shrink-0" />
            <h3 className="text-sm font-bold tracking-tight truncate">Recent Searches & Jump Back In</h3>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0">Your history</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {RECENT_SEARCHES.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => onSearchTagClick && onSearchTagClick(tag)}
              className="px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-[11px] font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer max-w-[160px] sm:max-w-xs"
            >
              <TrendingUp className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{tag}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Personalized Activity Discovery</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            Curated activities matched to your metro station, time preference, and saved categories.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                activeFilter === cat.id
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectActivity && onSelectActivity(item.id)}
            className="bg-white border border-slate-100 hover:border-slate-300 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4 relative"
          >
            <div className="space-y-3">
              {/* Image & Badge Overlay */}
              <div className="relative overflow-hidden rounded-2xl h-44">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-3 py-1 rounded-xl shadow-xs border border-white/20">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-extrabold px-3 py-1 rounded-xl shadow-sm">
                  {item.price}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span className="flex items-center space-x-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.rating}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 pt-1">
                  {item.title}
                </h3>

                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <p className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{item.metroStation} ({item.walkTime})</span>
                  </p>
                  <p className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.schedule}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendation Rationale & CTA */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              {item.reason && (
                <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                  "{item.reason}"
                </p>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-indigo-600 group-hover:underline flex items-center space-x-1">
                  <span>Explore Activity</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trial Spot Available</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
