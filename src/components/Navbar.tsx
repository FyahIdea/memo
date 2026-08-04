import React from 'react';
import {
  CalendarDays,
  FileText,
  CheckSquare,
  PiggyBank,
  Calendar,
  Plus,
  Flame,
  Star,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Layers,
} from 'lucide-react';
import { GamificationState } from '../types';

export type ActiveTab = 'timeline' | 'notes' | 'tasks' | 'finance' | 'weekly';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  gamification: GamificationState;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileView: boolean;
  onToggleMobileView: () => void;
  onOpenQuickCapture: () => void;
  onOpenSidebarPanel: () => void;
  isSidebarPanelOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  gamification,
  soundEnabled,
  onToggleSound,
  isMobileView,
  onToggleMobileView,
  onOpenQuickCapture,
  onOpenSidebarPanel,
  isSidebarPanelOpen,
}) => {
  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: CalendarDays },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'finance', label: 'Finance & Jars', icon: PiggyBank },
    { id: 'weekly', label: 'Weekly Grid', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-[#E5E2DA] dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2D2D2D] dark:bg-stone-100 rounded-xl flex items-center justify-center text-white dark:text-[#2D2D2D] font-bold text-lg font-serif">
            O
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-tight text-[#1A1A1A] dark:text-stone-100">
                OmniLife
              </span>
              <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-[#EFECE8] dark:bg-stone-800 text-[#2D2D2D] dark:text-stone-300">
                Studio
              </span>
            </div>
          </div>
        </div>

        {/* Center navigation tabs */}
        <nav className="hidden md:flex items-center bg-[#F3F1ED] dark:bg-stone-800/80 p-1 rounded-2xl border border-[#E5E2DA] dark:border-stone-700/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#2D2D2D] text-[#1A1A1A] dark:text-white shadow-xs font-semibold'
                    : 'text-[#9A958C] dark:text-stone-400 hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2D2D2D] dark:text-white' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Gamification Bar & Actions */}
        <div className="flex items-center gap-2">
          {/* Streak Counter */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFECE8] dark:bg-stone-800 text-[#2D2D2D] dark:text-stone-200 text-xs font-semibold"
            title="Daily Activity Streak"
          >
            <span className="text-orange-500">🔥</span>
            <span>{gamification.streakDays} Day Streak</span>
          </div>

          {/* Points Counter */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2D2D2D] text-white text-xs font-semibold shadow-2xs"
            title="Accumulated Points"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{gamification.points} Pts</span>
          </div>

          {/* Task Sidebar Toggle Button */}
          <button
            id="toggle-task-sidebar-btn"
            onClick={onOpenSidebarPanel}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isSidebarPanelOpen
                ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                : 'bg-white dark:bg-stone-800 text-[#2D2D2D] dark:text-stone-300 border-[#E5E2DA] dark:border-stone-700 hover:bg-[#FAF9F7]'
            }`}
            title="Toggle Task Sidebar Panel"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tasks Sidebar</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            className="p-1.5 rounded-full border border-[#E5E2DA] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-[#FAF9F7] transition-colors"
            title={soundEnabled ? 'Mute Interaction Sounds' : 'Enable Interaction Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#2D2D2D] dark:text-stone-200" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          {/* Device Frame Viewport Switcher */}
          <button
            id="toggle-device-view-btn"
            onClick={onToggleMobileView}
            className="p-1.5 rounded-full border border-[#E5E2DA] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-[#FAF9F7] transition-colors hidden sm:flex items-center gap-1 text-xs"
            title={isMobileView ? 'Switch to Full Desktop View' : 'Simulate Mobile Frame'}
          >
            {isMobileView ? <Monitor className="w-4 h-4 text-[#2D2D2D]" /> : <Smartphone className="w-4 h-4 text-stone-500" />}
          </button>

          {/* Quick Capture Button */}
          <button
            id="quick-capture-btn"
            onClick={onOpenQuickCapture}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white font-semibold text-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Capture</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E5E2DA] dark:border-stone-800 py-2 px-2 bg-[#F9F8F6] dark:bg-stone-900">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as ActiveTab)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#2D2D2D] dark:text-white font-bold' : 'text-[#9A958C]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
