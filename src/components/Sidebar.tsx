import React from 'react';
import {
  CalendarDays,
  FileText,
  CheckSquare,
  PiggyBank,
  Calendar,
} from 'lucide-react';

export type ActiveTab = 'timeline' | 'notes' | 'tasks' | 'finance' | 'weekly';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: CalendarDays, color: 'text-[#4285F4]' },
    { id: 'notes', label: 'Notes', icon: FileText, color: 'text-[#34A853]' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'text-[#FBBC05]' },
    { id: 'finance', label: 'Finance & Jars', icon: PiggyBank, color: 'text-[#EA4335]' },
    { id: 'weekly', label: 'Weekly Grid', icon: Calendar, color: 'text-[#4285F4]' },
  ];

  return (
    <>
      {/* Desktop Left Sidebar - Focused cleanly on Nav Pills */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 shrink-0 select-none z-20">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#4285F4] text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-xs">
            M
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-900 dark:text-slate-100 leading-none tracking-tight">
              Memo
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">Objects Studio</p>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`sidebar-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-[#4285F4] font-extrabold shadow-2xs border border-blue-100 dark:border-blue-900/40'
                    : 'text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#4285F4]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#121212] border-t border-slate-200 dark:border-slate-800 py-2 px-3 flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as ActiveTab)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive ? 'text-[#4285F4]' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-extrabold">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
