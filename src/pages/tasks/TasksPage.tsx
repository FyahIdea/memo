import React from 'react';
import { TasksView } from '../../components/tasks/TasksView';
import { useApp } from '../../contexts/AppContext';

// Trang Tasks: bọc TasksView và lấy data từ AppContext
const TasksPage: React.FC = () => {
  const {
    appState,
    setInspectedObject,
    setIsSidebarPanelOpen,
    handleAddTask,
    handleTogglePin,
    handleLinkReward,
  } = useApp();

  return (
    <TasksView
      tasks={appState.tasks}
      rewards={appState.rewards}
      onAddTask={handleAddTask}
      onTogglePin={handleTogglePin}
      onLinkReward={handleLinkReward}
      onSelectTask={setInspectedObject}
      onOpenSidebarPanel={() => setIsSidebarPanelOpen(true)}
    />
  );
};

export default TasksPage;
