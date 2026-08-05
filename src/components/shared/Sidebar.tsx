import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Sidebar.module.css';
import { Icon } from './Icon';

export type ActiveTab = 'timeline' | 'notes' | 'tasks' | 'finance' | 'weekly' | 'design';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { id: 'timeline', label: 'Timeline', icon: 'view_timeline' },
      { id: 'tasks', label: 'Tasks', icon: 'check_box' },
      { id: 'weekly', label: 'Weekly Grid', icon: 'calendar_month' },
      { id: 'notes', label: 'Notes', icon: 'description' },
    ]
  },
  {
    title: 'Finance',
    items: [
      { id: 'finance', label: 'Finance & Jars', icon: 'savings' },
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'design', label: 'Design System', icon: 'design_services' },
    ]
  }
];

const tabs = navGroups.flatMap(g => g.items);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop — sidebar trái cố định */}
      <aside className={clsx(styles.sidebar, isCollapsed && styles.sidebarCollapsed)}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandBox}>
            <div className={styles.brandLogo}>
              <img src="/logo.png" alt="Memo Logo" className={styles.brandLogoImg} />
            </div>
            <div className={styles.brandText}>
              <h1 className={styles.brandName}>
                Memo<span className={styles.brandNameFaded}>ries</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className={styles.navGroup}>
              <span className={styles.navLabel}>{group.title}</span>
              {group.items.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`sidebar-tab-${tab.id}`}
                    onClick={() => onTabChange(tab.id as ActiveTab)}
                    className={clsx(styles.navItem, isActive && styles['navItem--active'])}
                  >
                    <Icon
                      name={tab.icon}
                      size="md"
                      className={styles.navItemIcon}
                    />
                    <span className={styles.navItemText}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Toggle Button */}
        <button 
          className={styles.toggleBtn} 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Icon name={isCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'} size="md" />
        </button>
      </aside>

      {/* Mobile — bottom navigation bar */}
      <nav className={styles.mobileNav}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as ActiveTab)}
              className={clsx(styles.mobileNavItem, isActive && styles['mobileNavItem--active'])}
            >
              <Icon name={tab.icon} size="md" filled={isActive} />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
