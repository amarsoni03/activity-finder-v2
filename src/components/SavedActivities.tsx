import React, { useState } from 'react';
import { CompareActivities } from './CompareActivities';
import { Activity } from '../types';
import {
  Heart,
  Bookmark,
  Clock,
  MapPin,
  Star,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  ChevronRight,
  Tag
} from 'lucide-react';

export interface SavedActivityItem {
  id: string;
  title: string;
  category: string;
  image: string;
  price: string;
  numericPrice: number;
  rating: number;
  reviewsCount: number;
  metroStation: string;
  walkTime: string;
  schedule: string;
  level: string;
  availableSeats: number;
  viewedAt?: string;
  collectionId?: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  color: string;
  count: number;
}

interface SavedActivitiesProps {
  savedItems?: SavedActivityItem[];
  onRemoveSaved?: (id: string) => void;
  onReserveSpot?: (id: string) => void;
  onViewActivityDetails?: (id: string) => void;
}

const DEFAULT_MOCK_SAVED: SavedActivityItem[] = [
  {
    id: 'act-1',
    title: 'Wheel Throwing & Ceramic Glazing Workshop',
    category: 'Ceramics & Art',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    price: '₽2,500',
    numericPrice: 2500,
    rating: 4.9,
    reviewsCount: 128,
    metroStation: 'Taganskaya',
    walkTime: '4 min walk',
    schedule: 'Wednesdays & Saturdays, 18:30',
    level: 'Beginner Friendly',
    availableSeats: 3,
    viewedAt: '2 hours ago',
    collectionId: 'col-1'
  },
  {
    id: 'act-2',
    title: 'Vinyasa Flow & Breathwork Evening Session',
    category: 'Yoga & Wellness',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    price: '₽1,200',
    numericPrice: 1200,
    rating: 4.8,
    reviewsCount: 94,
    metroStation: 'Chistye Prudy',
    walkTime: '2 min walk',
    schedule: 'Tuesdays & Thursdays, 19:00',
    level: 'All Levels',
    availableSeats: 5,
    viewedAt: 'Yesterday',
    collectionId: 'col-2'
  },
  {
    id: 'act-3',
    title: 'Salsa & Bachata Social Dance Intensive',
    category: 'Dance & Movement',
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80',
    price: '₽1,800',
    numericPrice: 1800,
    rating: 4.95,
    reviewsCount: 210,
    metroStation: 'Arbatskaya',
    walkTime: '5 min walk',
    schedule: 'Fridays, 20:00',
    level: 'Intermediate',
    availableSeats: 2,
    viewedAt: '3 days ago',
    collectionId: 'col-2'
  },
  {
    id: 'act-4',
    title: 'Specialty Coffee Brewing & Cupping Masterclass',
    category: 'Culinary & Beverage',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    price: '₽3,000',
    numericPrice: 3000,
    rating: 4.87,
    reviewsCount: 65,
    metroStation: 'Mayakovskaya',
    walkTime: '3 min walk',
    schedule: 'Sundays, 11:00 AM',
    level: 'Beginner Friendly',
    availableSeats: 4,
    viewedAt: '4 days ago',
    collectionId: 'col-1'
  }
];

const INITIAL_COLLECTIONS: CollectionItem[] = [
  { id: 'col-1', name: 'Creative Workshops', description: 'Art, ceramics, and hands-on crafting sessions', color: 'from-amber-500 to-rose-500', count: 2 },
  { id: 'col-2', name: 'Active & Mindful', description: 'Movement, dance, and body wellness', color: 'from-emerald-500 to-teal-600', count: 2 },
  { id: 'col-3', name: 'Weekend Explorations', description: 'Fun single-session activities for Saturdays & Sundays', color: 'from-sky-500 to-indigo-600', count: 0 }
];

export const SavedActivities: React.FC<SavedActivitiesProps> = ({
  savedItems = DEFAULT_MOCK_SAVED,
  onRemoveSaved,
  onReserveSpot,
  onViewActivityDetails
}) => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'collections' | 'recent' | 'compare'>('wishlist');
  const [items, setItems] = useState<SavedActivityItem[]>(savedItems);
  const [collections, setCollections] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [compareItemIds, setCompareItemIds] = useState<string[]>(['act-1', 'act-2']);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (onRemoveSaved) onRemoveSaved(id);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    const newCol: CollectionItem = {
      id: `col-${Date.now()}`,
      name: newColName,
      description: newColDesc || 'Custom activity collection',
      color: 'from-purple-500 to-pink-500',
      count: 0
    };
    setCollections((prev) => [...prev, newCol]);
    setNewColName('');
    setNewColDesc('');
    setShowCreateCollection(false);
  };

  const toggleCompare = (id: string) => {
    setCompareItemIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const filteredItems = selectedCollectionId
    ? items.filter((item) => item.collectionId === selectedCollectionId)
    : items;

  return (
    <div className="space-y-5 overflow-x-hidden w-full">
      {/* Sub Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-100/80 p-1.5 rounded-2xl overflow-x-auto scrollbar-none snap-x w-full sm:w-auto">
          <button
            onClick={() => { setActiveTab('wishlist'); setSelectedCollectionId(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5 shrink-0 snap-start cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === 'wishlist' ? 'text-rose-500 fill-rose-500' : ''}`} />
            <span>Wishlist ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5 shrink-0 snap-start cursor-pointer ${
              activeTab === 'collections'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Collections ({collections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5 shrink-0 snap-start cursor-pointer ${
              activeTab === 'recent'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Recently Viewed</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5 shrink-0 snap-start cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Compare ({compareItemIds.length})</span>
          </button>
        </div>

        {activeTab === 'collections' && (
          <button
            onClick={() => setShowCreateCollection(!showCreateCollection)}
            className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Collection</span>
          </button>
        )}
      </div>

      {/* Modal for Creating New Collection */}
      {showCreateCollection && (
        <form onSubmit={handleCreateCollection} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-fade-in">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Create Custom Activity Collection</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Collection Name (e.g., Weekend Pottery)"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
            <input
              type="text"
              placeholder="Short Description"
              value={newColDesc}
              onChange={(e) => setNewColDesc(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCreateCollection(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Save Collection
            </button>
          </div>
        </form>
      )}

      {/* TAB 1: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {selectedCollectionId && (
            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-2xl text-xs text-indigo-900">
              <span className="font-semibold truncate">
                Filtering by Collection:{' '}
                <strong>{collections.find((c) => c.id === selectedCollectionId)?.name}</strong>
              </span>
              <button
                onClick={() => setSelectedCollectionId(null)}
                className="text-indigo-600 hover:text-indigo-900 font-bold underline shrink-0 cursor-pointer ml-2"
              >
                Clear filter
              </button>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Save activities you love while exploring schedule options and metro locations to compare and book later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredItems.map((item) => {
                const isSelectedForCompare = compareItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
                  >
                    {/* Activity Header */}
                    <div className="flex items-start space-x-3 sm:space-x-3.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md truncate max-w-[140px] sm:max-w-none">
                            {item.category}
                          </span>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                            title="Remove from saved"
                          >
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          </button>
                        </div>
                        <h4
                          onClick={() => onViewActivityDetails && onViewActivityDetails(item.id)}
                          className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer"
                        >
                          {item.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                          <span className="flex items-center space-x-1 text-amber-500 font-bold shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{item.rating}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.metroStation} ({item.walkTime})</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.schedule}</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block leading-none">Price / trial</span>
                        <span className="text-base font-extrabold text-slate-900">{item.price}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:space-x-2">
                        <button
                          onClick={() => toggleCompare(item.id)}
                          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center min-h-[38px] cursor-pointer ${
                            isSelectedForCompare
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {isSelectedForCompare ? 'In Compare' : '+ Compare'}
                        </button>

                        <button
                          onClick={() => onReserveSpot && onReserveSpot(item.id)}
                          className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1 min-h-[38px] cursor-pointer"
                        >
                          <span>Reserve Spot</span>
                          <ArrowRight className="w-3 h-3 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COLLECTIONS */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => {
                setSelectedCollectionId(col.id);
                setActiveTab('wishlist');
              }}
              className="bg-white border border-slate-100 hover:border-indigo-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${col.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Bookmark className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {col.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{col.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 font-semibold text-slate-600">
                <span>{col.count} activities saved</span>
                <span className="flex items-center space-x-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RECENTLY VIEWED */}
      {activeTab === 'recent' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 font-medium">Activities you explored recently across Moscow metro lines.</p>
          <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <img src={item.image} alt={item.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold mb-0.5">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{item.category}</span>
                      <span>•</span>
                      <span>Viewed {item.viewedAt}</span>
                    </div>
                    <h5
                      onClick={() => onViewActivityDetails && onViewActivityDetails(item.id)}
                      className="text-xs font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                    >
                      {item.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.metroStation} ({item.walkTime})</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate max-w-[160px] sm:max-w-none">{item.schedule}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-start sm:self-center">
                  <span className="text-xs font-extrabold text-slate-900">{item.price}</span>
                  <button
                    onClick={() => onReserveSpot && onReserveSpot(item.id)}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Book Trial
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMPARE ACTIVITIES */}
      {activeTab === 'compare' && (
        <CompareActivities
          comparedActivities={items
            .filter((item) => compareItemIds.includes(item.id))
            .map((item) => ({
              id: item.id,
              title: item.title,
              category: item.category as any,
              subSkill: item.category,
              audience: 'Adults',
              programType: 'Session',
              startDate: 'This Week',
              frequency: 'Regular',
              weekdays: ['Wed', 'Sat'],
              startTime: '18:30',
              endTime: '20:00',
              duration: '90 min',
              nextSession: item.schedule,
              availableSessions: [item.schedule],
              availableSeats: item.availableSeats,
              totalSeats: 10,
              metroLine: 'Line 7',
              metroStation: item.metroStation,
              metroStationName: item.metroStation,
              walkTimeMinutes: parseInt(item.walkTime) || 5,
              walkMinutes: parseInt(item.walkTime) || 5,
              travelTimeMinutes: 15,
              address: `Near ${item.metroStation} Metro`,
              trialPrice: item.numericPrice > 2000 ? 900 : 0,
              regularPrice: item.numericPrice,
              price: item.numericPrice,
              priceUnit: 'per session',
              currency: 'RUB',
              level: item.level as any,
              language: 'Russian',
              ageGroup: '18+',
              classSize: 'Small group (8-12)',
              learningOutcomes: ['Hands-on practical experience', 'Take home completed project', 'Expert instructor feedback'],
              shortDescription: `${item.title} at ${item.metroStation}`,
              fullDescription: `${item.title} at ${item.metroStation}`,
              tags: [item.category, item.level],
              goals: ['Try New Hobbies'],
              popularityScore: 92,
              featured: true,
              newActivity: false,
              rating: item.rating,
              reviewCount: item.reviewsCount,
              studioName: `${item.category.split(' ')[0]} Studio`,
              instructorName: 'Certified Instructor',
              instructorExperience: '5+ years',
              instructorQualifications: 'Professional Certificate',
              coverImage: item.image,
              image: item.image,
              galleryImages: [item.image],
              instantBooking: true,
              cancellationPolicy: 'Free cancellation up to 24h before session',
              bookingDeadline: '2 hours before',
              metroStationId: item.metroStation.toLowerCase().replace(/\s+/g, '-'),
              metroLineId: 'line-1',
              metroLineName: 'Central Line',
              metroLineColor: '#059669',
              schedule: {
                days: ['Wed', 'Sat'],
                timeOfDay: 'Evening',
                timeRange: '18:30 - 20:00',
                specificDaysText: item.schedule
              },
              accentColor: 'soft-green',
              deliveryMode: 'In-Person',
              timezone: 'Europe/Moscow',
              bookingType: 'Instant Booking',
              capacity: 12,
              materialsIncluded: 'All tools, materials & firing included',
              certificateOffered: true
            }))}
          allActivities={items.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category as any,
            subSkill: item.category,
            audience: 'Adults',
            programType: 'Session',
            startDate: 'This Week',
            frequency: 'Regular',
            weekdays: ['Wed', 'Sat'],
            startTime: '18:30',
            endTime: '20:00',
            duration: '90 min',
            nextSession: item.schedule,
            availableSessions: [item.schedule],
            availableSeats: item.availableSeats,
            totalSeats: 10,
            metroLine: 'Line 7',
            metroStation: item.metroStation,
            metroStationName: item.metroStation,
            walkTimeMinutes: parseInt(item.walkTime) || 5,
            walkMinutes: parseInt(item.walkTime) || 5,
            travelTimeMinutes: 15,
            address: `Near ${item.metroStation} Metro`,
            trialPrice: item.numericPrice > 2000 ? 900 : 0,
            regularPrice: item.numericPrice,
            price: item.numericPrice,
            priceUnit: 'per session',
            currency: 'RUB',
            level: item.level as any,
            language: 'Russian',
            ageGroup: '18+',
            classSize: 'Small group (8-12)',
            learningOutcomes: ['Hands-on practical experience', 'Take home completed project', 'Expert instructor feedback'],
            shortDescription: `${item.title} at ${item.metroStation}`,
            fullDescription: `${item.title} at ${item.metroStation}`,
            tags: [item.category, item.level],
            goals: ['Try New Hobbies'],
            popularityScore: 92,
            featured: true,
            newActivity: false,
            rating: item.rating,
            reviewCount: item.reviewsCount,
            studioName: `${item.category.split(' ')[0]} Studio`,
            instructorName: 'Certified Instructor',
            instructorExperience: '5+ years',
            instructorQualifications: 'Professional Certificate',
            coverImage: item.image,
            image: item.image,
            galleryImages: [item.image],
            instantBooking: true,
            cancellationPolicy: 'Free cancellation up to 24h before session',
            bookingDeadline: '2 hours before',
            metroStationId: item.metroStation.toLowerCase().replace(/\s+/g, '-'),
            metroLineId: 'line-1',
            metroLineName: 'Central Line',
            metroLineColor: '#059669',
            schedule: {
              specificDaysText: item.schedule,
              timeSlotText: '18:30 - 20:00',
              frequencyText: 'Weekly'
            },
            accentColor: 'soft-green',
            deliveryMode: 'In-Person',
            timezone: 'Europe/Moscow',
            bookingType: 'Instant Booking',
            capacity: 12,
            materialsIncluded: 'All tools, materials & firing included',
            certificateOffered: true
          }))}
          onRemoveFromCompare={(id) => toggleCompare(id)}
          onAddToCompare={(id) => toggleCompare(id)}
          onSelectActivity={(act) => onViewActivityDetails && onViewActivityDetails(act.id)}
          onBookActivity={(act) => onReserveSpot && onReserveSpot(act.id)}
        />
      )}
    </div>
  );
};
