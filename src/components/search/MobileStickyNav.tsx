import React from 'react';
import { Compass, Bookmark, Calendar, User } from 'lucide-react';

interface MobileStickyNavProps {
  activeTab: 'explore' | 'saved' | 'my-week' | 'profile';
  onSelectTab: (tab: 'explore' | 'saved' | 'my-week' | 'profile') => void;
  savedCount?: number;
}

export const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  activeTab,
  onSelectTab,
  savedCount = 0,
}) => {
  const tabs: { id: 'explore' | 'saved' | 'my-week' | 'profile'; label: string; icon: React.ElementType }[] = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'my-week', label: 'My Week', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900 scale-110' : ''}`} />
                {tab.id === 'saved' && savedCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
