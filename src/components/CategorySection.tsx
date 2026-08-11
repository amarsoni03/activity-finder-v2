import React from 'react';
import {
  Globe,
  Dumbbell,
  Sparkles,
  Palette,
  Music,
  Users,
  Building2,
  Utensils,
  Laptop,
} from 'lucide-react';
import { Category, FilterState } from '../types';

interface CategorySectionProps {
  onSelectCategory: (category: Category | string) => void;
  activeCategory?: Category | string;
}

interface CategoryTile {
  name: Category | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    name: 'Languages',
    icon: Globe,
    color: 'text-slate-700',
    bgColor: 'bg-white border-slate-200/70 hover:bg-slate-50',
    description: 'Spanish, English, French',
  },
  {
    name: 'Sports',
    icon: Dumbbell,
    color: 'text-[#074213]',
    bgColor: 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50',
    description: 'Tennis, Swimming, Padel',
  },
  {
    name: 'Dance',
    icon: Sparkles,
    color: 'text-slate-700',
    bgColor: 'bg-white border-slate-200/70 hover:bg-slate-50',
    description: 'Salsa, Bachata, Ballet',
  },
  {
    name: 'Arts',
    icon: Palette,
    color: 'text-[#074213]',
    bgColor: 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50',
    description: 'Painting, Pottery, Craft',
  },
  {
    name: 'Music',
    icon: Music,
    color: 'text-slate-700',
    bgColor: 'bg-white border-slate-200/70 hover:bg-slate-50',
    description: 'Piano, Vocal, Guitar',
  },
  {
    name: 'Kids',
    icon: Users,
    color: 'text-slate-700',
    bgColor: 'bg-white border-slate-200/70 hover:bg-slate-50',
    description: 'Art Camp, STEM, Games',
  },
  {
    name: 'Corporate',
    icon: Building2,
    color: 'text-slate-700',
    bgColor: 'bg-white border-slate-200/70 hover:bg-slate-50',
    description: 'Offsites & Team Building',
  },
  {
    name: 'Cooking',
    icon: Utensils,
    color: 'text-slate-700',
    bgColor: 'bg-white border-slate-200/70 hover:bg-slate-50',
    description: 'Pastry, Wine & Cuisine',
  },
  {
    name: 'Technology',
    icon: Laptop,
    color: 'text-slate-700',
    bgColor: 'bg-white border-slate-200/70 hover:bg-slate-50',
    description: 'Coding, AI & Robotics',
  },
];

export const CategorySection: React.FC<CategorySectionProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#074213]">
            Browse Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore by What You Love
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Select a category tile to filter nearby activities.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        {CATEGORY_TILES.map((tile) => {
          const Icon = tile.icon;
          const isActive = activeCategory === tile.name;

          return (
            <button
              key={tile.name}
              onClick={() => onSelectCategory(tile.name)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center text-center space-y-2 group ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-2'
                  : `${tile.bgColor} border-slate-200/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5`
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  isActive ? 'bg-white/20 text-[#A2FF00]' : 'bg-white shadow-2xs'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#A2FF00]' : tile.color}`} />
              </div>
              <div className="space-y-0.5">
                <p
                  className={`text-xs font-extrabold tracking-tight ${
                    isActive ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {tile.name}
                </p>
                <p
                  className={`text-[10px] line-clamp-1 ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {tile.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
