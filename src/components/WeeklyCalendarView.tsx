import React, { useState } from 'react';
import { EventObject, TaskObject } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface WeeklyCalendarViewProps {
  events: EventObject[];
  tasks: TaskObject[];
  onSelectObject: (obj: any) => void;
}

export const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  events,
  tasks,
  onSelectObject,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate 7 days for the selected week starting from Monday
  const getWeekDates = (offset: number) => {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
    const distToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distToMon + offset * 7);

    const weekDays: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d.toISOString().split('T')[0]);
    }
    return weekDays;
  };

  const weekDates = getWeekDates(weekOffset);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-150 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CalendarIcon className="w-5 h-5 text-[#4285F4]" />
            <span>Weekly Calendar Grid</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of scheduled events and time duration blocks across the week.
          </p>
        </div>

        {/* Week Navigator */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-4 py-1.5 rounded-xl bg-[#4285F4] text-white shadow-2xs text-xs font-bold"
          >
            Current Week
          </button>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDates.map((dateStr) => {
          const dayEvents = events.filter((e) => e.dateStr === dateStr);
          const dayTasks = tasks.filter((t) => t.dayRelations[dateStr] !== undefined);
          const todayStr = new Date().toISOString().split('T')[0];
          const isToday = dateStr === todayStr;

          const dateObj = new Date(dateStr.split('-').map(Number)[0], dateStr.split('-').map(Number)[1] - 1, dateStr.split('-').map(Number)[2]);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = dateObj.getDate();

          return (
            <div
              key={dateStr}
              className={`p-4 rounded-3xl border flex flex-col gap-3 transition-all min-h-[360px] ${
                isToday
                  ? 'bg-blue-50/20 dark:bg-blue-950/20 border-[#4285F4] ring-2 ring-blue-100'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Day Column Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <span className="text-xs font-bold text-slate-400">
                    {dayName}
                  </span>
                  <div className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                    {dayNum}
                  </div>
                </div>
                {isToday && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#4285F4] text-white">
                    Today
                  </span>
                )}
              </div>

              {/* Scheduled Events Section */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#4285F4]">
                  Events ({dayEvents.length})
                </span>
                {dayEvents.length === 0 ? (
                  <span className="text-xs italic text-slate-400">None</span>
                ) : (
                  dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => onSelectObject(evt)}
                      className="p-2.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs flex flex-col gap-0.5 cursor-pointer hover:border-blue-300 transition-all"
                    >
                      <span className="font-semibold text-blue-950 dark:text-blue-100 line-clamp-1">
                        {evt.title}
                      </span>
                      <span className="font-mono text-[10px] text-[#4285F4] font-bold">
                        {evt.timeStr}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Time-Blocked Tasks Section */}
              <div className="flex flex-col gap-1.5 flex-1 mt-1">
                <span className="text-xs font-bold text-[#FBBC05]">
                  Time Blocks ({dayTasks.length})
                </span>
                {dayTasks.length === 0 ? (
                  <span className="text-xs italic text-slate-400">No tasks</span>
                ) : (
                  dayTasks.map((t) => {
                    const dayConfig = t.dayRelations[dateStr];
                    const mins = dayConfig?.durationMinutes || 30;
                    const hours = (mins / 60).toFixed(1);

                    return (
                      <div
                        key={t.id}
                        onClick={() => onSelectObject(t)}
                        className={`p-2.5 rounded-2xl border text-xs flex flex-col gap-1 cursor-pointer hover:border-slate-300 transition-all ${
                          dayConfig?.status === 'done'
                            ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 text-slate-400 line-through'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="font-semibold line-clamp-2">{t.title}</span>
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold pt-1 border-t border-slate-100 dark:border-slate-800/60">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {mins >= 60 ? `${hours}h` : `${mins}m`}
                          </span>
                          <span className="text-amber-500">+{t.points} PTS</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
