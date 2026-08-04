import React from 'react';
import clsx from 'clsx';
import styles from './Sidebar.module.css';
import { Icon } from './Icon';

export type ActiveTab = 'timeline' | 'notes' | 'tasks' | 'finance' | 'weekly' | 'design';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

// Danh sách các tab trong navigation
const tabs = [
  { id: 'timeline', label: 'Timeline',     icon: 'view_timeline'    },
  { id: 'notes',    label: 'Notes',        icon: 'description'      },
  { id: 'tasks',    label: 'Tasks',        icon: 'check_box'        },
  { id: 'finance',  label: 'Finance & Jars', icon: 'savings'        },
  { id: 'weekly',   label: 'Weekly Grid',  icon: 'calendar_month'   },
  { id: 'design',   label: 'Design System', icon: 'design_services' },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <>
      {/* Desktop — sidebar trái cố định */}
      <aside className={styles.sidebar}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandLogo}>M</div>
          <div>
            <h1 className={styles.brandName}>Memo</h1>
            <p className={styles.brandSub}>Objects Studio</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <span className={styles.navLabel}>Navigation</span>
          {tabs.map((tab) => {
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
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
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
