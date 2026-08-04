import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import MainLayout from './layout/shared/MainLayout';
import TimelinePage from './pages/timeline/TimelinePage';
import NotesPage from './pages/notes/NotesPage';
import TasksPage from './pages/tasks/TasksPage';
import FinancePage from './pages/finance/FinancePage';
import WeeklyPage from './pages/weekly/WeeklyPage';
import DesignSystemPage from './pages/design-system/DesignSystemPage';

// Router nội bộ: chọn trang hiển thị dựa trên activeTab
const AppRouter: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <MainLayout>
      {activeTab === 'timeline' && <TimelinePage />}
      {activeTab === 'notes'    && <NotesPage />}
      {activeTab === 'tasks'    && <TasksPage />}
      {activeTab === 'finance'  && <FinancePage />}
      {activeTab === 'weekly'   && <WeeklyPage />}
      {activeTab === 'design'   && <DesignSystemPage />}
    </MainLayout>
  );
};

// Entry point: bọc toàn app trong AppProvider
export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
