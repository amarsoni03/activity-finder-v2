import React from 'react';
import { Activity, DayOfWeek, TimeOfDay, UserFreeTime } from '../types';
import { Calendar, Clock, MapPin, Star, Sparkles } from 'lucide-react';

interface WeeklyScheduleViewProps {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  userFreeTime?: UserFreeTime;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  activities,
  onSelectActivity,
  userFreeTime,
}) => {
  // Helper to filter activities that take place on a specific day & time slot
  const getActivitiesForCell = (day: DayOfWeek, slot: TimeOfDay) => {
    return activities.filter(
      (act) => act.schedule.days.includes(day) && act.schedule.timeOfDay === slot
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      
      {/* Schedule Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Weekly Free Time & Course Schedule</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your saved free time slots are highlighted in emerald. Click any course to view details or book a trial.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700 font-bold">Your Free Time Slot</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            <span className="text-slate-600 font-medium">Dance</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-slate-600 font-medium">Craft & Arts</span>
          </span>
        </div>
      </div>

      {/* Grid View Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              <th className="p-2.5 border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase text-slate-400 w-24 text-left">
                Time / Day
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="p-2.5 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-800 text-center"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot} className="border-b border-slate-100">
                
                {/* Row Time Slot Header */}
                <td className="p-3 bg-slate-50/70 border-r border-slate-100 text-xs font-bold text-slate-700 align-top">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{slot}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal block mt-1">
                    {slot === 'Morning' && '08:00 - 12:00'}
                    {slot === 'Afternoon' && '12:00 - 17:00'}
                    {slot === 'Evening' && '17:00 - 21:30'}
                  </span>
                </td>

                {/* Day Cells */}
                {DAYS.map((day) => {
                  const cellActivities = getActivitiesForCell(day, slot);
                  const isUserFree = userFreeTime ? userFreeTime[day]?.includes(slot) : false;

                  return (
                    <td
                      key={day}
                      className={`p-2 border-r border-slate-100 align-top h-36 transition-colors ${
                        isUserFree
                          ? 'bg-emerald-50/50 hover:bg-emerald-50'
                          : 'bg-slate-50/20 hover:bg-slate-50/80'
                      }`}
                    >
                      {isUserFree && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full mb-1.5 inline-flex items-center space-x-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Free Slot</span>
                        </span>
                      )}

                      {cellActivities.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-[10px] text-slate-300 font-medium italic">
                          —
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {cellActivities.map((act) => {
                            const badgeBg =
                              act.category === 'Dance'
                                ? 'bg-pink-50 border-pink-100 text-pink-900 hover:bg-pink-100'
                                : act.category === 'Crafts' || act.category === 'Arts'
                                ? 'bg-yellow-50 border-yellow-100 text-yellow-900 hover:bg-yellow-100'
                                : 'bg-green-50 border-green-100 text-green-900 hover:bg-green-100';

                            return (
                              <div
                                key={act.id}
                                onClick={() => onSelectActivity(act)}
                                className={`p-2 rounded-xl border text-left cursor-pointer transition-all shadow-2xs hover:shadow-xs ${badgeBg}`}
                              >
                                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                  <span className="uppercase">{act.category}</span>
                                  {act.scheduleMatchPercentage && (
                                    <span className="text-emerald-700 font-extrabold">{act.scheduleMatchPercentage}% Match</span>
                                  )}
                                </div>
                                <h4 className="text-xs font-bold leading-tight line-clamp-1 text-slate-900">
                                  {act.title}
                                </h4>
                                <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1">
                                  <span className="flex items-center space-x-0.5 truncate font-medium">
                                    <MapPin className="w-2.5 h-2.5 text-green-600 shrink-0" />
                                    <span className="truncate">{act.metroStationName}</span>
                                  </span>
                                  <span className="font-bold text-slate-900">${act.price}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

