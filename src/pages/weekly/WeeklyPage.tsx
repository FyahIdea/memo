import React from 'react';
import { WeeklyCalendarView } from '../../components/weekly/WeeklyCalendarView';
import { useApp } from '../../contexts/AppContext';

// Trang Weekly Calendar: bọc WeeklyCalendarView và lấy data từ AppContext
const WeeklyPage: React.FC = () => {
  const { appState, setInspectedObject } = useApp();

  return (
    <WeeklyCalendarView
      events={appState.events}
      tasks={appState.tasks}
      onSelectObject={setInspectedObject}
    />
  );
};

export default WeeklyPage;
