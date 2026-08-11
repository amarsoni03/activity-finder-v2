import React from 'react';
import {
  Languages,
  Dumbbell,
  Music,
  Palette,
  Baby,
  Building2,
  UtensilsCrossed,
  Code,
  Sparkles,
  Sparkle,
  Compass,
  HeartHandshake,
  Flame,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Category } from '../types';

interface CategoryCarouselProps {
  onSelectCategory: (category: Category) => void;
  selectedCategory?: Category;
}

interface CategoryTile {
  name: Category;
  label: string;
  icon: React.ElementType;
  emoji?: string;
  color: string;
  badge?: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  { name: 'Languages', label: 'Languages', icon: Languages, color: 'from-slate-100 to-slate-50 text-slate-700', badge: 'Popular' },
  { name: 'Sports', label: 'Sports', icon: Dumbbell, color: 'from-[#074213]/10 to-emerald-500/10 text-[#074213]', badge: 'High Energy' },
  { name: 'Dance', label: 'Dance', icon: Sparkles, color: 'from-slate-100 to-slate-50 text-slate-700' },
  { name: 'Music', label: 'Music', icon: Music, color: 'from-slate-100 to-slate-50 text-slate-700' },
  { name: 'Arts', label: 'Arts', icon: Palette, color: 'from-[#074213]/10 to-emerald-500/10 text-[#074213]' },
  { name: 'STEM', label: 'Kids & STEM', icon: Baby, color: 'from-slate-100 to-slate-50 text-slate-700', badge: 'Family' },
  { name: 'Corporate Team Building', label: 'Corporate', icon: Building2, color: 'from-slate-100 to-slate-50 text-slate-700' },
  { name: 'Cooking', label: 'Cooking', icon: UtensilsCrossed, color: 'from-slate-100 to-slate-50 text-slate-700' },
  { name: 'Technology', label: 'Technology', icon: Code, color: 'from-slate-100 to-slate-50 text-slate-700' },
  { name: 'Fitness', label: 'Fitness & Yoga', icon: HeartHandshake, color: 'from-[#074213]/10 to-emerald-500/10 text-[#074213]' },
];

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
            BROWSE CATEGORIES
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Popular Categories
          </h2>
        </div>

        {selectedCategory && selectedCategory !== 'All Categories' && (
          <button
            onClick={() => onSelectCategory('All Categories')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            Show All
          </button>
        )}
      </div>

      {/* Horizontal Carousel of Rounded Tiles */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
        {CATEGORY_TILES.map((tile) => {
          const Icon = tile.icon;
          const isSelected = selectedCategory === tile.name;

          return (
            <motion.button
              key={tile.name}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectCategory(tile.name)}
              className={`snap-start shrink-0 group relative flex flex-col items-center justify-between p-4 rounded-2xl sm:rounded-3xl transition-colors duration-200 cursor-pointer min-w-[110px] sm:min-w-[130px] h-[115px] sm:h-[130px] ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 ring-2 ring-slate-900'
                  : 'bg-white hover:bg-slate-900/5 text-slate-800 border border-slate-200/60 hover:border-slate-300 shadow-2xs hover:shadow-md'
              }`}
            >
              {/* Badge */}
              {tile.badge && !isSelected && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#A2FF00] text-[#074213] text-[9px] font-black rounded-full uppercase tracking-tighter">
                  {tile.badge}
                </span>
              )}

              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  isSelected
                    ? 'bg-[#A2FF00] text-[#074213]'
                    : `bg-gradient-to-br ${tile.color}`
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <span
                className={`text-xs font-extrabold text-center tracking-tight truncate w-full ${
                  isSelected ? 'text-white' : 'text-slate-900 group-hover:text-slate-950'
                }`}
              >
                {tile.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
