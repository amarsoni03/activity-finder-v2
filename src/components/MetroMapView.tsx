import React, { useState } from 'react';
import { METRO_LINES, METRO_STATIONS } from '../data/metroData';
import { Activity } from '../types';
import { MapPin, Compass, ArrowRight, Clock, Star } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface MetroMapViewProps {
  activities: Activity[];
  onSelectStation: (stationId: string) => void;
  onSelectActivity: (activity: Activity) => void;
  selectedStationId?: string;
}

export const MetroMapView: React.FC<MetroMapViewProps> = ({
  activities,
  onSelectStation,
  onSelectActivity,
  selectedStationId,
}) => {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const activeStationId = hoveredStation || selectedStationId;
  const stationActivities = activeStationId
    ? activities.filter((a) => a.metroStationId === activeStationId)
    : [];

  const selectedStationObj = METRO_STATIONS.find((s) => s.id === activeStationId);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Moscow Metro Network & District Activity Hubs</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any Moscow Metro station node on the transit schematic to view courses within walking distance.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {METRO_LINES.map((line) => (
            <span
              key={line.id}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border"
              style={{
                backgroundColor: `${line.color}15`,
                borderColor: line.color,
                color: line.color,
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
              <span>{line.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Map Canvas & Station Activity Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spatial Moscow Metro Map Schematic */}
        <div className="lg:col-span-2 relative bg-slate-950 rounded-3xl h-[440px] p-6 overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between">
          
          {/* Subtle Grid Lines Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Draw Line Connections SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Moskva River Curve */}
            <path
              d="M 10% 75% Q 40% 65% 50% 55% T 90% 45%"
              fill="none"
              stroke="#0284C7"
              strokeWidth="12"
              strokeOpacity="0.25"
              strokeLinecap="round"
            />

            {/* Line 5 - Koltsevaya Brown Circle Line */}
            <ellipse
              cx="50%"
              cy="48%"
              rx="18%"
              ry="20%"
              fill="none"
              stroke="#9A3412"
              strokeWidth="7"
            />

            {/* Line 1 - Red Line (Sokolnicheskaya) */}
            <line x1="68%" y1="22%" x2="30%" y2="80%" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
            
            {/* Line 2 - Green Line (Zamoskvoretskaya) */}
            <line x1="44%" y1="35%" x2="56%" y2="66%" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
            
            {/* Line 3 - Blue Line (Arbatsko-Pokrovskaya) */}
            <line x1="18%" y1="58%" x2="65%" y2="46%" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
            
            {/* Line 11 - BKL / Moscow City Turquoise Line */}
            <path
              d="M 24% 48% Q 26% 30% 42% 24%"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>

          {/* Station Nodes */}
          {METRO_STATIONS.map((st) => {
            const count = activities.filter((a) => a.metroStationId === st.id).length;
            const isSelected = activeStationId === st.id;
            const lineObj = METRO_LINES.find((l) => l.id === st.lineId);

            return (
              <div
                key={st.id}
                onClick={() => onSelectStation(st.id)}
                onMouseEnter={() => setHoveredStation(st.id)}
                onMouseLeave={() => setHoveredStation(null)}
                className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group"
                style={{
                  left: `${st.xRatio}%`,
                  top: `${st.yRatio}%`,
                }}
              >
                {/* Node Ring */}
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? 'w-9 h-9 ring-4 ring-white shadow-lg scale-125 z-20'
                      : 'w-7 h-7 ring-2 ring-white/80 hover:scale-110'
                  }`}
                  style={{ backgroundColor: lineObj?.color || '#10B981' }}
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  
                  {/* Activity Count Badge */}
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-slate-900 text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                      {count}
                    </span>
                  )}
                </div>

                {/* Station Label */}
                <div className="mt-1 px-2 py-0.5 bg-slate-950/90 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-xs border border-slate-800 text-center group-hover:bg-emerald-600 transition-colors">
                  {st.name}
                </div>
              </div>
            );
          })}

          <div className="relative z-10 text-[11px] text-slate-300 bg-black/70 p-2.5 rounded-xl border border-slate-800 backdrop-blur-xs max-w-xs mt-auto">
            📍 Hover or click Moscow Metro station markers to preview nearby classes.
          </div>
        </div>

        {/* Selected Station Activities Sidebar */}
        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-4 flex flex-col h-[440px]">
          {selectedStationObj ? (
            <>
              <div className="pb-3 border-b border-slate-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-400">Selected Station</div>
                <h3 className="text-base font-bold text-slate-900">{selectedStationObj.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedStationObj.lineName}</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stationActivities.length === 0 ? (
                  <div className="text-center py-12 space-y-2 text-slate-500">
                    <p className="text-xs">No active courses registered around this station yet.</p>
                  </div>
                ) : (
                  stationActivities.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => onSelectActivity(act)}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs hover:shadow-md cursor-pointer transition-all space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md">
                          {act.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">{formatPrice(act.price)}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {act.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>{act.schedule.specificDaysText}</span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{act.rating}</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <Compass className="w-8 h-8 text-slate-300 animate-spin-slow" />
              <p className="text-xs font-medium text-slate-600">Select any station on the Moscow Metro map to view nearby courses</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
